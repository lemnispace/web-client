export const GLOBAL_APP_TEXT = {
  name: "LemniSpace",
} as const;

export const BUTTON_TEXT = {
  goBackHome: "Home",
  landing: {
    cta: "Start Creating",
    heroCta: "Craft Your Masterpiece",
  },
  goToProduct: "Customize Now",
  goToCustomize: "Personalize",
  addToCart: "Add to Cart",
  addToFavorites: "Favorite",
  generate: "Create",
  cancel: "Cancel",
  crop: "Crop",
  back: "Back",
  finishEdit: "Finish Masterpiece",
} as const;

export const NAVIGATION_TEXT = {
  home: "Home",
  collections: "Collections",
  comingSoon: "Sneak Peek",
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
      title: "Oops! Page Not Found",
      code: "404",
      description: "This page seems to have vanished into thin air!",
      shortDescription: "Page not found",
    },
  },
  /**
   * Error messages for the image editor
   */
  imageEditor: {
    backgroundRemoval: "Whoops! Our magic eraser hit a snag.",
    mosaicGeneration: "Uh-oh! Our mosaic maker needs a quick reset.",
    missingText: "Oops! We need your words to weave some magic.",
    noImage: "Hold up! We need an image to start the fun.",
  },
  /**
   * General error messages
   */
  general: {
    default: "Oops! We hit a bump. Let's try that again.",
    notFound: "We've looked high and low, but couldn't find that.",
    missingData: "Almost there! Just fill in the blanks.",
  },
} as const;
