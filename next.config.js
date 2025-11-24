/** @type {import('next').NextConfig} */
const nextConfig = {
  // Updated for shop-api migration - removed Shopify domains
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tailwindui.com",
        port: "",
        pathname: "/img/*/**",
      },
      {
        protocol: "https",
        hostname: "files.cdn.printful.com",
        port: "",
        pathname: "/*/**",
      },
      {
        protocol: "https",
        hostname: "lemnispace-images.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "cdn.lemnispace.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000",
        pathname: "/user-product-files/**",
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  webpack: (config) => {
    config.externals = [...config.externals, "canvas", "jsdom"];
    return config;
  },
};

module.exports = nextConfig;
