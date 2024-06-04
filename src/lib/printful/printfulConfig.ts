import { env } from "@/utils/env";

const printfulConfig = Object.freeze({
  apiUrl: env.LEMNISPACE_MOCKUP_GEN_API_URL,
  authToken: env.LEMNISPACE_MOCKUP_GEN_KEY,
});

export type PrintfulConfig = typeof printfulConfig;
export default printfulConfig;
