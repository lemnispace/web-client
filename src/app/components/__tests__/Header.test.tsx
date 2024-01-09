import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { Header } from "../Header";

describe("Header", () => {
  const mockNavLinks = [
    { href: "/about", children: "About" },
    { href: "/contact", children: "Contact" },
  ];

  it("renders the logo", () => {
    const { getByLabelText } = render(<Header navLinks={mockNavLinks} />);
    const logoElement = getByLabelText("Home");
    expect(logoElement).toBeInTheDocument();
    expect(logoElement).toHaveAttribute("href", "/");
  });

  it("renders the navigation links", () => {
    const { getByText } = render(<Header navLinks={mockNavLinks} />);
    const aboutLink = getByText("About");
    const contactLink = getByText("Contact");
    expect(aboutLink).toBeInTheDocument();
    expect(aboutLink).toHaveAttribute("href", "/about");
    expect(contactLink).toBeInTheDocument();
    expect(contactLink).toHaveAttribute("href", "/contact");
  });

  it("renders the shopping cart", () => {
    const { getByText } = render(<Header navLinks={mockNavLinks} />);
    const shoppingCartElement = getByText("items in cart, view bag");
    expect(shoppingCartElement).toBeInTheDocument();
  });

  it("renders mobile navigation", () => {
    const { getByLabelText } = render(<Header navLinks={mockNavLinks} />);
    const mobileNav = getByLabelText("Toggle Navigation");
    expect(mobileNav).toBeInTheDocument();
  });
});
