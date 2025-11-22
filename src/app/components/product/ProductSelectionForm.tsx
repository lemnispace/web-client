"use client";

import { Button } from "@/components/button";
import LinearGradientIcon from "@/components/icons/LinearGradientIcon";
import { getVariantCustomizeUrl } from "@/utils/links";
import { BUTTON_TEXT } from "@/utils/text";
import { Product } from "@/utils/types";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useContext } from "react";
import { useCart } from "@/app/hooks/useCart";
import ProductColorPicker, { ProductColor } from "./ProductColorPicker";
import ProductSizePicker from "./ProductSizePicker";
import { ProductVariantContext } from "./ProductView";

interface ProductSelectionFormProps
  extends Omit<React.HTMLAttributes<HTMLFormElement>, "onSubmit"> {
  onAddToFavorites?: () => void;
  product: Product;
  customizationImageId?: string;
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
  customizationImageId,
  ...props
}: ProductSelectionFormProps) {
  const { selectedVariant } = useContext(ProductVariantContext);
  const { addItem } = useCart();

  // Check if there's a customization available
  const hasCustomization = Boolean(customizationImageId);
  
  console.log('[ProductSelectionForm] Customization status:', {
    customizationImageId,
    hasCustomization,
    selectedVariantId: selectedVariant?.id
  });

  return (
    <form
      {...props}
      onSubmit={(e) => {
        e.preventDefault();
        
        console.log('[ProductSelectionForm] Form submit:', {
          hasCustomization,
          selectedVariantId: selectedVariant?.id,
          customizationImageId,
          willAddToCart: Boolean(selectedVariant && hasCustomization)
        });
        
        if (selectedVariant && hasCustomization) {
          const itemData = {
            productId: product.id,
            variantId: selectedVariant.id,
            quantity: 1,
            customizationData: {
              imageId: customizationImageId!,
            },
          };
          
          console.log('[ProductSelectionForm] Adding item to cart:', itemData);
          
          addItem(itemData).catch((error) => {
            console.error("Failed to add item to cart:", error);
          });
        }
      }}
    >
      <ProductColorPicker product={product} />
      <ProductSizePicker product={product} className="mt-8" />
      <div className={clsx("mt-10 flex flex-col sm:w-full sm:flex-row")}>
        <Button
          type="submit"
          color={hasCustomization ? "primary" : "zinc"}
          className={clsx(
            "flex max-w-xs flex-1 sm:w-full",
            hasCustomization
              ? "cursor-pointer"
              : "cursor-not-allowed"
          )}
          disabled={!hasCustomization}
          title={
            !hasCustomization
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
