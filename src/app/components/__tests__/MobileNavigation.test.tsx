import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MobileNavigation, { MobileNavigationProps } from "../MobileNavigation";

describe("MobileNavigation", () => {
  const mockItems: MobileNavigationProps["items"] = [
    { href: "/about", children: "About" },
    { href: "/contact", children: "Contact" },
  ];

  const mockSeparatedItems: MobileNavigationProps["separatedItems"] = [
    { href: "/login", children: "Login" },
    { href: "/signup", children: "Sign Up" },
  ];

  it("renders the mobile navigation icon", () => {
    const { getByLabelText } = render(<MobileNavigation items={mockItems} />);
    const mobileNavIcon = getByLabelText("Toggle Navigation");
    expect(mobileNavIcon).toBeInTheDocument();
  });

  it("renders the navigation items in the mobile navigation panel", async () => {
    const { getByLabelText, findByText, queryByText } = render(
      <MobileNavigation items={mockItems} separatedItems={mockSeparatedItems} />
    );
    const mobileNavIcon = getByLabelText("Toggle Navigation");
    expect(mobileNavIcon).toBeInTheDocument();
    // ensure the navigation panel is closed
    expect(queryByText("About")).toBeNull();
    expect(queryByText("Contact")).toBeNull();
    expect(queryByText("Login")).toBeNull();
    expect(queryByText("Sign Up")).toBeNull();
    // open the navigation panel
    userEvent.click(mobileNavIcon);
    // ensure the navigation panel is open
    const aboutLink = await findByText("About");
    const contactLink = await findByText("Contact");
    const loginLink = await findByText("Login");
    const signUpLink = await findByText("Sign Up");
    expect(aboutLink).toBeInTheDocument();
    expect(contactLink).toBeInTheDocument();
    expect(loginLink).toBeInTheDocument();
    expect(signUpLink).toBeInTheDocument();
  });
});
