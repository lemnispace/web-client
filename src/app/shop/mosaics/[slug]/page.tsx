import { ProductView } from "@/app/components/product/ProductView";
import { Container } from "@/components/container";
import { productClient } from "@/lib/shopify/client";
import {
  ProductResponse,
  productQuery,
} from "@/lib/shopify/queries/productsQuery";
import { ProductNode } from "@/lib/types/shopify";
import {sanitizeHtml} from "@/utils/formatters";
import { Product, ProductItemImg } from "@/utils/types";
import { redirect } from "next/navigation";

interface MosaicProps {
  params: {
    slug: string;
  };
  searchParams: Record<string, string>;
}

function getProduct(handle: string, firstNImages: number) {
  return productClient.request<ProductResponse>(productQuery, {
    variables: {
      handle,
      firstNImages,
    },
  });
}

function mapProduct(product: ProductNode): Product {
  const images: ProductItemImg[] =
    product.images?.edges?.map((e) => ({
      src: e.node.url,
      alt: e.node.altText,
      width: e.node.width,
      height: e.node.height,
    })) ?? [];
  const img = images[0];
  return {
    id: product.id,
    name: product.title,
    description: product.description,
    descriptionHtml: sanitizeHtml(product.descriptionHtml),
    tags: product.tags,
    priceRange: product.priceRange,
    type: product.productType,
    href: `/shop/mosaics/${product.handle}`,
    img,
    images,
    variants: product.variants?.edges.map((variant) => variant.node),
  };
}

export default async function Mosaic(props: MosaicProps) {
  const productResponse = await getProduct(props.params.slug, 10);
  if (productResponse.errors) {
    console.error("Error getting product: ", productResponse.errors);
  }
  const product = productResponse.data
    ? mapProduct(productResponse.data.product)
    : undefined;
  if (!product) {
    console.error("Error, product not found");
    redirect("/not-found");
  }
  return (
    <main className="bg-white">
      <Container
        className="py-16 sm:py-24 max-w-2xl lg:max-w-7xl"
        overrideMaxWidth
      >
        <ProductView product={product} />
      </Container>
    </main>
  );
}
