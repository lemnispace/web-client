import { getImgWithinElement } from "@/utils/test_utils";
import "@testing-library/jest-dom";
import { render, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductGridSection } from "../ProductGrid";

// mock text
jest.mock("@/utils/text", () => ({
  PRODUCT_DETAIL_SECTION_TEXT: {
    grid: {
      title: "test product grid",
    },
  },
}));

describe("ProductGridSection", () => {
  it("Displays all products", async () => {
    const mockProducts = [
      {
        id: 123,
        name: "test product",
        href: "/test-product",
        price: "1234",
        description: "this is a test product",
        imageSrc: "/test.png",
        imageAlt: "test",
      },
      {
        id: 456,
        name: "test product 2",
        href: "/test-product-2",
        price: "4567",
        description: "this is another test product",
        imageSrc: "/test-2.jpg",
        imageAlt: "test-2",
      },
    ];
    const { getByLabelText, findByRole } = render(
      <ProductGridSection products={mockProducts} />
    );
    // the product grid section is rendered correctly with an accessible label
    expect(getByLabelText("test product grid")).toBeInTheDocument();
    const product1 = (await findByRole("link", {
      name: "test product",
    })) as HTMLAnchorElement;
    const product2 = (await findByRole("link", {
      name: "test product 2",
    })) as HTMLAnchorElement;
    expect(product1).toBeInTheDocument();
    expect(product2).toBeInTheDocument();
    expect(product1).toHaveAttribute("href", "/test-product");
    expect(product2).toHaveAttribute("href", "/test-product-2");
    expect(getImgWithinElement(product1).getAttribute("src")).toContain(
      "test.png"
    );
    expect(getImgWithinElement(product2).getAttribute("src")).toContain(
      "test-2.jpg"
    );
  });
});
