import { Edges, ProductEdge, ProductNode } from "@/lib/types/shopify";
import { productClient } from "../client";

const VARIANT_METADATA_PREVIEW_IMAGE_KEY = "preview_image";
const VARIANT_METADATA_NAMESPACE = "custom";

const moneyFragment = /* GraphQL */ `
  {
    amount
    currencyCode
  }
`;

const imageFragment = /* GraphQL */ `
  {
    id
    url
    altText
    width
    height
  }
`;

const metafieldFragment = /* GraphQL */ `
  {
    key
    value
    reference {
      ... on MediaImage {
        id
        image ${imageFragment}
      }
    }
  }
`;

const variantsFragment = /* GraphQL */ `
  {
    edges {
      cursor
      node {
        id
        title
        quantityAvailable
        price {
          amount
          currencyCode
        }
        selectedOptions {
          name
          value
        }
        image ${imageFragment}
        metafield(namespace: $namespace, key: $key) ${metafieldFragment}
      }
    }
  }
`;

const getVariantsFragment = (namespace: string, key: string) => {
  return variantsFragment
    .replace(/\$namespace/g, `"${namespace}"`)
    .replace(/\$key/g, `"${key}"`);
};

export const productsQuery = /* GraphQL */ `
  query getProducts($firstNProducts: Int!) {
    products(first: $firstNProducts) {
      edges {
        cursor
        node {
          id
          title
          description
          descriptionHtml
          handle
          tags
          priceRange {
            maxVariantPrice ${moneyFragment}
            minVariantPrice ${moneyFragment}
          }
          productType
          images(first: 1){
            edges{
              cursor
              node ${imageFragment}
            }
          }
        }
      }
    }
  }
`;

export const productQuery = /* GraphQL */ `
query getProductByHandle($handle: String!) {
  product(handle: $handle) {
    id
    title
    description
    descriptionHtml
    handle
    priceRange {
      maxVariantPrice ${moneyFragment}
      minVariantPrice ${moneyFragment}
    }
    variants(first: 99) ${getVariantsFragment(
      VARIANT_METADATA_NAMESPACE,
      VARIANT_METADATA_PREVIEW_IMAGE_KEY
    )}
  }
}
`;

export interface ProductsResponse {
  products?: Edges<ProductEdge>;
}

export function fetchProductList(firstNProducts: number) {
  return productClient.request<ProductsResponse>(productsQuery, {
    variables: {
      firstNProducts,
    },
  });
}

export interface ProductResponse {
  product?: ProductNode;
}

export function fetchProduct(handle: string) {
  return productClient.request<ProductResponse>(productQuery, {
    variables: {
      handle,
    },
  });
}
