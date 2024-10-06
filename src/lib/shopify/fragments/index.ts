import {
  VARIANT_METADATA_NAMESPACE,
  VariantMetadataNamespace,
} from "@/utils/constants";

export const moneyFragment = /* GraphQL */ `
  {
    amount
    currencyCode
  }
`;

export const imageFragment = /* GraphQL */ `
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
    id
    namespace
    reference {
      ... on MediaImage {
        id
        image ${imageFragment}
      }
      ... on ProductVariant {
        title
        id
      }
      ... on Product {
        handle
        id
      }
    }
  }
`;

export const getMetafieldsFragment = (
  namespace: VariantMetadataNamespace = VARIANT_METADATA_NAMESPACE,
  first = 99
) => /* GraphQL */ `
  metafields(namespace: "${namespace}", first: ${first}) {
    edges {
      node ${metafieldFragment}
    }
  }
`;

interface VariantFragmentOptions {
  metafields?: string;
  includeQuantityAvailable?: boolean;
  includePrice?: boolean;
  includePriceWithoutSubfields?: boolean;
}

export const getVariantFragment = (options: VariantFragmentOptions = {}) => {
  return /* GraphQL */ `
    {
      id
      title
      ${options.includeQuantityAvailable ? "quantityAvailable" : ""}
      ${options.includePrice ? `price ${moneyFragment}` : ""}
      ${options.includePriceWithoutSubfields ? `price` : ""}
      sku
      selectedOptions {
        name
        value
      }
      image ${imageFragment}
      ${options.metafields ?? ""}
    }
  `;
};

export const getVariantEdgesFragment = (
  options: VariantFragmentOptions = {}
) => /* GraphQL */ `
  {
    edges {
      cursor
      node ${getVariantFragment(options)}
    }
  }
`;

export const getVariantWithMetafieldsFragment = (
  namespace: VariantMetadataNamespace = VARIANT_METADATA_NAMESPACE,
  options: VariantFragmentOptions = {}
) => {
  const metafields = getMetafieldsFragment(namespace);
  return getVariantFragment({ ...options, metafields });
};

export const getVariantEdgesWithMetafieldsFragment = (
  namespace: VariantMetadataNamespace | undefined,
  options: VariantFragmentOptions = {}
) => {
  if (namespace) {
    const metafields = getMetafieldsFragment(namespace);
    return getVariantEdgesFragment({
      ...options,
      metafields,
    });
  }
  return getVariantEdgesFragment(options);
};

export const cartFragment = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
      totalTaxAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              quantityAvailable
              price {
                amount
                currencyCode
              }
              image {
                url
                altText
              }
              product {
                title
                handle
              }
            }
          }
        }
      }
    }
  }
`;

export const draftOrderFragment = /* GraphQL */ `
  fragment DraftOrderFields on DraftOrder {
    id
    name
    status
    email
    totalPriceSet {
      shopMoney {
        amount
        currencyCode
      }
      presentmentMoney {
        amount
        currencyCode
      }
    }
    lineItems(first: 100) {
      # Adjust 'first' if you expect more line items
      edges {
        node {
          id
          title
          quantity
          originalUnitPriceSet {
            shopMoney {
              amount
              currencyCode
            }
            presentmentMoney {
              amount
              currencyCode
            }
          }
          variant {
            id
            title
            image {
              url
            }
            product {
              handle
            }
          }
        }
      }
    }
  }
`;
