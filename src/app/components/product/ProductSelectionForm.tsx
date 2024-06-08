"use client";

import { Button } from "@/components/button";
import { getVariantCustomizeUrl } from "@/utils/links";
import { BUTTON_TEXT } from "@/utils/text";
import { Product } from "@/utils/types";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useContext } from "react";
import ProductColorPicker, { ProductColor } from "./ProductColorPicker";
import ProductSizePicker from "./ProductSizePicker";
import { ProductVariantContext } from "./ProductView";

interface ProductSelectionFormProps
  extends Omit<React.HTMLAttributes<HTMLFormElement>, "onSubmit"> {
  onAddToFavorites?: () => void;
  onSubmit?: (data: ProductFormData) => void;
  product: Product;
}
type ColorFormValue = {
  [K in keyof ProductColor as `color[${K}]`]: string;
};

type FormState = "READY" | "BUSY" | "LOADING";
type ProductFormData = ColorFormValue & {
  size?: string;
};

export default function ProductSelectionForm({
  product,
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
  const { selectedVariant } = useContext(ProductVariantContext);
  return (
    <form {...props} onSubmit={handleSubmit}>
      <ProductColorPicker product={product} />
      <ProductSizePicker product={product} className="mt-8" />
      <div
        className={clsx(
          "mt-10 flex flex-col sm:w-full sm:flex-row",
          !selectedVariant?.hasCustomization && "lg:flex-row-reverse"
        )}
      >
        {selectedVariant?.hasCustomization && (
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
        )}
        <Button
          href={getVariantCustomizeUrl(product.href, selectedVariant)}
          disabled={!selectedVariant}
          {...(selectedVariant?.hasCustomization
            ? { outline: true }
            : { color: "secondary" })}
          className={clsx(
            selectedVariant?.hasCustomization && "sm:ml-4",
            "mt-4 sm:mt-0 flex max-w-xs flex-1 sm:w-full border-secondary-500",
            formState === "READY" && "cursor-pointer"
          )}
        >
          <span
            className={clsx(
              selectedVariant?.hasCustomization && "text-secondary-500"
            )}
          >
            {BUTTON_TEXT.goToCustomize}
          </span>
          <PencilSquareIcon
            className={clsx(
              "h-6 w-6 flex-shrink-0",
              selectedVariant?.hasCustomization
                ? "stroke-secondary-500"
                : "stroke-white"
            )}
            aria-hidden="true"
          />
        </Button>
        {/* <Button
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
        </Button> */}
      </div>
    </form>
  );
}
