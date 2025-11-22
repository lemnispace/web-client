"use client";

import { ShopifyProductService } from "@/lib/shopify/services/ShopifyProductService";
import { ProductVariantOptionType } from "@/lib/shopify/types/product";
import {
  Product,
  ProductImg,
  ProductVariant,
  ProductWithCustomization,
} from "@/utils/types";
import { isDefined } from "@/utils/validators";
import { Tab } from "@headlessui/react";
import clsx from "clsx";
import Image from "next/image";
import { useContext, useMemo } from "react";
import { ProductVariantContext } from "./ProductView";

interface ImageGalleryProps {
  product: Product;
  className?: string;
  customizationImage?: {
    imageUrl: string;
    imageId: string;
    variantId: string;
    productId: string;
  } | null;
}

interface ImageVariant extends ProductImg {
  variantId: string;
}

const getImagesByVariant = (
  product: ProductWithCustomization,
  variantType: ProductVariantOptionType,
  value: string
): ImageVariant[] => {
  if (!product.variants) {
    return [];
  }
  const customVariantsByOriginVariantId = new Map<string, ProductVariant>();
  product.customVariants?.forEach((variant) => {
    if (variant.metafields?.origin_product_variant?.value) {
      customVariantsByOriginVariantId.set(
        variant.metafields?.origin_product_variant?.value,
        variant
      );
    }
  });
  return product.variants
    .filter((variant) => variant[variantType] === value)
    .map((variant) => {
      const customVariant = customVariantsByOriginVariantId.get(variant.id);
      const image = customVariant?.image ?? variant.image;
      return image && { variantId: variant.id, ...image };
    })
    .filter(isDefined);
};

export default function ImageGallery({
  product,
  className,
  customizationImage,
}: ImageGalleryProps) {
  const { selectedVariant, setSelectedVariant } = useContext(
    ProductVariantContext
  );

  // Determine the primary variant option to use for image filtering
  const primaryVariantOption = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return null;
    }
    // Priority: Color > Size > Material > Style
    const firstVariant = product.variants[0];
    if (firstVariant.Color) return "Color" as ProductVariantOptionType;
    if (firstVariant.Size) return "Size" as ProductVariantOptionType;
    if (firstVariant.Material) return "Material" as ProductVariantOptionType;
    if (firstVariant.Style) return "Style" as ProductVariantOptionType;
    return null;
  }, [product.variants]);

  const images = useMemo(
    () => {
      // If there's a customization image for the selected variant, show it
      if (customizationImage && selectedVariant?.id === customizationImage.variantId) {
        console.log('[ImageGallery] Showing customization image:', {
          imageUrl: customizationImage.imageUrl,
          variantId: customizationImage.variantId,
          selectedVariantId: selectedVariant?.id
        });
        return [{
          variantId: selectedVariant.id,
          src: customizationImage.imageUrl,
          alt: `Customized ${product.name}`,
        }];
      }

      if (customizationImage && selectedVariant) {
        console.log('[ImageGallery] Customization image variant mismatch:', {
          customizationVariantId: customizationImage.variantId,
          selectedVariantId: selectedVariant.id
        });
      }

      if (!primaryVariantOption) {
        // No primary variant option: show all product images if available
        if (product.images && product.images.length > 0) {
          return product.images.map((img) => ({
            variantId: "", // No variant, so use empty string
            ...img,
          }));
        }
        // If no product images, show the first available variant image
        const firstVariantWithImage = product.variants?.find(v => v.image);
        if (firstVariantWithImage && firstVariantWithImage.image) {
          return [{
            variantId: firstVariantWithImage.id,
            ...firstVariantWithImage.image,
          }];
        }
        return [];
      }
      if (!selectedVariant) {
        return [];
      }
      const optionValue = selectedVariant[primaryVariantOption];
      return optionValue
        ? getImagesByVariant(product, primaryVariantOption, optionValue)
        : [];
    },
    [selectedVariant, product, primaryVariantOption, customizationImage]
  );
  const selectedIndex = useMemo(() => {
    if (!selectedVariant) {
      return -1;
    }
    return images.findIndex((image) => image.variantId === selectedVariant.id);
  }, [images, selectedVariant]);

  if (!setSelectedVariant || selectedVariant === null) {
    throw new Error("ProductVariantContext not found");
  }

  const handleVariantImageSelect = (index: number) => {
    const variant = ShopifyProductService.getVariantById(
      product,
      images?.[index].variantId
    );
    if (variant) {
      setSelectedVariant((prev) => {
        if (!prev) {
          return variant;
        }
        // If the variant is the same, return the previous value to avoid unnecessary re-renders
        if (
          prev.Color === variant.Color &&
          prev.Size === variant.Size &&
          prev.Material === variant.Material &&
          prev.Style === variant.Style
        ) {
          return prev;
        }
        return { ...prev, ...variant };
      });
    }
  };

  return (
    <Tab.Group
      as="div"
      className={clsx("flex flex-col-reverse", className)}
      onChange={handleVariantImageSelect}
      selectedIndex={selectedIndex}
    >
      {/* Image selector */}
      <div className="mx-auto mt-6 w-full max-w-2xl block lg:max-w-none">
        <Tab.List className="grid grid-cols-4 gap-6">
          {images?.map((image, index) => (
            <Tab
              key={image.src}
              className="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 lemni-focus-4"
            >
              {({ selected }) => (
                <>
                  <span className="sr-only">
                    {image.alt ?? `${product.name}-${index}`}
                  </span>
                  <span className="absolute inset-0 overflow-hidden rounded-md">
                    <Image
                      src={image.src}
                      alt={image.alt ?? ""}
                      style={{
                        maxWidth: "100%",
                      }}
                      fill
                      priority
                      className="object-contain object-center"
                    />
                  </span>
                  <span
                    /**Use clsx instead of classNames to avoid removing ring-transparent*/
                    className={clsx(
                      selected ? "ring-primary-500" : "ring-transparent",
                      "pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2"
                    )}
                    aria-hidden="true"
                  />
                </>
              )}
            </Tab>
          ))}
        </Tab.List>
      </div>

      <Tab.Panels className="aspect-h-1 aspect-w-1 w-full">
        {images?.map((image) => (
          <Tab.Panel key={image.src} className="lemni-focus-4">
            <Image
              src={image.src}
              alt={image.alt ?? ""}
              style={{
                maxWidth: "100%",
              }}
              fill
              className="object-contain object-center sm:rounded-lg"
            />
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
}
