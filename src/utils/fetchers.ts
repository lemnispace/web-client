import { fetchCollection } from "@/lib/shopify/queries/collectionQuery";
import { fetchCustomProduct } from "@/lib/shopify/queries/productQuery";
import { ProductMetafield } from "@/lib/types/shopify";
import { getCustomProductByOriginProductId } from "./getters";
import { mapCustomProduct, mapMetafields } from "./mappers";
import { tryParseClientResponse } from "./parsers";
import { ProductMetafields } from "./types";

export const fetchCustomProductsFromUserCollection = async (userId: string) => {
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
  const customProductResponse = await fetchCustomProduct(customProductId);
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

export const fetchCustomProductByOriginProductId = async (
  originProductId: string,
  userId: string
) => {
  const customProductsFromCollection =
    await fetchCustomProductsFromUserCollection(userId);
  const customProductId = getCustomProductByOriginProductId(
    customProductsFromCollection,
    originProductId
  )?.id;

  return tryFetchCustomProduct(customProductId);
};
