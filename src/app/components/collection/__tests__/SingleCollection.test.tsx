import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import SingleCollection from "../SingleCollection";

describe("SingleCollection", () => {
  const props = {
    cta: "Test CTA",
    title: "Test Title",
    desc: "Test Description",
    imgAlt: "Test Alt",
    imgSrc: "/test-image.jpg",
    className: "test-class",
    href: "/test",
    blurrDataUrl: "test-blur-data-url",
    imgContainerClassName: "test-img-container-class",
  };

  it("renders the component with correct props", () => {
    const { getByText, getByRole } = render(<SingleCollection {...props} />);

    const titleElement = getByText("Test Title");
    expect(titleElement).toBeInTheDocument();

    const descElement = getByText("Test Description");
    expect(descElement).toBeInTheDocument();

    const imgElement = getByRole("img");
    expect(imgElement).toBeInTheDocument();
    expect(imgElement.getAttribute("src")).toContain("test-image.jpg");
    expect(imgElement).toHaveAttribute("alt", "Test Alt");

    const linkElement = getByRole("link", { name: "Test CTA" });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", "/test");
  });
});
