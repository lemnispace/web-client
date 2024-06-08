import ImgEditor from "@/app/components/editor/ImgEditor";
import ProductsMainMessageSection from "@/app/components/product/ProductsMainMessageSection";
import { Container } from "@/components/container";
import PrintfulClient from "@/lib/printful/PrintfulClient";
import { Orientation } from "@/lib/types/printful";
import { fetchProductDataWithMetafields } from "@/utils/fetchers";
import { toInt } from "@/utils/parsers";
import { PRODUCTS_CREATE_MESSAGE_SECTION_TEXT } from "@/utils/text";
import { ProductVariant } from "@/utils/types";
import { isDefined } from "@/utils/validators";
import { redirect } from "next/navigation";

interface MosaicProps {
  params: {
    slug: string;
  };
  searchParams: Record<string, string>;
}

const isValidOrientation = (
  orientation?: string
): orientation is Orientation => {
  return orientation === "horizontal" || orientation === "vertical";
};

const fetchVariantTemplates = async (
  variant: ProductVariant,
  orientation?: string
) => {
  const catalogProductId = toInt(
    variant.metafields?.printful_catalog_product_id?.value
  );
  const catalogVariantId = toInt(
    variant.metafields?.printful_catalog_variant_id?.value
  );
  if (!isDefined(catalogProductId)) {
    throw new Error("catalogProductId not found");
  }
  if (!isDefined(catalogVariantId)) {
    throw new Error("catalogVariantId not found");
  }
  const productTemplateLayouts = await PrintfulClient.getLayoutTemplates(
    catalogProductId,
    undefined,
    isValidOrientation(orientation) ? orientation : undefined
  );
  if (productTemplateLayouts.code !== 200) {
    throw new Error("Error fetching product template layouts");
  }
  const variantTemplateMapping =
    productTemplateLayouts.result.variant_mapping.filter(
      ({ variant_id }) => variant_id === catalogVariantId
    );
  if (!variantTemplateMapping) {
    throw new Error("Error no variant template mapping found");
  }
  const templates = variantTemplateMapping
    .flatMap((mapping) =>
      mapping.templates.flatMap((v) => {
        return productTemplateLayouts.result.templates.filter(
          (template) => template.template_id === v.template_id
        );
      })
    )
    .filter(isDefined);
  return templates;
};

export default async function CustomizeProduct(props: MosaicProps) {
  const variantId = props.searchParams.variant;
  const productHandle = props.params.slug;
  try {
    const product = await fetchProductDataWithMetafields(productHandle);
    if (!product) {
      throw new Error("product not found");
    }
    const variant = product.variants?.find((v) => v.id === variantId);
    if (!variant) {
      throw new Error("variant not found");
    }
    const variantTemplates = await fetchVariantTemplates(
      variant,
      product.metafields?.orientation?.value
    );
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
