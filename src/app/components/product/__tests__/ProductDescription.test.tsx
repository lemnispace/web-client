import { render } from "@testing-library/react";
import ProductDescription from "../ProductDescription";

describe("ProductDescription", () => {
  it("renders the description correctly", () => {
    const description = "Product description";
    const { asFragment } = render(
      <ProductDescription description={description} />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("applies the provided className", () => {
    const description = "Product description";
    const className = "custom-class";
    const { getByText } = render(
      <ProductDescription description={description} className={className} />
    );
    const descriptionElement = getByText(description);
    expect(descriptionElement.classList).toContain(className);
  });
});
