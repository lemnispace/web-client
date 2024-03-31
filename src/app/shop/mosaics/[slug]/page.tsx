import ImageGallery from "@/app/components/product/ImageGallery";
import ProductDescription from "@/app/components/product/ProductDescription";
import ProductDetails from "@/app/components/product/ProductDetails";
import ProductRating from "@/app/components/product/ProductRating";
import ProductSelectionForm from "@/app/components/product/ProductSelectionForm";
import ProductTitle, {
  ProductSectionTitle,
} from "@/app/components/product/ProductTitle";
import { Container } from "@/components/container";
import { productClient } from "@/lib/shopify/client";
import {
  ProductResponse,
  productQuery,
} from "@/lib/shopify/queries/productsQuery";
import { ProductNode } from "@/lib/types/shopify";
import sanitizeHtml, { formatPrice } from "@/utils/formatters";
import { Product, ProductItemImg } from "@/utils/types";
import { redirect } from "next/navigation";

interface MosaicProps {
  params: {
    slug: string;
  };
  searchParams: Record<string, string>;
}

function getProduct(handle: string, firstNImages: number) {
  return productClient.request<ProductResponse>(productQuery, {
    variables: {
      handle,
      firstNImages,
    },
  });
}

function mapProduct(product: ProductNode): Product {
  const images: ProductItemImg[] =
    product.images?.edges?.map((e) => ({
      src: e.node.url,
      alt: e.node.altText,
      width: e.node.width,
      height: e.node.height,
    })) ?? [];
  const img = images[0];
  return {
    id: product.id,
    name: product.title,
    description: product.description,
    descriptionHtml: sanitizeHtml(product.descriptionHtml),
    tags: product.tags,
    priceRange: product.priceRange,
    type: product.productType,
    href: `/shop/mosaics/${product.handle}`,
    img,
    images,
    variants: product.variants.edges.map((variant) => variant.node),
  };
}

export default async function Mosaic(props: MosaicProps) {
  const productResponse = await getProduct(props.params.slug, 10);
  if (productResponse.errors) {
    console.error("Error getting product: ", productResponse.errors);
  }
  const product = productResponse.data
    ? mapProduct(productResponse.data.product)
    : undefined;
  if (!product) {
    console.error("Error, product not found");
    redirect("/not-found");
  }
  return (
    <main className="bg-white">
      <Container
        className="py-16 sm:py-24 max-w-2xl lg:max-w-7xl"
        overrideMaxWidth
      >
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          <ImageGallery product={product} />
          {/* Product info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <ProductTitle
              name={product.name}
              price={formatPrice(
                product.priceRange.minVariantPrice.amount,
                product.priceRange.minVariantPrice.currencyCode
              )}
            />
            <ProductRating rating={4} outOf={4} className="mt-3" />
            <div className="mt-6">
              <ProductDescription
                description={product.description}
                descriptionHtml={product.descriptionHtml}
              />
            </div>
            {/* <ProductSelectionForm colors={product.colors} className="mt-6" /> */}
            <section aria-labelledby="details-heading" className="mt-12">
              <ProductSectionTitle id="details-heading">
                Additional details
              </ProductSectionTitle>
              {/* <ProductDetails details={product.details} /> */}
            </section>
          </div>
        </div>
      </Container>
    </main>
  );
}
