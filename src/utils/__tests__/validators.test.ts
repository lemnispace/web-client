import exp from "constants";
import { getMockProduct } from "../test_utils";
import { Product } from "../types";
import { hasVariant, isDefined, isNumber, toFloat, toInt } from "../validators";

test.each([
  [10, true],
  ["hello", true],
  [true, true],
  [false, true],
  [undefined, false],
  [null, false],
  [0, true],
  [Infinity, true],
  [-Infinity, true],
  [NaN, true],
  [Symbol("test"), true],
  [{}, true],
  [[], true],
  [() => {}, true],
  [BigInt(10), true],
  [BigInt("10"), true],
  ["", true],
  [0xedcba9876543210, true],
  [0b101010, true],
  [0o76543210, true],
  [Symbol(""), true],
])("given %p, should return %p if the value is defined", (value, expected) => {
  expect(isDefined(value)).toBe(expected);
});

describe("hasVariant", () => {
  test("should return true if the product has a variant of the specified type", () => {
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

    expect(hasVariant(product, "Color")).toBe(true);
    expect(hasVariant(product, "Size")).toBe(true);
    expect(
      hasVariant(
        {
          ...product,
          variants: [
            {
              id: "1",
              title: "Variant 1",
              Size: 0 as any,
              price: {
                amount: "100",
                currencyCode: "USD",
              },
            },
          ],
        },
        "Size"
      )
    ).toBe(true);
    expect(hasVariant(product, "Style")).toBe(false);
    expect(hasVariant(product, "Material")).toBe(false);
    expect(hasVariant({ ...product, variants: null as any }, "Color")).toBe(
      false
    );
    expect(hasVariant({ ...product, variants: null as any }, "Size")).toBe(
      false
    );
    expect(hasVariant({ ...product, variants: null as any }, "Style")).toBe(
      false
    );
    expect(hasVariant({ ...product, variants: null as any }, "Material")).toBe(
      false
    );
  });
});

describe("isNumber", () => {
  test.each([
    [0, true],
    [10, true],
    [3.14, true],
    [NaN, false],
    [Infinity, false],
    [-Infinity, false],
    ["hello", false],
    [true, false],
    [false, false],
    [undefined, false],
    [null, false],
    [{}, false],
    [[], false],
    [() => {}, false],
    [BigInt(10), true],
    ["10", false],
  ])(
    "given %p, should return %p if the value is a number",
    (value, expected) => {
      expect(isNumber(value)).toBe(expected);
    }
  );
});

describe("toInt", () => {
  test.each([
    ["10", 10],
    ["100", 100],
    ["hello", undefined],
    ["3.14", 3],
    ["", undefined],
    [0, 0],
    [10, 10],
    ["0", 0],
    ["0.5", 0],
    [NaN, undefined],
    [Infinity, undefined],
    [-Infinity, undefined],
    [null, undefined],
    [BigInt(10), 10],
    ["0xedcba9876543210", 0], // behaves like parseInt
    [0xedcba9876543210, 1070935975390360000], // behaves like parseInt
    ["45.3sadfsfsasfasbss", 45], // behaves like parseInt
    ["-45.3sadfsfsasfasbss", -45], // behaves like parseInt
    ["-45.3", -45],
    ["dsf4", undefined], // behaves like parseInt
  ])(
    "should convert %p to a an integer if it's valid, undefined otherwise",
    (value, expected) => {
      expect(toInt(value as any)).toBe(expected);
    }
  );
});

describe("toFloat", () => {
  test.each([
    ["3.14", 3.14],
    ["2.718", 2.718],
    ["hello", undefined],
    ["10", 10.0],
    ["", undefined],
    [0, 0],
    [10.43, 10.43],
    ["0", 0],
    ["0.0", 0],
    ["0.5", 0.5],
    [NaN, undefined],
    [Infinity, undefined],
    [-Infinity, undefined],
    [null, undefined],
    [BigInt(10), 10.0],
    ["0xedcba9876543210", 0], // behaves like parseFloat
    [0xedcba9876543210, 1070935975390360000], // behaves like parseFloat
    ["45.3sadfsfsasfasbss", 45.3], // behaves like parseFloat
    ["-45.3sadfsfsasfasbss", -45.3], // behaves like parseFloat
    ["-45.3", -45.3],
    ["dsf4", undefined], // behaves like parseFloat
  ])(
    "should convert %p to a float if it's valid, undefined otherwise",
    (value, expected) => {
      expect(toFloat(value as any)).toBe(expected);
    }
  );
});
