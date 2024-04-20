export const PRODUCTS_MAIN_MESSAGE_SECTION_TEXT = {
  title: "Browse Our Collections",
  shortDescription: "Browse our collections of customizable products",
  description:
    "Explore our collections of customizable products. Our unique service allows users to create custom text mosaics with more great products coming soon.",
} as const;

export const PRODUCTS_CREATE_MESSAGE_SECTION_TEXT = {
  title: "Make It Yours",
  shortDescription: "Customizable products",
  description:
    "The best way to buy the products you love is to personalize them.",
} as const;

export const PRODUCT_DETAIL_SECTION_TEXT = {
  grid: {
    title: "Products",
  },
} as const;

export const PRODUCT_SECTION_TEXT = {
  title: "Product Information",
  shortDescription: "Product information",
  description: "Product information",
} as const;

export const PRODUCT_RATING_TEXT = {
  title: "Reviews",
  getShortDescription(
    rating: number,
    total: number
  ): `${number} out of ${number} stars` {
    return `${rating} out of ${total} stars`;
  },
} as const;

export const PRODUCT_COLOR_PICKER_TEXT = {
  title: "Color",
  shortDescription: "Choose a color",
  description: "Choose a color",
} as const;

export const PRODUCT_SIZE_PICKER_TEXT = {
  title: "Size",
  shortDescription: "Choose a size",
  description: "Choose a size",
} as const;
