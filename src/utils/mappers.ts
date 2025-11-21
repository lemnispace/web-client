import { Product as ShopAPIProduct } from "@/lib/commerce/types";
import { Template } from "@/lib/printful/types";
import { CurrencyCode } from "@/lib/shopify/types/shopifyCurrencyCodes";
import DOMPurify from "isomorphic-dompurify";
import { ProductImg, ProductItem, VariantTemplate } from "./types";

/*
 *  ╔══════════════════════════════════════════════════════════════════════════════╗
 *  ║                               Shop-API Products                              ║
 *  ╚══════════════════════════════════════════════════════════════════════════════╝
 */

/**
 * Maps a shop-api Product to ProductItem used by the UI components
 */
export const mapShopAPIProduct = (product: ShopAPIProduct): ProductItem => {
  // Calculate price range from product and its variants
  const prices = [
    product.price,
    ...(product.variants?.map((v) => v.price) || []),
  ];
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  // Map the first image to ProductImg format, or use a placeholder if no images exist
  const img: ProductImg =
    product.images && product.images.length > 0
      ? {
          src: product.images[0].url,
          alt: product.images[0].altText || product.title,
          width: product.images[0].width || 800,
          height: product.images[0].height || 800,
          id: product.images[0].id || product.id,
        }
      : {
          // Use local generated images based on product type
          src:
            product.tags?.includes("drinkware") || product.tags?.includes("mug")
              ? "/products/mug.png"
              : product.tags?.includes("apparel") ||
                  product.tags?.includes("t-shirt")
                ? "/products/tshirt.png"
                : product.tags?.includes("canvas") ||
                    product.tags?.includes("print")
                  ? "/products/canvas.png"
                  : "/products/mug.png", // default fallback
          alt: product.title,
          width: 800,
          height: 800,
          id: product.id,
        };

  // Use product ID for routing since shop-api doesn't have unique handles
  // Handles/slugs can be non-unique since they're generated from titles

  return {
    id: product.id,
    name: product.title,
    priceRange: {
      minVariantPrice: {
        amount: minPrice,
        currencyCode: CurrencyCode.USD, // shop-api uses USD by default
      },
      maxVariantPrice: {
        amount: maxPrice,
        currencyCode: CurrencyCode.USD,
      },
    },
    description: product.description,
    descriptionHtml: DOMPurify.sanitize(product.description),
    tags: product.tags,
    href: `/shop/products/${product.id}`,
    img,
  };
};

/**
 * Maps an array of shop-api Products to ProductItems
 */
export const mapShopAPIProducts = (
  products: ShopAPIProduct[]
): ProductItem[] => {
  return products.map(mapShopAPIProduct);
};

/**
 * Maps shop-api Product to the full Product type expected by ProductView
 */
export const mapShopAPIProductToFull = (product: ShopAPIProduct) => {
  const baseProduct = mapShopAPIProduct(product);

  // Map all product images
  const images: ProductImg[] =
    product.images?.map((img) => ({
      id: img.id || product.id,
      src: img.url,
      alt: img.altText || product.title,
      width: img.width || 800,
      height: img.height || 800,
    })) || [];

  // Create a map of variant SKU to image for quick lookup
  const variantToImageMap = new Map<string, ProductImg>();
  product.images?.forEach((img) => {
    const mappedImg: ProductImg = {
      id: img.id || product.id,
      src: img.url,
      alt: img.altText || product.title,
      width: img.width || 800,
      height: img.height || 800,
    };

    // Map each variant SKU associated with this image
    img.variants?.forEach((variantSku: string) => {
      variantToImageMap.set(variantSku, mappedImg);
    });
  });

  // Get fallback image based on product tags
  const getFallbackImage = (): ProductImg => {
    const src =
      product.tags?.includes("drinkware") || product.tags?.includes("mug")
        ? "/products/mug.png"
        : product.tags?.includes("apparel") || product.tags?.includes("t-shirt")
          ? "/products/tshirt.png"
          : product.tags?.includes("canvas") || product.tags?.includes("print")
            ? "/products/canvas.png"
            : "/products/mug.png";

    return {
      id: product.id,
      src,
      alt: product.title,
      width: 800,
      height: 800,
    };
  };

  // Map variants to the expected format
  const variants =
    product.variants?.map((variant) => {
      // Find the image associated with this variant's SKU
      const variantImage = variant.sku
        ? variantToImageMap.get(variant.sku)
        : undefined;

      // Use fallback image if no variant image found
      const finalImage = variantImage || getFallbackImage();

      // Map variant options to the format expected by ProductView
      const variantOptions: Record<string, string> = {};
      variant.options?.forEach((opt) => {
        variantOptions[opt.name] = opt.value;
      });

      // Extract Printful metadata from fulfillmentData
      const metafields =
        variant.fulfillmentData?.partnerId === "printful"
          ? {
              printful_catalog_product_id: {
                id: `gid://shopify/Metafield/${variant.id}_catalog_product`,
                namespace: "printful",
                value: variant.fulfillmentData.partnerProductId,
                type: "string",
              },
              printful_catalog_variant_id: {
                id: `gid://shopify/Metafield/${variant.id}_catalog_variant`,
                namespace: "printful",
                value: variant.fulfillmentData.partnerVariantId,
                type: "string",
              },
            }
          : undefined;

      return {
        id: variant.id,
        title: variant.title,
        price: {
          amount: String(variant.price),
          currencyCode: CurrencyCode.USD,
        },
        sku: variant.sku,
        availableForSale: (variant.inventory || 0) > 0,
        quantityAvailable: variant.inventory || 0,
        image: finalImage,
        metafields,
        ...variantOptions,
      };
    }) || [];

  return {
    ...baseProduct,
    images,
    variants,
    // Customization fields - not yet supported in shop-api
    customVariants: undefined,
    customProductId: undefined,
    metafields: undefined,
  };
};

/*
 *  ╔══════════════════════════════════════════════════════════════════════════════╗
 *  ║                               Printful Templates                             ║
 *  ╚══════════════════════════════════════════════════════════════════════════════╝
 */

export const mapPrintfulTemplates = (
  templates: Template[]
): VariantTemplate[] => {
  return templates.map((t) => ({
    // convert snake_case to camelCase
    templateId: t.template_id,
    imageUrl: t.image_url,
    backgroundUrl: t.background_url,
    backgroundColor: t.background_color,
    printfileId: t.printfile_id,
    templateWidth: t.template_width,
    templateHeight: t.template_height,
    printAreaWidth: t.print_area_width,
    printAreaHeight: t.print_area_height,
    printAreaTop: t.print_area_top,
    printAreaLeft: t.print_area_left,
    isTemplateOnFront: t.is_template_on_front,
    orientation: t.orientation,
    conflictingPlacements: t.conflicting_placements,
  }));
};

/*
 *  ╔══════════════════════════════════════════════════════════════════════════════╗
 *  ║                               Utility Mappers                                ║
 *  ╚══════════════════════════════════════════════════════════════════════════════╝
 */

/**
 * Filters an object by removing properties with falsy values.
 *
 * @param obj - The object to filter.
 * @returns A new object with only the properties that have truthy values.
 */
export const filterObject = <T extends Record<string, any>>(
  obj: T
): Partial<T> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => Boolean(value))
  ) as Partial<T>;
};
