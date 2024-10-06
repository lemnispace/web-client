import { ClientResponse } from "@shopify/storefront-api-client";
import { SafeParseReturnType } from "zod";
import {
  getArrayErrorMessage,
  getErrorMessage,
  getuserErrorsFromResponseData,
} from "./getters";
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

const parseUserErrorsFromClientResponse = (response: ClientResponse) => {
  const userErrors = getuserErrorsFromResponseData(response?.data);
  if (userErrors) {
    return getArrayErrorMessage(userErrors);
  }
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
  const userErrors = parseUserErrorsFromClientResponse(response);
  if (userErrors) {
    throw new Error(userErrors);
  }
  return response.data;
};

export const tryParseClientResponse = <T>(
  response?: ClientResponse<T>
): T | undefined => {
  try {
    return response && parseClientResponse(response, "");
  } catch {
    return undefined;
  }
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
    status: response.status as 200 | 201 | 204,
    data: response.data as DATA,
  };
};

export const parseFetchResponse = async <T>(
  response: Response,
  defaultMessage: string
): Promise<NonNullable<T>> => {
  if (!response.ok) {
    const errorMessage = await getErrorMessage(response, defaultMessage);
    throw new Error(errorMessage);
  }
  return await response.json();
};

export const parseValidationErrors = <Input, Output>(
  validatedValues: SafeParseReturnType<Input, Output>
) => {
  if (!validatedValues.success) {
    const errors = validatedValues.error.errors;
    return errors.map(({ code, message }) => ({ code, message }));
  }
  return undefined;
};
