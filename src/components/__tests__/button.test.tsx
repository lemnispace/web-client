import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../button";

describe("Button", () => {
  it("renders the button with the provided label", () => {
    const { getByRole } = render(<Button>Click me</Button>);
    const button = getByRole("button", { name: "Click me" });
    expect(button).toBeInTheDocument();
  });

  it("calls the onClick function when the button is clicked", async () => {
    const onClick = jest.fn();
    const { getByRole } = render(<Button onClick={onClick}>Click me</Button>);
    const button = getByRole("button", { name: "Click me" });
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it.each([
    [undefined, "theme(colors.zinc.900)"], // same as dark/zinc by default
    ["dark/zinc", "theme(colors.zinc.900)"],
    ["light", "white"],
    ["dark/white", "theme(colors.zinc.900)"],
    ["dark", "theme(colors.zinc.900)"],
    ["white", "white"],
    ["zinc", "theme(colors.zinc.600)"],
    ["indigo", "theme(colors.indigo.500)"],
    ["cyan", "theme(colors.cyan.300)"],
    ["red", "theme(colors.red.600)"],
    ["orange", "theme(colors.orange.500)"],
    ["primary", "theme(colors.primary.500)"],
    ["secondary", "theme(colors.secondary.600)"],
    ["amber", "theme(colors.amber.400)"],
    ["yellow", "theme(colors.yellow.300)"],
    ["lime", "theme(colors.lime.300)"],
    ["green", "theme(colors.green.600)"],
    ["emerald", "theme(colors.emerald.600)"],
    ["teal", "theme(colors.teal.600)"],
    ["sky", "theme(colors.sky.500)"],
    ["blue", "theme(colors.blue.600)"],
    ["violet", "theme(colors.violet.500)"],
    ["purple", "theme(colors.purple.500)"],
    ["fuchsia", "theme(colors.fuchsia.500)"],
    ["pink", "theme(colors.pink.500)"],
    ["rose", "theme(colors.rose.500)"],
  ])("applies the specified color style to the button", (color, expected) => {
    const { getByRole } = render(
      <Button color={color as any}>Click me</Button>
    );
    const button = getByRole("button", { name: "Click me" });
    expect(button).toHaveClass(`[--btn-bg:${expected}]`);
  });

  // test each variant
  it("applies the specified variant style to the button", () => {
    const { getByRole, rerender } = render(<Button plain>Click me</Button>);
    let button = getByRole("button", { name: "Click me" });
    // no border or background
    expect(button).toHaveClass("border-transparent");
    expect(button.className).not.toContain("[--btn-bg");
    rerender(<Button outline>Click me</Button>);
    button = getByRole("button", { name: "Click me" });
    // should have a border but no background
    expect(button).toHaveClass("border-zinc-950/10");
    expect(
      // remove the dark:[--btn-bg:transparent] class
      button.className
        .split(" ")
        .filter((c) => c !== "dark:[--btn-bg:transparent]")
        .join(" ")
    ).not.toContain("[--btn-bg");
  });

  // test each variant
  it("applies the specified variant style to the button as a link when href is specified", () => {
    // PLAIN variant
    const { getByRole, rerender } = render(
      <Button href="/test1" plain>
        Click me
      </Button>
    );
    let button = getByRole("link", { name: "Click me" });
    // no border or background
    expect(button).toHaveClass("border-transparent");
    expect(button.className).not.toContain("[--btn-bg");
    expect(button).toHaveAttribute("href", "/test1");

    // OUTLINE variant
    rerender(
      <Button href="/test2" outline>
        Click me
      </Button>
    );
    button = getByRole("link", { name: "Click me" });
    // should have a border but no background
    expect(button).toHaveClass("border-zinc-950/10");
    expect(
      // remove the dark:[--btn-bg:transparent] class
      button.className
        .split(" ")
        .filter((c) => c !== "dark:[--btn-bg:transparent]")
        .join(" ")
    ).not.toContain("[--btn-bg");
    expect(button).toHaveAttribute("href", "/test2");

    // SOLID variant
    rerender(<Button href="/test3">Click me</Button>);
    button = getByRole("link", { name: "Click me" });
    // solid background with no border
    expect(button).toHaveClass("[--btn-bg:theme(colors.zinc.900)]");
    expect(button).toHaveClass("border-transparent");
    expect(button).toHaveAttribute("href", "/test3");
  });

  it("applies the specified cursor style to the button", async () => {
    const { findByRole, rerender } = render(<Button>Click me</Button>);
    let button = await findByRole("button", { name: "Click me" });
    expect(button).toHaveClass("cursor-default");
    expect(button).toBeEnabled();
    // DISABLED variant
    rerender(<Button disabled>Click me</Button>);
    expect(button).toHaveClass("cursor-default");
    expect(button).toBeDisabled();
    // WAIT variant
    rerender(<Button className="cursor-wait">Click me</Button>);
    button = await findByRole("button", { name: "Click me" });
    expect(button).toHaveClass("cursor-wait");
    expect(button).toBeEnabled();
    rerender(<Button className="cursor-not-allowed">Click me</Button>);
    button = await findByRole("button", { name: "Click me" });
    expect(button).toHaveClass("cursor-not-allowed");
    expect(button).toBeEnabled();
  });
});
