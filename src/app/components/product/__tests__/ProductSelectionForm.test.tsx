import { getMockProduct } from "@/utils/test_utils";
import { Product } from "@/utils/types";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import ProductSelectionForm from "../ProductSelectionForm";
import { ProductVariantContext } from "../ProductView";

// mock text
jest.mock("@/utils/text", () => ({
  BUTTON_TEXT: {
    addToCart: "test cart",
    addToFavorites: "test favorites",
    goToCustomize: "test customize",
  },
  PRODUCT_COLOR_PICKER_TEXT: {
    title: "color picker test",
    shortDescription: "color picker test description",
  },
}));

const mockProduct = {
  ...getMockProduct(),
  href: "/product/test-product",
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
} satisfies Product;

describe("ProductSelectionForm", () => {
  it("adds the selected variant when redirecting to customize page", async () => {
    const mockOnSubmit = jest.fn();
    const { getByRole } = render(
      <ProductVariantContext.Provider
        value={{
          setSelectedVariant: jest.fn(),
          selectedVariant: mockProduct.variants[1],
        }}
      >
        <ProductSelectionForm onSubmit={mockOnSubmit} product={mockProduct} />
      </ProductVariantContext.Provider>
    );
    const customizeLink = getByRole("link", { name: "test customize" });
    expect(customizeLink).toHaveAttribute(
      "href",
      "/product/test-product/create?variant=2"
    );
  });
});
