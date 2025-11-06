import { ProductView } from "@/app/components/product/ProductView";
import { Container } from "@/components/container";
import { getDefaultProvider } from "@/lib/commerce";
import { mapShopAPIProductToFull } from "@/utils/mappers";
import { redirect } from "next/navigation";

interface ProductDetailsProps {
  params: {
    slug: string;
  };
  searchParams: { selectedVariantId?: string };
}

export default async function ProductDetails(props: ProductDetailsProps) {
  const commerce = getDefaultProvider();

  try {
    // The slug parameter is actually a product ID (e.g., prod_123)
    const product = await commerce.getProduct(props.params.slug);

    if (!product) {
      console.error("Error, product not found");
      redirect("/not-found");
    }

    // Map shop-api product to the format expected by ProductView
    const mappedProduct = mapShopAPIProductToFull(product);

    return (
      <main className="bg-white flex-1">
        <Container
          className="py-16 sm:py-24 max-w-2xl lg:max-w-7xl"
          overrideMaxWidth
        >
          <ProductView
            product={mappedProduct}
            selectedCustomVariantId={props.searchParams.selectedVariantId}
          />
        </Container>
      </main>
    );
  } catch (error) {
    console.error("Error fetching product:", error);
    redirect("/not-found");
  }
}
