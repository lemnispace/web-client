/**
 *********************************
 ***** GLOBAL TEXT CONSTANTS *****
 *********************************
 */

export const GLOBAL_APP_TEXT = {
  name: "LemniSpace",
} as const;
// *** Button Text ***
export const BUTTON_TEXT = {
  goBackHome: "Go Back Home",
  cta: "Start Crafting Now",
  heroCta: "Craft Your Personal Masterpiece",
} as const;

// *** Navigation Text ***
export const NAVIGATION_TEXT = {
  home: "Home",
  mosaics: "Mosaics",
  comingSoon: "Coming Soon",
} as const;

// *** 404 Not Found Text ***
export const ERROR_TEXTS = {
  notFound: {
    title: "Page Not Found",
    code: "404",
    description: "Sorry, we couldn’t find the page you’re looking for.",
    shortDescription: "Page not found",
  },
} as const;

/**
 *********************************
 ***** LANDING PAGE CONSTANTS ****
 *********************************
 */

// *** Layout Text ***
export const LAYOUT_TEXT = {
  name: GLOBAL_APP_TEXT.name,
  title: "Customizable E-commerce Platform",
  shortDescription: "Customizable E-commerce Platform",
  description: `Explore ${GLOBAL_APP_TEXT.name}, the innovative e-commerce platform specializing in personalized products. Our unique service allows users to create custom text mosaics and other tailor-made items, offering an interactive and creative shopping experience. Ideal for those seeking one-of-a-kind gifts or personal keepsakes.`,
} as const;

// *** Call To Action Text ***
export const CTA_TEXT = {
  title: "Begin Your Creative Journey",
  shortDescription: "Begin Your Creative Journey",
  description: `Embark on a path of personal expression with ${GLOBAL_APP_TEXT.name}. Unleash your creativity and transform your vision into bespoke art pieces that tell your unique story.`,
} as const;

// *** Coming Soon Text ***
export const COMING_SOON_TEXT = {
  title: "More Great Products Coming Soon",
  shortDescription: "More products coming soon",
  description:
    "We are working hard to bring you more great products. Please check back soon.",
} as const;

// *** Hero Text ***
export const HERO_TEXT = {
  // break up title into array of strings to allow for styling
  title: ["Crafting", "your visions", "into artistic treasures"],
  shortDescription: "Crafting your visions into artistic treasures",
  description:
    "Every product is a canvas for your imagination, transforming your ideas into art that celebrates your individuality.",
} as const;
