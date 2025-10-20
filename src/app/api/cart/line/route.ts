import { ShopAPIProvider } from "@/lib/commerce/providers/shop-api";
import type { Cart } from "@/lib/commerce/types";
import { getCartId } from "@/utils/cookies/cartId";
import { parseValidationErrors } from "@/utils/parsers";
import { ServerApiResponse } from "@/utils/types";
import { CartLineUpdateInputSchema } from "@/utils/validators/cartInputValidator";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

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
      baseUrl: process.env.SHOP_API_URL || 'http://localhost:8080',
    });

    const cartId = getCartId();

    if (!cartId) {
      return NextResponse.json(
        { errors: "No cart found", data: undefined },
        { status: 404 }
      );
    }

    const data = await request.json();
    const validCartLinesInput = z
      .array(CartLineUpdateInputSchema)
      .safeParse(data);
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

    // Update each cart line (quantity update or removal)
    let updatedCart: Cart | undefined = undefined;

    for (const line of validCartLinesInput.data) {
      const quantity = line.quantity ?? 1;

      if (quantity === 0) {
        // Remove item if quantity is 0
        updatedCart = await shopAPI.removeCartItem(cartId, line.id);
      } else {
        // Update quantity
        updatedCart = await shopAPI.updateCartItem(cartId, line.id, quantity);
      }
    }

    return NextResponse.json(
      { data: updatedCart, errors: undefined },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json(
      { errors: "Error updating cart", data: undefined },
      { status: 500 }
    );
  }
};
