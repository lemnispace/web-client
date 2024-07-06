import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { Hero } from "../Hero";

// mock GLOBAL_APP_TEXT
jest.mock("@/utils/text", () => ({
  BUTTON_TEXT: {
    landing: {
      heroCta: "Hero Button",
    },
  },
  HERO_TEXT: {
    title: ["first", "second", "third"],
    description: "Sample Description",
  },
}));

describe("Hero", () => {
  it("renders the title", () => {
    const { getByLabelText } = render(<Hero />);
    // the title should be rendered using the HERO_TEXT.title array
    const titleElement = getByLabelText("first second third");
    expect(titleElement).toBeInTheDocument();
  });

  it("renders the description", () => {
    const { getByText } = render(<Hero />);
    const descriptionElement = getByText("Sample Description");
    expect(descriptionElement).toBeInTheDocument();
  });

  it("renders the button", () => {
    const { getByText } = render(<Hero />);
    const buttonElement = getByText("Hero Button");
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toBeEnabled();
    expect(buttonElement).toHaveAttribute("href", "/shop");
  });
});
