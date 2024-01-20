import ProductsMainMessageSection from "@/app/components/product/ProductsMainMessageSection";
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
      <Container>
        <ProductsMainMessageSection
          title={PRODUCTS_MAIN_MESSAGE_SECTION_TEXT.title}
          description={PRODUCTS_MAIN_MESSAGE_SECTION_TEXT.description}
        />
        <ProductGridSection products={products} />
      </Container>
    </main>
  );
}
