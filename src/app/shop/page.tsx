import ProductsMainMessageSection from "@/app/components/product/ProductsMainMessageSection";
import { ProductGridSection } from "@/app/components/shop/ProductGrid";
import { Container } from "@/components/container";
import { productClient } from "@/lib/shopify/client";
import {
  ProductsResponse,
  productsQuery,
} from "@/lib/shopify/queries/productsQuery";
import { Image } from "@/lib/types/shopify";
import { sanitizeHtml } from "@/utils/formatters";
import { mapProductVariantNodeToProductVariantOption } from "@/utils/mappers";
import { PRODUCTS_MAIN_MESSAGE_SECTION_TEXT } from "@/utils/text";
import { ProductItem } from "@/utils/types";

function getProductList(firstNProducts: number) {
  return productClient.request<ProductsResponse>(productsQuery, {
    variables: {
      firstNProducts,
    },
  });
}

function mapProducts(productList?: ProductsResponse): ProductItem[] {
  if (!productList?.products?.edges) {
    return [];
  }
  return productList.products.edges.map((e) => {
    const img = e.node.images.edges[0]?.node as Image | undefined;
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
            id: img.id,
          }
        : undefined,
      variants:
        e.node.variants &&
        mapProductVariantNodeToProductVariantOption(e.node.variants),
    };
  });
}

export default async function Shop() {
  const productList = await getProductList(20);
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
