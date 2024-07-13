"use client";

import { Button } from "@/components/button";
import LinearGradientIcon from "@/components/icons/LinearGradientIcon";
import { getVariantCustomizeUrl } from "@/utils/links";
import { BUTTON_TEXT } from "@/utils/text";
import { Product } from "@/utils/types";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useContext } from "react";
import ProductColorPicker, { ProductColor } from "./ProductColorPicker";
import ProductSizePicker from "./ProductSizePicker";
import { ProductVariantContext } from "./ProductView";
import { handleAddToCart } from "./actions/addToCart";

interface ProductSelectionFormProps
  extends Omit<React.HTMLAttributes<HTMLFormElement>, "onSubmit"> {
  onAddToFavorites?: () => void;
  product: Product;
}
type ColorFormValue = {
  [K in keyof ProductColor as `color[${K}]`]: string;
};

export type ProductSelectionFormData = ColorFormValue & {
  size?: string;
};

export default function ProductSelectionForm({
  product,
  onAddToFavorites,
  ...props
}: ProductSelectionFormProps) {
  const { selectedVariant } = useContext(ProductVariantContext);
  const addToCartWithSelectedVariant = handleAddToCart.bind(null, {
    variant: selectedVariant,
    quantity: 1,
  });
  return (
    <form {...props} action={addToCartWithSelectedVariant}>
      <ProductColorPicker product={product} />
      <ProductSizePicker product={product} className="mt-8" />
      <div className={clsx("mt-10 flex flex-col sm:w-full sm:flex-row")}>
        <Button
          type="submit"
          color={selectedVariant?.hasCustomization ? "primary" : "zinc"}
          className={clsx(
            "flex max-w-xs flex-1 sm:w-full",
            selectedVariant?.hasCustomization
              ? "cursor-pointer"
              : "cursor-not-allowed"
          )}
          disabled={!selectedVariant?.hasCustomization}
          title={
            !selectedVariant?.hasCustomization
              ? "Customization required"
              : undefined
          }
        >
          {BUTTON_TEXT.addToCart}
        </Button>
        <Button
          href={getVariantCustomizeUrl(product.href, selectedVariant)}
          disabled={!selectedVariant}
          outline
          className={clsx(
            "sm:ml-4 mt-4 sm:mt-0 flex max-w-xs flex-1 sm:w-full custom-gradient-border",
            "cursor-pointer"
          )}
        >
          <span className="custom-gradient-text">
            {BUTTON_TEXT.goToCustomize}
          </span>
          <LinearGradientIcon
            fromColor="#3aa1f5"
            toColor="#f55679"
            direction="right"
          >
            <PencilSquareIcon
              className="h-6 w-6 flex-shrink-0"
              aria-hidden="true"
            />
          </LinearGradientIcon>
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
