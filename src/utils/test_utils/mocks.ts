import { ProductVariantNode } from "@/lib/types/shopify";
import { FabricImage } from "fabric";
import { Product, VariantTemplate } from "../types";

export const getMockVariantTemplate = () =>
  ({
    templateId: 321,
    imageUrl: "https://fake-img-example.test/image.jpg",
    printAreaWidth: 100,
    printAreaHeight: 100,
    printAreaLeft: 0,
    printAreaTop: 0,
    printfileId: 123,
    templateWidth: 0,
    templateHeight: 0,
    isTemplateOnFront: true,
    orientation: "any",
    conflictingPlacements: [],
  }) satisfies VariantTemplate;

export const getMockFabricImage = (src: string): FabricImage => {
  const mockImgEl = document.createElement("img");
  mockImgEl.src = src;
  return new FabricImage(mockImgEl);
};

export const getMockProduct = () =>
  ({
    id: "1",
    name: "Test Product",
    description: "Test Description",
    priceRange: {
      minVariantPrice: {
        amount: 10.0,
        currencyCode: "USD",
      },
      maxVariantPrice: {
        amount: 20.0,
        currencyCode: "USD",
      },
    },
    tags: ["test"],
    img: {
      src: "test.png",
      alt: "test",
      width: 100,
      height: 100,
      id: "1",
    },
    href: "/product/test-product",
    descriptionHtml: "Test Description HTML",
    images: [
      {
        height: 100,
        width: 100,
        alt: "Image 1",
        src: "/first_test_image.jpg",
        id: "1",
      },
      {
        height: 100,
        width: 100,
        alt: "Image 2",
        src: "/second_test_image.png",
        id: "2",
      },
    ],
    variants: [
      {
        id: "1",
        Color: "Red",
        title: "Red",
        price: {
          amount: "10.0",
          currencyCode: "USD",
        },
      },
      {
        id: "2",
        Color: "Blue",
        title: "Blue",
        price: {
          amount: "20.0",
          currencyCode: "USD",
        },
      },
    ],
  }) satisfies Product;

export const getMockVariantNode = () =>
  ({
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
  }) satisfies ProductVariantNode;
