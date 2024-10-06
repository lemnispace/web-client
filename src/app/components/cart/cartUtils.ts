import { Cart } from "@/lib/shopify/types/cart";
import { CART_API_ENDPOINT, CART_LINE_API_ENDPOINT } from "@/utils/constants";
import { parseFetchResponse } from "@/utils/parsers";
import { ClientResponse } from "@/utils/types";

interface AddToCartProps {
  variantId: string;
  quantity: number;
}
interface UpdateCartProps {
  cartLineId: string;
  quantity: number;
}

export const handleAddToCart = async (props: AddToCartProps) => {
  const updateCartResponse = await fetch(CART_API_ENDPOINT, {
    method: "PATCH",
    body: JSON.stringify([
      {
        merchandiseId: props.variantId,
        quantity: props.quantity,
      },
    ]),
  });
  const data = await parseFetchResponse<ClientResponse<Cart>>(
    updateCartResponse,
    "Error adding to cart"
  );
  if (!data.data || data.errors) {
    return undefined;
  }
  return data.data;
};

export const handleUpdateCartItemQuantity = async ({
  cartLineId,
  quantity,
}: UpdateCartProps) => {
  // TODO: fix this to update cart line item
  const updateCartResponse = await fetch(CART_LINE_API_ENDPOINT, {
    method: "PATCH",
    body: JSON.stringify([
      {
        id: cartLineId,
        quantity,
      },
    ]),
  });
  const data = await parseFetchResponse<ClientResponse<Cart>>(
    updateCartResponse,
    "Error updating cart"
  );
  if (!data.data || data.errors) {
    return undefined;
  }
  return data.data;
};

export const handleRemoveCartItem = async (cartLineId: string) => {
  throw new Error("Not implemented");
  // TODO: fix this to delete cart line item
  const updateCartResponse = await fetch(CART_API_ENDPOINT, {
    method: "PATCH",
    body: JSON.stringify([
      {
        merchandiseId: cartLineId,
        quantity: 0,
      },
    ]),
  });
  const data = await parseFetchResponse<ClientResponse<Cart>>(
    updateCartResponse,
    "error removing item from cart"
  );
  if (!data.data || data.errors) {
    return undefined;
  }
  return data.data;
};
