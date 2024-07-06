import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { Heading, Hero } from "../Hero";

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

  // test title doesn't render last line if not provided
  it("renders the title without last line", () => {
    const { getByTestId } = render(
      <Heading
        firstLine="first"
        highlightedLine="second"
        lastLine={undefined}
        data-testid="test-title"
      />
    );
    const titleElement = getByTestId("test-title");
    expect(titleElement).toHaveTextContent("first second");
  });

  // test title doesn't render first line if not provided
  it("renders the title without the firstl line", () => {
    const { getByTestId } = render(
      <Heading
        highlightedLine="second"
        lastLine="last"
        data-testid="test-title"
      />
    );
    const titleElement = getByTestId("test-title");
    expect(titleElement).toHaveTextContent("second last");
  });

  it.each(["h1", "h2", "h3", "h4", "h5", "h6"])(
    "renders the title using the %s tag",
    (headingTag) => {
      const { getByTestId } = render(
        <Heading
          highlightedLine="second"
          lastLine="last"
          data-testid="test-title"
          as={headingTag as "h1" | "h2" | "h3" | "h4" | "h5" | "h6"}
        />
      );
      const titleElement = getByTestId("test-title");
      expect(titleElement.tagName).toBe(headingTag.toUpperCase());
    }
  );

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
