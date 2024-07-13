import { SEVEN_DAYS_COOKIE_MAX_AGE } from "../constants";
import { createCookie, getCookie } from "./cookie";

const CART_ID_COOKIE = "visitor_id";

export const createCartIdCookie = (cartId: string): string => {
  return createCookie(
    CART_ID_COOKIE,
    { maxAge: SEVEN_DAYS_COOKIE_MAX_AGE },
    () => cartId
  );
};

export const getCartId = (): string | undefined => getCookie(CART_ID_COOKIE);
