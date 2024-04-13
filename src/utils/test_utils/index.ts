import { Product } from "@/utils/types";
import { within } from "@testing-library/react";
import { FabricImage } from "fabric";
export const getImgWithinElement = (el: HTMLElement): HTMLImageElement => {
  return within(el).getByRole("img") as HTMLImageElement;
};

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
