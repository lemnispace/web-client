import { ShopifyCartService } from "@/lib/shopify/services/ShopifyCartService";
import { Cart } from "@/lib/shopify/types/cart";
import { CartLineUpdateInput } from "@/lib/shopify/types/input";
import { getNavigationLink } from "@/utils/getters";
import { parseClientResponse, parseValidationErrors } from "@/utils/parsers";
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
    const data = await request.json();
    const validCartLinesInput = z
      .array(CartLineUpdateInputSchema)
      .safeParse(data);
    const validationErrors = parseValidationErrors(validCartLinesInput);
    if (validationErrors) {
      return NextResponse.json(
        {
          errors: validationErrors,
          data: undefined,
        },
        { status: 400 }
      );
    }
    const cartService = new ShopifyCartService({
      parseClientResponse,
      getNavigationLink,
    });
    const existingCart = await cartService.tryFetchCart();
    if (!existingCart) {
      return NextResponse.json(
        { errors: "No cart found", data: undefined },
        { status: 404 }
      );
    }
    // if cart exists, update the cart with the new lines
    const updatedCart = await cartService.updateCartLine(
      existingCart.id,
      validCartLinesInput.data as CartLineUpdateInput[]
    );

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
