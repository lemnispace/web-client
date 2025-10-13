import { getDefaultProvider } from "@/lib/commerce";
import type { Cart } from "@/lib/commerce/types";
import { getCartId, createCartId } from "@/utils/cookies/cartId";
import { parseValidationErrors } from "@/utils/parsers";
import { ServerApiResponse } from "@/utils/types";
import {
  CartLineInputSchema,
} from "@/utils/validators/cartInputValidator";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const GET = async (): Promise<ServerApiResponse<Cart>> => {
  const cartId = getCartId();
  if (!cartId) {
    // no cartId in cookie means no cart for this visitor
    return NextResponse.json(
      { errors: "No cart found", data: undefined },
      { status: 404 }
    );
  }

  try {
    const commerce = getDefaultProvider();
    const cart = await commerce.getCart(cartId);
    return NextResponse.json({ data: cart }, { status: 200 });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { errors: "Error fetching cart", data: undefined },
      { status: 500 }
    );
  }
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

  try {
    const commerce = getDefaultProvider();
    const data = await request.json().catch(() => ({}));

    // Extract customerId if provided (shop-api format)
    const customerId = data.customerId as string | undefined;

    // Check if cart already exists
    const existingCartId = getCartId();
    if (existingCartId) {
      try {
        const existingCart = await commerce.getCart(existingCartId);
        return NextResponse.json(
          { data: existingCart, errors: undefined },
          { status: 200 }
        );
      } catch (error) {
        // Cart doesn't exist or error, create new one
        console.warn("Existing cart not found, creating new cart");
      }
    }

    // Create new cart
    const cart = await commerce.createCart(customerId);

    // Set cart ID in cookie using createCartId helper
    createCartId(cart.id);

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
    const commerce = getDefaultProvider();
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

    // Transform Shopify format to shop-api format
    // Shopify uses merchandiseId, shop-api uses productId + variantId
    // For now, we pass through merchandiseId as variantId (needs proper mapping in real implementation)
    const cartItems = validCartLinesInput.data.map((line) => ({
      productId: line.merchandiseId, // TODO: Extract actual productId
      variantId: line.merchandiseId,
      quantity: line.quantity ?? 1,
      customizationData: line.attributes
        ? Object.fromEntries(
            line.attributes.map((attr) => [attr.key, attr.value])
          )
        : undefined,
    }));

    const existingCartId = getCartId();

    if (existingCartId) {
      try {
        // Add items to existing cart
        const updatedCart = await commerce.addToCart(existingCartId, cartItems);
        return NextResponse.json(
          { data: updatedCart, errors: undefined },
          { status: 200 }
        );
      } catch (error) {
        console.warn("Existing cart not found, creating new cart");
      }
    }

    // Cart doesn't exist, create a new cart with items
    const newCart = await commerce.createCart();
    const cartWithItems = await commerce.addToCart(newCart.id, cartItems);

    // Set cart ID in cookie
    createCartId(newCart.id);

    return NextResponse.json(
      { data: cartWithItems, errors: undefined },
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
