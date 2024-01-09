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

interface ProductGridProps {
  products: Product[];
}

export function ProductGridSection(props: ProductGridProps) {
  return (
    <section aria-labelledby="products-heading" className="mt-8">
      <h2 id="products-heading" className="sr-only">
        Products
      </h2>
      <ProductGrid {...props} />
    </section>
  );
}

export default function ProductGrid({ products, ...props }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
      {products.map((product) => (
        <a key={product.id} href={product.href} className="group">
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
          <div className="mt-4 flex items-center justify-between text-base font-medium text-gray-900">
            <h3>{product.name}</h3>
            <p>{product.price}</p>
          </div>
          <p className="mt-1 text-sm italic text-gray-500">
            {product.description}
          </p>
        </a>
      ))}
    </div>
  );
}
