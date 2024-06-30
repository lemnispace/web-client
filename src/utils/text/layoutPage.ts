import { GLOBAL_APP_TEXT } from "./global";

export const LAYOUT_TEXT = {
  root: {
    name: GLOBAL_APP_TEXT.name,
    title: "Where Creativity Meets Commerce",
    shortDescription: "Your Personal E-Commerce Canvas",
    description: `Welcome to ${GLOBAL_APP_TEXT.name}, where shopping becomes an art form. Create custom text mosaics and unique products that speak to your soul. Perfect for gifting or treating yourself to something truly special.`,
  },
  shop: {
    name: "Shop",
    description: `Dive into ${GLOBAL_APP_TEXT.name}'s world of customizable wonders. From text mosaics to personalized treasures, every item is a canvas for your imagination. Find the perfect gift or create a keepsake that's uniquely you.`,
  },
} as const;

export const CTA_TEXT = {
  title: "Unleash Your Inner Artist",
  shortDescription: "Start Your Creative Adventure",
  description: `${GLOBAL_APP_TEXT.name} is your playground for personal expression. Turn your ideas into tangible art that tells your story.`,
} as const;

export const COMING_SOON_TEXT = {
  title: "More Creativity in the Works!",
  shortDescription: "New treasures coming soon",
  description:
    "Our creative elves are hard at work. Check back soon for more delightful surprises!",
} as const;

export const HERO_TEXT = {
  title: ["Transform", "your ideas", "into art"],
  shortDescription: "Where imagination becomes reality",
  description:
    "Every product is a blank canvas, waiting for your touch to become a masterpiece that celebrates you.",
} as const;

export const COLLECTION_TEXT = {
  textMosaic: {
    title: "Text Mosaic Magic",
    shortDescription: "Words paint a thousand pictures",
    description:
      "Weave your words into a stunning portrait. It's not just art; it's your story, beautifully told.",
  },
} as const;
