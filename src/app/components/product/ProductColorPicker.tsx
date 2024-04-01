"use client";

import { PRODUCT_COLOR_PICKER_TEXT } from "@/utils/text";
import { Label, RadioGroup } from "@headlessui/react";
import clsx from "clsx";
import { useState } from "react";

export interface ProductColor {
  name: string;
  bgColor: string;
  selectedColor: string;
}

export interface ProductColorPickerProps
  extends React.HTMLAttributes<HTMLElement> {
  colors: string[];
  defaultColor?: string;
  onColorChange?: (color: string) => void;
}

/**
 * Takes in a string for a color and returns the color in tailwind format.
 * @param color - The color string.
 * @returns The color object in tailwind format.
 */
export const formatColor = (color: string) => {
  color = color.toLowerCase();
  const colorMap: Record<string, ProductColor> = {
    white: {
      name: "white",
      bgColor: "bg-gray-100",
      selectedColor: "ring-gray-400",
    },
    "red oak": {
      name: "red oak",
      bgColor: "bg-amber-600",
      selectedColor: "ring-amber-600",
    },
    oak: {
      name: "oak",
      bgColor: "bg-yellow-500",
      selectedColor: "ring-yellow-500",
    },
    black: {
      name: "black",
      bgColor: "bg-gray-900",
      selectedColor: "ring-gray-900",
    },
  };
  if (color in colorMap) {
    return colorMap[color];
  }
  return {
    name: color,
    bgColor: `bg-${color}-500`,
    selectedColor: `ring-${color}-500`,
  };
};

const mapColors = (colors: string[]) => colors.map(formatColor);
const findColor = (color: string, colors: ProductColor[]) =>
  colors.find((c) => c.name === color);
const getDefaultColor = (color: string | undefined, colors: ProductColor[]) => {
  if (color) {
    return findColor(color, colors) ?? colors[0];
  }
  return colors[0];
};

export default function ProductColorPicker({
  colors: colorStrings,
  onColorChange,
  defaultColor: defaultColorString,
  ...props
}: ProductColorPickerProps) {
  const colors = mapColors(colorStrings);
  const defaultColor = getDefaultColor(defaultColorString, colors);
  const [selectedColor, setSelectedColor] = useState(defaultColor);

  const handleColorChange = (color: ProductColor) => {
    setSelectedColor(color);
    onColorChange?.(color.name);
  };

  return (
    <div {...props}>
      <h3 className="text-sm text-gray-600">
        {PRODUCT_COLOR_PICKER_TEXT.title}
      </h3>
      <RadioGroup
        value={selectedColor}
        onChange={handleColorChange}
        by="name"
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
              value={color}
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
