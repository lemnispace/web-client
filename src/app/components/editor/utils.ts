import { IMAGE_EDITOR_STATUS_TEXT } from "@/utils/text";
import { removeBackground as imglyRemoveBackground } from "@imgly/background-removal";
import { Canvas, FabricImage, ImageProps } from "fabric";
import { Area } from "react-easy-crop";

export type ImgSource =
  | ImageData
  | ArrayBuffer
  | Uint8Array
  | Blob
  | URL
  | string;

/**
 * Represents the data of an image.
 */
export type ImgData = {
  data: string | ArrayBuffer;
  fileName: string;
};

/**
 * Reads the file and returns the image source data.
 * @param file The file to read.
 * @returns A promise that resolves to the image source data.
 */
export const getImgSrcFromFile = (file: File): Promise<ImgData> => {
  return new Promise((resolve, reject) => {
    // create a FileReader to read the file
    const reader = new FileReader();
    // event handler for when the reader encounters an error
    reader.onerror = (e) => {
      console.error("Error reading file", e);
      reject("Error reading file");
    };
    // event handler for when the reader finishes reading the file
    reader.onload = (e) => {
      // if the reader has a result, set the uploaded img
      if (reader.result) {
        resolve({ data: reader.result, fileName: file.name });
      } else {
        console.error("Unable to read file", e);
        reject("Unable to read file");
      }
    };
    reader.readAsDataURL(file);
  });
};

/**
 * Creates a new Fabric image object from the given source.
 * @param src The image source.
 * @param options Optional image properties.
 * @returns A promise that resolves to the new Fabric image object.
 */
export const getNewFabricImgFromSrc = async (
  src: string,
  options?: Partial<ImageProps>
) => {
  return await FabricImage.fromURL(src, undefined, {
    snapAngle: 5,
    lockSkewingX: true,
    lockSkewingY: true,
    cornerColor: "#FCC325",
    borderColor: "#FCC325",
    lockScalingFlip: true,
    ...options,
  });
};

/**
 * Finds the Fabric image object in the canvas that matches the given condition.
 * @param canvas The canvas to search in.
 * @param fn Optional condition function to filter the image objects.
 * @returns The found Fabric image object, or null if not found.
 */
export const findCanvasImgObj = (
  canvas: Canvas,
  fn?: (o: FabricImage) => boolean
) => {
  return canvas
    ?.getObjects()
    .find((o) => o.type === "image" && (!fn || fn(o as FabricImage)));
};

/**
 * Finds the Fabric image object in the canvas that has the given source.
 * @param canvas The canvas to search in.
 * @param src The image source to match.
 * @returns The found Fabric image object, or null if not found.
 */
export const findCanvasImgFromSrc = (
  canvas: Canvas,
  src: string
): FabricImage | null => {
  const img = findCanvasImgObj(canvas, (o) => o.getSrc?.() === src);
  return (img as FabricImage) || null;
};

/**
 * Creates an HTMLImageElement from the given URL.
 * @param url The URL of the image.
 * @returns A promise that resolves to the created HTMLImageElement.
 */
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });

/**
 * Crops the image based on the provided crop area.
 * @param imageSrc The source of the image to crop.
 * @param crop The crop area.
 * @returns A promise that resolves to the cropped image data URL.
 */
export const getCroppedImg = async (
  imageSrc: string,
  crop: Area
): Promise<string | null> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return null;
  }
  // set canvas size to match the bounding box
  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);
  const croppedCanvas = document.createElement("canvas");
  const croppedCtx = croppedCanvas.getContext("2d");
  if (!croppedCtx) {
    return null;
  }
  // Set the size of the cropped canvas
  croppedCanvas.width = crop.width;
  croppedCanvas.height = crop.height;
  // Draw the cropped image onto the new canvas
  croppedCtx.drawImage(
    canvas,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  );
  return new Promise((resolve, reject) => {
    croppedCanvas.toBlob((blob) => {
      if (!blob) {
        reject("Error cropping image");
      } else {
        resolve(URL.createObjectURL(blob));
      }
    }, "image/png");
  });
};

interface ProgressHandler {
  /**
   * Handles the progress of an operation.
   * @param message The progress message.
   * @param progress The progress value.
   */
  (message: string, progress: number): void;
}

/**
 * Removes the background from an image using the imgly background removal library.
 * @param image_src The source of the image to remove the background from.
 * @param handleProgress Optional progress handler function.
 * @returns A promise that resolves to the resulting image blob.
 */
export const removeBackground = async (
  image_src: ImgSource,
  handleProgress?: ProgressHandler
): Promise<Blob> => {
  const blob = await imglyRemoveBackground(image_src, {
    progress: (...args) => {
      if (handleProgress) {
        const [stage, current, total] = args;
        let statusMessage = "";
        if (stage.startsWith("fetch:/models/")) {
          statusMessage =
            IMAGE_EDITOR_STATUS_TEXT.removeBackground.progress.modelFetch;
        } else if (stage.startsWith("fetch:/onnxruntime-web/")) {
          statusMessage =
            IMAGE_EDITOR_STATUS_TEXT.removeBackground.progress.modelPrep;
        } else if (stage.startsWith("compute:inference")) {
          statusMessage =
            IMAGE_EDITOR_STATUS_TEXT.removeBackground.progress.inferenceCompute;
        }
        const progress = total > 0 ? Math.round((current / total) * 100) : 0;
        handleProgress(statusMessage, progress);
      }
    },
    model: "isnet",
  });
  return blob;
};

/**
 * Converts the Fabric canvas to an image file.
 * @param canvas The Fabric canvas to convert.
 * @returns A promise that resolves to the image file.
 */
export const canvasToFile = async (canvas: Canvas): Promise<File> => {
  const dataURL = canvas.toDataURL();
  const blob = await (await fetch(dataURL)).blob();
  return new File([blob], "image.png", { type: "image/png" });
};
