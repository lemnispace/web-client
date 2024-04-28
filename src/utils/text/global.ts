export const GLOBAL_APP_TEXT = {
  name: "LemniSpace",
} as const;

export const BUTTON_TEXT = {
  goBackHome: "Go Back Home",
  landing: {
    cta: "Start Crafting Now",
    heroCta: "Craft Your Personal Masterpiece",
  },
  goToProduct: "Craft Your Own",
  goToCustomize: "Customize",
  addToCart: "Add to Cart",
  addToFavorites: "Add to Favorites",
  generate: "Generate",
  cancel: "Cancel",
  crop: "Crop",
} as const;

export const NAVIGATION_TEXT = {
  home: "Home",
  mosaics: "Mosaics",
  comingSoon: "Coming Soon",
} as const;

export const ERROR_TEXTS = {
  /**
   * Error messages for pages
   */
  page: {
    /**
     * 404 Not Found Page
     */
    404: {
      title: "Page Not Found",
      code: "404",
      description: "Sorry, the page you're looking for doesn't exist.",
      shortDescription: "Page not found",
    },
  },
  /**
   * Error messages for the image editor
   */
  imageEditor: {
    backgroundRemoval: "Oops! Background removal hit a snag.",
    mosaicGeneration: "Mosaic creation encountered a glitch. Let's try again!",
    missingText: "Please add some text to make the mosaic truly unique!",
    noImage: "No image found. Please upload an image to get started.",
  },
  /**
   * General error messages
   */
  general: {
    default: "Oops! Something went wrong. Please try again.",
    notFound: "Sorry, we couldn't find what you're looking for.",
    missingData: "Oops! Please fill in all the required fields.",
  },
} as const;
