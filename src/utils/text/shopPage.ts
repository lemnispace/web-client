export const PRODUCTS_MAIN_MESSAGE_SECTION_TEXT = {
  title: "Discover Your Perfect Canvas",
  shortDescription: "Explore our customizable collections",
  description:
    "Dive into a world of endless possibilities. From text mosaics to upcoming surprises, find the perfect backdrop for your creativity.",
} as const;

export const PRODUCTS_CREATE_MESSAGE_SECTION_TEXT = {
  title: ["Your Vision,", "Our Canvas"],
  shortDescription: "Personalization at its finest",
  description:
    "Why settle for ordinary when you can own extraordinary? Make each product uniquely yours.",
} as const;

export const PRODUCT_DETAIL_SECTION_TEXT = {
  grid: {
    title: "Your Creative Playground",
  },
} as const;

export const PRODUCT_SECTION_TEXT = {
  title: "The Nitty-Gritty",
  shortDescription: "All about your soon-to-be favorite item",
  description: "Everything you need to know about this creative canvas",
} as const;

export const PRODUCT_RATING_TEXT = {
  title: "What Artists Like You Say",
  getShortDescription(
    rating: number,
    total: number
  ): `${number} out of ${number} stars` {
    return `${rating} out of ${total} stars`;
  },
} as const;

export const PRODUCT_COLOR_PICKER_TEXT = {
  title: "Pick Your Palette",
  shortDescription: "Choose your perfect hue",
  description: "Select the color that speaks to you",
} as const;

export const PRODUCT_SIZE_PICKER_TEXT = {
  title: "Size It Up",
  shortDescription: "Find your perfect fit",
  description: "Choose the size that suits your style",
} as const;
