import { SEVEN_DAYS_COOKIE_MAX_AGE } from "../constants";
import { createCookie, deleteCookie, getCookie } from "./cookie";

const CART_ID_COOKIE = "cart_id";

export const createCartId = (cartId: string): string => {
  return createCookie(
    CART_ID_COOKIE,
    { maxAge: SEVEN_DAYS_COOKIE_MAX_AGE },
    () => cartId
  );
};

export const getCartId = (): string | undefined => getCookie(CART_ID_COOKIE);

export const deleteCartId = (): void => deleteCookie(CART_ID_COOKIE);
