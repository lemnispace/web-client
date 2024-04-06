"use client";

import { Button } from "@/components/button";
import { BUTTON_TEXT } from "@/utils/text";
import { HeartIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import ProductColorPicker, { ProductColor } from "./ProductColorPicker";

interface ProductSelectionFormProps
  extends Omit<React.HTMLAttributes<HTMLFormElement>, "onSubmit"> {
  colors: string[];
  onAddToFavorites?: () => void;
  onSubmit?: (data: ProductFormData) => void;
}
type ColorFormValue = {
  [K in keyof ProductColor as `color[${K}]`]: string;
};
type FormState = "READY" | "BUSY" | "LOADING";
interface ProductFormData extends ColorFormValue {}

export default function ProductSelectionForm({
  colors,
  onAddToFavorites,
  ...props
}: ProductSelectionFormProps) {
  let formState: FormState = "READY";
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
      {Boolean(colors?.length) && <ProductColorPicker colors={colors} />}
      <div className="mt-10 flex flex-col sm:flex-row sm:w-full">
        <Button
          type="submit"
          color="primary"
          className={clsx(
            "flex max-w-xs flex-1 sm:w-full",
            formState === "READY" && "cursor-pointer"
          )}
        >
          {BUTTON_TEXT.addToCart}
        </Button>
        <Button
          href="./text-mosaic/create"
          outline
          className={clsx(
            "mt-4 sm:ml-4 sm:mt-0 flex max-w-xs flex-1 sm:w-full",
            formState === "READY" && "cursor-pointer"
          )}
        >
          <span className="text-primary-500">{BUTTON_TEXT.goToCustomize}</span>
          <PencilSquareIcon
            className="h-6 w-6 flex-shrink-0 stroke-primary-500"
            aria-hidden="true"
          />
        </Button>
        <Button
          type="button"
          className={clsx(
            "mt-4 sm:ml-4 sm:mt-0 flex max-w-xs",
            formState === "READY" && "cursor-pointer"
          )}
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
