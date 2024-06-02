import { getImgWithinElement, getMockProduct } from "@/utils/test_utils";
import { Product } from "@/utils/types";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import ImageGallery from "../ImageGallery";
import { ProductVariantContext } from "../ProductView";

const product = {
  ...getMockProduct(),
  variants: [
    {
      id: "1",
      Color: "Red",
      Size: "S",
      title: "S/Red",
      price: {
        amount: "10.0",
        currencyCode: "USD",
      },
      image: {
        height: 100,
        width: 100,
        alt: "Image 1",
        src: "/first_test_image.jpg",
        id: "1",
      },
    },
    {
      id: "2",
      Color: "Red",
      Size: "M",
      title: "M/Red",
      price: {
        amount: "20.0",
        currencyCode: "USD",
      },
      image: {
        height: 100,
        width: 100,
        alt: "Image 2",
        src: "/second_test_image.png",
        id: "2",
      },
    },
  ],
} satisfies Product;

const productWithMoreImages = {
  ...product,
  variants: [
    ...product.variants,
    {
      id: "3",
      Color: "Red",
      title: "L/Red",
      Size: "L",
      price: {
        amount: "30.0",
        currencyCode: "USD",
      },
      image: {
        height: 100,
        width: 100,
        alt: "Image 3",
        src: "/third_test_image.jpg",
        id: "3",
      },
    },
    {
      id: "4",
      Color: "Red",
      title: "XS/Red",
      Size: "XS",
      price: {
        amount: "40.0",
        currencyCode: "USD",
      },
      image: {
        height: 100,
        width: 100,
        alt: "Image 4",
        src: "/fourth_test_image.png",
        id: "4",
      },
    },
    {
      id: "5",
      Color: "Red",
      title: "XL/Red",
      Size: "XL",
      price: {
        amount: "50.0",
        currencyCode: "USD",
      },
      image: {
        height: 100,
        width: 100,
        alt: "Image 5",
        src: "/fifth_test_image.jpg",
        id: "5",
      },
    },
    {
      id: "6",
      Color: "Red",
      title: "XXS/Red",
      Size: "XXS",
      price: {
        amount: "60.0",
        currencyCode: "USD",
      },
      image: {
        height: 100,
        width: 100,
        alt: "Image 6",
        src: "/sixth_test_image.png",
        id: "6",
      },
    },
  ],
} satisfies Product;

describe("ImageGallery", () => {
  it("renders image selector with correct number of images", () => {
    const { getByRole, getAllByRole } = render(
      <ProductVariantContext.Provider
        value={{
          setSelectedVariant: jest.fn(),
          selectedVariant: {
            ...productWithMoreImages.variants[1],
            hasCustomization: false,
            customization: undefined,
          },
        }}
      >
        <ImageGallery product={productWithMoreImages} />
      </ProductVariantContext.Provider>
    );
    const displayedImg = getImgWithinElement(getByRole("tabpanel"));
    const imageSelectorItems = getAllByRole("tab");
    // the second image is displayed because the second variant is selected
    expect(displayedImg.src).toContain("second_test_image.png");
    // all images of the same color variant are displayed in the image selector
    expect(imageSelectorItems).toHaveLength(6);
  });
});
