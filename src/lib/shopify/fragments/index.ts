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

const metafieldsFragment = /* GraphQL */ `
metafields(namespace: "custom", first: 99) {
  edges {
    node ${metafieldFragment}
  }
}
`;

const variantFragment = /* GraphQL */ `
  {
    id
    title
    quantityAvailable
    price ${moneyFragment}
    selectedOptions {
      name
      value
    }
    image ${imageFragment}
  }
`;

const variantFragmentWithMetafields = /* GraphQL */ `
  {
    id
    title
    quantityAvailable
    price ${moneyFragment}
    selectedOptions {
      name
      value
    }
    image ${imageFragment}
    ${metafieldsFragment}
  }
`;

const newProductvariantWithMetafieldsFragment = /* GraphQL */ `
  {
    id
    title
    selectedOptions {
      name
      value
    }
    image ${imageFragment}
    ${metafieldsFragment}
  }
`;

const variantEdgesFragment = /* GraphQL */ `
  {
    edges {
      cursor
      node ${variantFragment}
    }
  }
`;

const variantEdgesWithMetafieldsFragment = /* GraphQL */ `
  {
    edges {
      cursor
      node ${variantFragmentWithMetafields}
    }
  }
`;

const newProductvariantEdgesWithMetafieldsFragment = /* GraphQL */ `
  {
    edges {
      cursor
      node ${newProductvariantWithMetafieldsFragment}
    }
  }
`;

export const getMetafieldsFragment = (
  namespace: VariantMetadataNamespace,
  fragment: string = metafieldsFragment
) => {
  return fragment.replace(/\$namespace/g, `"${namespace}"`);
};

/**
 * Returns a fragment for multiple variants with the provided namespace and key.
 */
export const getVariantEdgesFragment = (
  namespace: VariantMetadataNamespace | undefined
) => {
  if (namespace) {
    return getMetafieldsFragment(namespace, variantEdgesWithMetafieldsFragment);
  }
  return variantEdgesFragment;
};

export const getNewProductVariantEdgesFragment = (
  namespace: VariantMetadataNamespace = VARIANT_METADATA_NAMESPACE
) => {
  return getMetafieldsFragment(
    namespace,
    newProductvariantEdgesWithMetafieldsFragment
  );
};
