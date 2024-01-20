import ImgEditor from "@/app/components/editor/ImgEditor";
import ProductsMainMessageSection from "@/app/components/product/ProductsMainMessageSection";
import { Container } from "@/components/container";
import { PRODUCTS_CREATE_MESSAGE_SECTION_TEXT } from "@/utils/text";

export default function CreateMosaic() {
  return (
    <main className="bg-white">
      <Container>
        <ProductsMainMessageSection
          title={PRODUCTS_CREATE_MESSAGE_SECTION_TEXT.title}
          description={PRODUCTS_CREATE_MESSAGE_SECTION_TEXT.description}
        />
        <ImgEditor />
      </Container>
    </main>
  );
}
