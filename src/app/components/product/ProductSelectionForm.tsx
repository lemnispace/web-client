"use client";

import { Button } from "@/components/button";
import { Label, RadioGroup } from "@headlessui/react";
import { HeartIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useState } from "react";

interface ProductColor {
  name: string;
  bgColor: string;
  selectedColor: string;
}
interface ProductSelectionFormProps
  extends React.HTMLAttributes<HTMLFormElement> {
  colors: ProductColor[];
}

export default function ProductSelectionForm({
  colors,
  ...props
}: ProductSelectionFormProps) {
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  return (
    <form {...props}>
      {/* Colors */}
      <div>
        <h3 className="text-sm text-gray-600">Color</h3>

        <RadioGroup
          value={selectedColor}
          onChange={setSelectedColor}
          className="mt-2"
        >
          <Label className="sr-only">Choose a color</Label>
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

      <div className="mt-10 flex">
        <Button
          type="submit"
          color="primary"
          className="flex max-w-xs flex-1 sm:w-full"
        >
          Add to bag
        </Button>

        <Button type="button" className="ml-4 flex" plain>
          <HeartIcon className="h-6 w-6 flex-shrink-0" aria-hidden="true" />
          <span className="sr-only">Add to favorites</span>
        </Button>
      </div>
    </form>
  );
}
