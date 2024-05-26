import { ProductView } from "@/app/components/product/ProductView";
import { Container } from "@/components/container";
import {
  ProductResponse,
  fetchCustomProduct,
  fetchProduct,
} from "@/lib/shopify/queries/productQuery";
import {
  mapCustomProduct,
  mapProduct,
  mergeCustomProduct,
} from "@/utils/mappers";
import { parseClientResponse, tryParseClientResponse } from "@/utils/parsers";
import { ClientResponse } from "@shopify/storefront-api-client";
import { redirect } from "next/navigation";

interface MosaicProps {
  params: {
    slug: string;
  };
  searchParams?: { customProductId?: string };
}

const fetchAllProducts = async (
  productHandle: string,
  customProductId?: string
): Promise<
  [ClientResponse<ProductResponse>, ClientResponse<ProductResponse> | undefined]
> => {
  if (customProductId) {
    return Promise.all([
      fetchProduct(productHandle),
      fetchCustomProduct(customProductId),
    ]);
  }
  const response = await fetchProduct(productHandle);
  return [response, undefined];
};
export default async function Mosaic(props: MosaicProps) {
  const customProductId = props.searchParams?.customProductId;
  const [productResponse, customProductResponse] = await fetchAllProducts(
    props.params.slug,
    customProductId
  );
  const parsedProductResponse = parseClientResponse(
    productResponse,
    "Error, product not found"
  );
  const product =
    parsedProductResponse.product && mapProduct(parsedProductResponse.product);
  if (!product) {
    console.error("Error, product not found");
    redirect("/not-found");
  }
  const parsedCustomProductResponse = tryParseClientResponse(
    customProductResponse
  );
  const customProduct =
    parsedCustomProductResponse?.product &&
    mapCustomProduct(parsedCustomProductResponse.product);
  const productWithCustomVariant = mergeCustomProduct(product, customProduct);
  return (
    <main className="bg-white flex-1">
      <Container
        className="py-16 sm:py-24 max-w-2xl lg:max-w-7xl"
        overrideMaxWidth
      >
        <ProductView product={productWithCustomVariant} />
      </Container>
    </main>
  );
}
