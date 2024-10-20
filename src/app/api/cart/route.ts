import { ShopifyCartService } from "@/lib/shopify/services/ShopifyCartService";
import { Cart } from "@/lib/shopify/types/cart";
import { getCartId } from "@/utils/cookies/cartId";
import { getNavigationLink } from "@/utils/getters";
import { parseClientResponse, parseValidationErrors } from "@/utils/parsers";
import { ServerApiResponse } from "@/utils/types";
import {
  CartInputSchema,
  CartLineInputSchema,
} from "@/utils/validators/cartInputValidator";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const GET = async (): Promise<ServerApiResponse<Cart>> => {
  let cartId = getCartId();
  if (!cartId) {
    // no cartId in cookie means no cart for this visitor
    return NextResponse.json(
      { errors: "No cart found", data: undefined },
      { status: 404 }
    );
  }
  const cartService = new ShopifyCartService({
    parseClientResponse,
    getNavigationLink,
  });
  const cart = await cartService.fetchCart(cartId);
  return NextResponse.json({ data: cart }, { status: 200 });
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
    const cart = await cartService.createCartWithManagedCookie(
      validatedCartInput.data
    );
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
    if (existingCart) {
      // if cart exists, update the cart with the new lines
      const updatedCart = await cartService.addToCart(
        existingCart.id,
        validCartLinesInput.data
      );
      return NextResponse.json(
        { data: updatedCart, errors: undefined },
        { status: 200 }
      );
    }
    // cart does not exist, create a new cart with the new lines
    const newCart = await cartService.createCartWithManagedCookie({
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
