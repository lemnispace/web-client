import { PRODUCT_DETAIL_SECTION_TEXT } from "@/utils/text";
import { ProductItem } from "@/utils/types";
import clsx from "clsx";
import { ProductGridItem } from "./ProductGridItem";

interface ProductGridProps extends React.HTMLAttributes<HTMLElement> {
  products: ProductItem[];
}

export function ProductGridSection(props: ProductGridProps) {
  return (
    <section aria-labelledby="products-heading" className="mt-8">
      <h2 id="products-heading" className="sr-only">
        {PRODUCT_DETAIL_SECTION_TEXT.grid.title}
      </h2>
      <ProductGrid {...props} />
    </section>
  );
}

export default function ProductGrid({
  products,
  className,
  ...props
}: ProductGridProps) {
  return (
    <div
      className={clsx(
        "grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8",
        className
      )}
      {...props}
    >
      {products.map((product) => (
        <ProductGridItem key={product.id} {...product} />
      ))}
    </div>
  );
}
