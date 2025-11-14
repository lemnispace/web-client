import ProductsMainMessageSection from "@/app/components/product/ProductsMainMessageSection";
import { ProductGridSection } from "@/app/components/shop/ProductGrid";
import { Container } from "@/components/container";
import { getDefaultProvider } from "@/lib/commerce";
import { PRODUCTS_MAIN_MESSAGE_SECTION_TEXT } from "@/utils/text";
import { mapShopAPIProducts } from "@/utils/mappers";

export const dynamic = 'force-dynamic';

export default async function Shop() {
  const commerce = getDefaultProvider();
  const response = await commerce.getProducts({ limit: 20, status: 'active' });
  const products = mapShopAPIProducts(response.data);

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
