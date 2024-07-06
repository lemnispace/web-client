import { ProductView } from "@/app/components/product/ProductView";
import { Container } from "@/components/container";
import { fetchProduct } from "@/lib/shopify/queries/productQuery";
import { TEMP_USER_ID } from "@/utils/constants";
import {
  fetchCustomProductData,
  fetchCustomProductsFromUserCollection,
} from "@/utils/fetchers";
import { getCustomProductByOriginProductId } from "@/utils/getters";
import { mapProduct, mergeCustomProduct } from "@/utils/mappers";
import { parseClientResponse } from "@/utils/parsers";
import { redirect } from "next/navigation";

interface ProductDetailsProps {
  params: {
    slug: string;
  };
  searchParams: { selectedVariantId?: string };
}

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
  const [customProducts, product] = await Promise.all([
    fetchCustomProductsFromUserCollection(TEMP_USER_ID),
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

  return (
    <main className="bg-white flex-1">
      <Container
        className="py-16 sm:py-24 max-w-2xl lg:max-w-7xl"
        overrideMaxWidth
      >
        <ProductView
          product={productWithCustomVariant}
          selectedCustomVariantId={props.searchParams.selectedVariantId}
        />
      </Container>
    </main>
  );
}
