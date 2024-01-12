import "@testing-library/jest-dom";
import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductColorPicker from "../ProductColorPicker";

// mock text
jest.mock("@/utils/text", () => ({
  PRODUCT_COLOR_PICKER_TEXT: {
    title: "color picker test",
    shortDescription: "color picker test description",
  },
}));

const colors = [
  {
    name: "Red",
    bgColor: "bg-red-500",
    selectedColor: "text-red-500",
  },
  {
    name: "Blue",
    bgColor: "bg-blue-500",
    selectedColor: "text-blue-500",
  },
];

describe("ProductColorPicker", () => {
  it("renders correctly", () => {
    const { getByRole, getByText } = render(
      <ProductColorPicker colors={colors} />
    );
    // color picker title and description
    expect(getByText("color picker test")).toBeInTheDocument();
    expect(getByText("color picker test description")).toBeInTheDocument();
    // color picker radio buttons
    const redRadioButton = getByRole("radio", { name: "Red" });
    const blueRadioButton = getByRole("radio", { name: "Blue" });
    expect(redRadioButton).toBeInTheDocument();
    expect(blueRadioButton).toBeInTheDocument();
    // if no default is provided, first color is selected
    expect(redRadioButton).toBeChecked();
    expect(blueRadioButton).not.toBeChecked();
  });

  it("calls onColorChange when color is selected", async () => {
    const mockOnColorChange = jest.fn();
    const { getByLabelText } = render(
      <ProductColorPicker
        colors={colors}
        onColorChange={mockOnColorChange}
        defaultColor={colors[1]}
      />
    );
    const redRadioButton = getByLabelText("Red");
    const blueRadioButton = getByLabelText("Blue");
    // default selected based on defaultColor prop
    expect(redRadioButton).not.toBeChecked();
    expect(blueRadioButton).toBeChecked();
    // click on the red radio button
    await userEvent.click(redRadioButton);
    expect(mockOnColorChange).toHaveBeenCalledWith(colors[0]);
    expect(redRadioButton).toBeChecked();
    // click on the blue radio button
    await userEvent.click(blueRadioButton);
    expect(mockOnColorChange).toHaveBeenCalledWith(colors[1]);
    await userEvent.click(blueRadioButton);
    await userEvent.click(blueRadioButton);
    // won't call onColorChange if the same color is selected
    expect(mockOnColorChange).toHaveBeenCalledTimes(2);
    await userEvent.click(redRadioButton);
    await userEvent.click(redRadioButton);
    expect(mockOnColorChange).toHaveBeenCalledTimes(3);
  });

  it("applies correct classes based on focus and checked state", async () => {
    const { getAllByRole } = render(<ProductColorPicker colors={colors} />);
    const radioOptions = getAllByRole("radio");
    expect(radioOptions).toHaveLength(2);
    // focus on the first radio button (red radio button)
    await userEvent.tab();

    // RED RADIO BUTTON
    const redRadioButton = radioOptions[0];
    expect(redRadioButton).toHaveClass("text-red-500");
    // should be focused
    expect(redRadioButton).toHaveFocus();
    // state is focused and checked
    expect(redRadioButton).toHaveClass("ring", "ring-offset-1");
    // state is NOT unfocused and checked
    expect(redRadioButton).not.toHaveClass("ring-2");

    // BLUE RADIO BUTTON
    const blueRadioButton = radioOptions[1];
    expect(blueRadioButton).toHaveClass("text-blue-500");
    // should NOT be focused
    expect(blueRadioButton).not.toHaveFocus();
    // state is NEITHER focused NOR checked
    expect(blueRadioButton).not.toHaveClass("ring", "ring-offset-1");
    expect(blueRadioButton).not.toHaveClass("ring-2");

    // Both radio buttons should have these classes
    radioOptions.forEach((r) =>
      expect(r).toHaveClass("cursor-pointer", "focus:outline-none")
    );
  });
});
