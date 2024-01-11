import { getImgWithinElement } from "@/utils/test_utils";
import "@testing-library/jest-dom";
import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ImageGallery from "../ImageGallery";

const product = {
  id: 1,
  name: "Product Name",
  href: "/product",
  price: "$10",
  description: "Product description",
  images: [
    {
      id: 1,
      name: "Image 1",
      src: "/first_test_image.jpg",
      alt: "Image 1",
    },
    {
      id: 2,
      name: "Image 2",
      src: "/second_test_image.png",
      alt: "Image 2",
    },
  ],
};

const productWithMoreImages = {
  ...product,
  images: [
    ...product.images,
    {
      id: 3,
      name: "Image 3",
      src: "/third_test_image.jpg",
      alt: "Image 3",
    },
    { id: 4, name: "Image 4", src: "/fourth_test_image.jpg", alt: "Image 4" },
    { id: 5, name: "Image 5", src: "/fourth_test_image.jpg", alt: "Image 5" },
    { id: 6, name: "Image 6", src: "/fourth_test_image.jpg", alt: "Image 6" },
  ],
};
describe("ImageGallery", () => {
  it("renders image selector with correct number of images", () => {
    const { getByRole, getAllByRole } = render(
      <ImageGallery product={productWithMoreImages} />
    );
    const displayedImg = getImgWithinElement(getByRole("tabpanel"));
    const imageSelectorItems = getAllByRole("tab");
    expect(displayedImg.src).toContain("first_test_image.jpg");
    expect(imageSelectorItems).toHaveLength(6);
  });

  it("changes displayed image when image selector is clicked", async () => {
    const { getByRole, getAllByRole } = render(
      <ImageGallery product={product} />
    );
    const imageSelector = getAllByRole("tab");
    // there are two image tabs
    expect(imageSelector).toHaveLength(2);
    const [firstImgTab, secondImgTab] = imageSelector;
    // aria-selected is true for the first image tab by default
    expect(firstImgTab).toHaveAttribute("aria-selected", "true");
    expect(secondImgTab).toHaveAttribute("aria-selected", "false");
    // the first image is displayed by default
    const firstImg = getImgWithinElement(firstImgTab);
    expect(firstImg.src).toContain("first_test_image.jpg");
    expect(firstImg.src).toEqual(
      getImgWithinElement(getByRole("tabpanel")).src
    );
    // click on the second image tab
    userEvent.click(secondImgTab);
    // wait for the second image to be selected
    await waitFor(() => {
      // aria-selected is true for the second image tab
      expect(secondImgTab).toHaveAttribute("aria-selected", "true");
      expect(firstImgTab).toHaveAttribute("aria-selected", "false");
    });
    // the second image is displayed
    const secondImg = getImgWithinElement(secondImgTab);
    expect(secondImg.src).toContain("second_test_image.png");
    expect(secondImg.src).toEqual(
      getImgWithinElement(getByRole("tabpanel")).src
    );
  });
});
