import { ShopAPIProvider } from '@/lib/commerce/providers/shop-api';
import type { Cart } from "@/lib/commerce/types";
import { getCartId, createCartId } from "@/utils/cookies/cartId";
import { env } from "@/utils/env";
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
    const shopAPI = new ShopAPIProvider({
      baseUrl: env.SHOP_API_URL,
      apiKey: env.SHOP_API_KEY,
    });
    const cart = await shopAPI.getCart(cartId);
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
    const shopAPI = new ShopAPIProvider({
      baseUrl: env.SHOP_API_URL,
      apiKey: env.SHOP_API_KEY,
    });
    const body = await request.json().catch(() => ({}));

    // Parse request body
    const { items, customerId } = body;

    // Check if cart already exists
    const existingCartId = getCartId();
    if (existingCartId) {
      try {
        const existingCart = await shopAPI.getCart(existingCartId);
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
    let cart = await shopAPI.createCart(customerId);

    // Add items if provided
    if (items && items.length > 0) {
      cart = await shopAPI.addToCart(cart.id, items);
    }

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
    const shopAPI = new ShopAPIProvider({
      baseUrl: env.SHOP_API_URL,
      apiKey: env.SHOP_API_KEY,
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
        const updatedCart = await shopAPI.addToCart(existingCartId, cartItems);
        return NextResponse.json(
          { data: updatedCart, errors: undefined },
          { status: 200 }
        );
      } catch (error) {
        console.warn("Existing cart not found, creating new cart");
      }
    }

    // Cart doesn't exist, create a new cart with items
    const newCart = await shopAPI.createCart();
    const cartWithItems = await shopAPI.addToCart(newCart.id, cartItems);

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
