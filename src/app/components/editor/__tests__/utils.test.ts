import { Canvas } from "fabric";
import {
  findCanvasImgFromSrc,
  findCanvasImgObj,
  getImgSrcFromFile,
} from "../utils";

beforeEach(() => {
  // Clear the mocks
  jest.restoreAllMocks();
});

it("should resolve with the correct ImgData object when the file is read successfully", async () => {
  // Create a mock file object
  const file = new File(["test"], "test.png", { type: "image/png" });
  const result = await getImgSrcFromFile(file);
  // Assert that the result is correct
  expect(result).toEqual({
    data: "data:image/png;base64,dGVzdA==", // Base64 representation of "test"
    fileName: "test.png",
  });
});

it("should reject with an error when there is an error reading the file", async () => {
  // Create a mock file object
  const file = new File(["test"], "test.png", { type: "image/png" });
  // Mock the FileReader to throw an error
  jest.spyOn(window, "FileReader").mockImplementation(() => {
    return {
      readAsDataURL: () => {
        throw new Error("Mock error");
      },
    } as unknown as FileReader;
  });
  await expect(getImgSrcFromFile(file)).rejects.toThrow("Mock error");
});

test("findCanvasImgObj", () => {
  // Case 1: No image objects
  let canvas = {
    getObjects: () => [
      { type: "rect", id: "rect1" },
      { type: "rect", id: "rect2" },
      { type: "rect", id: "rect3" },
    ],
  } as unknown as Canvas;
  const result = findCanvasImgObj(canvas);
  expect(result).toEqual(undefined);

  // Case 2: Image object found
  canvas = {
    getObjects: () => [
      { type: "rect", id: "rect1" },
      { type: "image", id: "rect2" },
      { type: "rect", id: "rect3" },
    ],
  } as unknown as Canvas;
  const result2 = findCanvasImgObj(canvas) as any;
  expect(result2).toBeDefined();
  expect(result2.id).toEqual("rect2");

  // Case 3: Image object found with a filter function
  canvas = {
    getObjects: () => [
      { type: "image", id: "rect1", fill: "red" },
      { type: "image", id: "rect2", fill: "blue" },
      { type: "image", id: "rect3", fill: "green" },
    ],
  } as unknown as Canvas;
  const result3 = findCanvasImgObj(canvas, (o) => o.fill === "green") as any;
  expect(result3).toBeDefined();
  expect(result3.id).toEqual("rect3");
});

test("findCanvasImgFromSrc", () => {
  // Case 1: No image objects
  let canvas = {
    getObjects: () => [
      { getSrc: () => "src/rect1", type: "rect", id: "rect1" },
      { getSrc: () => "src/rect2", type: "rect", id: "rect2" },
      { getSrc: () => "src/rect3", type: "rect", id: "rect3" },
    ],
  } as unknown as Canvas;
  const result = findCanvasImgFromSrc(canvas, "src/rect2");
  expect(result).toBeNull();

  // Case 2: Image object found but src doesn't match
  canvas = {
    getObjects: () => [
      { getSrc: () => "src/rect1", type: "rect", id: "rect1" },
      { getSrc: () => "src/rect2", type: "image", id: "rect2" },
      { getSrc: () => "src/rect3", type: "rect", id: "rect3" },
    ],
  } as unknown as Canvas;
  const result2 = findCanvasImgFromSrc(canvas, "src/rect1") as any;
  expect(result2).toBeNull();

  // Case 3: Image object found
  canvas = {
    getObjects: () => [
      { getSrc: () => "src/rect1", type: "image", id: "rect1", fill: "blue" },
      { getSrc: () => "src/rect2", type: "rect", id: "rect2", fill: "red" },
      { getSrc: () => "src/rect2", type: "image", id: "rect3", fill: "red" },
    ],
  } as unknown as Canvas;
  const result3 = findCanvasImgFromSrc(canvas, "src/rect2") as any;
  expect(result3).toBeDefined();
  expect(result3.id).toEqual("rect3");

  // Case 3: Image object found with duplicate src, in case of duplicate src, the first one is returned
  canvas = {
    getObjects: () => [
      { getSrc: () => "src/rect1", type: "image", id: "rect1", fill: "blue" },
      { getSrc: () => "src/rect2", type: "image", id: "rect2", fill: "red" },
      { getSrc: () => "src/rect2", type: "image", id: "rect3", fill: "red" },
    ],
  } as unknown as Canvas;
  const result4 = findCanvasImgFromSrc(canvas, "src/rect2") as any;
  expect(result4).toBeDefined();
  expect(result4.id).toEqual("rect2");
});
