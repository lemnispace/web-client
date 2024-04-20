import { isDefined } from "@/utils/validators";
import { Canvas } from "fabric";

const TEXT_MOSAIC_API_URL = "http://localhost:3000/";

const canvasToFile = async (canvas: Canvas): Promise<File> => {
  const dataURL = canvas.toDataURL();
  const blob = await (await fetch(dataURL)).blob();
  return new File([blob], "image.png", { type: "image/png" });
};

export const fetchTextMosaic = async (
  canvas: Canvas,
  text: string,
  options?: {
    width?: number;
    baseFontSize?: number;
    isBlackAndWhite?: boolean;
    contrastFactor?: number;
  }
) => {
  try {
    // Get the image data from the canvas as a Blob
    const file = await canvasToFile(canvas);

    // Create a FormData object to store the request payload
    const formData = new FormData();
    formData.append("text", text);
    if (isDefined(options?.width))
      formData.append("width", options.width.toString());
    if (isDefined(options?.baseFontSize))
      formData.append("base_font_size", options.baseFontSize.toString());
    if (isDefined(options?.isBlackAndWhite))
      formData.append("is_black_and_white", options.isBlackAndWhite.toString());
    if (isDefined(options?.contrastFactor))
      formData.append("contrast_factor", options.contrastFactor.toString());
    formData.append("file", file);

    // Make the POST request to the endpoint using fetch
    const response = await fetch(TEXT_MOSAIC_API_URL, {
      method: "POST",
      body: formData,
    });

    // Handle the response
    if (response.ok) {
      // response is an "image/png"
      const data = await response.blob();
      return data;
    } else {
      console.error("Error generating mosaic:", response.statusText);
    }
  } catch (error) {
    console.error("Error generating mosaic:", error);
  }
};
