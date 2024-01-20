import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import ProductTitle from "../ProductTitle";

// mock GLOBAL_APP_TEXT
jest.mock("@/utils/text", () => ({
  PRODUCT_SECTION_TEXT: {
    title: "test section",
  },
}));

describe("ProductTitle", () => {
  it("renders the product title with the price", () => {
    const { getByText } = render(
      <ProductTitle name="Test Product" price="$10.99" />
    );
    // section title is rendered and uses global text
    expect(getByText("test section")).toBeInTheDocument();
    const productNameElement = getByText("Test Product");
    expect(productNameElement).toBeInTheDocument();
    // price is rendered
    expect(getByText("$10.99")).toBeInTheDocument();
  });
});
