import { SEVEN_DAYS_COOKIE_MAX_AGE } from "../constants";
import { getCookie, getOrCreateCookie } from "./cookie";

const VISITOR_ID_COOKIE = "visitor_id";

export const getOrCreateVisitorId = (): string =>
  getOrCreateCookie(VISITOR_ID_COOKIE, { maxAge: SEVEN_DAYS_COOKIE_MAX_AGE });

export const getVisitorId = (): string | undefined =>
  getCookie(VISITOR_ID_COOKIE);
