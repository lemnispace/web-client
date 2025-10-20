import { Cart } from "@/lib/shopify/types/cart";
import { cartFragment } from "../fragments";
import { ensureStorefrontClient as ensureClient } from "../clientUtils";

interface CartQueryResponse {
  cart: Cart;
}

export async function fetchCart(cartId: string) {
  const query = /* GraphQL */ `
    query getCart($cartId: ID!) {
      cart(id: $cartId) {
        ...CartFields
      }
    }
    ${cartFragment}
  `;

  return ensureClient().request<CartQueryResponse>(query, {
    variables: { cartId },
  });
}
