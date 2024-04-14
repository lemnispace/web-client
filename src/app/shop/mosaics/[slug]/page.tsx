import { ProductView } from "@/app/components/product/ProductView";
import { Container } from "@/components/container";
import { fetchProduct } from "@/lib/shopify/queries/productsQuery";
import { mapProduct } from "@/utils/mappers";
import { redirect } from "next/navigation";

interface MosaicProps {
  params: {
    slug: string;
  };
  searchParams: Record<string, string>;
}

export default async function Mosaic(props: MosaicProps) {
  const productResponse = await fetchProduct(props.params.slug);
  if (productResponse.errors) {
    console.error("Error getting product: ", productResponse.errors);
  }
  const product = productResponse.data?.product
    ? mapProduct(productResponse.data.product)
    : undefined;
  if (!product) {
    console.error("Error, product not found");
    redirect("/not-found");
  }
  return (
    <main className="bg-white flex-1">
      <Container
        className="py-16 sm:py-24 max-w-2xl lg:max-w-7xl"
        overrideMaxWidth
      >
        <ProductView product={product} />
      </Container>
    </main>
  );
}
