"use client";

import { Button } from "@/components/button";
import { BUTTON_TEXT } from "@/utils/text";
import { Product, ProductVariant } from "@/utils/types";
import { HeartIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
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

const variantToQueryParams = (variant: ProductVariant) => {
  const params = new URLSearchParams();
  // we need to add the variant id to the query params in the create page
  params.set("variant", variant.id);
  return params.toString();
};

const getVariantCreateUrl = (
  baseUrl: string,
  variant: ProductVariant | undefined | null
) => {
  const url = `${baseUrl}/create`;
  const params = variant && variantToQueryParams(variant);
  return params ? `${url}?${params}` : baseUrl;
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
      <div className="mt-10 flex flex-col sm:flex-row sm:w-full">
        <Button
          type="submit"
          color="primary"
          disabled
          className={clsx(
            "flex max-w-xs flex-1 sm:w-full",
            formState === "READY" && "cursor-pointer"
          )}
        >
          {BUTTON_TEXT.addToCart}
        </Button>
        <Button
          href={getVariantCreateUrl(product.href, selectedVariant)}
          disabled={!selectedVariant}
          outline
          className={clsx(
            "mt-4 sm:ml-4 sm:mt-0 flex max-w-xs flex-1 sm:w-full border-secondary-500",
            formState === "READY" && "cursor-pointer"
          )}
        >
          <span className="text-secondary-500">
            {BUTTON_TEXT.goToCustomize}
          </span>
          <PencilSquareIcon
            className="h-6 w-6 flex-shrink-0 stroke-secondary-500"
            aria-hidden="true"
          />
        </Button>
        {/* <Button
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
        </Button> */}
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
