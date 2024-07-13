import { ProductView } from "@/app/components/product/ProductView";
import { Container } from "@/components/container";
import { fetchProduct } from "@/lib/shopify/queries/productQuery";
import { getVisitorId } from "@/utils/cookies/visitorId";
import {
  fetchCustomProductData,
  fetchCustomProductsFromUserCollection,
} from "@/utils/fetchers";
import { getCustomProductByOriginProductId } from "@/utils/getters";
import { mapProduct, mergeCustomProduct } from "@/utils/mappers";
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

const fetchProductData = async (handle: string) => {
  const productResponse = await fetchProduct({ handle });
  const parsedProductResponse = parseClientResponse(
    productResponse,
    "Error, product not found"
  );
  return (
    parsedProductResponse.product && mapProduct(parsedProductResponse.product)
  );
};

export default async function ProductDetails(props: ProductDetailsProps) {
  const visitorId = getVisitorId();
  const [customProducts, product] = await Promise.all([
    fetchCustomProductsFromUserCollection(visitorId),
    fetchProductData(props.params.slug),
  ]);

  if (!product) {
    console.error("Error, product not found");
    redirect("/not-found");
  }

  const customProductId = getCustomProductByOriginProductId(
    customProducts,
    product.id
  )?.id;

  const customProduct = await fetchCustomProductData(customProductId);
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
