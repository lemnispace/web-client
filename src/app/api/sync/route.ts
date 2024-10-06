import PrintfulClient, {
  SyncVariantWithCatalogVariant,
} from "@/lib/printful/PrintfulClient";
import { CatalogVariant } from "@/lib/printful/types";
import { productVariantsBulkUpdate } from "@/lib/shopify/mutations/productMutations";
import { fetchProductList } from "@/lib/shopify/queries/productQuery";
import { ProductVariantsBulkInput } from "@/lib/shopify/types/input";
import { mapProducts } from "@/lib/shopify/utils/mappers";
import {
  VARIANT_METADATA_NAMESPACE,
  VARIANT_METADATA_PRINTFUL_CATALOG_PRODUCT_ID_KEY,
  VARIANT_METADATA_PRINTFUL_CATALOG_VARIANT_ID_KEY,
} from "@/utils/constants";
import { getNavigationLink } from "@/utils/getters";
import { parseClientResponse } from "@/utils/parsers";
import { ProductItem, ProductVariant, ServerApiResponse } from "@/utils/types";
import { isDefined, isEmptyArray } from "@/utils/validators";
import { NextResponse } from "next/server";

interface SyncResponse {
  success: boolean;
}

const getProductVariantsBulkInput = (
  variant: ProductVariant,
  catalogVariant: CatalogVariant
): ProductVariantsBulkInput => {
  return {
    id: variant.id,
    metafields: [
      {
        namespace: VARIANT_METADATA_NAMESPACE,
        key: VARIANT_METADATA_PRINTFUL_CATALOG_PRODUCT_ID_KEY,
        value: catalogVariant.catalog_product_id.toString(),
        type: "number_integer",
      },
      {
        namespace: VARIANT_METADATA_NAMESPACE,
        key: VARIANT_METADATA_PRINTFUL_CATALOG_VARIANT_ID_KEY,
        value: catalogVariant.id.toString(),
        type: "number_integer",
      },
    ],
  };
};

const fetchData = async () => {
  const [allCatalogVariants, productListResponse] = await Promise.all([
    PrintfulClient.getAllCatalogVariants(),
    fetchProductList(99),
  ]);
  const parsedProductListResponse = parseClientResponse(
    productListResponse,
    "Error fetching products"
  );
  const products = mapProducts(parsedProductListResponse, getNavigationLink);
  if (isEmptyArray(products)) {
    throw new Error("No products found");
  }
  return { allCatalogVariants, products };
};

const createVariantsBySkusMap = (products: ProductItem[]) => {
  const variantsBySkusMap = new Map<
    string,
    ProductVariant & { productId: string }
  >();
  products.forEach((product) => {
    product.variants?.forEach((variant) => {
      if (variant.sku) {
        variantsBySkusMap.set(variant.sku, {
          ...variant,
          productId: product.id,
        });
      }
    });
  });
  return variantsBySkusMap;
};

const createProductVariantBulkUpdates = (
  allCatalogVariants: SyncVariantWithCatalogVariant[],
  products: ProductItem[]
): Array<[string, ProductVariantsBulkInput]> => {
  const variantsBySkusMap = createVariantsBySkusMap(products);
  return allCatalogVariants
    .map((printfulVariant) => {
      const variant = variantsBySkusMap.get(printfulVariant.sku);
      if (variant && printfulVariant.catalogVariant) {
        return [
          variant.productId,
          getProductVariantsBulkInput(variant, printfulVariant.catalogVariant),
        ] satisfies [string, ProductVariantsBulkInput];
      }
      return null;
    })
    .filter(isDefined);
};

const createBulkUpdatesMap = (
  productVariantBulkUpdates: Array<[string, ProductVariantsBulkInput]>
) => {
  const bulkUpdatesMap = new Map<string, ProductVariantsBulkInput[]>();
  productVariantBulkUpdates.forEach(([productId, variantUpdates]) => {
    const existingVariantUpdates = bulkUpdatesMap.get(productId) || [];
    bulkUpdatesMap.set(
      productId,
      existingVariantUpdates.concat(variantUpdates)
    );
  });
  return bulkUpdatesMap;
};

const performBulkUpdate = async (
  bulkUpdatesEntries: Array<[string, ProductVariantsBulkInput]>
) => {
  const bulkUpdates = Array.from(createBulkUpdatesMap(bulkUpdatesEntries));
  const bulkUpdateResponse = await Promise.all(
    bulkUpdates.map(([productId, variantUpdates]) =>
      productVariantsBulkUpdate(productId, variantUpdates)
    )
  );
  const parsedBulkUpdateResponse = bulkUpdateResponse.map((response) =>
    parseClientResponse(response, "Error updating product variants")
  );
  return parsedBulkUpdateResponse.every(
    (response) => response.productVariantsBulkUpdate.productVariants.length > 0
  );
};

export const POST = async (): Promise<ServerApiResponse<SyncResponse>> => {
  try {
    const { allCatalogVariants, products } = await fetchData();
    const productVariantBulkUpdates = createProductVariantBulkUpdates(
      allCatalogVariants,
      products
    );
    const success = await performBulkUpdate(productVariantBulkUpdates);
    return NextResponse.json({ data: { success } }, { status: 200 });
  } catch (error) {
    console.error("Error syncing products:", error);
    return NextResponse.json(
      { errors: "Error syncing products", data: undefined },
      { status: 500 }
    );
  }
};
