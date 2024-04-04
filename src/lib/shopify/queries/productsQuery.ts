import { Edges, ProductEdge, ProductNode } from "@/lib/types/shopify";

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
      }
    }
  }
`;

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
query getProductByHandle($handle: String!, $firstNImages: Int!) {
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
    images(first: $firstNImages) {
      edges {
        cursor
        node ${imageFragment}
      }
    }
    variants(first: 99) ${variantsFragment}
  }
}
`;

export interface ProductsResponse {
  products?: Edges<ProductEdge>;
}

export interface ProductResponse {
  product?: ProductNode;
}
