import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

interface ResponseCookie {
  maxAge: number;
}

/**
 * Creates a cookie with the specified key and options.
 * If a `getValue` function is provided, it will be used to generate the cookie value.
 * Otherwise, a random UUID will be used as the value.
 *
 * @param key - The key of the cookie.
 * @param options - The options for the cookie.
 * @param getValue - An optional function to generate the cookie value.
 * @returns The value of the created cookie.
 */
export const createCookie = (
  key: string,
  options: ResponseCookie,
  getValue?: () => string
) => {
  const cookieStore = cookies();
  const value = getValue ? getValue() : uuidv4();
  cookieStore.set(key, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    ...options,
  });
  return value;
};

/**
 * Retrieves an existing cookie value or creates a new cookie with the specified key and options.
 * If a value getter function is provided, it will be used to generate the value for the new cookie.
 * @param key - The key of the cookie.
 * @param options - The options for the new cookie.
 * @param getValue - An optional function that returns the value for the new cookie.
 * @returns The value of the existing cookie or the newly created cookie.
 */
export const getOrCreateCookie = (
  key: string,
  options: ResponseCookie,
  getValue?: () => string
): string => getCookie(key) ?? createCookie(key, options, getValue);

/**
 * Retrieves the value of a cookie by its key.
 * @param key - The key of the cookie to retrieve.
 * @returns The value of the cookie, or undefined if the cookie does not exist.
 */
export const getCookie = (key: string): string | undefined => {
  const cookieStore = cookies();
  return cookieStore.get(key)?.value;
};
