import ImgEditor from "@/app/components/editor/ImgEditor";
import ProductsMainMessageSection from "@/app/components/product/ProductsMainMessageSection";
import { Container } from "@/components/container";
import { fetchProductData } from "@/utils/fetchers";
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
  try {
    const product = await fetchProductData({ handle: productHandle });

    if (!product) {
      throw new Error("product not found");
    }
    const variant = product.variants?.find((v) => v.id === variantId);
    if (!variant) {
      throw new Error("variant not found");
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
  } catch (error) {
    console.error("Error getting product: ", error);
    redirect("/not-found");
  }
}
