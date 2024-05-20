import { Edges, ProductNode, ProductVariantEdge } from "@/lib/types/shopify";
import { Product, ProductVariant } from "@/utils/types";
import {
  filterObject,
  getAllProductVariantOptions,
  mapCustomProduct,
  mapProduct,
  mapProductVariantNodeToProductVariant,
} from "../mappers";

describe("mapProductVariantNodeToProductVariant", () => {
  it("should map product variant nodes to product variants", () => {
    const variants: Edges<ProductVariantEdge> = {
      edges: [
        {
          cursor: "1",
          node: {
            id: "1",
            title: "Variant 1",
            quantityAvailable: 10,
            price: {
              amount: "9.99",
              currencyCode: "USD",
            },
            image: {
              url: "variant1.jpg",
              height: 640,
              width: 640,
              id: "image-1",
              altText: "Variant 1",
            },
            selectedOptions: [
              { name: "Color", value: "red" },
              { name: "Size", value: "small" },
            ],
          },
        },
        {
          cursor: "2",
          node: {
            id: "2",
            title: "Variant 2",
            quantityAvailable: 5,
            price: {
              amount: "14.99",
              currencyCode: "USD",
            },
            image: {
              url: "variant2.jpg",
              height: 640,
              width: 640,
              id: "image-2",
              altText: "Variant 2",
            },
            selectedOptions: [
              { name: "Color", value: "blue" },
              { name: "Size", value: "medium" },
            ],
          },
        },
      ],
    };

    const expectedProductVariants = [
      {
        id: "1",
        title: "Variant 1",
        quantityAvailable: 10,
        Color: "red",
        Size: "small",
        price: {
          amount: "9.99",
          currencyCode: "USD",
        },
        image: {
          id: "image-1",
          src: "variant1.jpg",
          alt: "Variant 1",
          width: 640,
          height: 640,
        },
      },
      {
        id: "2",
        title: "Variant 2",
        quantityAvailable: 5,
        Color: "blue",
        Size: "medium",
        price: {
          amount: "14.99",
          currencyCode: "USD",
        },
        image: {
          id: "image-2",
          src: "variant2.jpg",
          alt: "Variant 2",
          width: 640,
          height: 640,
        },
      },
    ] satisfies ProductVariant[];

    const productVariants = mapProductVariantNodeToProductVariant(variants);

    expect(productVariants).toEqual(expectedProductVariants);
  });
});
describe("mapProduct", () => {
  it("should map a product node to a product", () => {
    const productNode = {
      id: "1",
      title: "Product 1",
      handle: "product-1",
      description: "This is a product",
      descriptionHtml: "<p>This is a product.</p>",
      productType: "test product",
      priceRange: {
        minVariantPrice: {
          amount: 9.99,
          currencyCode: "USD",
        },
        maxVariantPrice: {
          amount: 14.99,
          currencyCode: "USD",
        },
      },
      tags: ["tag1", "tag2"],
      images: {
        edges: [
          {
            cursor: "1",
            node: {
              id: "image-1",
              altText: "Image 1",
              url: "image1.jpg",
              width: 640,
              height: 640,
            },
          },
          {
            cursor: "2",
            node: {
              id: "image-2",
              altText: "Image 2",
              url: "image2.jpg",
              width: 640,
              height: 640,
            },
          },
        ],
      },
      variants: {
        edges: [
          {
            cursor: "1",
            node: {
              id: "1",
              title: "Variant 1",
              quantityAvailable: 10,
              price: {
                amount: "9.99",
                currencyCode: "USD",
              },
              image: {
                url: "variant1.jpg",
                height: 640,
                width: 640,
                id: "image-1",
                altText: "Variant 1",
              },
              selectedOptions: [
                { name: "Color", value: "red" },
                { name: "Size", value: '12"x18"' },
              ],
            },
          },
        ],
      },
    } satisfies ProductNode;

    const expectedProduct = {
      id: "1",
      name: "Product 1",
      description: "This is a product",
      descriptionHtml: "<p>This is a product.</p>",
      tags: ["tag1", "tag2"],
      priceRange: {
        minVariantPrice: {
          amount: 9.99,
          currencyCode: "USD",
        },
        maxVariantPrice: {
          amount: 14.99,
          currencyCode: "USD",
        },
      },
      type: "test product",
      href: "/shop/mosaics/product-1",
      images: [
        {
          src: "image1.jpg",
          alt: "Image 1",
          width: 640,
          height: 640,
          id: "image-1",
        },
        {
          src: "image2.jpg",
          alt: "Image 2",
          width: 640,
          height: 640,
          id: "image-2",
        },
      ],
      variants: [
        {
          id: "1",
          title: "Variant 1",
          quantityAvailable: 10,
          Color: "red",
          Size: '12"x18"',
          price: {
            amount: "9.99",
            currencyCode: "USD",
          },
          image: {
            id: "image-1",
            src: "variant1.jpg",
            alt: "Variant 1",
            width: 640,
            height: 640,
          },
        },
      ],
    } satisfies Product;

    const mappedProduct = mapProduct(productNode);

    expect(mappedProduct).toEqual(expectedProduct);
  });
  describe("getAllProductVariantOptions", () => {
    it("should return an array of unique values for the specified option type", () => {
      const variants = [
        {
          id: "1",
          title: "Variant 1",
          quantityAvailable: 10,
          price: {
            amount: "9.99",
            currencyCode: "USD",
          },
          Color: "red",
          Size: "small",
          Style: "modern",
          Material: "cotton",
        },
        {
          id: "2",
          title: "Variant 2",
          quantityAvailable: 5,
          price: {
            amount: "14.99",
            currencyCode: "USD",
          },
          Color: "blue",
          Size: "medium",
          Style: "classic",
          Material: "wool",
        },
        {
          id: "3",
          title: "Variant 3",
          quantityAvailable: 3,
          price: {
            amount: "19.99",
            currencyCode: "USD",
          },
          Color: "red",
          Size: "small",
          Style: "modern",
          Material: "silk",
        },
      ] satisfies ProductVariant[];
      // Test that the function returns an empty array if no variants are provided for the specified option type
      expect(
        getAllProductVariantOptions(
          [
            {
              id: "1",
              title: "Variant 1",
              quantityAvailable: 10,
              price: {
                amount: "9.99",
                currencyCode: "USD",
              },
              Color: "red",
            },
          ],
          "Size"
        )
      ).toEqual([]);

      expect(getAllProductVariantOptions(variants, "Color")).toEqual([
        "red",
        "blue",
      ]);
      expect(getAllProductVariantOptions(variants, "Size")).toEqual([
        "small",
        "medium",
      ]);
      expect(getAllProductVariantOptions(variants, "Material")).toEqual([
        "cotton",
        "wool",
        "silk",
      ]);
      expect(getAllProductVariantOptions(variants, "Style")).toEqual([
        "modern",
        "classic",
      ]);
    });
  });
});
describe("filterObject", () => {
  it("should filter object properties with falsy values", () => {
    const obj = {
      name: "John",
      age: 30,
      email: "",
      address: null,
      isActive: false,
    };

    const filteredObj = filterObject(obj);

    expect(filteredObj).toEqual({
      name: "John",
      age: 30,
    });
  });

  it("should return an empty object if all properties are falsy", () => {
    const obj = {
      name: "",
      age: null,
      email: undefined,
      address: false,
      phone: 0,
    };

    const filteredObj = filterObject(obj);

    expect(filteredObj).toEqual({});
  });

  it("should not modify the original object", () => {
    const obj = {
      name: "John",
      age: 30,
      email: "",
    };

    filterObject(obj);

    expect(obj).toEqual({
      name: "John",
      age: 30,
      email: "",
    });
  });
});

describe("mapCustomProduct", () => {
  it("should map a product node to a product with valid custom variants", () => {
    const productNode = {
      id: "1",
      title: "Custom Product",
      handle: "custom-product",
      description: "This is a custom product",
      descriptionHtml: "<p>This is a custom product.</p>",
      productType: "custom",
      priceRange: {
        minVariantPrice: {
          amount: 19.99,
          currencyCode: "USD",
        },
        maxVariantPrice: {
          amount: 29.99,
          currencyCode: "USD",
        },
      },
      tags: ["custom", "personalized"],
      images: {
        edges: [
          {
            cursor: "1",
            node: {
              id: "image-1",
              altText: "Custom Image 1",
              url: "custom-image1.jpg",
              width: 800,
              height: 600,
            },
          },
        ],
      },
      variants: {
        edges: [
          {
            cursor: "1",
            node: {
              id: "1",
              title: "Custom Variant 1",
              quantityAvailable: 5,
              price: {
                amount: "19.99",
                currencyCode: "USD",
              },
              image: {
                url: "custom-variant1.jpg",
                height: 600,
                width: 800,
                id: "image-2",
                altText: "Custom Variant 1",
              },
              selectedOptions: [
                { name: "Size", value: "Small" },
                { name: "Color", value: "Red" },
              ],
            },
          },
          {
            cursor: "2",
            node: {
              id: "2",
              title: "Custom Variant 2",
              quantityAvailable: 3,
              price: {
                amount: "29.99",
                currencyCode: "USD",
              },
              image: null!,
              selectedOptions: [
                { name: "Size", value: "Large" },
                { name: "Color", value: "Blue" },
              ],
            },
          },
        ],
      },
    } satisfies ProductNode;

    const expectedCustomProduct = {
      id: "1",
      name: "Custom Product",
      description: "This is a custom product",
      descriptionHtml: "<p>This is a custom product.</p>",
      tags: ["custom", "personalized"],
      priceRange: {
        minVariantPrice: {
          amount: 19.99,
          currencyCode: "USD",
        },
        maxVariantPrice: {
          amount: 29.99,
          currencyCode: "USD",
        },
      },
      type: "custom",
      href: "/shop/mosaics/custom-product",
      images: [
        {
          src: "custom-image1.jpg",
          alt: "Custom Image 1",
          width: 800,
          height: 600,
          id: "image-1",
        },
      ],
      variants: [
        {
          id: "1",
          title: "Custom Variant 1",
          quantityAvailable: 5,
          Size: "Small",
          Color: "Red",
          price: {
            amount: "19.99",
            currencyCode: "USD",
          },
          image: {
            id: "image-2",
            src: "custom-variant1.jpg",
            alt: "Custom Variant 1",
            width: 800,
            height: 600,
          },
        },
      ],
    } satisfies Product;

    const mappedCustomProduct = mapCustomProduct(productNode);

    expect(mappedCustomProduct).toEqual(expectedCustomProduct);
  });

  it("should filter out custom variants without image or media", () => {
    const productNode = {
      id: "2",
      title: "Custom Product 2",
      handle: "custom-product-2",
      description: "This is another custom product",
      descriptionHtml: "<p>This is another custom product.</p>",
      productType: "custom",
      priceRange: {
        minVariantPrice: {
          amount: 15.99,
          currencyCode: "USD",
        },
        maxVariantPrice: {
          amount: 25.99,
          currencyCode: "USD",
        },
      },
      tags: ["custom"],
      images: {
        edges: [],
      },
      variants: {
        edges: [
          {
            cursor: "1",
            node: {
              id: "1",
              title: "Custom Variant 1",
              quantityAvailable: 10,
              price: {
                amount: "15.99",
                currencyCode: "USD",
              },
              image: null!,
              selectedOptions: [
                { name: "Size", value: "Medium" },
                { name: "Color", value: "Green" },
              ],
            },
          },
          {
            cursor: "2",
            node: {
              id: "2",
              title: "Custom Variant 2",
              quantityAvailable: 8,
              price: {
                amount: "25.99",
                currencyCode: "USD",
              },
              image: {
                url: "custom-variant2.jpg",
                height: 600,
                width: 800,
                id: "image-3",
                altText: "Custom Variant 2",
              },
              selectedOptions: [
                { name: "Size", value: "Large" },
                { name: "Color", value: "Yellow" },
              ],
            },
          },
        ],
      },
    } satisfies ProductNode;

    const expectedCustomProduct = {
      id: "2",
      name: "Custom Product 2",
      description: "This is another custom product",
      descriptionHtml: "<p>This is another custom product.</p>",
      tags: ["custom"],
      priceRange: {
        minVariantPrice: {
          amount: 15.99,
          currencyCode: "USD",
        },
        maxVariantPrice: {
          amount: 25.99,
          currencyCode: "USD",
        },
      },
      type: "custom",
      href: "/shop/mosaics/custom-product-2",
      images: [],
      variants: [
        {
          id: "2",
          title: "Custom Variant 2",
          quantityAvailable: 8,
          Size: "Large",
          Color: "Yellow",
          price: {
            amount: "25.99",
            currencyCode: "USD",
          },
          image: {
            id: "image-3",
            src: "custom-variant2.jpg",
            alt: "Custom Variant 2",
            width: 800,
            height: 600,
          },
        },
      ],
    } satisfies Product;

    const mappedCustomProduct = mapCustomProduct(productNode);

    expect(mappedCustomProduct).toEqual(expectedCustomProduct);
  });
});
