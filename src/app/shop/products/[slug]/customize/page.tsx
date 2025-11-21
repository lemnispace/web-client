import ImgEditor from "@/app/components/editor/ImgEditor";
import ProductsMainMessageSection from "@/app/components/product/ProductsMainMessageSection";
import { Container } from "@/components/container";
import { getDefaultProvider } from "@/lib/commerce";
import PrintfulClient from "@/lib/printful/PrintfulClient";
import { Orientation } from "@/lib/printful/types";
import { mapPrintfulTemplates, mapShopAPIProductToFull } from "@/utils/mappers";
import { toInt } from "@/utils/parsers";
import { PRODUCTS_CREATE_MESSAGE_SECTION_TEXT } from "@/utils/text";
import { ProductVariant, VariantTemplate } from "@/utils/types";
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
  const commerce = getDefaultProvider();
  const variantId = props.searchParams.variant;
  const productId = props.params.slug; // Now using product ID instead of handle

  try {
    // Fetch product from shop-api
    const shopApiProduct = await commerce.getProduct(productId);
    if (!shopApiProduct) {
      throw new Error("product not found");
    }

    // Map to the format expected by components
    const product = mapShopAPIProductToFull(shopApiProduct);

    const variant = product.variants?.find((v) => v.id === variantId);
    if (!variant) {
      throw new Error("variant not found");
    }

    // Try to fetch Printful templates, but provide fallback if metafields are missing
    let variantTemplates: any[] = [];
    const catalogProductId = toInt(
      variant.metafields?.printful_catalog_product_id?.value
    );
    const catalogVariantId = toInt(
      variant.metafields?.printful_catalog_variant_id?.value
    );

    if (isDefined(catalogProductId) && isDefined(catalogVariantId)) {
      try {
        variantTemplates = await fetchVariantTemplates(variant, undefined);
      } catch (error) {
        console.error("Error fetching Printful templates:", error);
        // Continue with default template
      }
    }

    // Use default template if no Printful templates available
    const templates: VariantTemplate[] =
      variantTemplates.length > 0
        ? mapPrintfulTemplates(variantTemplates)
        : [
            {
              templateId: 0,
              imageUrl: "",
              backgroundUrl: "",
              backgroundColor: "#FFFFFF",
              printfileId: 0,
              templateWidth: 1800,
              templateHeight: 2400,
              printAreaWidth: 1800,
              printAreaHeight: 2400,
              printAreaTop: 0,
              printAreaLeft: 0,
              isTemplateOnFront: true,
              orientation: "vertical" as const,
              conflictingPlacements: [],
            },
          ];

    return (
      <main className="bg-white flex-1">
        <Container>
          <ProductsMainMessageSection
            headingProps={{
              highlightedLine: PRODUCTS_CREATE_MESSAGE_SECTION_TEXT.title[0],
              lastLine: PRODUCTS_CREATE_MESSAGE_SECTION_TEXT.title[1],
              highlightedProps: {
                icon: "loop",
              },
            }}
            description={PRODUCTS_CREATE_MESSAGE_SECTION_TEXT.description}
          />
          <ImgEditor
            productVariant={variant}
            product={product}
            template={templates[0]}
          />
        </Container>
      </main>
    );
  } catch (error) {
    console.error("Error getting product: ", error);
    redirect("/not-found");
  }
}
