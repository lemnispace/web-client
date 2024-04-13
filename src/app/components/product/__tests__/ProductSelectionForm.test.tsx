import { Product } from "@/utils/types";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductSelectionForm from "../ProductSelectionForm";

// mock text
jest.mock("@/utils/text", () => ({
  BUTTON_TEXT: {
    addToCart: "test cart",
    addToFavorites: "test favorites",
  },
  PRODUCT_COLOR_PICKER_TEXT: {
    title: "color picker test",
    shortDescription: "color picker test description",
  },
}));

const mockProduct: Product = {
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
};

describe("ProductSelectionForm", () => {
  it("Gets the form data with default color selected when the add to bag button is clicked", async () => {
    const mockOnSubmit = jest.fn();
    const { getByText } = render(
      <ProductSelectionForm onSubmit={mockOnSubmit} product={mockProduct} />
    );
    const addToBagButton = getByText("test cart");
    await userEvent.click(addToBagButton);
    expect(mockOnSubmit).toHaveBeenCalledWith({
      "color[name]": "Red",
      "color[bgColor]": "bg-red-500",
      "color[selectedColor]": "text-red-500",
    });
  });

  it("Gets the form data with selected color selected when the add to bag button is clicked", async () => {
    const mockOnSubmit = jest.fn();
    const { getByText, getByRole } = render(
      <ProductSelectionForm product={mockProduct} onSubmit={mockOnSubmit} />
    );
    const blueRadioButton = getByText("Blue");
    const addToBagButton = getByRole("button", { name: "test cart" });
    await userEvent.click(blueRadioButton);
    await userEvent.click(addToBagButton);
    expect(mockOnSubmit).toHaveBeenCalledWith({
      "color[name]": "Blue",
      "color[bgColor]": "bg-blue-500",
      "color[selectedColor]": "text-blue-500",
    });
  });

  it("fires 'Add to favorites' action on button click", async () => {
    const mockOnAddToFavorites = jest.fn();
    const { getByRole } = render(
      <ProductSelectionForm
        product={mockProduct}
        onAddToFavorites={mockOnAddToFavorites}
      />
    );
    const addToFavoritesButton = getByRole("button", {
      name: "test favorites",
    });
    await userEvent.click(addToFavoritesButton);
    expect(mockOnAddToFavorites).toHaveBeenCalledTimes(1);
  });
});
