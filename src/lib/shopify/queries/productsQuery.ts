import { ProductEdge } from "@/lib/types/shopify";

const moneyFragment = /* GraphQL */ `
  {
    amount
    currencyCode
  }
`;

export const productsAndVariantsQuery = /* GraphQL */ `
  query getProductsAndVariants($firstNProducts: Int!, $firstNVariants: Int!) {
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
          media(first: 1){
            edges{
              cursor
              node {
                id
                alt
                mediaContentType
                previewImage {
                  id
                  url
                  altText
                  width
                  height
                }
              }
            }
          }
          variants(first: $firstNVariants) {
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
              }
            }
          }
        }
      }
    }
  }
`;

export interface ProductsAndVariantsResponse {
  products: {
    edges: ProductEdge[];
  };
}
