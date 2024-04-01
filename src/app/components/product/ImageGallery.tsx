"use client";

import { Product, ProductItemImg } from "@/utils/types";
import { Tab } from "@headlessui/react";
import clsx from "clsx";
import Image from "next/image";
import { useMemo } from "react";

interface ImageGalleryProps {
  product: Product;
  className?: string;
  imageVariantKey: string;
}

const getColorFromVariantTitle = (title: string) => {
  return title.split("/")[0].trim().toLowerCase();
};

const groupImagesByColorVariant = (product: Product) => {
  const imageMap = new Map<string, ProductItemImg[]>();
  Object.entries(product.images ?? {}).forEach(([variantTitle, images]) => {
    const color = getColorFromVariantTitle(variantTitle).toLowerCase();
    const imgs = imageMap.get(color) ?? [];
    imgs.push(...images);
    imageMap.set(color, imgs);
  });
  return imageMap;
};

export default function ImageGallery({
  product,
  className,
  imageVariantKey,
  ...props
}: ImageGalleryProps) {
  const imagesByVariant = useMemo(
    () => product && groupImagesByColorVariant(product),
    [product]
  );
  const colorKey = useMemo(
    () => getColorFromVariantTitle(imageVariantKey),
    [imageVariantKey]
  );
  const images = imagesByVariant.get(colorKey) ?? [];
  return (
    <Tab.Group as="div" className={clsx("flex flex-col-reverse", className)}>
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
