import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { NavLink } from "../NavLink";

describe("NavLink", () => {
  it("renders the link with correct href and children", () => {
    const href = "/about";
    const children = "About";
    const { getByText } = render(<NavLink href={href}>{children}</NavLink>);
    const linkElement = getByText(children);
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", href);
  });

  it("renders the link with correct styling", () => {
    const href = "/about";
    const children = "About";
    const { asFragment } = render(<NavLink href={href}>{children}</NavLink>);
    expect(asFragment()).toMatchSnapshot();
  });
});
