"use server";

import {
  addToCart,
  removeCartLine,
  updateCartLine,
} from "@/lib/shopify/mutations/cartMutations";
import { getCartId } from "@/utils/cookies/cartId";
import { getOrCreateCartWithManagedCookie } from "@/utils/fetchers";
import { parseClientResponse } from "@/utils/parsers";
import { ProductVariantWithCustomization } from "@/utils/types";

interface AddToCartProps {
  variant: ProductVariantWithCustomization | null | undefined;
  quantity: number;
}

export const handleAddToCart = async (
  props: AddToCartProps,
  _formData: FormData
) => {
  if (!props.variant) {
    throw new Error("No variant provided");
  }
  const cart = await getOrCreateCartWithManagedCookie({
    lines: [{ merchandiseId: props.variant.id, quantity: props.quantity }],
  });

  const updatedCartResponse = await addToCart(cart.id, [
    { merchandiseId: props.variant?.id, quantity: props.quantity },
  ]);
  const parsedUpdatedCartResponse = parseClientResponse(
    updatedCartResponse,
    "error adding item to cart"
  );
  return parsedUpdatedCartResponse.cartLinesAdd.cart;
};

export const handleUpdateCartItemQuantity = async ({
  lineId,
  quantity,
}: {
  lineId: string;
  quantity: number;
}) => {
  const cartId = getCartId();
  if (!cartId) throw new Error("Unexpected error: cartId not found");
  const updatedCartResponse = await updateCartLine(cartId, lineId, quantity);
  parseClientResponse(updatedCartResponse, "error updating item quantity");
};

export const handlerRemoveCartItem = async ({ lineId }: { lineId: string }) => {
  const cartId = getCartId();
  if (!cartId) throw new Error("Unexpected error: cartId not found");
  const updatedCartResponse = await removeCartLine(cartId, [lineId]);
  parseClientResponse(updatedCartResponse, "error removing item from cart");
};
