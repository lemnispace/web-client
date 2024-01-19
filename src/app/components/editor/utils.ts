import { Canvas, FabricImage, ImageProps } from "fabric";

export type ImgData = {
  data: string | ArrayBuffer;
  fileName: string;
};

export const getImgSrcFromFile = (file: File): Promise<ImgData> => {
  return new Promise((resolve, reject) => {
    // create a FileReader to read the file
    const reader = new FileReader();
    // event handler for when the reader encounters an error
    reader.onerror = (e) => {
      console.error("Error reading file");
      reject(e);
    };
    // event handler for when the reader finishes reading the file
    reader.onload = (e) => {
      // if the reader has a result, set the uploaded img
      if (reader.result) {
        resolve({ data: reader.result, fileName: file.name });
      } else {
        console.error("Unable to read file");
      }
    };
    reader.readAsDataURL(file);
  });
};

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
    ...options,
  });
};

export const findCanvasImgObj = (
  canvas: Canvas,
  fn?: (o: FabricImage) => boolean
) => {
  return canvas
    ?.getObjects()
    .find((o) => o.type === "image" && (!fn || fn(o as FabricImage)));
};

export const findCanvasImgFromSrc = (
  canvas: Canvas,
  src: string
): FabricImage | null => {
  const img = findCanvasImgObj(canvas, (o) => o.getSrc?.() === src);
  return (img as FabricImage) || null;
};
