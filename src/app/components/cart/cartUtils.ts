import { Cart } from "@/lib/commerce/types";
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
    credentials: "include", // Include httpOnly cart_id cookie
    headers: {
      "Content-Type": "application/json",
    },
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
  const updateCartResponse = await fetch(CART_LINE_API_ENDPOINT, {
    method: "PATCH",
    credentials: "include", // Include httpOnly cart_id cookie
    headers: {
      "Content-Type": "application/json",
    },
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
  // Remove item by setting quantity to 0
  const updateCartResponse = await fetch(CART_LINE_API_ENDPOINT, {
    method: "PATCH",
    credentials: "include", // Include httpOnly cart_id cookie
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      {
        id: cartLineId,
        quantity: 0,
      },
    ]),
  });
  const data = await parseFetchResponse<ClientResponse<Cart>>(
    updateCartResponse,
    "Error removing item from cart"
  );
  if (!data.data || data.errors) {
    return undefined;
  }
  return data.data;
};
