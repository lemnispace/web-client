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

export const variantsFragment = /* GraphQL */ `
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

export const getVariantsFragment = (namespace: string, key: string) => {
  return variantsFragment
    .replace(/\$namespace/g, `"${namespace}"`)
    .replace(/\$key/g, `"${key}"`);
};
