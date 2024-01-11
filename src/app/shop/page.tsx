import { ProductGridSection } from "@/app/components/shop/ProductGrid";
import { Container } from "@/components/container";
import mosaicCloseupImage from "@/images/mosaic/mosaic-closeup-1.jpg";
import { PRODUCTS_MAIN_MESSAGE_SECTION_TEXT } from "@/utils/text";
import clsx from "clsx";

interface Product {
  id: number;
  name: string;
  href: string;
  price: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}

interface MainMessageSectionProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
  description: string;
}

function ProductsMainMessageSection({
  title,
  description,
  className,
  ...props
}: MainMessageSectionProps) {
  return (
    <div className={clsx("py-24 text-center", className)} {...props}>
      <h1 className="text-4xl font-bold tracking-tight text-gray-900">
        {title}
      </h1>
      <p className="mx-auto mt-4 max-w-3xl text-base text-gray-500">
        {description}
      </p>
    </div>
  );
}

export default function Shop() {
  const products = [
    {
      id: 1,
      name: "Focus Paper Refill",
      href: "/shop/mosaics/text-mosaic",
      price: "$13",
      description: "3 sizes available",
      imageSrc: mosaicCloseupImage.src,
      imageAlt: "Text mosaic of a couple kissing",
    },
  ];
  return (
    <main>
      <Container className="max-w-3xl lg:max-w-7xl">
        <ProductsMainMessageSection
          title={PRODUCTS_MAIN_MESSAGE_SECTION_TEXT.title}
          description={PRODUCTS_MAIN_MESSAGE_SECTION_TEXT.description}
        />
        <ProductGridSection products={products} />
      </Container>
    </main>
  );
}
