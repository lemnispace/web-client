"use client";

import { ProductVariantOptionType } from "@/lib/types/shopify";
import { formatPrice, getVariantTitleFromOptions } from "@/utils/formatters";
import { Product } from "@/utils/types";
import { useState } from "react";
import ImageGallery from "./ImageGallery";
import ProductDescription from "./ProductDescription";
import ProductSelectionForm from "./ProductSelectionForm";
import ProductTitle from "./ProductTitle";

interface ProductViewProps {
  product: Product;
}

const getVariantValues = (
  product: Product,
  variantName: ProductVariantOptionType
) => {
  return product.variants?.find((v) => v.name === variantName)?.values ?? [];
};

export const ProductView = ({ product, ...props }: ProductViewProps) => {
  const colors = getVariantValues(product, "Color");
  const sizes = getVariantValues(product, "Size");
  const [variantKey, setVariantKey] = useState<string>(
    getVariantTitleFromOptions(colors[0], sizes[0])
  );
  return (
    <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
      <ImageGallery product={product} imageVariantKey={variantKey} />
      {/* Product info */}
      <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
        <ProductTitle
          name={product.name}
          price={formatPrice(
            product.priceRange.minVariantPrice.amount,
            product.priceRange.minVariantPrice.currencyCode
          )}
        />
        {/* <ProductRating rating={4} outOf={4} className="mt-3" /> */}
        <div className="mt-6">
          <ProductDescription
            description={product.description}
            descriptionHtml={product.descriptionHtml}
          />
        </div>
        <ProductSelectionForm
          colors={colors}
          onColorChange={(newColor) => {
            setVariantKey(getVariantTitleFromOptions(newColor, sizes[0]));
          }}
          className="mt-6"
        />
        {/* <section aria-labelledby="details-heading" className="mt-12">
          <ProductSectionTitle id="details-heading">
            Additional details
          </ProductSectionTitle>
          <ProductDetails details={product.details} />
        </section> */}
      </div>
    </div>
  );
};
