import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { Footer } from "../Footer";

// mock GLOBAL_APP_TEXT
jest.mock("@/utils/text", () => ({
  GLOBAL_APP_TEXT: {
    name: "Test App Name",
  },
}));

describe("Footer", () => {
  const originalDate = Date;

  beforeAll(() => {
    // Mock the current year
    const CURRENT_YEAR = 1234;
    global.Date.prototype.getFullYear = jest.fn(() => CURRENT_YEAR);
  });

  afterAll(() => {
    // Restore the original Date object
    global.Date = originalDate;
  });

  const mockNavLinks = [
    { href: "/about", children: "About" },
    { href: "/contact", children: "Contact" },
  ];

  it("renders the logo", () => {
    const { getByLabelText } = render(<Footer navLinks={mockNavLinks} />);
    const logoElement = getByLabelText("Logo");
    expect(logoElement).toBeInTheDocument();
  });

  it("renders the navigation links", () => {
    const { getByText } = render(<Footer navLinks={mockNavLinks} />);
    const aboutLink = getByText("About");
    const contactLink = getByText("Contact");
    expect(aboutLink).toBeInTheDocument();
    expect(contactLink).toBeInTheDocument();
  });

  it("renders the copyright text", () => {
    const { getByText } = render(<Footer navLinks={mockNavLinks} />);
    const copyrightText = getByText(
      "Copyright © 1234 Test App Name. All rights reserved."
    );
    expect(copyrightText).toBeInTheDocument();
  });
});
