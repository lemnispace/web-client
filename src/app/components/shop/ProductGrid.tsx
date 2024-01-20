import { Button } from "@/components/button";
import { PRODUCT_DETAIL_SECTION_TEXT } from "@/utils/text";
import clsx from "clsx";
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  href: string;
  price: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}

interface ProductGridProps extends React.HTMLAttributes<HTMLElement> {
  products: Product[];
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
        <Button
          key={product.id}
          href={product.href}
          className="group flex-col"
          aria-labelledby={`${product.id}`}
          plain
        >
          <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg sm:aspect-h-3 sm:aspect-w-2">
            <Image
              src={product.imageSrc}
              alt={product.imageAlt}
              style={{
                maxWidth: "100%",
              }}
              fill
              className="object-cover object-center group-hover:opacity-75"
            />
          </div>
          <div className="mt-4 flex items-center justify-between text-base font-medium text-gray-900 w-full">
            <h3 id={`${product.id}`}>{product.name}</h3>
            <p>{product.price}</p>
          </div>
          <p className="mt-1 text-sm italic text-gray-500 w-full">
            {product.description}
          </p>
        </Button>
      ))}
    </div>
  );
}
