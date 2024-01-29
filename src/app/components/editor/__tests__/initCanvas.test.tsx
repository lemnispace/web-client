import "@testing-library/jest-dom";
import { initCanvas } from "../Canvas";

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
};

jest.mock("fabric", () => ({
  Canvas: jest.fn(() => mockCanvas),
}));

describe("initCanvas", () => {
  it("calls callbackFn if el is not null", () => {
    const mockCallbackFn = jest.fn();
    const mockEl = document.createElement("canvas");
    initCanvas({
      el: null,
      callbackFn: mockCallbackFn,
      options: {},
    });
    expect(mockCallbackFn).not.toHaveBeenCalled();
    initCanvas({
      el: mockEl,
      callbackFn: mockCallbackFn,
      options: {},
    });
    expect(mockCallbackFn).toHaveBeenCalledTimes(1);
    expect(mockCallbackFn).toHaveBeenCalledWith(mockCanvas);
  });
});
