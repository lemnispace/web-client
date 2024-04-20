import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import Canvas, {
  addImgToFabricCanvas,
  centerImgOnCanvas,
  resetImgState,
  resizeCanvas,
  scaleImgToCanvas,
} from "../Canvas";

const originalResizeObserver = global.ResizeObserver;
// Mock the getComputedStyle function
const mockGetComputedStyle = jest.fn(() => ({
  paddingTop: "0px",
  paddingBottom: "0px",
  paddingLeft: "0px",
  paddingRight: "0px",
}));

Object.defineProperty(window, "getComputedStyle", {
  value: mockGetComputedStyle,
});

const mockCanvas = {
  add: jest.fn(),
  remove: jest.fn(),
  setActiveObject: jest.fn(),
  getActiveObject: jest.fn(),
  requestRenderAll: jest.fn(),
  getObjects: jest.fn(),
  dispose: jest.fn(),
  clear: jest.fn(),
  setDimensions: jest.fn(),
  centerObject: jest.fn(),
};

describe("Canvas", () => {
  beforeAll(() => {
    global.ResizeObserver = jest.fn(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  });
  afterAll(() => {
    global.ResizeObserver = originalResizeObserver;
  });
  it("renders without crashing", () => {
    const src = "https://example.com/image.jpg";
    const src2 = "https://example.com/image2.jpg";
    const loadCanvas = jest.fn();
    const { getByTestId, rerender } = render(
      <Canvas
        imgSrc={src}
        canvas={mockCanvas as any}
        loadCanvas={loadCanvas}
        data-testid="canvas-test"
      />
    );
    const canvasElement = getByTestId("canvas-test");
    expect(canvasElement).toBeInTheDocument();
    expect(mockCanvas.clear).toHaveBeenCalledTimes(1);
    rerender(
      <Canvas
        imgSrc={src2}
        canvas={mockCanvas as any}
        loadCanvas={loadCanvas}
        data-testid="canvas-test"
      />
    );
    expect(mockCanvas.clear).toHaveBeenCalledTimes(2);
  });
  test("resize observer is called", () => {
    const src = "https://example.com/image.jpg";
    const loadCanvas = jest.fn();
    const { getByTestId } = render(
      <Canvas
        imgSrc={src}
        canvas={mockCanvas as any}
        loadCanvas={loadCanvas}
        data-testid="canvas-test"
      />
    );
    const canvasElement = getByTestId("canvas-test");
    expect(canvasElement).toBeInTheDocument();
    expect(global.ResizeObserver).toHaveBeenCalledTimes(1);
  });
  test("resizeCanvas", () => {
    resizeCanvas(mockCanvas as any, null, null);
    expect(mockCanvas.setDimensions).not.toHaveBeenCalled();
    const wrapper = {
      getBoundingClientRect: jest.fn(() => ({
        width: 155,
        height: 255,
      })),
    };
    const canvas = { ...mockCanvas, width: 100, height: 100 };
    const mockFabricImg = {
      width: 123,
      height: 456,
      scale: jest.fn(),
      fire: jest.fn(),
    };
    resizeCanvas(
      canvas as any,
      wrapper as unknown as HTMLDivElement,
      mockFabricImg as any
    );
    expect(mockCanvas.setDimensions).toHaveBeenCalledTimes(1);
    expect(mockCanvas.setDimensions).toHaveBeenCalledWith({
      width: 155,
      height: 255,
    });
    expect(mockFabricImg.scale).toHaveBeenCalledTimes(1);
    // scaleImgToCanvas uses: min(100-40/123, 100-40/456) = min(60/123, 60/456) = 60/456
    expect(mockFabricImg.scale).toHaveBeenCalledWith(60 / 456);
    expect(mockFabricImg.fire).toHaveBeenCalledTimes(1);
    expect(mockFabricImg.fire).toHaveBeenCalledWith("scaling");
  });
  test("scaleImgToCanvas", () => {
    const canvas = { ...mockCanvas, width: 100, height: 100 };
    const mockFabricImg = {
      width: 123,
      height: 456,
      scale: jest.fn(),
      fire: jest.fn(),
    };
    scaleImgToCanvas(
      mockFabricImg as any,
      canvas as any,
      0 // padding
    );
    expect(mockFabricImg.scale).toHaveBeenCalledTimes(1);
    expect(mockFabricImg.scale).toHaveBeenCalledWith(100 / 456);
    expect(mockFabricImg.fire).toHaveBeenCalledTimes(1);
    expect(mockFabricImg.fire).toHaveBeenCalledWith("scaling");
    canvas.width = 1;
    scaleImgToCanvas(
      mockFabricImg as any,
      canvas as any,
      0 // padding
    );
    expect(mockFabricImg.scale).toHaveBeenCalledTimes(2);
    expect(mockFabricImg.scale).toHaveBeenCalledWith(1 / 123);
    expect(mockFabricImg.fire).toHaveBeenCalledTimes(2);
    expect(mockFabricImg.fire).toHaveBeenCalledWith("scaling");
    const originalError = console.error;
    const originalWarn = console.warn;
    console.error = jest.fn();
    console.warn = jest.fn();
    expect(() => {
      scaleImgToCanvas(
        mockFabricImg as any,
        { width: 10, height: 10 } as any,
        1000 // padding that is larger than the canvas
      );
    }).not.toThrow();
    // downgraded the error to a warning since the canvas can have padding that is larger than the canvas for aspect ratio reasons
    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledWith(
      "Padding cannot be larger than the canvas width or height"
    );
    console.error = originalError;
    console.warn = originalWarn;
  });
  test("centerImgOnCanvas", () => {
    const fImg = {
      fire: jest.fn(),
    };
    const canvas = {
      getCenterPoint: jest.fn(() => ({ x: 50, y: 50 })),
      centerObject: jest.fn(),
    };
    centerImgOnCanvas(fImg as any, canvas as any);
    expect(canvas.centerObject).toHaveBeenCalledTimes(1);
    expect(canvas.centerObject).toHaveBeenCalledWith(fImg);
    expect(fImg.fire).toHaveBeenCalledWith("moving");
  });
  test("addImgToFabricCanvas", () => {
    const setCoords = jest.fn();
    const fImg = {
      width: 100,
      height: 200,
      scaleX: 0.5,
      scaleY: 0.5,
      set: jest.fn().mockReturnValue({
        setCoords,
      }),
      setCoords,
      fire: jest.fn(),
    };
    const canvas = {
      getCenterPoint: jest.fn(() => ({ x: 50, y: 50 })),
      centerObject: jest.fn(),
    };
    addImgToFabricCanvas("/test-src", canvas as any, {
      borderColor: "test-color",
    }).then((fabricImg) => {
      expect(fabricImg).toBeDefined();
      expect(fabricImg.borderColor).toEqual("test-color");
      expect(canvas.centerObject).toHaveBeenCalledTimes(1);
      expect(canvas.centerObject).toHaveBeenCalledWith(fabricImg);
    });
  });
});
