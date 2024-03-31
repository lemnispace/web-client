import { Button } from "@/components/button";
import { ProductPriceRange } from "@/lib/types/shopify";
import { formatPrice } from "@/utils/formatters";
import { ProductItem, ProductItemImg } from "@/utils/types";
import clsx from "clsx";
import Image from "next/image";
import { ProductDescriptionHtml } from "../product/ProductDescription";
import "./productGridStyles.css";

interface ProductGridItemProps extends ProductItem {
  className?: string;
}

interface ProductGridItemImgProps extends ProductItemImg {
  className?: string;
}

interface ProductGridItemTitleProps {
  priceRange: ProductPriceRange;
  id: string;
  name: string;
  className?: string;
}

export const ProductGridItemImg = ({
  src,
  alt,
  className,
  ...props
}: ProductGridItemImgProps) => {
  return (
    <div
      {...props}
      className={clsx(
        "aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg sm:aspect-h-3 sm:aspect-w-2",
        className
      )}
    >
      <Image
        src={src}
        alt={alt ?? ""}
        style={{
          maxWidth: "100%",
        }}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw"
        className="object-cover object-center group-hover:opacity-75"
      />
    </div>
  );
};

const ProductGridItemTitle = ({
  className,
  ...props
}: ProductGridItemTitleProps) => {
  return (
    <div
      className={clsx(
        "mt-4 flex items-center justify-between text-base font-medium text-gray-900 w-full",
        className
      )}
    >
      <h3 id={`${props.id}`}>{props.name}</h3>
      <p>
        {formatPrice(
          props.priceRange.minVariantPrice.amount,
          props.priceRange.minVariantPrice.currencyCode
        )}
      </p>
    </div>
  );
};

export const ProductGridItem = ({
  className,
  ...product
}: ProductGridItemProps) => {
  return (
    <Button
      href={product.href}
      className={clsx("group flex-col", className)}
      aria-labelledby={`${product.id}`}
      plain
    >
      {product.img && <ProductGridItemImg {...product.img} />}
      <ProductGridItemTitle
        name={product.name}
        id={product.id}
        priceRange={product.priceRange}
      />
      <ProductDescriptionHtml
        description={product.description}
        descriptionHtml={product.descriptionHtml}
        short
        className="mt-1 text-sm italic text-gray-500 w-full product-grid-item__description"
      />
    </Button>
  );
};
