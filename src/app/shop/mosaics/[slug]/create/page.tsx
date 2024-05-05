import ImgEditor from "@/app/components/editor/ImgEditor";
import ProductsMainMessageSection from "@/app/components/product/ProductsMainMessageSection";
import { Container } from "@/components/container";
import { fetchProduct } from "@/lib/shopify/queries/productQuery";
import { mapProduct } from "@/utils/mappers";
import { PRODUCTS_CREATE_MESSAGE_SECTION_TEXT } from "@/utils/text";
import { redirect } from "next/navigation";

interface MosaicProps {
  params: {
    slug: string;
  };
  searchParams: Record<string, string>;
}

export default async function CreateMosaic(props: MosaicProps) {
  const variantId = props.searchParams.variant;
  const productHandle = props.params.slug;
  const productResponse = await fetchProduct(productHandle);
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
  const variant = product.variants?.find((v) => v.id === variantId);
  if (!variant) {
    console.error("Error, variant not found");
    redirect("/not-found");
  }
  return (
    <main className="bg-white flex-1">
      <Container>
        <ProductsMainMessageSection
          title={PRODUCTS_CREATE_MESSAGE_SECTION_TEXT.title}
          description={PRODUCTS_CREATE_MESSAGE_SECTION_TEXT.description}
        />
        <ImgEditor productVariant={variant} product={product} />
      </Container>
    </main>
  );
}
