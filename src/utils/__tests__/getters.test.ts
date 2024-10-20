/**
 * @jest-environment node
 */

import { ShopifyProductService } from "@/lib/shopify/services/ShopifyProductService";
import { CurrencyCode } from "@/lib/shopify/types/shopifyCurrencyCodes";
import {
  getErrorMessage,
  getObjFirstValue,
  getuserErrorsFromResponseData,
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
        currencyCode: CurrencyCode.USD,
      },
    },
    {
      id: "2",
      title: "Variant 2",
      Color: "Blue",
      Size: "Medium",
      price: {
        amount: "150",
        currencyCode: CurrencyCode.USD,
      },
    },
    {
      id: "3",
      title: "Variant 3",
      Color: "Green",
      Size: "Large",
      price: {
        amount: "200",
        currencyCode: CurrencyCode.USD,
      },
    },
  ],
} satisfies Product;

describe("getVariantById", () => {
  it("should return the variant object with the specified ID", () => {
    const id = "2";
    const result = ShopifyProductService.getVariantById(product, id);
    expect(result).toEqual(product.variants[1]);
  });

  it("should return undefined if the variant with the specified ID is not found", () => {
    const id = "4";
    const result = ShopifyProductService.getVariantById(product, id);
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
      const result = ShopifyProductService.getVariantByValues(
        product,
        variantOptions
      );
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
      const result = ShopifyProductService.getDimensionsFromVariant(
        variant as any
      );
      expect(result).toEqual(expected);
    }
  );
});

describe("getErrorMessage", () => {
  it("should return the error message for an Error instance", async () => {
    const error = new Error("Something went wrong");
    const message = await getErrorMessage(error);
    expect(message).toBe("Something went wrong");
  });

  it("should return the default message for an Error instance with no message", async () => {
    const error = new Error();
    const message = await getErrorMessage(error, "Default error message");
    expect(message).toBe("Default error message");
  });

  it("should return the error message for a string error", async () => {
    const error = "Invalid input";
    const message = await getErrorMessage(error);
    expect(message).toBe("Invalid input");
  });

  it("should return the status error message for a Response error", async () => {
    const error = new Response(null, { status: 400 });
    const message = await getErrorMessage(error);
    expect(message).toBe("Bad Request");
  });

  it("should return the error message from response data for a Response error", async () => {
    let error = new Response(JSON.stringify({ message: "Validation failed" }), {
      status: 400,
    });
    let message = await getErrorMessage(error);
    expect(message).toBe("Validation failed");
    error = new Response(
      JSON.stringify({ error: { message: "nested error" } }),
      { status: 400 }
    );
    message = await getErrorMessage(error);
    expect(message).toBe("nested error");
  });
  it("should return the error message from response data with an 'error' property", async () => {
    const error = new Response(JSON.stringify({ error: "API error" }), {
      status: 400,
    });
    const message = await getErrorMessage(error);
    expect(message).toBe("API error");
  });
  it("should return the status error message for a 401 Unauthorized response", async () => {
    const error = new Response(null, { status: 401 });

    const message = await getErrorMessage(error);

    expect(message).toBe("Unauthorized");
  });

  it("should return the status error message for a 403 Forbidden response", async () => {
    const error = new Response(null, { status: 403 });

    const message = await getErrorMessage(error);

    expect(message).toBe("Forbidden");
  });

  it("should return the status error message for a 404 Not Found response", async () => {
    const error = new Response(null, { status: 404 });

    const message = await getErrorMessage(error);

    expect(message).toBe("Not Found");
  });

  it("should return the status error message for a 500 Internal Server Error response", async () => {
    const error = new Response(null, { status: 500 });

    const message = await getErrorMessage(error);

    expect(message).toBe("Internal Server Error");
  });

  it("should return the default message for an unknown status code", async () => {
    const error = new Response(null, { status: 418 });

    const message = await getErrorMessage(error, "Unknown error");

    expect(message).toBe("Unknown error");
  });
  it("should return the status error message for a Response error with invalid JSON data", async () => {
    const error = new Response(`{"message": 'test invalid json"}`, {
      status: 500,
    });
    const message = await getErrorMessage(error, "Default error message");
    expect(message).toBe("Internal Server Error");
  });
  it("should return the error text for a response error with non-JSON error text", async () => {
    const error = new Response("Server error", { status: 500 });
    const message = await getErrorMessage(error);
    expect(message).toBe("Server error");
  });
  it('should return the error message for an object with a "message" property', async () => {
    const error = { message: "Access denied" };
    const message = await getErrorMessage(error);
    expect(message).toBe("Access denied");
  });

  it('should return the error message for an object with an "error" property', async () => {
    const error = { error: "Not found" };
    const message = await getErrorMessage(error);
    expect(message).toBe("Not found");
  });
  it("should prioritize the 'message' property over the 'error' property in response data", async () => {
    const error = new Response(
      JSON.stringify({ message: "Validation error", error: "Invalid input" }),
      { status: 400 }
    );
    const message = await getErrorMessage(error);
    expect(message).toBe("Validation error");
  });
  it("should prioritize the 'message' property over the 'error' property in an object error", async () => {
    const error = { message: "Validation error", error: "Invalid input" };
    const message = await getErrorMessage(error);
    expect(message).toBe("Validation error");
  });
  it('should return the combined error messages for an object with an "errors" array', async () => {
    const error = {
      errors: [
        "Field is required",
        { message: "Invalid format" },
        { code: "ERR001" }, // ignored since it's not a string or an object with a "message" or "error" property
        { error: "ERR002" },
        { error: "[object Object]" }, // ignored since it's not considered an appropriate string value
      ],
    };
    const message = await getErrorMessage(error);
    expect(message).toBe("Field is required; Invalid format; ERR002");
  });

  it("should return the stringified error for an unknown object structure", async () => {
    const error = { statusCode: 500, details: "Internal server error" };
    const message = await getErrorMessage(error);
    expect(message).toBe(
      '{"statusCode":500,"details":"Internal server error"}'
    );
  });

  it("should return the default message for an unknown error type", async () => {
    for (const error of [null, undefined, {}, 0]) {
      const message = await getErrorMessage(error, "An unknown error occurred");
      expect(message).toBe("An unknown error occurred");
    }
  });
  it("should never throw an error", async () => {
    const errorCases = [
      undefined,
      null,
      {},
      { message: "Custom error" },
      { error: "Another custom error" },
      { errors: ["Error 1", "Error 2"] },
      { status: 400 },
      new Error("Test error"),
      "String error",
      new Response(null, { status: 500 }),
      new Response(`{"invalid": json}`, { status: 500 }),
      new Response(JSON.stringify({ message: "API error" }), { status: 400 }),
    ];
    for (const error of errorCases) {
      expect(async () => {
        const message = await getErrorMessage(error);
        expect(message).toBeTruthy();
      }).not.toThrow();
    }
  });
});

test("getFirstEntry", () => {
  expect(getObjFirstValue({ a: 1, b: 2, c: 3 })).toEqual(1);
  expect(getObjFirstValue({})).toBeUndefined();
  expect(getObjFirstValue(null!)).toBeUndefined();
  expect(getObjFirstValue(123 as any)).toBeUndefined();
  expect(getObjFirstValue("four" as any)).toBeUndefined();
  expect(getObjFirstValue([1, 2, 3] as any)).toBeUndefined();
  expect(
    getObjFirstValue({
      productVariantUpdate: {
        product: { id: "12" },
        userErrors: [{ field: "title", message: "Title is required" }],
      },
    })
  ).toEqual({
    product: { id: "12" },
    userErrors: [{ field: "title", message: "Title is required" }],
  });
});

test("getuserErrorsFromResponseData", () => {
  expect(getuserErrorsFromResponseData(null!)).toBeUndefined();
  expect(getuserErrorsFromResponseData({})).toBeUndefined();
  expect(getuserErrorsFromResponseData({ userErrors: [] })).toEqual([]);
  expect(
    getuserErrorsFromResponseData({
      userErrors: [{ field: "title", message: "Title is required" }],
    })
  ).toEqual([{ field: "title", message: "Title is required" }]);
  expect(
    getuserErrorsFromResponseData({
      productVariantUpdate: {
        userErrors: [{ field: "title", message: "Title is required" }],
      },
    })
  ).toEqual([{ field: "title", message: "Title is required" }]);
  expect(
    getuserErrorsFromResponseData({
      productVariantUpdate: {
        something: [{ field: "title", message: "Title is required" }],
      },
    })
  ).toBeUndefined();
  expect(
    getuserErrorsFromResponseData({
      productVariantUpdate: ["one"],
    })
  ).toBeUndefined();
});
