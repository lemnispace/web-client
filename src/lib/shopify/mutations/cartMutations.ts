import { Cart, CartInput } from "@/lib/types/shopify";
import { cartFragment } from "../fragments";
import storefrontClient from "../storefrontClient";

interface CartCreateResponse {
  cartCreate: {
    cart: Cart;
  };
}

interface CartAddResponse {
  cartLinesAdd: {
    cart: Cart;
  };
}

interface CartUpdateResponse {
  cartLinesUpdate: {
    cart: Cart;
  };
}

interface CartRemoveResponse {
  cartLinesRemove: {
    cart: Cart;
  };
}

export async function createCart(variables: CartInput) {
  const mutation = /* GraphQL */ `
    mutation cartCreate {
      cartCreate {
        cart {
          ...CartFields
        }
        userErrors {
          field
          message
        }
      }
    }
    ${cartFragment}
  `;

  return storefrontClient.request<CartCreateResponse>(mutation, { variables });
}

export async function addToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[]
) {
  const mutation = /* GraphQL */ `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          ...CartFields
        }
      }
    }
    ${cartFragment}
  `;

  return storefrontClient.request<CartAddResponse>(mutation, {
    variables: { cartId, lines },
  });
}

export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number
) {
  const mutation = /* GraphQL */ `
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          ...CartFields
        }
      }
    }
    ${cartFragment}
  `;

  return storefrontClient.request<CartUpdateResponse>(mutation, {
    variables: {
      cartId,
      lines: [{ id: lineId, quantity }],
    },
  });
}

export async function removeCartLine(cartId: string, lineIds: string[]) {
  const mutation = /* GraphQL */ `
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          ...CartFields
        }
      }
    }
    ${cartFragment}
  `;

  return storefrontClient.request<CartRemoveResponse>(mutation, {
    variables: {
      cartId,
      lineIds,
    },
  });
}
