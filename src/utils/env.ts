type EnvVariableName =
  | "TEXT_MOSAIC_API_URL"
  | "SHOP_API_URL"
  | "NODE_ENV";

type OptionalEnvVariableName =
  | "SHOP_API_KEY"
  | "LEMNISPACE_MOCKUP_GEN_API_URL"
  | "LEMNISPACE_MOCKUP_GEN_KEY"
  | "LEMNISPACE_PRODUCTS_API_TOKEN"
  | "LEMNISPACE_STORE_DOMAIN"
  | "LEMNISPACE_PRODUCTS_ADMIN_API_TOKEN"
  | "LEMNISPACE_PRODUCTS_API_KEY"
  | "LEMNISPACE_PRODUCTS_API_SECRET_KEY"
  | "LEMNISPACE_HOST_NAME"
  | "LEMNISPACE_SHOP_NAME";

const getEnvVariable = (name: EnvVariableName): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
};

const getOptionalEnvVariable = (name: OptionalEnvVariableName): string | undefined => {
  return process.env[name];
};

export const env = {
  TEXT_MOSAIC_API_URL: getEnvVariable("TEXT_MOSAIC_API_URL"),
  LEMNISPACE_MOCKUP_GEN_API_URL: getOptionalEnvVariable(
    "LEMNISPACE_MOCKUP_GEN_API_URL"
  ),
  LEMNISPACE_MOCKUP_GEN_KEY: getOptionalEnvVariable("LEMNISPACE_MOCKUP_GEN_KEY"),
  LEMNISPACE_PRODUCTS_API_TOKEN: getOptionalEnvVariable(
    "LEMNISPACE_PRODUCTS_API_TOKEN"
  ),
  LEMNISPACE_STORE_DOMAIN: getOptionalEnvVariable("LEMNISPACE_STORE_DOMAIN"),
  LEMNISPACE_PRODUCTS_ADMIN_API_TOKEN: getOptionalEnvVariable(
    "LEMNISPACE_PRODUCTS_ADMIN_API_TOKEN"
  ),
  LEMNISPACE_PRODUCTS_API_KEY: getOptionalEnvVariable("LEMNISPACE_PRODUCTS_API_KEY"),
  LEMNISPACE_PRODUCTS_API_SECRET_KEY: getOptionalEnvVariable(
    "LEMNISPACE_PRODUCTS_API_SECRET_KEY"
  ),
  LEMNISPACE_HOST_NAME: getOptionalEnvVariable("LEMNISPACE_HOST_NAME"),
  LEMNISPACE_SHOP_NAME: getOptionalEnvVariable("LEMNISPACE_SHOP_NAME"),
  SHOP_API_URL: getEnvVariable("SHOP_API_URL"),
  SHOP_API_KEY: getOptionalEnvVariable("SHOP_API_KEY"),
  NODE_ENV: getEnvVariable("NODE_ENV"),
  get LEMNISPACE_HOST_SCHEME() {
    return this.NODE_ENV === "development" ? "http" : "https";
  },
} as const;
