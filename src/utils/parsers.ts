import { ClientResponse } from "@shopify/storefront-api-client";
import { isNumber } from "./validators";

/**
 * Converts a string value to an integer.
 *
 * @param value - The string value to convert.
 * @returns The converted integer value, or `undefined` if the input is not a valid number.
 */
export const toInt = (value: string | undefined): number | undefined => {
  if (!value && typeof value !== "number") {
    return undefined;
  }
  const int = parseInt(value, 10);
  return isNumber(int) ? int : undefined;
};

/**
 * Converts a string value to a float.
 *
 * @param value - The string value to convert.
 * @returns The converted float value, or `undefined` if the input is not a valid number.
 */
export const toFloat = (value: string | undefined): number | undefined => {
  if (!value && typeof value !== "number") {
    return undefined;
  }
  const float = parseFloat(value);
  return isNumber(float) ? float : undefined;
};

export const parseClientResponse = <T>(
  response: ClientResponse<T>,
  defaultErrorMessage: string
): NonNullable<T> => {
  if (!response.data) {
    const errorMessage = response.errors?.message;
    throw new Error(errorMessage || defaultErrorMessage);
  }
  return response.data;
};
