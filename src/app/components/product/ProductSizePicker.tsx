"use client";

import { ShopifyProductService } from "@/lib/shopify/services/ShopifyProductService";
import { getAllProductVariantOptions } from "@/lib/shopify/utils/mappers";
import { PRODUCT_SIZE_PICKER_TEXT } from "@/utils/text";
import { Product } from "@/utils/types";
import { hasVariant } from "@/utils/validators";
import { Label, RadioGroup } from "@headlessui/react";
import clsx from "clsx";
import React, { useContext } from "react";
import { ProductVariantContext } from "./ProductView";

export interface ProductSizePickerProps
  extends React.HTMLAttributes<HTMLElement> {
  product: Product;
}

export default function ProductSizePicker({
  product,
  ...props
}: ProductSizePickerProps) {
  const { selectedVariant, setSelectedVariant } = useContext(
    ProductVariantContext
  );
  if (!setSelectedVariant || selectedVariant === null) {
    throw new Error("ProductVariantContext not found");
  }
  if (!selectedVariant || !hasVariant(product, "Size")) {
    // in case the product has no variants
    return null;
  }

  const handleSizeChange = (size: string) => {
    setSelectedVariant((prev) => {
      if (!prev) {
        return prev;
      }
      const variant = ShopifyProductService.getVariantByValues(product, {
        Color: prev.Color,
        Size: size,
        Material: prev.Material,
        Style: prev.Style,
      });
      return {
        ...prev,
        ...variant,
      };
    });
  };

  const sizes = getAllProductVariantOptions(product.variants, "Size");

  return (
    <div {...props}>
      <h3 className="text-sm text-gray-600">
        {PRODUCT_SIZE_PICKER_TEXT.title}
      </h3>
      <RadioGroup
        value={selectedVariant.Size}
        onChange={handleSizeChange}
        className="mt-2"
        name="size"
      >
        <Label className="sr-only">
          {PRODUCT_SIZE_PICKER_TEXT.shortDescription}
        </Label>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {sizes?.map((size) => (
            <RadioGroup.Option
              key={size}
              value={size}
              className={({ focus }) =>
                clsx(
                  "cursor-pointer lemni-focus",
                  focus ? "ring-2 ring-primary-500 ring-offset-2" : "",
                  "ui-checked:border-transparent ui-checked:bg-primary-500 ui-checked:text-white ui-checked:hover:bg-primary-600 border-gray-200 bg-white text-gray-900 hover:bg-gray-50",
                  "flex items-center justify-center rounded-md border py-3 px-3 text-sm font-medium uppercase sm:flex-1"
                )
              }
            >
              <Label as="span">{size}</Label>
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
}
