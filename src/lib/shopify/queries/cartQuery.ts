import { Cart } from "@/lib/types/shopify";
import { cartFragment } from "../fragments";
import storefrontClient from "../storefrontClient";

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

  return storefrontClient.request<CartQueryResponse>(query, {
    variables: { cartId },
  });
}
