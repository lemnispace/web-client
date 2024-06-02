"use client";

import { formatPrice } from "@/utils/formatters";
import { ProductVariant, ProductWithCustomization } from "@/utils/types";
import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useMemo,
  useState,
} from "react";
import ImageGallery from "./ImageGallery";
import ProductDescription from "./ProductDescription";
import ProductSelectionForm from "./ProductSelectionForm";
import ProductTitle from "./ProductTitle";

interface ProductViewProps {
  product: ProductWithCustomization;
}

interface ProductVariantWithCustomization extends ProductVariant {
  hasCustomization: boolean;
}

interface ProductVariantContextProps {
  selectedVariant: ProductVariantWithCustomization | null | undefined;
  setSelectedVariant: Dispatch<
    SetStateAction<ProductVariant | undefined>
  > | null;
}

export const ProductVariantContext = createContext<ProductVariantContextProps>({
  selectedVariant: null,
  setSelectedVariant: null,
});

export const ProductView = ({ product, ...props }: ProductViewProps) => {
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0]);
  const customVariantsByOriginVariantId = useMemo(() => {
    const variantMap = new Map<string, ProductVariant>();
    product.customVariants?.forEach((variant) => {
      if (variant.metafields?.origin_product_variant) {
        variantMap.set(
          variant.metafields.origin_product_variant.value,
          variant
        );
      }
    });
    return variantMap;
  }, [product]);
  const price =
    selectedVariant?.price.amount ?? product.priceRange.minVariantPrice.amount;
  const currencyCode =
    selectedVariant?.price.currencyCode ??
    product.priceRange.minVariantPrice.currencyCode;
  const selectedVariantWithCustomization = useMemo(() => {
    const selectedCustomVariant =
      selectedVariant &&
      customVariantsByOriginVariantId.get(selectedVariant.id);
    return (
      selectedVariant && {
        ...selectedVariant,
        hasCustomization: Boolean(selectedCustomVariant),
      }
    );
  }, [selectedVariant, customVariantsByOriginVariantId]);

  return (
    <ProductVariantContext.Provider
      value={{
        selectedVariant: selectedVariantWithCustomization,
        setSelectedVariant,
      }}
    >
      <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
        <ImageGallery product={product} />
        {/* Product info */}
        <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
          <ProductTitle
            name={product.name}
            price={formatPrice(price, currencyCode)}
          />
          {/* <ProductRating rating={4} outOf={4} className="mt-3" /> */}
          <div className="flex flex-col-reverse">
            <div className="mt-6">
              <ProductDescription
                description={product.description}
                descriptionHtml={product.descriptionHtml}
              />
            </div>
            <ProductSelectionForm product={product} className="mt-6 mb-6" />
            {/* <section aria-labelledby="details-heading" className="mt-12">
            <ProductSectionTitle id="details-heading">
              Additional details
            </ProductSectionTitle>
            <ProductDetails details={product.details} />
          </section> */}
          </div>
        </div>
      </div>
    </ProductVariantContext.Provider>
  );
};
