import ProductsMainMessageSection from "@/app/components/product/ProductsMainMessageSection";
import { ProductGridSection } from "@/app/components/shop/ProductGrid";
import { Container } from "@/components/container";
import { productClient } from "@/lib/shopify/client";
import {
  productsAndVariantsQuery,
  ProductsAndVariantsResponse,
} from "@/lib/shopify/queries/productsQuery";
import { Image } from "@/lib/types/shopify";
import sanitizeHtml from "@/utils/formatters";
import { PRODUCTS_MAIN_MESSAGE_SECTION_TEXT } from "@/utils/text";
import { ProductItem } from "@/utils/types";

function getProductList(firstNProducts: number, firstNVariants: number) {
  return productClient.request<ProductsAndVariantsResponse>(
    productsAndVariantsQuery,
    {
      variables: {
        firstNProducts,
        firstNVariants,
      },
    }
  );
}

function mapProducts(productList?: ProductsAndVariantsResponse): ProductItem[] {
  if (!productList) {
    return [];
  }
  return productList.products.edges.map((e) => {
    const img = e.node.media.edges[0]?.node.previewImage as Image | undefined;
    return {
      id: e.node.id,
      name: e.node.title,
      description: e.node.description,
      descriptionHtml: sanitizeHtml(e.node.descriptionHtml),
      tags: e.node.tags,
      priceRange: e.node.priceRange,
      type: e.node.productType,
      href: `/shop/mosaics/${e.node.handle}`,
      img: img
        ? {
            alt: img.altText ?? e.node.title,
            src: img.url,
            width: img.width,
            height: img.height,
          }
        : undefined,
      variants: e.node.variants.edges.map((variant) => variant.node),
    };
  });
}

export default async function Shop() {
  const productList = await getProductList(20, 3);
  if (productList.errors) {
    console.error("Error getting product list: ", productList.errors);
  }
  const products = mapProducts(productList.data);
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
