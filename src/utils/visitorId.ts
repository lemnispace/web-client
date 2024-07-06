import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

const VISITOR_ID_COOKIE = "visitor_id";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 1 week

export function getOrCreateVisitorId(): string {
  const cookieStore = cookies();
  let visitorId = cookieStore.get(VISITOR_ID_COOKIE)?.value;

  if (!visitorId) {
    visitorId = uuidv4();
    cookieStore.set(VISITOR_ID_COOKIE, visitorId, {
      maxAge: COOKIE_MAX_AGE,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  }

  return visitorId;
}

export function getVisitorId(): string | undefined {
  const cookieStore = cookies();
  return cookieStore.get(VISITOR_ID_COOKIE)?.value;
}
