"use client";

import { getAllProductVariantOptions } from "@/lib/shopify/utils/mappers";
import { getVariantByValues } from "@/utils/getters";
import { PRODUCT_COLOR_PICKER_TEXT } from "@/utils/text";
import { Product, ProductVariant } from "@/utils/types";
import { hasVariant } from "@/utils/validators";
import { Label, RadioGroup } from "@headlessui/react";
import clsx from "clsx";
import React, { useContext } from "react";
import { ProductVariantContext } from "./ProductView";

export interface ProductColor {
  name: string;
  bgColor: string;
  selectedColor: string;
}

export interface ProductColorPickerProps
  extends React.HTMLAttributes<HTMLElement> {
  product: Product;
}

/**
 * Takes in a string for a color and returns the color in tailwind format.
 * @param color - The color string.
 * @returns The color object in tailwind format.
 */
export const formatColor = (color: string) => {
  const colorMap: Record<string, ProductColor> = {
    White: {
      name: "White",
      bgColor: "bg-gray-100",
      selectedColor: "ring-gray-400",
    },
    "Red Oak": {
      name: "Red Oak",
      bgColor: "bg-amber-600",
      selectedColor: "ring-amber-600",
    },
    Oak: {
      name: "Oak",
      bgColor: "bg-yellow-500",
      selectedColor: "ring-yellow-500",
    },
    Black: {
      name: "Black",
      bgColor: "bg-gray-900",
      selectedColor: "ring-gray-900",
    },
  };
  if (color in colorMap) {
    return colorMap[color];
  }
  return {
    name: color,
    bgColor: `bg-${color.toLowerCase()}-500`,
    selectedColor: `ring-${color.toLowerCase()}-500`,
  };
};

const mapColors = (variants: ProductVariant[]): ProductColor[] => {
  return getAllProductVariantOptions(variants, "Color").map(formatColor);
};

export default function ProductColorPicker({
  product,
  ...props
}: ProductColorPickerProps) {
  const { selectedVariant, setSelectedVariant } = useContext(
    ProductVariantContext
  );
  if (!setSelectedVariant || selectedVariant === null) {
    throw new Error("ProductVariantContext not found");
  }
  if (!selectedVariant || !hasVariant(product, "Color")) {
    // in case the product has no variants
    return null;
  }

  const colors = mapColors(product.variants);

  const handleColorChange = (color: string) => {
    setSelectedVariant((prev) => {
      if (!prev) {
        return prev;
      }
      const variant = getVariantByValues(product, {
        Color: color,
        Size: prev.Size,
        Material: prev.Material,
        Style: prev.Style,
      });
      return {
        ...prev,
        ...variant,
      };
    });
  };

  return (
    <div {...props}>
      <h3 className="text-sm text-gray-600">
        {PRODUCT_COLOR_PICKER_TEXT.title}
      </h3>
      <RadioGroup
        value={selectedVariant.Color}
        onChange={handleColorChange}
        className="mt-2"
        name="color"
      >
        <Label className="sr-only">
          {PRODUCT_COLOR_PICKER_TEXT.shortDescription}
        </Label>
        <span className="flex items-center space-x-3">
          {colors.map((color) => (
            <RadioGroup.Option
              key={color.name}
              value={color.name}
              className={({ focus, checked }) =>
                clsx(
                  color.selectedColor,
                  focus && checked ? "ring ring-offset-1" : "",
                  !focus && checked ? "ring-2" : "",
                  "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 lemni-focus"
                )
              }
            >
              <Label as="span" className="sr-only">
                {color.name}
              </Label>
              <span
                aria-hidden="true"
                className={clsx(
                  color.bgColor,
                  "h-8 w-8 rounded-full border border-black border-opacity-10"
                )}
              />
            </RadioGroup.Option>
          ))}
        </span>
      </RadioGroup>
    </div>
  );
}
