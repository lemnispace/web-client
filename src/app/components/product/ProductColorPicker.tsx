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
  colors: ProductColor[];
  defaultColor?: ProductColor;
  onColorChange?: (color: ProductColor) => void;
}

export default function ProductColorPicker({
  colors,
  onColorChange,
  defaultColor,
  ...props
}: ProductColorPickerProps) {
  defaultColor = defaultColor ?? colors[0];
  const [selectedColor, setSelectedColor] = useState(defaultColor);

  const handleColorChange = (color: ProductColor) => {
    setSelectedColor(color);
    onColorChange?.(color);
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
                  "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none"
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
