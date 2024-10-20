import ProductsMainMessageSection from "@/app/components/product/ProductsMainMessageSection";
import { ProductGridSection } from "@/app/components/shop/ProductGrid";
import { Container } from "@/components/container";
import { ShopifyProductService } from "@/lib/shopify/services/ShopifyProductService";
import { getNavigationLink } from "@/utils/getters";
import { parseClientResponse } from "@/utils/parsers";
import { PRODUCTS_MAIN_MESSAGE_SECTION_TEXT } from "@/utils/text";

export default async function Shop() {
  const productService = new ShopifyProductService({
    parseClientResponse,
    getNavigationLink,
  });
  const products = await productService.fetchProductList(20);

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
