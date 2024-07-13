import { createCart } from "@/lib/shopify/mutations/cartMutations";
import { fetchCart } from "@/lib/shopify/queries/cartQuery";
import { fetchCollection } from "@/lib/shopify/queries/collectionQuery";
import {
  ProductVariables,
  fetchProduct,
  fetchProductWithMetafields,
} from "@/lib/shopify/queries/productQuery";
import { CartInput, ProductMetafield } from "@/lib/types/shopify";
import { createCartIdCookie, getCartId } from "./cookies/cartId";
import {
  getCustomProductByOriginProductHandle,
  getCustomProductByOriginProductId,
} from "./getters";
import { mapCustomProduct, mapMetafields, mapProduct } from "./mappers";
import { parseClientResponse, tryParseClientResponse } from "./parsers";
import { ProductMetafields } from "./types";

/*
 *  ╔══════════════════════════════════════════════════════════════════════════════╗
 *  ║                                  Products                                    ║
 *  ╚══════════════════════════════════════════════════════════════════════════════╝
 */

export const fetchProductData = async (params: ProductVariables) => {
  const productResponse = await fetchProduct(params);
  const { product } = parseClientResponse(
    productResponse,
    "Error getting product"
  );
  return product && mapProduct(product);
};

export const fetchProductDataWithMetafields = async (handle: string) => {
  const productResponse = await fetchProductWithMetafields(handle, "handle");
  const { productByHandle } = parseClientResponse(
    productResponse,
    "Error getting product with metafields"
  );
  return productByHandle && mapProduct(productByHandle);
};

/*
 *  ╔══════════════════════════════════════════════════════════════════════════════╗
 *  ║                                 Custom Products                              ║
 *  ╚══════════════════════════════════════════════════════════════════════════════╝
 */

export const fetchCustomProductsFromUserCollection = async (
  userId: string | undefined
) => {
  if (!userId) return undefined;

  const collectionResponse = await fetchCollection(userId);
  const collection = tryParseClientResponse(collectionResponse);

  return collection?.collectionByHandle?.products?.edges?.map((e) => ({
    ...e.node,
    metafields:
      e.node.metafields &&
      mapMetafields<ProductMetafield, ProductMetafields>(e.node.metafields),
  }));
};

export const tryFetchCustomProduct = async (
  customProductId: string | undefined
) => {
  if (!customProductId) return undefined;
  const customProductResponse = await fetchProductWithMetafields(
    customProductId,
    "id"
  );
  const parsedCustomProductResponse = tryParseClientResponse(
    customProductResponse
  );
  return parsedCustomProductResponse?.product;
};
export const fetchCustomProductData = async (
  customProductId: string | undefined
) => {
  const customProduct = await tryFetchCustomProduct(customProductId);
  return customProduct && mapCustomProduct(customProduct);
};

type CustomProductByOriginProductProps =
  | {
      originProductId: string;
      userId: string;
    }
  | {
      originProductHandle: string;
      userId: string;
    };
export const fetchCustomProductByOriginProduct = async (
  params: CustomProductByOriginProductProps
) => {
  const customProductsFromCollection =
    await fetchCustomProductsFromUserCollection(params.userId);
  let customProductId: string | undefined = undefined;
  if ("originProductHandle" in params) {
    customProductId = getCustomProductByOriginProductHandle(
      customProductsFromCollection,
      params.originProductHandle
    )?.id;
  } else {
    customProductId = getCustomProductByOriginProductId(
      customProductsFromCollection,
      params.originProductId
    )?.id;
  }
  return tryFetchCustomProduct(customProductId);
};

/*
 *  ╔══════════════════════════════════════════════════════════════════════════════╗
 *  ║                                 Custom Products                              ║
 *  ╚══════════════════════════════════════════════════════════════════════════════╝
 */

interface FetchOrCreateCartRequest extends CartInput {
  cartId?: string;
}

export const fetchOrCreateCart = async (request: FetchOrCreateCartRequest) => {
  if (request.cartId) {
    const fetchedCartResponse = await fetchCart(request.cartId);
    const fetchedCart = parseClientResponse(
      fetchedCartResponse,
      "error fetching cart"
    );
    return fetchedCart.cart;
  }
  // create new cart if no cartId is provided
  const createCartResponse = await createCart(request);
  const parsedCreateCartResponse = parseClientResponse(
    createCartResponse,
    "error creating cart"
  );
  return parsedCreateCartResponse.cartCreate.cart;
};


/**
 * Gets the cartId from a cookie and attempts to fetch the cart with that id.
 * If no cartId is found or fetching the cart fails, a new cart is created and the cartId is stored in a cookie.
 * @param input - Optional cart input parameters.
 * @returns The retrieved or created cart.
 */
export const getOrCreateCartWithManagedCookie = async (input?: CartInput) => {
  let cartId = getCartId();
  const cart = await fetchOrCreateCart({ ...input, cartId });
  if (!cartId) {
    createCartIdCookie(cart.id);
  }
  return cart;
};
