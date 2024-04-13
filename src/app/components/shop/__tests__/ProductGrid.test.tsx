import { getImgWithinElement } from "@/utils/test_utils";
import { ProductItem } from "@/utils/types";
import "@testing-library/jest-dom";
import { render, within } from "@testing-library/react";

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
        id: "1",
        name: "test product",
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
        description: "test description",
        descriptionHtml: "<p>test description</p>",
        tags: ["test"],
        href: "/test-product",
        img: {
          src: "/test.png",
          alt: "test",
          width: 100,
          height: 100,
          id: "1",
        },
      },
      {
        id: "2",
        name: "test product 2",
        priceRange: {
          minVariantPrice: {
            amount: 20.0,
            currencyCode: "USD",
          },
          maxVariantPrice: {
            amount: 30.0,
            currencyCode: "USD",
          },
        },
        description: "test description 2",
        descriptionHtml: "<p>test description 2</p>",
        tags: ["test"],
        href: "/test-product-2",
        img: {
          src: "/test-2.jpg",
          alt: "test 2",
          width: 100,
          height: 100,
          id: "2",
        },
      },
    ] satisfies ProductItem[];
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
