"use client";

import { ShopifyProductService } from "@/lib/shopify/services/ShopifyProductService";
import { formatPrice } from "@/utils/formatters";
import {
  ProductVariant,
  ProductVariantWithCustomization,
  ProductWithCustomization,
} from "@/utils/types";
import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import ImageGallery from "./ImageGallery";
import ProductDescription from "./ProductDescription";
import ProductSelectionForm from "./ProductSelectionForm";
import ProductTitle from "./ProductTitle";

interface ProductViewProps {
  product: ProductWithCustomization;
  selectedCustomVariantId?: string;
  customizationImageId?: string;
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
  // Use state to store customization image to avoid hydration mismatch
  const [customizationImage, setCustomizationImage] = useState<{
    imageUrl: string;
    imageId: string;
    variantId: string;
    productId: string;
  } | null>(null);

  // Retrieve customization image from sessionStorage after mount
  useEffect(() => {
    if (props.customizationImageId && typeof window !== 'undefined') {
      const storageKey = `customization_${props.customizationImageId}`;
      console.log('[ProductView] Looking for customization in sessionStorage:', {
        imageId: props.customizationImageId,
        storageKey
      });
      
      const stored = sessionStorage.getItem(storageKey);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          console.log('[ProductView] Found customization data:', parsed);
          setCustomizationImage(parsed);
        } catch (e) {
          console.error('[ProductView] Failed to parse customization data:', e);
        }
      } else {
        console.warn('[ProductView] No customization data found in sessionStorage for key:', storageKey);
      }
    }
  }, [props.customizationImageId]);

  const [selectedVariant, setSelectedVariant] = useState(
    props.selectedCustomVariantId
      ? ShopifyProductService.getVariantById(
          product,
          props.selectedCustomVariantId
        )
      : product.variants?.[0]
  );
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
  const price = ShopifyProductService.getPrice(selectedVariant, product);
  const selectedVariantWithCustomization = useMemo(() => {
    const selectedCustomVariant =
      selectedVariant &&
      customVariantsByOriginVariantId.get(selectedVariant.id);
    return (
      selectedVariant && {
        ...selectedVariant,
        hasCustomization: Boolean(selectedCustomVariant),
        customization: selectedCustomVariant,
        customProductId: product.customProductId,
      }
    );
  }, [
    selectedVariant,
    product.customProductId,
    customVariantsByOriginVariantId,
  ]);

  return (
    <ProductVariantContext.Provider
      value={{
        selectedVariant: selectedVariantWithCustomization,
        setSelectedVariant,
      }}
    >
      <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
        <ImageGallery product={product} customizationImage={customizationImage} />
        {/* Product info */}
        <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
          <ProductTitle
            name={product.name}
            price={formatPrice(price.amount, price.currencyCode)}
          />
          {/* <ProductRating rating={4} outOf={4} className="mt-3" /> */}
          <div className="flex flex-col-reverse">
            <div className="mt-6">
              <ProductDescription
                description={product.description}
                descriptionHtml={product.descriptionHtml}
              />
            </div>
            <ProductSelectionForm 
              product={product} 
              className="mt-6 mb-6"
              customizationImageId={props.customizationImageId}
            />
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
