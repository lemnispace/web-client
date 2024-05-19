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

export const metafieldFragment = /* GraphQL */ `
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

export const variantFragment = /* GraphQL */ `
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
    metafield(namespace: $namespace, key: $key) ${metafieldFragment}
  }
`;

export const newProductvariantFragment = /* GraphQL */ `
  {
    id
    title
    selectedOptions {
      name
      value
    }
    image ${imageFragment}
    metafield(namespace: $namespace, key: $key) ${metafieldFragment}
  }
`;

export const variantEdgesFragment = /* GraphQL */ `
  {
    edges {
      cursor
      node ${variantFragment}
    }
  }
`;

export const newProductvariantEdgesFragment = /* GraphQL */ `
  {
    edges {
      cursor
      node ${newProductvariantFragment}
    }
  }
`;

/**
 * Returns a fragment for multiple variants with the provided namespace and key.
 */
export const getVariantEdgesFragment = (namespace: string, key: string) => {
  return variantEdgesFragment
    .replace(/\$namespace/g, `"${namespace}"`)
    .replace(/\$key/g, `"${key}"`);
};

export const getNewProductVariantEdgesFragment = (
  namespace: string,
  key: string
) => {
  return newProductvariantEdgesFragment
    .replace(/\$namespace/g, `"${namespace}"`)
    .replace(/\$key/g, `"${key}"`);
};

/**
 * Returns a fragment for a single variant with the provided namespace and key.
 */
export const getVariantFragment = (namespace: string, key: string) => {
  return variantFragment
    .replace(/\$namespace/g, `"${namespace}"`)
    .replace(/\$key/g, `"${key}"`);
};

export const getNewProductVariantFragment = (
  namespace: string,
  key: string
) => {
  return newProductvariantFragment
    .replace(/\$namespace/g, `"${namespace}"`)
    .replace(/\$key/g, `"${key}"`);
};
