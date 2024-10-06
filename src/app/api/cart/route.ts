import { addToCart, createCart } from "@/lib/shopify/mutations/cartMutations";
import { fetchCart } from "@/lib/shopify/queries/cartQuery";
import { ShopifyCartService } from "@/lib/shopify/services/CartService";
import { Cart } from "@/lib/shopify/types/cart";
import { CartInput } from "@/lib/shopify/types/input";
import { createCartId, getCartId } from "@/utils/cookies/cartId";
import { getNavigationLink } from "@/utils/getters";
import { parseClientResponse, parseValidationErrors } from "@/utils/parsers";
import { ServerApiResponse } from "@/utils/types";
import {
  CartInputSchema,
  CartLineInputSchema,
} from "@/utils/validators/cartInputValidator";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createCartWithManagedCookie = async (input: CartInput = {}) => {
  // create new cart if no cartId is provided or fetching the cart fails
  const createCartResponse = await createCart(input);
  const parsedCreateCartResponse = parseClientResponse(
    createCartResponse,
    "error creating cart"
  );
  const cart = parsedCreateCartResponse.cartCreate.cart;
  createCartId(cart.id);
  return cart;
};

export const GET = async (): Promise<ServerApiResponse<Cart>> => {
  let cartId = getCartId();
  if (!cartId) {
    // no cartId in cookie means no cart for this visitor
    return NextResponse.json(
      { errors: "No cart found", data: undefined },
      { status: 404 }
    );
  }
  const fetchedCartResponse = await fetchCart(cartId);
  const fetchedCart = parseClientResponse(
    fetchedCartResponse,
    "error fetching cart"
  );
  return NextResponse.json({ data: fetchedCart.cart }, { status: 200 });
};

export const POST = async (
  request: NextRequest
): Promise<ServerApiResponse<Cart>> => {
  if (request.method !== "POST") {
    return NextResponse.json(
      { errors: "Method not allowed", data: undefined },
      { status: 405 }
    );
  }
  const cartService = new ShopifyCartService({
    parseClientResponse,
    getNavigationLink,
  });
  try {
    const data = await request.json();
    const validatedCartInput = CartInputSchema.safeParse(data);
    if (!validatedCartInput.success) {
      const errors = validatedCartInput.error.errors;
      return NextResponse.json({ errors, data: undefined }, { status: 400 });
    }

    const existingCart = await cartService.tryFetchCart();
    if (existingCart) {
      return NextResponse.json(
        { data: existingCart, errors: undefined },
        { status: 200 }
      );
    }
    // create new cart if no existing cart is found
    const cart = await createCartWithManagedCookie(validatedCartInput.data);
    return NextResponse.json(
      { data: cart, errors: undefined },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating cart:", error);
    return NextResponse.json(
      { errors: "Error creating cart", data: undefined },
      { status: 500 }
    );
  }
};

export const PATCH = async (
  request: NextRequest
): Promise<ServerApiResponse<Cart>> => {
  if (request.method !== "PATCH") {
    return NextResponse.json(
      { errors: "Method not allowed", data: undefined },
      { status: 405 }
    );
  }
  try {
    const cartService = new ShopifyCartService({
      parseClientResponse,
      getNavigationLink,
    });
    const data = await request.json();
    const validCartLinesInput = z.array(CartLineInputSchema).safeParse(data);
    const validationErrors = parseValidationErrors(validCartLinesInput);
    if (validationErrors || !validCartLinesInput.success) {
      return NextResponse.json(
        {
          errors: validationErrors,
          data: undefined,
        },
        { status: 400 }
      );
    }
    const existingCart = await cartService.tryFetchCart();
    console.log("existingCart", existingCart);
    if (existingCart) {
      // if cart exists, update the cart with the new lines
      const cartResponse = await addToCart(
        existingCart.id,
        validCartLinesInput.data
      );

      const parsedCartResponse = parseClientResponse(
        cartResponse,
        "error adding item to cart"
      );
      return NextResponse.json(
        { data: parsedCartResponse.cartLinesAdd.cart, errors: undefined },
        { status: 200 }
      );
    }
    // cart does not exist, create a new cart with the new lines
    const newCart = await createCartWithManagedCookie({
      lines: validCartLinesInput.data,
    });
    return NextResponse.json(
      { data: newCart, errors: undefined },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding items to cart:", error);
    return NextResponse.json(
      { errors: "Error adding items to cart", data: undefined },
      { status: 500 }
    );
  }
};
