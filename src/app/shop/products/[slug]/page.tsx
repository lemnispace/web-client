import { ProductView } from "@/app/components/product/ProductView";
import { Container } from "@/components/container";
import { ShopifyProductService } from "@/lib/shopify/services/ProductService";
import { mergeCustomProduct } from "@/lib/shopify/utils/mappers";
import { getVisitorId } from "@/utils/cookies/visitorId";
import { getNavigationLink } from "@/utils/getters";
import { parseClientResponse } from "@/utils/parsers";
import { ProductWithCustomization } from "@/utils/types";
import { isValidCustomVariantId } from "@/utils/validators";
import { redirect } from "next/navigation";

interface ProductDetailsProps {
  params: {
    slug: string;
  };
  searchParams: { selectedVariantId?: string };
}

const getValidCustomVariantId = (
  customProduct: ProductWithCustomization,
  selectedCustomVariantId: string | undefined
) => {
  if (
    selectedCustomVariantId &&
    isValidCustomVariantId(customProduct, selectedCustomVariantId)
  ) {
    return selectedCustomVariantId;
  }
  return undefined;
};

export default async function ProductDetails(props: ProductDetailsProps) {
  const visitorId = getVisitorId();
  const productService = new ShopifyProductService({
    parseClientResponse,
    getNavigationLink,
  });
  const [customProducts, product] = await Promise.all([
    productService.fetchCustomProductsFromUserCollection(visitorId),
    productService.fetchProductData({ handle: props.params.slug }),
  ]);

  if (!product) {
    console.error("Error, product not found");
    redirect("/not-found");
  }

  const customProductId =
    ShopifyProductService.getCustomProductByOriginProductId(
      customProducts,
      product.id
    )?.id;

  const customProduct =
    await productService.fetchCustomProductData(customProductId);
  const productWithCustomVariant = mergeCustomProduct(product, customProduct);
  const selectedCustomVariantId = getValidCustomVariantId(
    productWithCustomVariant,
    props.searchParams.selectedVariantId
  );

  return (
    <main className="bg-white flex-1">
      <Container
        className="py-16 sm:py-24 max-w-2xl lg:max-w-7xl"
        overrideMaxWidth
      >
        <ProductView
          product={productWithCustomVariant}
          selectedCustomVariantId={selectedCustomVariantId}
        />
      </Container>
    </main>
  );
}
