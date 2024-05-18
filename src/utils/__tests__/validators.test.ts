import { getMockProduct } from "../test_utils";
import { Product } from "../types";
import {
  hasVariant,
  isDefined,
  isEmptyObject,
  isNumber,
  isObject,
  isString,
  isStringEmpty,
  isStringJSONLike,
  isValidJSON,
  toFloat,
  toInt,
} from "../validators";

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

describe("isString", () => {
  it("should return true for string values", () => {
    expect(isString("hello")).toBe(true);
    expect(isString("")).toBe(true);
    expect(isString("[object ]")).toBe(true);
  });

  it("should return false for non-string values", () => {
    expect(isString(123)).toBe(false);
    expect(isString(true)).toBe(false);
    expect(isString(null)).toBe(false);
    expect(isString(undefined)).toBe(false);
    expect(isString({})).toBe(false);
    expect(isString([])).toBe(false);
    expect(isString(`${{ something: "blue" }}`)).toBe(false);
    expect(isString("[object Object]")).toBe(false);
  });
});

describe("isStringJSONLike", () => {
  it("should return true for JSON-like strings", () => {
    expect(isStringJSONLike("{}")).toBe(true);
    expect(isStringJSONLike('{"key": "value"}')).toBe(true);
    expect(isStringJSONLike('{"key": \'value"}')).toBe(true);
  });

  it("should return false for non-JSON-like strings", () => {
    expect(isStringJSONLike("")).toBe(false);
    expect(isStringJSONLike("hello")).toBe(false);
    expect(isStringJSONLike("{")).toBe(false);
    expect(isStringJSONLike("}")).toBe(false);
  });

  it("should return false for non-string values", () => {
    expect(isStringJSONLike(123)).toBe(false);
    expect(isStringJSONLike(true)).toBe(false);
    expect(isStringJSONLike(null)).toBe(false);
    expect(isStringJSONLike(undefined)).toBe(false);
    expect(isStringJSONLike({})).toBe(false);
    expect(isStringJSONLike([])).toBe(false);
  });
});

describe("isObject", () => {
  it("should return true for object values", () => {
    expect(isObject({})).toBe(true);
    expect(isObject({ key: "value" })).toBe(true);
  });

  it("should return false for non-object values", () => {
    expect(isObject(123)).toBe(false);
    expect(isObject("hello")).toBe(false);
    expect(isObject(true)).toBe(false);
    expect(isObject(null)).toBe(false);
    expect(isObject(undefined)).toBe(false);
    expect(isObject([])).toBe(false);
  });
});

describe("isValidJSON", () => {
  it("should return true for valid JSON strings", () => {
    expect(isValidJSON("{}")).toBe(true);
    expect(isValidJSON('{"key": "value"}')).toBe(true);
    expect(isValidJSON("[]")).toBe(true);
    expect(isValidJSON('["item1", "item2"]')).toBe(true);
  });

  it("should return false for invalid JSON strings", () => {
    expect(isValidJSON("")).toBe(false);
    expect(isValidJSON("hello")).toBe(false);
    expect(isValidJSON("{")).toBe(false);
    expect(isValidJSON("}")).toBe(false);
    expect(isValidJSON('{"key": value}')).toBe(false);
  });
});

describe("isStringEmpty", () => {
  it("should return true for empty strings", () => {
    expect(isStringEmpty("")).toBe(true);
    expect(isStringEmpty("   ")).toBe(true);
  });

  it("should return false for non-empty strings", () => {
    expect(isStringEmpty("hello")).toBe(false);
    expect(isStringEmpty(" hello ")).toBe(false);
  });
});

describe("isEmptyObject", () => {
  it("should return true for empty objects", () => {
    expect(isEmptyObject({})).toBe(true);
  });

  it("should return false for non-empty objects", () => {
    expect(isEmptyObject({ key: "value" })).toBe(false);
  });

  it("should return false for non-object values", () => {
    expect(isEmptyObject(123)).toBe(false);
    expect(isEmptyObject("hello")).toBe(false);
    expect(isEmptyObject(true)).toBe(false);
    expect(isEmptyObject(null)).toBe(false);
    expect(isEmptyObject(undefined)).toBe(false);
    expect(isEmptyObject([])).toBe(false);
  });
});
