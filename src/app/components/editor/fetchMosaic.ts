import { Canvas } from "fabric";
import { canvasToFile } from "./utils";

export const fetchMosaic = async (canvas: Canvas, text: string) => {
  const file = await canvasToFile(canvas);
  try {
    const formData = new FormData();
    formData.append("text", text);
    formData.append("file", file);
    const response = await fetch("/api/mosaic", {
      method: "POST",
      body: formData,
      headers: {
        Accept: "image/png",
      },
    });
    return response.blob();
  } catch (e) {
    console.error("Error generating mosaic:", e);
  }
};
