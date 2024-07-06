import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { Heading } from "../Heading";

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
