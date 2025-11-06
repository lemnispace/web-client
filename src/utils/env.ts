type EnvVariableName =
  | "SHOP_API_URL"
  | "TEXT_MOSAIC_API_URL"
  | "SHOP_API_KEY"
  | "LEMNISPACE_MOCKUP_GEN_API_URL"
  | "LEMNISPACE_MOCKUP_GEN_KEY"
  | "LEMNISPACE_PRODUCTS_API_TOKEN"
  | "LEMNISPACE_STORE_DOMAIN"
  | "LEMNISPACE_PRODUCTS_ADMIN_API_TOKEN"
  | "LEMNISPACE_PRODUCTS_API_KEY"
  | "LEMNISPACE_PRODUCTS_API_SECRET_KEY"
  | "LEMNISPACE_HOST_NAME"
  | "LEMNISPACE_SHOP_NAME"
  | "NODE_ENV";

const getOptionalEnvVariable = (name: EnvVariableName): string | undefined => {
  return process.env[name];
};

// Use lazy getters to avoid accessing process.env at module load time
// This prevents hydration errors when the env object is imported in client components
export const env = {
  get TEXT_MOSAIC_API_URL() {
    return getOptionalEnvVariable("TEXT_MOSAIC_API_URL");
  },
  get LEMNISPACE_MOCKUP_GEN_API_URL() {
    return getOptionalEnvVariable("LEMNISPACE_MOCKUP_GEN_API_URL");
  },
  get LEMNISPACE_MOCKUP_GEN_KEY() {
    return getOptionalEnvVariable("LEMNISPACE_MOCKUP_GEN_KEY");
  },
  get LEMNISPACE_PRODUCTS_API_TOKEN() {
    return getOptionalEnvVariable("LEMNISPACE_PRODUCTS_API_TOKEN");
  },
  get LEMNISPACE_STORE_DOMAIN() {
    return getOptionalEnvVariable("LEMNISPACE_STORE_DOMAIN");
  },
  get LEMNISPACE_PRODUCTS_ADMIN_API_TOKEN() {
    return getOptionalEnvVariable("LEMNISPACE_PRODUCTS_ADMIN_API_TOKEN");
  },
  get LEMNISPACE_PRODUCTS_API_KEY() {
    return getOptionalEnvVariable("LEMNISPACE_PRODUCTS_API_KEY");
  },
  get LEMNISPACE_PRODUCTS_API_SECRET_KEY() {
    return getOptionalEnvVariable("LEMNISPACE_PRODUCTS_API_SECRET_KEY");
  },
  get LEMNISPACE_HOST_NAME() {
    return getOptionalEnvVariable("LEMNISPACE_HOST_NAME");
  },
  get LEMNISPACE_SHOP_NAME() {
    return getOptionalEnvVariable("LEMNISPACE_SHOP_NAME");
  },
  get SHOP_API_URL() {
    return getOptionalEnvVariable("SHOP_API_URL");
  },
  get SHOP_API_KEY() {
    return getOptionalEnvVariable("SHOP_API_KEY");
  },
  get NODE_ENV() {
    return getOptionalEnvVariable("NODE_ENV") || "development";
  },
  get LEMNISPACE_HOST_SCHEME() {
    return this.NODE_ENV === "development" ? "http" : "https";
  },
} as const;
