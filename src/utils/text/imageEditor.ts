export const IMAGE_EDITOR_TEXT = {
  title: "Customize Your Image",
  shortDescription: "Customize your image",
  description: "Customize your image",
} as const;

export const IMAGE_EDITOR_FILE_DROP_ZONE_TEXT = {
  description: {
    emphasis: "Click to upload",
    text: "or drag and drop your image here",
  },
} as const;
export const IMAGE_EDITOR_INPUT_TEXT = {
  title: "Generate Text Mosaic",
  description: "Provide the text you want to use to create the mosaic.",
  label: "Enter Text",
} as const;

export const IMAGE_EDITOR_MENU_TEXT = {
  reset: {
    label: "Reset",
    description: "Reset the image and editor to its original state.",
  },
  backgroundRemove: {
    label: "BG Remove",
    description: "Remove the background from the image.",
  },
  centerImg: {
    label: "Center",
    description: "Center the image in the editor.",
  },
  cropImg: {
    label: "Crop",
    description: "Open the crop tool to crop the image.",
  },
  textMosaicEffect: {
    label: "Text Mosaic",
    description: "Turn your image into a text mosaic.",
  },
  reuploadImg: {
    label: "Re-upload",
    description: "Change the image by re-uploading a new one.",
  },
  panZoom: {
    label: "Pan/Zoom",
    description: "Allow panning and zooming of the editor by dragging, scrolling, and pinching.",
  },
} as const;
