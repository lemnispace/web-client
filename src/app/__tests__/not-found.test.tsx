import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import NotFound from "../not-found";

// mock GLOBAL TEXT CONSTANTS
jest.mock("@/utils/text", () => ({
  BUTTON_TEXT: {
    goBackHome: "test button",
  },
  ERROR_TEXTS: {
    notFound: {
      title: "test title",
      code: "123",
      description: "test description",
    },
  },
}));

describe("NotFound", () => {
  it("renders the error code", () => {
    const { getByText } = render(<NotFound />);
    const errorCodeElement = getByText("123");
    expect(errorCodeElement).toBeInTheDocument();
  });

  it("renders the error title", () => {
    const { getByText } = render(<NotFound />);
    const errorTitleElement = getByText("test title");
    expect(errorTitleElement).toBeInTheDocument();
  });

  it("renders the error description", () => {
    const { getByText } = render(<NotFound />);
    const errorDescriptionElement = getByText("test description");
    expect(errorDescriptionElement).toBeInTheDocument();
  });

  it("renders the 'Go Back Home' button", () => {
    const { getByRole } = render(<NotFound />);
    const goBackHomeButton = getByRole("link", { name: "test button" });
    expect(goBackHomeButton).toBeInTheDocument();
    expect(goBackHomeButton).toHaveAttribute("href", "/");
    expect(goBackHomeButton).toHaveTextContent("test button");
  });
});
