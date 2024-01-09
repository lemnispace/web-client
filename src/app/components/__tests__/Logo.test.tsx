import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { Logo } from "../Logo";

describe("Logo", () => {
  it("renders correctly", () => {
    const { asFragment } = render(<Logo />);
    expect(asFragment()).toMatchSnapshot();
  });
});
