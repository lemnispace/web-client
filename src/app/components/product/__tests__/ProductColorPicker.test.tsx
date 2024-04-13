import { Product } from "@/utils/types";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductColorPicker from "../ProductColorPicker";
import { ProductVariantContext } from "../ProductView";

// mock text
jest.mock("@/utils/text", () => ({
  PRODUCT_COLOR_PICKER_TEXT: {
    title: "color picker test",
    shortDescription: "color picker test description",
  },
}));

const mockProduct = {
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

describe("ProductColorPicker", () => {
  it("renders the color picker with correct title and radio buttons", () => {
    const { getByRole, getByText } = render(
      <ProductVariantContext.Provider
        value={{
          setSelectedVariant: jest.fn(),
          selectedVariant: mockProduct.variants[1],
        }}
      >
        <ProductColorPicker product={mockProduct} />
      </ProductVariantContext.Provider>
    );
    // color picker title
    expect(getByText("color picker test")).toBeInTheDocument();
    // color picker radio buttons
    const redRadioButton = getByRole("radio", { name: "Red" });
    const blueRadioButton = getByRole("radio", { name: "Blue" });
    expect(redRadioButton).toBeInTheDocument();
    expect(blueRadioButton).toBeInTheDocument();
    // the selected variant ("Blue") should be checked
    expect(redRadioButton).not.toBeChecked();
    expect(blueRadioButton).toBeChecked();
  });

  it("calls onColorChange when color is selected", async () => {
    const mockCb = (cb: any) => {
      if (typeof cb === "function") {
        return cb(mockProduct.variants[1]);
      }
      return cb;
    };
    const mockOnColorChange = jest.fn(mockCb);
    const { getByLabelText, rerender } = render(
      <ProductVariantContext.Provider
        value={{
          setSelectedVariant: mockOnColorChange,
          selectedVariant: mockProduct.variants[1],
        }}
      >
        <ProductColorPicker product={mockProduct} />
      </ProductVariantContext.Provider>
    );
    const redRadioButton = getByLabelText("Red");
    const blueRadioButton = getByLabelText("Blue");
    // default selected based on the selected variant from context
    expect(redRadioButton).not.toBeChecked();
    expect(blueRadioButton).toBeChecked();
    // click on the red radio button
    await userEvent.click(redRadioButton);
    expect(mockOnColorChange).toHaveBeenCalledWith(expect.any(Function));
    expect(mockOnColorChange).toHaveBeenCalledTimes(1);
    expect(mockOnColorChange.mock.results[0].value).toEqual(
      mockProduct.variants[0]
    );
    rerender(
      <ProductVariantContext.Provider
        value={{
          setSelectedVariant: mockOnColorChange,
          selectedVariant: mockProduct.variants[0],
        }}
      >
        <ProductColorPicker product={mockProduct} />
      </ProductVariantContext.Provider>
    );
    expect(redRadioButton).toBeChecked();
    // click on the blue radio button
    await userEvent.click(blueRadioButton);
    expect(mockOnColorChange).toHaveBeenCalledWith(expect.any(Function));
    expect(mockOnColorChange).toHaveBeenCalledTimes(2);
    expect(mockOnColorChange.mock.results[1].value).toEqual(
      mockProduct.variants[1]
    );
  });

  it("applies correct classes based on focus and checked state", async () => {
    const { getAllByRole } = render(
      <ProductVariantContext.Provider
        value={{
          setSelectedVariant: jest.fn(),
          selectedVariant: mockProduct.variants[0],
        }}
      >
        <ProductColorPicker product={mockProduct} />
      </ProductVariantContext.Provider>
    );
    const radioOptions = getAllByRole("radio");
    expect(radioOptions).toHaveLength(2);
    // focus on the selected radio button (red radio button)
    await userEvent.tab();

    // RED RADIO BUTTON
    const redRadioButton = radioOptions[0];
    expect(redRadioButton).toHaveClass("ring-red-500");
    // should be focused
    expect(redRadioButton).toHaveFocus();
    // state is focused and checked
    expect(redRadioButton).toHaveClass("ring", "ring-offset-1");
    // state is NOT unfocused and checked
    expect(redRadioButton).not.toHaveClass("ring-2");

    // BLUE RADIO BUTTON
    const blueRadioButton = radioOptions[1];
    expect(blueRadioButton).toHaveClass("ring-blue-500");
    // should NOT be focused
    expect(blueRadioButton).not.toHaveFocus();
    // state is NEITHER focused NOR checked
    expect(blueRadioButton).not.toHaveClass("ring", "ring-offset-1");
    expect(blueRadioButton).not.toHaveClass("ring-2");

    // Both radio buttons should have these classes
    radioOptions.forEach((r) =>
      expect(r).toHaveClass("cursor-pointer", "lemni-focus")
    );
  });
});
