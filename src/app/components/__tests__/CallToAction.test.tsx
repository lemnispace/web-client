import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { CallToAction } from "../landing_page/CallToAction";

jest.mock("@/utils/text", () => ({
  CTA_TEXT: {
    title: "Sample Title",
    description: "Sample Description",
  },
  BUTTON_TEXT: {
    cta: "Call to Action Button",
  },
}));

describe("CallToAction", () => {
  it("renders the title", () => {
    const { getByText } = render(<CallToAction />);
    const titleElement = getByText("Sample Title");
    expect(titleElement).toBeInTheDocument();
  });

  it("renders the description", () => {
    const { getByText } = render(<CallToAction />);
    const descriptionElement = getByText("Sample Description");
    expect(descriptionElement).toBeInTheDocument();
  });

  it("renders the button", () => {
    const { getByText } = render(<CallToAction />);
    const buttonElement = getByText("Call to Action Button");
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toBeEnabled();
    expect(buttonElement).toHaveAttribute("href", "/shop");
  });
});
