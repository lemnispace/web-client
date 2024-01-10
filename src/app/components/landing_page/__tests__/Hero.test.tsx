import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { Hero, Title } from "../Hero";

// mock GLOBAL_APP_TEXT
jest.mock("@/utils/text", () => ({
  BUTTON_TEXT: {
    heroCta: "Hero Button",
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

  // test title doesn't render last line if not provided
  it("renders the title without last line", () => {
    const { getByTestId } = render(
      <Title
        firstLine="first"
        highlightedLine="second"
        lastLine={undefined}
        data-testid="test-title"
      />
    );
    const titleElement = getByTestId("test-title");
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveTextContent("first second");
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
