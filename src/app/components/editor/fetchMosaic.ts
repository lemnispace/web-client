import { MOSAIC_API_ENDPOINT } from "@/utils/constants";
import { getErrorMessage } from "@/utils/getters";

export const fetchMosaic = async (formData: FormData) => {
  try {
    if (!formData.get("text")) {
      throw new Error("Missing text field in form data");
    }
    if (!formData.get("file")) {
      throw new Error("Missing file field in form data");
    }
    const response = await fetch(MOSAIC_API_ENDPOINT, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "image/png",
      },
    });
    if (!response.ok) {
      const errorMessage = await getErrorMessage(
        response,
        "Failed to generate mosaic"
      );
      throw new Error(errorMessage);
    }
    return response.blob();
  } catch (e) {
    console.error("Error fetching mosaic", e);
    throw e;
  }
};
