import { fetchCollection } from "@/lib/shopify/queries/collectionQuery";
import {
  ProductVariables,
  fetchProduct,
  fetchProductWithMetafields,
} from "@/lib/shopify/queries/productQuery";
import { ProductMetafield } from "@/lib/types/shopify";
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
