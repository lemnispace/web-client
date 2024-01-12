"use client";

import { Button } from "@/components/button";
import { BUTTON_TEXT } from "@/utils/text";
import { HeartIcon } from "@heroicons/react/24/outline";
import ProductColorPicker, { ProductColor } from "./ProductColorPicker";

interface ProductSelectionFormProps
  extends Omit<React.HTMLAttributes<HTMLFormElement>, "onSubmit"> {
  colors: ProductColor[];
  onColorChange?: (color: ProductColor) => void;
  onAddToFavorites?: () => void;
  onSubmit?: (data: ProductFormData) => void;
}
type ColorFormValue = {
  [K in keyof ProductColor as `color[${K}]`]: string;
};
interface ProductFormData extends ColorFormValue {}

export default function ProductSelectionForm({
  colors,
  onColorChange,
  onAddToFavorites,
  ...props
}: ProductSelectionFormProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // get form data
    const formData = new FormData(event.target as HTMLFormElement);
    event.preventDefault();
    // get data from form
    const data = Object.fromEntries(formData.entries()) as ProductFormData;
    props.onSubmit?.(data);
  };
  return (
    <form {...props} onSubmit={handleSubmit}>
      <ProductColorPicker colors={colors} onColorChange={onColorChange} />
      <div className="mt-10 flex">
        <Button
          type="submit"
          color="primary"
          className="flex max-w-xs flex-1 sm:w-full"
        >
          {BUTTON_TEXT.addToCart}
        </Button>
        <Button
          type="button"
          className="ml-4 flex"
          plain
          onClick={onAddToFavorites}
        >
          <HeartIcon className="h-6 w-6 flex-shrink-0" aria-hidden="true" />
          <span className="sr-only">{BUTTON_TEXT.addToFavorites}</span>
        </Button>
      </div>
    </form>
  );
}
