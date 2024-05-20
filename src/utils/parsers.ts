import { ClientResponse } from "@shopify/storefront-api-client";
import { getArrayErrorMessage, getErrorMessage } from "./getters";
import { ApiResponse, ServerParsedApiResponse } from "./types";
import { isErrorResponse, isNumber } from "./validators";

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
    const errorMessage =
      getArrayErrorMessage(response.errors?.graphQLErrors) ||
      response.errors?.message;
    throw new Error(errorMessage || defaultErrorMessage);
  }
  return response.data;
};

export const parseApiResponse = async <
  DATA,
  SERVER_ERRORS = unknown,
  VALIDATION_ERRORS = unknown,
>(
  response: ApiResponse<VALIDATION_ERRORS, SERVER_ERRORS, DATA>,
  defaultMessage: string
): Promise<ServerParsedApiResponse<DATA>> => {
  if (isErrorResponse(response)) {
    // Handle validation errors
    const errorMessage = await getErrorMessage(response.errors, defaultMessage);
    return {
      status: response.status,
      errors: errorMessage,
    };
  }
  return {
    status: response.status,
    data: response.data,
  };
};
