import { ProductView } from "@/app/components/product/ProductView";
import { Container } from "@/components/container";
import { productClient } from "@/lib/shopify/client";
import {
  ProductResponse,
  productQuery,
} from "@/lib/shopify/queries/productsQuery";
import { ProductNode } from "@/lib/types/shopify";
import {
  formatVariantTitleForGrouping,
  sanitizeHtml,
} from "@/utils/formatters";
import { mapProductVariantNodeToProductVariantOption } from "@/utils/mappers";
import { GroupedProductImages, Product, ProductItemImg } from "@/utils/types";
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

function getImagesByVariant(product: ProductNode): GroupedProductImages {
  const images: { [VariantTitle: string]: ProductItemImg[] } = {};
  product.variants?.edges.forEach((variantEdge) => {
    const variant = variantEdge.node;
    const variantTitle = formatVariantTitleForGrouping(variant.title);
    /**
     * image title example: enhanced-matte-paper-framed-poster-_in_-black-18x24-lifestyle-1-65bc4a53b648c
     * variant title example: Black / 18"x24"
     * image url contains the title. Ex:  https://cdn.shopify.com/s/files/1/0001/0001/0001/products/enhanced-matte-paper-framed-poster-_in_-black-18x24-lifestyle-1-65bc4a53b648c.jpg
     */
    product.images?.edges?.forEach((imageEdge) => {
      const image = imageEdge.node;
      if (image.url.includes(variantTitle)) {
        if (!images[variant.title]) {
          images[variant.title] = [];
        }
        images[variant.title].push({
          src: image.url,
          alt: image.altText,
          width: image.width,
          height: image.height,
          id: image.id,
        });
      }
    });
  });
  return images;
}

function mapProduct(product: ProductNode): Product {
  const images = getImagesByVariant(product);
  return {
    id: product.id,
    name: product.title,
    description: product.description,
    descriptionHtml: sanitizeHtml(product.descriptionHtml),
    tags: product.tags,
    priceRange: product.priceRange,
    type: product.productType,
    href: `/shop/mosaics/${product.handle}`,
    images,
    variants:
      product.variants &&
      mapProductVariantNodeToProductVariantOption(product.variants),
  };
}

export default async function Mosaic(props: MosaicProps) {
  const productResponse = await getProduct(props.params.slug, 99);
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
        <ProductView product={product} />
      </Container>
    </main>
  );
}
