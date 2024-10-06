import { CurrencyCode } from "@/lib/shopify/types/shopifyCurrencyCodes";
import { getMockProduct } from "@/utils/test_utils";
import { Product } from "@/utils/types";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductSizePicker from "../ProductSizePicker";
import { ProductVariantContext } from "../ProductView";

describe("ProductSizePicker", () => {
  const product = {
    ...getMockProduct(),
    variants: [
      {
        id: "1",
        title: "Small",
        price: {
          amount: "9.99",
          currencyCode: CurrencyCode.USD,
        },
        quantityAvailable: 10,
        Size: "Small",
      },
      {
        id: "2",
        title: "Medium",
        price: {
          amount: "9.99",
          currencyCode: CurrencyCode.USD,
        },
        quantityAvailable: 10,
        Size: "Medium",
      },
      {
        id: "3",
        title: "Large",
        price: {
          amount: "9.99",
          currencyCode: CurrencyCode.USD,
        },
        quantityAvailable: 10,
        Size: "Large",
      },
      {
        id: "4",
        title: "Large/Blue",
        price: {
          amount: "9.99",
          currencyCode: CurrencyCode.USD,
        },
        quantityAvailable: 1,
        Size: "Large",
        Color: "Blue",
      },
    ],
  } satisfies Product;

  it("renders the product size options", async () => {
    const mockCb = (cb: any) => {
      if (typeof cb === "function") {
        return cb(product.variants[0]);
      }
      return cb;
    };
    const mockSetSelectedVariant = jest.fn(mockCb);
    const { getAllByRole, getByRole } = render(
      <ProductVariantContext.Provider
        value={{
          selectedVariant: {
            ...product.variants[0],
            hasCustomization: false,
            customization: undefined,
          },
          setSelectedVariant: mockSetSelectedVariant,
        }}
      >
        <ProductSizePicker product={product} />
      </ProductVariantContext.Provider>
    );

    // Assert that the product size options are rendered correctly
    const sizeOptions = getAllByRole("radio");
    // only 3 unique sizes are present
    expect(sizeOptions).toHaveLength(3);

    // Assert that the first size option is selected
    const selectedSizeOption = getByRole("radio", {
      name: product.variants[0].Size,
    });
    expect(selectedSizeOption).toBeChecked();

    // Simulate selecting a size option
    const sizeOption = getByRole("radio", { name: "Medium" });
    await userEvent.click(sizeOption);

    // Assert that the selected variant is updated
    expect(mockSetSelectedVariant).toHaveBeenCalledTimes(1);
    expect(mockSetSelectedVariant.mock.results[0].value).toEqual(
      product.variants[1] // product of size "Medium"
    );
  });
});
