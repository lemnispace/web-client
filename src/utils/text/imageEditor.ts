export const IMAGE_EDITOR_TEXT = {
  title: "Make It Yours",
  shortDescription: "Personalize your image",
  description: "Transform your image into a unique masterpiece",
} as const;

export const IMAGE_EDITOR_FILE_DROP_ZONE_TEXT = {
  description: {
    emphasis: "Drop your image here",
    text: "or click to upload",
  },
} as const;

export const IMAGE_EDITOR_INPUT_TEXT = {
  title: "Text Mosaic Magic",
  description: "What words will bring your image to life?",
  label: "Your Words Here",
} as const;

export const IMAGE_EDITOR_MENU_TEXT = {
  reset: {
    label: "Reset",
    description: "Start fresh with your original image.",
  },
  finishEdit: {
    label: "Finish",
    description: "Wrap up your masterpiece and prepare it for ordering.",
  },
  backgroundRemove: {
    label: "BG Remove",
    description: "Poof! Make the background disappear.",
  },
  centerImg: {
    label: "Center",
    description: "Put your image in the spotlight by centering it.",
  },
  cropImg: {
    label: "Crop",
    description: "Trim your image to perfection.",
  },
  textMosaicEffect: {
    label: "Text Mosaic",
    description: "Transform your image into a tapestry of words.",
  },
  reuploadImg: {
    label: "New Image",
    description: "Swap in a fresh image to customize.",
  },
  panZoom: {
    label: "Adjust",
    description:
      "Move and resize your image with ease. Simply drag, scroll, or pinch in the editor.",
  },
} as const;
