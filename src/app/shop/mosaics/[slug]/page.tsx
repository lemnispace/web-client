import { ProductView } from "@/app/components/product/ProductView";
import { Container } from "@/components/container";
import { fetchCollection } from "@/lib/shopify/queries/collectionQuery";
import {
  fetchCustomProduct,
  fetchProduct,
} from "@/lib/shopify/queries/productQuery";
import { ProductMetafield } from "@/lib/types/shopify";
import { TEMP_USER_ID } from "@/utils/constants";
import {
  mapCustomProduct,
  mapMetafields,
  mapProduct,
  mergeCustomProduct,
} from "@/utils/mappers";
import { parseClientResponse, tryParseClientResponse } from "@/utils/parsers";
import { ProductMetafields } from "@/utils/types";
import { redirect } from "next/navigation";

interface MosaicProps {
  params: {
    slug: string;
  };
}

const fetchCustomProducts = async () => {
  const collectionResponse = await fetchCollection(TEMP_USER_ID);
  const collection = tryParseClientResponse(collectionResponse);

  return collection?.collectionByHandle?.products?.edges?.map((e) => ({
    ...e.node,
    metafields:
      e.node.metafields &&
      mapMetafields<ProductMetafield, ProductMetafields>(e.node.metafields),
  }));
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

const fetchCustomProductData = async (customProductId: string | undefined) => {
  if (!customProductId) return undefined;

  const customProductResponse = await fetchCustomProduct(customProductId);
  const parsedCustomProductResponse = tryParseClientResponse(
    customProductResponse
  );
  return (
    parsedCustomProductResponse?.product &&
    mapCustomProduct(parsedCustomProductResponse.product)
  );
};

export default async function Mosaic(props: MosaicProps) {
  const [customProducts, product] = await Promise.all([
    fetchCustomProducts(),
    fetchProductData(props.params.slug),
  ]);

  if (!product) {
    console.error("Error, product not found");
    redirect("/not-found");
  }

  const customProductId = customProducts?.find(
    ({ metafields }) => metafields?.origin_product?.value === product.id
  )?.id;

  const customProduct = await fetchCustomProductData(customProductId);
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
