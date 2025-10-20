import { Cart } from "@/lib/shopify/types/cart";
import {
  CartInput,
  CartLineInput,
  CartLineUpdateInput,
} from "@/lib/shopify/types/input";
import { cartFragment } from "../fragments";
import { ensureStorefrontClient as ensureClient } from "../clientUtils";

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

  return ensureClient().request<CartCreateResponse>(mutation, { variables });
}

export async function addToCart(cartId: string, lines: CartLineInput[]) {
  console.log("cartId", cartId);
  console.log("lines", lines);
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

  return ensureClient().request<CartAddResponse>(mutation, {
    variables: { cartId, lines },
  });
}

export async function updateCartLine(
  cartId: string,
  lines: CartLineUpdateInput[]
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

  return ensureClient().request<CartUpdateResponse>(mutation, {
    variables: {
      cartId,
      lines,
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

  return ensureClient().request<CartRemoveResponse>(mutation, {
    variables: {
      cartId,
      lineIds,
    },
  });
}
