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
