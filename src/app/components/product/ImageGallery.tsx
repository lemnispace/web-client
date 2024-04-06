"use client";

import { ProductVariantOptionType } from "@/lib/types/shopify";
import { getVariantById } from "@/utils/getters";
import { Product, ProductImg } from "@/utils/types";
import { isDefined } from "@/utils/validators";
import { Tab } from "@headlessui/react";
import clsx from "clsx";
import Image from "next/image";
import { useContext } from "react";
import { ProductVariantContext } from "./ProductView";

interface ImageGalleryProps {
  product: Product;
  className?: string;
}

interface ImageVariant extends ProductImg {
  variantId: string;
}

const getImagesByVariant = (
  product: Product,
  variantType: ProductVariantOptionType,
  value: string
): ImageVariant[] => {
  if (!product.variants) {
    return [];
  }
  return product.variants
    .filter((variant) => variant[variantType] === value)
    .map(
      (variant) => variant.image && { variantId: variant.id, ...variant.image }
    )
    .filter(isDefined);
};

export default function ImageGallery({
  product,
  className,
  ...props
}: ImageGalleryProps) {
  const { selectedVariant, setSelectedVariant } = useContext(
    ProductVariantContext
  );
  if (!selectedVariant || !setSelectedVariant) {
    throw new Error("ProductVariantContext not found");
  }
  const images = selectedVariant?.Color
    ? getImagesByVariant(product, "Color", selectedVariant.Color)
    : [];

  const handleVariantImageSelect = (index: number) => {
    const variant = getVariantById(product, images?.[index].variantId);
    if (variant) {
      setSelectedVariant((prev) => {
        // If the variant is the same, return the previous value to avoid unnecessary re-renders
        if (
          prev.Color === variant.Color &&
          prev.Size === variant.Size &&
          prev.Material === variant.Material &&
          prev.Style === variant.Style
        ) {
          return prev;
        }
        const { Color, Size, Material, Style } = variant;
        return { ...prev, Color, Size, Material, Style };
      });
    }
  };
  return (
    <Tab.Group
      as="div"
      className={clsx("flex flex-col-reverse", className)}
      onChange={handleVariantImageSelect}
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
                      className="object-cover object-center"
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
              className="object-cover object-center sm:rounded-lg"
            />
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
}
