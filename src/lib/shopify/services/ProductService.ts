import { toFloat } from "@/utils/parsers";
import { isDefined } from "@/utils/validators";
import { ClientResponse } from "@shopify/storefront-api-client";
import {
  VARIANT_METADATA_CUSTOMIZATION_TIMESTAMP_KEY,
  VARIANT_METADATA_NAMESPACE,
  VARIANT_METADATA_ORIGIN_PRODUCT_KEY,
  VARIANT_METADATA_ORIGIN_PRODUCT_VARIANT_KEY,
  VARIANT_METADATA_USER_ID_KEY,
} from "../constants";
import {
  duplicateProduct,
  productVariantUpdate,
} from "../mutations/productMutations";
import {
  createImageForProduct,
  stageImageForUpload,
} from "../mutations/stagedUploads";
import { fetchCollection } from "../queries/collectionQuery";
import {
  fetchProduct,
  fetchProductWithMetafields,
  ProductVariables,
} from "../queries/productQuery";
import { ProductMetafield, ProductMetafieldsByKey } from "../types/metafields";
import { Price } from "../types/pricing";
import { ProductNode, ProductVariantOption } from "../types/product";
import { ShopifyServiceConfig } from "../types/services";
import { DEFAULT_CURRENCY_CODE } from "../types/shopifyCurrencyCodes";
import {
  mapCustomProduct,
  mapMetafields,
  mapProduct,
  Product,
  ProductVariant,
  ProductWithCustomization,
} from "../utils/mappers";

type CustomProductByOriginProductProps =
  | {
      originProductId: string;
      userId: string;
    }
  | {
      originProductHandle: string;
      userId: string;
    };

interface CustomProductIdProps {
  userId: string;
  productId: string;
}

interface UpdateCustomProductParams {
  variantTitle: string;
  product: ProductNode;
  imageId: string;
  userId: string;
  originProductId: string;
  originProductVariantId: string;
}

interface UpdateCustomProductVariantWithImageParams {
  customProduct: ProductNode;
  originProductId: string;
  originProductVariantId: string;
  userId: string;
  resourceUrl: string;
  variantTitle: string;
}

export interface CreateCustomProductParams {
  productId: string;
  variantId: string;
  variantTitle: string;
  file: File;
  userId: string;
}

export class ShopifyProductService {
  parseClientResponse: ShopifyServiceConfig["parseClientResponse"];
  getNavigationLink: ShopifyServiceConfig["getNavigationLink"];

  constructor(config: ShopifyServiceConfig) {
    this.parseClientResponse = config.parseClientResponse;
    this.getNavigationLink = config.getNavigationLink;
  }

  /*
   *  ╔══════════════════════════════════════════════════════════════════════╗
   *  ║                               UTILITY                                ║
   *  ╚══════════════════════════════════════════════════════════════════════╝
   */

  private tryParseClientResponse = <T>(response: ClientResponse<T>) => {
    try {
      return this.parseClientResponse(response, "");
    } catch (error) {
      console.warn(error);
      return undefined;
    }
  };

  /*
   *  ╔═══════════════════════════════════════════════════════════════════════╗
   *  ║                               FETCHERS                                ║
   *  ╚═══════════════════════════════════════════════════════════════════════╝
   */

  fetchProductData = async (params: ProductVariables) => {
    const productResponse = await fetchProduct(params);
    const { product } = this.parseClientResponse(
      productResponse,
      "Error getting product"
    );
    return product && mapProduct(product, this.getNavigationLink);
  };

  fetchProductDataWithMetafields = async (handle: string) => {
    const productResponse = await fetchProductWithMetafields(handle, "handle");
    const { productByHandle } = this.parseClientResponse(
      productResponse,
      "Error getting product with metafields"
    );
    return (
      productByHandle && mapProduct(productByHandle, this.getNavigationLink)
    );
  };

  fetchCustomProductsFromUserCollection = async (
    userId: string | undefined
  ) => {
    if (!userId) return undefined;

    const collectionResponse = await fetchCollection(userId);
    const collection = this.tryParseClientResponse(collectionResponse);

    return collection?.collectionByHandle?.products?.edges?.map((e) => ({
      ...e.node,
      metafields:
        e.node.metafields &&
        mapMetafields<ProductMetafield, ProductMetafieldsByKey>(
          e.node.metafields
        ),
    }));
  };

  tryFetchCustomProduct = async (customProductId: string | undefined) => {
    if (!customProductId) return undefined;
    const customProductResponse = await fetchProductWithMetafields(
      customProductId,
      "id"
    );
    const parsedCustomProductResponse = this.tryParseClientResponse(
      customProductResponse
    );
    return parsedCustomProductResponse?.product;
  };

  fetchCustomProductData = async (customProductId: string | undefined) => {
    const customProduct = await this.tryFetchCustomProduct(customProductId);
    return (
      customProduct && mapCustomProduct(customProduct, this.getNavigationLink)
    );
  };

  fetchCustomProductByOriginProduct = async (
    params: CustomProductByOriginProductProps
  ) => {
    const customProductsFromCollection =
      await this.fetchCustomProductsFromUserCollection(params.userId);
    let customProductId: string | undefined = undefined;
    if ("originProductHandle" in params) {
      customProductId =
        ShopifyProductService.getCustomProductByOriginProductHandle(
          customProductsFromCollection,
          params.originProductHandle
        )?.id;
    } else {
      customProductId = ShopifyProductService.getCustomProductByOriginProductId(
        customProductsFromCollection,
        params.originProductId
      )?.id;
    }
    return this.tryFetchCustomProduct(customProductId);
  };

  fetchOrCreateCustomProduct = async (
    originProductId: string,
    userId: string
  ) => {
    const customProduct = await this.fetchCustomProductByOriginProduct({
      originProductId,
      userId,
    });
    if (customProduct) {
      return customProduct;
    }
    // If no custom product exists, duplicate the origin product
    const duplicateProductResponse = await duplicateProduct({
      newStatus: "DRAFT",
      productId: originProductId,
      newTitle: ShopifyProductService.getCustomProductId({
        userId,
        productId: originProductId,
      }),
    });
    const duplicateProductData = this.parseClientResponse(
      duplicateProductResponse,
      "Error duplicating product"
    );
    return duplicateProductData.productDuplicate.newProduct;
  };

  /*
   *  ╔══════════════════════════════════════════════════════════════════════╗
   *  ║                               GETTERS                                ║
   *  ╚══════════════════════════════════════════════════════════════════════╝
   */

  static getCustomProductId = (product: CustomProductIdProps) => {
    return `product-${product.userId}-${product.productId}`;
  };

  static getCustomProductByOriginProductId = <
    T extends { metafields?: ProductMetafieldsByKey },
  >(
    products: T[] | undefined,
    originProductId: string
  ) => {
    return products?.find(
      ({ metafields }) => metafields?.origin_product?.value === originProductId
    );
  };

  static getCustomProductByOriginProductHandle = <
    T extends { metafields?: ProductMetafieldsByKey },
  >(
    products: T[] | undefined,
    originProductHandle: string
  ) => {
    return products?.find(
      ({ metafields }) =>
        metafields?.origin_product?.reference?.handle === originProductHandle
    );
  };
  /**
   * Retrieves a variant from a product by its ID.
   * @param product - The product object.
   * @param id - The ID of the variant to retrieve.
   * @returns The variant object with the specified ID, or undefined if not found.
   */
  static getVariantByTitle = (product: Product, title: string) => {
    return product.variants?.find((variant) => variant.title === title);
  };

  /**
   * Retrieves a variant from a product by its ID.
   * @param product - The product object.
   * @param id - The ID of the variant to retrieve.
   * @returns The variant object with the specified ID, or undefined if not found.
   */
  static getVariantById = (product: Product, id: string) => {
    return product.variants?.find((variant) => variant.id === id);
  };

  /**
   * Retrieves a variant from a product by its variant options.
   * @param product - The product object.
   * @param variantOptions - The variant options to match.
   * @returns The variant object that matches the specified variant options, or undefined if not found.
   */
  static getVariantByValues = (
    product: Product,
    variantOptions: ProductVariantOption
  ) => {
    return product.variants?.find((variant) =>
      Object.entries(variantOptions).every(
        ([key, value]) => variant[key as keyof ProductVariantOption] === value
      )
    );
  };

  /**
   * Retrieves the dimensions (width and height) from a variant.
   * @param variant - The variant object.
   * @returns An object containing the width and height of the variant, or undefined if the dimensions cannot be extracted.
   */
  static getDimensionsFromVariant = (variant: ProductVariant) => {
    const size = variant.Size; // size like 18"x24" or "24x36" or 12x18 or etc...
    if (!size) {
      return undefined;
    }
    // Match digits in the size string
    const matches = size.match(/\d+(\.\d+)?/g);
    // Check if exactly two matches are found (width and height)
    if (!matches || matches.length !== 2) {
      return undefined;
    }
    // Extract width and height from the matches
    const width = toFloat(matches[0]);
    const height = toFloat(matches[1]);
    // Check if both width and height are valid numbers
    if (!isDefined(width) || !isDefined(height)) {
      return undefined;
    }
    // Return an object with the extracted width and height
    return { width, height };
  };

  static getPrice = (
    variant: ProductVariant | undefined,
    product: ProductWithCustomization
  ): Price => {
    if (variant?.price) {
      if (typeof variant.price === "string") {
        return {
          amount: variant.price,
          currencyCode: DEFAULT_CURRENCY_CODE,
        };
      }
      return {
        amount: variant.price.amount,
        currencyCode: variant.price.currencyCode,
      };
    }
    return {
      amount: `${product.priceRange.minVariantPrice.amount}`,
      currencyCode: product.priceRange.minVariantPrice.currencyCode,
    };
  };

  static getProductPrice = (price: Price | string | number) => {
    if (typeof price === "string" || typeof price === "number") {
      return price;
    }
    return price.amount;
  };

  static getCustomVariantByOriginVariantId = <
    T extends Pick<ProductWithCustomization, "customVariants">,
  >(
    product: T,
    originVariantId: string
  ) => {
    return product.customVariants?.find(
      (variant) =>
        variant.metafields?.origin_product_variant?.value === originVariantId
    );
  };

  static getProductVariantByCustomVariantId = (
    product: ProductWithCustomization,
    customVariantId: string
  ) => {
    const originVariantId = product.customVariants?.find(
      (variant) => variant.id === customVariantId
    )?.metafields?.origin_product_variant?.value;
    return product.variants?.find((variant) => variant.id === originVariantId);
  };

  /*
   *  ╔══════════════════════════════════════════════════════════════════════╗
   *  ║                              UPDATERS                                ║
   *  ╚══════════════════════════════════════════════════════════════════════╝
   */

  updateCustomProductVariant = async ({
    product,
    variantTitle,
    imageId,
    userId,
    originProductId,
    originProductVariantId,
  }: UpdateCustomProductParams) => {
    const variant = ShopifyProductService.getVariantByTitle(
      mapProduct(product, this.getNavigationLink),
      variantTitle
    );
    if (!variant) {
      throw new Error(`No variant found with title: ${variantTitle}`);
    }
    const updateVariantResponse = await productVariantUpdate({
      id: variant.id,
      mediaId: imageId,
      metafields: [
        {
          type: "single_line_text_field",
          id: variant.metafields?.[VARIANT_METADATA_USER_ID_KEY]?.id,
          namespace: VARIANT_METADATA_NAMESPACE,
          key: VARIANT_METADATA_USER_ID_KEY,
          value: userId,
        },
        {
          type: "product_reference",
          id: variant.metafields?.[VARIANT_METADATA_ORIGIN_PRODUCT_KEY]?.id,
          namespace: VARIANT_METADATA_NAMESPACE,
          key: VARIANT_METADATA_ORIGIN_PRODUCT_KEY,
          value: originProductId,
        },
        {
          type: "date_time",
          id: variant.metafields?.[VARIANT_METADATA_CUSTOMIZATION_TIMESTAMP_KEY]
            ?.id,
          namespace: VARIANT_METADATA_NAMESPACE,
          key: VARIANT_METADATA_CUSTOMIZATION_TIMESTAMP_KEY,
          value: new Date().toISOString(),
        },
        {
          type: "variant_reference",
          id: variant.metafields?.[VARIANT_METADATA_ORIGIN_PRODUCT_VARIANT_KEY]
            ?.id,
          namespace: VARIANT_METADATA_NAMESPACE,
          key: VARIANT_METADATA_ORIGIN_PRODUCT_VARIANT_KEY,
          value: originProductVariantId,
        },
      ],
    });
    const parsedUpdateVariantResponse = this.parseClientResponse(
      updateVariantResponse,
      "Error updating variant image"
    );
    return parsedUpdateVariantResponse.productVariantUpdate.productVariant;
  };

  updateCustomProductVariantWithImage = async ({
    customProduct,
    userId,
    resourceUrl,
    variantTitle,
    originProductId,
    originProductVariantId,
  }: UpdateCustomProductVariantWithImageParams) => {
    const createImageForProductResponse = await createImageForProduct({
      productId: customProduct.id,
      resourceUrl,
    });
    const updatedCustomVariant = await this.updateCustomProductVariant({
      product: customProduct,
      variantTitle,
      imageId: createImageForProductResponse.mediaId,
      userId,
      originProductId,
      originProductVariantId,
    });
    if (!updatedCustomVariant) {
      throw new Error("Failed to update custom product variant");
    }
    return updatedCustomVariant;
  };

  createCustomProduct = async (params: CreateCustomProductParams) => {
    try {
      const [stagedImageUploadResponse, customProduct] = await Promise.all([
        stageImageForUpload(
          params.file,
          ShopifyProductService.getCustomProductId({
            productId: params.productId,
            userId: params.userId,
          })
        ),
        this.fetchOrCreateCustomProduct(params.productId, params.userId),
      ]);

      const updatedCustomVariant =
        await this.updateCustomProductVariantWithImage({
          customProduct,
          originProductId: params.productId,
          originProductVariantId: params.variantId,
          userId: params.userId,
          resourceUrl: stagedImageUploadResponse.resourceUrl,
          variantTitle: params.variantTitle,
        });

      return {
        data: {
          customProduct,
          updatedCustomVariant,
          userId: params.userId,
          referenceProductId: params.productId,
        },
      };
    } catch (error) {
      console.error("Error creating custom product:", error);
      return {
        data: undefined,
        errors: error,
      };
    }
  };
}
