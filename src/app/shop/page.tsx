import ProductsMainMessageSection from "@/app/components/product/ProductsMainMessageSection";
import { ProductGridSection } from "@/app/components/shop/ProductGrid";
import { Container } from "@/components/container";
import { fetchProductList } from "@/lib/shopify/queries/productQuery";
import { mapProducts } from "@/utils/mappers";
import { PRODUCTS_MAIN_MESSAGE_SECTION_TEXT } from "@/utils/text";

export default async function Shop() {
  const productList = await fetchProductList(20);
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
