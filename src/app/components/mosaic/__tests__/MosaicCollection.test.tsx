import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import MosaicCollection from "../MosaicCollection";

// mock GLOBAl TEXTS
jest.mock("@/utils/text", () => ({
  COLLECTION_TEXT: {
    textMosaic: {
      title: "test mosaic title",
      description: "test mosaic description",
    },
  },
  BUTTON_TEXT: {
    collectionCta: "Test Btn",
  },
}));

describe("MosaicCollection", () => {
  it("renders the section with correct id and aria-label", () => {
    const { getByRole } = render(<MosaicCollection />);
    const sectionElement = getByRole("region", {
      name: "Mosaic product collections",
    });
    expect(sectionElement).toBeInTheDocument();
    expect(sectionElement).toHaveAttribute("id", "Mosaic");
  });

  it("renders the SingleCollection component with correct props", () => {
    const { getByText, getByRole } = render(<MosaicCollection />);
    const titleElement = getByText("test mosaic title");
    const descElement = getByText("test mosaic description");
    const imgElement = getByRole("img");
    const ctaButton = getByRole("link", { name: "Test Btn" });

    expect(titleElement).toBeInTheDocument();
    expect(descElement).toBeInTheDocument();
    expect(imgElement).toBeInTheDocument();
    expect(ctaButton).toBeInTheDocument();
    expect(ctaButton).toHaveAttribute("href", "/shop/mosaics");
    expect(ctaButton).toBeEnabled();
  });
});
