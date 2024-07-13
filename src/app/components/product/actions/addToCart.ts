"use server";

import { addToCart } from "@/lib/shopify/mutations/cartMutations";
import { getOrCreateCartWithManagedCookie } from "@/utils/fetchers";
import { parseClientResponse } from "@/utils/parsers";
import { ProductVariantWithCustomization } from "@/utils/types";

interface AddToCartProps {
  variant: ProductVariantWithCustomization | null | undefined;
  quantity: number;
}

export async function handleAddToCart(
  props: AddToCartProps,
  _formData: FormData
) {
  if (!props.variant) {
    throw new Error("No variant provided");
  }
  const cart = await getOrCreateCartWithManagedCookie();

  const updatedCartResponse = await addToCart(cart.id, [
    { merchandiseId: props.variant?.id, quantity: props.quantity },
  ]);
  const parsedUpdatedCartResponse = parseClientResponse(
    updatedCartResponse,
    "error adding item to cart"
  );
  return parsedUpdatedCartResponse.cartLinesAdd.cart;
}
