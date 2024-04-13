import {
  getDimensionsFromVariant,
  getVariantById,
  getVariantByValues,
} from "../getters";
import { getMockProduct } from "../test_utils";
import { Product } from "../types";

const product = {
  ...getMockProduct(),
  variants: [
    {
      id: "1",
      title: "Variant 1",
      Color: "Blue",
      Size: "Small",
      price: {
        amount: "100",
        currencyCode: "USD",
      },
    },
    {
      id: "2",
      title: "Variant 2",
      Color: "Blue",
      Size: "Medium",
      price: {
        amount: "150",
        currencyCode: "USD",
      },
    },
    {
      id: "3",
      title: "Variant 3",
      Color: "Green",
      Size: "Large",
      price: {
        amount: "200",
        currencyCode: "USD",
      },
    },
  ],
} satisfies Product;

describe("getVariantById", () => {
  it("should return the variant object with the specified ID", () => {
    const id = "2";
    const result = getVariantById(product, id);
    expect(result).toEqual(product.variants[1]);
  });

  it("should return undefined if the variant with the specified ID is not found", () => {
    const id = "4";
    const result = getVariantById(product, id);
    expect(result).toBeUndefined();
  });
});

describe("getVariantByValues", () => {
  it.each([
    [{ Color: "Blue", Size: "Small" }, product.variants[0]],
    [{ Color: "Blue", Size: "Medium" }, product.variants[1]],
    [{ Color: "Green", Size: "Large" }, product.variants[2]],
    [{ Color: "Red", Size: "Large" }, undefined],
    [{ Color: "Green", Size: "Small" }, undefined],
  ])(
    "should return the variant object that matches the $expected variant options",
    (variantOptions, expected) => {
      const result = getVariantByValues(product, variantOptions);
      expect(result).toEqual(expected);
    }
  );
});

describe("getDimensionsFromVariant", () => {
  it.each([
    ["18x24", { width: 18.0, height: 24.0 }],
    [`"24X36"`, { width: 24.0, height: 36.0 }],
    [`12″x18″`, { width: 12.0, height: 18.0 }],
    [`12.″x18.″`, { width: 12.0, height: 18.0 }],
    [`10"x18"`, { width: 10.0, height: 18.0 }],
    [`  10"x  18"`, { width: 10.0, height: 18.0 }],
    [`-10"_x_18"-`, { width: 10.0, height: 18.0 }],
    [`-10″_x_18″-`, { width: 10.0, height: 18.0 }],
    [`-10.4″_x_18.5″-`, { width: 10.4, height: 18.5 }],
    [`-10.4cm_x_18.5cm-`, { width: 10.4, height: 18.5 }],
    [null, undefined],
    ["", undefined],
    ["invalid", undefined],
    ["18", undefined],
    ["18x", undefined],
    ["x24", undefined],
    ["18x24x36", undefined],
    ["NaNxNaN", undefined],
  ])(
    "should return an object with the width and height of the variant",
    (size, expected) => {
      const variant = { ...product.variants[0], Size: size };
      const result = getDimensionsFromVariant(variant as any);
      expect(result).toEqual(expected);
    }
  );
});
