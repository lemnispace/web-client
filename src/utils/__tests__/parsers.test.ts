/**
 * @jest-environment node
 */

import {
  parseApiResponse,
  parseClientResponse,
  toFloat,
  toInt,
} from "../parsers";

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

describe("parseApiResponse", () => {
  test("should get the get the correct error message if the response errors contain a GraphQL error message", async () => {
    const response = {
      data: undefined,
      status: 500,
      errors: {
        body: {
          errors: {
            networkStatusCode: 200,
            message:
              "GraphQL Client: An error occurred while fetching from the API. Review 'graphQLErrors' for details.",
            graphQLErrors: [
              {
                message: "Field 'product' doesn't exist on type 'Mutation'",
                locations: [{ line: 0, column: 0 }],
                path: [],
                extensions: {},
              },
              {
                message:
                  "Field 'productVariant' doesn't exist on type 'Mutation'",
                locations: [{ line: 0, column: 0 }],
                path: [],
                extensions: {},
              },
              {
                message: "Field 'userErrors' doesn't exist on type 'Mutation'",
                locations: [{ line: 0, column: 0 }],
                path: [],
                extensions: {},
              },
              {
                message:
                  "Variable $input is declared by UpdateProductVariant but not used",
                locations: [{ line: 0, column: 0 }],
                path: [],
                extensions: {},
              },
            ],
            response: {
              size: 0,
              timeout: 0,
            },
          },
        },
        headers: {
          "Alt-Svc": ["..."],
          "Cf-Cache-Status": ["..."],
          "Cf-Ray": ["..."],
          Connection: ["..."],
          "Content-Encoding": ["..."],
          // ...
        },
        response: {
          size: 0,
          timeout: 0,
        },
        message: "Field 'product' doesn't exist on type 'Mutation'",
        stack: "Error: Field 'product' doesn't exist on type 'Mutation'...",
      },
    } as const;
    const defaultErrorMessage = "test message";
    const parsedResponse = await parseApiResponse(
      response,
      defaultErrorMessage
    );
    expect(parsedResponse).toEqual({
      status: 500,
      errors: "Field 'product' doesn't exist on type 'Mutation'",
    });
    const parsedResponse2 = await parseApiResponse(
      { data: undefined, status: 400, errors: undefined },
      defaultErrorMessage
    );
    expect(parsedResponse2).toEqual({
      status: 400,
      errors: "test message",
    });
  });

  test("should return the response data if it exists", async () => {
    const defaultErrorMessage = "An error occurred";
    const parsedResponse = await parseApiResponse(
      { data: { id: "123" }, status: 200 },
      defaultErrorMessage
    );
    expect(parsedResponse).toEqual({ data: { id: "123" }, status: 200 });
  });
});

describe("parseClientResponse", () => {
  it("should throw an error if the response data is undefined", () => {
    const response = {
      data: undefined,
      errors: { graphQLErrors: [{ message: "Field is required" }] },
    };
    expect(() =>
      parseClientResponse(response, "default error message")
    ).toThrow("Field is required");
    expect(() =>
      parseClientResponse(
        {
          data: undefined,
          errors: { message: "test message" },
        },
        "defaultErrorMessage"
      )
    ).toThrow("test message");
    expect(() =>
      parseClientResponse(
        {
          data: undefined,
          errors: { message: undefined },
        },
        "defaultErrorMessage"
      )
    ).toThrow("defaultErrorMessage");
  });
  it("should return the response data if it exists", () => {
    const response = {
      data: { id: "123" },
      errors: { graphQLErrors: [{ message: "Field is required" }] },
    };
    expect(parseClientResponse(response, "default error message")).toBe(
      response.data
    );
  });
  it("should throw an error if the response data has user errors", () => {
    const response = {
      data: {
        productVariantUpdate: {
          product: { id: "123" },
          productVariant: { id: "456" },
          userErrors: [
            { field: ["field", "4", "value"], message: "test user error" },
          ],
        },
      },
      errors: undefined,
    };
    expect(() =>
      parseClientResponse(response, "default error message")
    ).toThrow("test user error");
  });
});
