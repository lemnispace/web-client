export const fetchMosaic = async (formData: FormData) => {
  try {
    if (!formData.get("text")) {
      throw new Error("Missing text field in form data");
    }
    if (!formData.get("file")) {
      throw new Error("Missing file field in form data");
    }
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
