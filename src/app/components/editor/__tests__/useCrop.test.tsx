import { getMockFabricImage } from "@/utils/test_utils";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { Canvas, FabricImage, FabricObject, Rect } from "fabric";
import {
  addSyncEventHandlers,
  createCrop,
  freezeFabricObj,
  getClipPath,
  getCroppedImg,
  getCroppingRect,
  getImg,
  getOverlay,
  hideFabricObj,
  init,
  showFabricObj,
  syncObjects,
  unfreezeFabricObj,
  useCrop,
} from "../useCrop";

type MockTestRef = { current: any };
const MOCK_IMG_SRC = "http://localhost/test-src";
const mockFabricImg = getMockFabricImage(MOCK_IMG_SRC);

const mockCanvas = {
  add: jest.fn(),
  remove: jest.fn(),
  setActiveObject: jest.fn(),
  getActiveObject: jest.fn(),
  requestRenderAll: jest.fn(),
  getObjects: jest.fn(),
};

const MockComponent = (props: {
  imgSrc: string;
  startRef: MockTestRef;
  stopRef: MockTestRef;
  canvas: any;
}) => {
  const [start, stop, isCropActive] = useCrop(props.canvas, props.imgSrc);
  props.startRef.current = start;
  props.stopRef.current = stop;

  return <div>{isCropActive ? "active" : "inactive"}</div>;
};

describe("useCrop", () => {
  it("should be inactive by default and should not call any functions", () => {
    const startRef: MockTestRef = { current: null };
    const stopRef: MockTestRef = { current: null };
    const localMockCanvas = {
      ...mockCanvas,
      getObjects: jest.fn(() => [mockFabricImg]),
    };
    const { getByText, queryByText } = render(
      <MockComponent
        canvas={localMockCanvas}
        startRef={startRef}
        stopRef={stopRef}
        imgSrc={MOCK_IMG_SRC}
      />
    );
    // crop is inactive by default
    expect(getByText("inactive")).toBeInTheDocument();
    expect(queryByText("active")).toBeNull();
    // no functions have been called yet
    expect(mockCanvas.add).not.toHaveBeenCalled();
    expect(mockCanvas.setActiveObject).not.toHaveBeenCalled();
    expect(mockCanvas.getActiveObject).not.toHaveBeenCalled();
    expect(mockCanvas.requestRenderAll).not.toHaveBeenCalled();
  });
});

describe("useCrop utils", () => {
  it("should freeze the fabric object and not allow it to be selectable", async () => {
    const obj = new Rect({
      selectable: true,
      evented: true,
      id: "mock-img",
    });
    freezeFabricObj(obj);
    expect(obj.selectable).toBe(false);
    expect(obj.evented).toBe(false);
    unfreezeFabricObj(obj);
    expect(obj.selectable).toBe(true);
    expect(obj.evented).toBe(true);
  });
  it("should hide the fabric object and not allow it to be selectable or seen", () => {
    const obj = new Rect({
      selectable: true,
      evented: true,
      visible: true,
      id: "mock-img",
    });
    hideFabricObj(obj);
    expect(obj.selectable).toBe(false);
    expect(obj.evented).toBe(false);
    expect(obj.visible).toBe(false);
    showFabricObj(obj);
    expect(obj.selectable).toBe(true);
    expect(obj.evented).toBe(true);
    expect(obj.visible).toBe(true);
  });
  test("syncObjects: it should sync 2 fabric objects so that the target has the same properties as the source", () => {
    const source = new Rect({
      top: 0,
      left: 0,
      width: 100,
      height: 100,
      scaleX: 1,
      scaleY: 1,
      angle: 0,
      originX: "left",
      originY: "top",
      selectable: true,
      evented: true,
      visible: true,
      id: "mock-source-img",
    });
    const target = new Rect({
      top: 123,
      left: 456,
      width: 789,
      height: 101112,
      scaleX: 0.7,
      scaleY: 0.7,
      angle: 90,
      originX: "center",
      originY: "center",
      selectable: false,
      evented: false,
      visible: false,
      id: "mock-target-img",
    });
    syncObjects(mockCanvas as any, source, target);
    expect(target.top).toBe(0);
    expect(target.left).toBe(0);
    expect(target.width).toBe(100);
    expect(target.height).toBe(100);
    expect(target.scaleX).toBe(1);
    expect(target.scaleY).toBe(1);
    expect(target.angle).toBe(0);
    expect(target.originX).toBe("left");
    expect(target.originY).toBe("top");
    expect(target.selectable).toBe(false);
    expect(target.evented).toBe(false);
    expect(target.visible).toBe(false);
    expect(target.get("id")).toBe("mock-target-img");
  });
  test("syncObjects with getProps: it should sync 2 fabric objects so that the target has the same properties as the source", () => {
    const source = new Rect({
      top: 0,
      left: 0,
      width: 100,
      height: 100,
      scaleX: 1,
      scaleY: 1,
      angle: 0,
      originX: "left",
      originY: "top",
      selectable: true,
      evented: true,
      visible: true,
      id: "mock-source-img",
    });
    const target = new Rect({
      top: 123,
      left: 456,
      width: 789,
      height: 101112,
      scaleX: 0.7,
      scaleY: 0.7,
      angle: 90,
      originX: "center",
      originY: "center",
      selectable: false,
      evented: false,
      visible: false,
      id: "mock-target-img",
    });

    syncObjects(mockCanvas as any, source, target, (src, tgt) => {
      return {
        top: src.top, // same as source
        angle: src.angle, // same as source
        left: tgt.left, // same as target
      };
    });
    expect(target.top).toBe(0); // same as source
    expect(target.left).toBe(456);
    expect(target.width).toBe(789);
    expect(target.height).toBe(101112);
    expect(target.scaleX).toBe(0.7);
    expect(target.scaleY).toBe(0.7);
    expect(target.angle).toBe(0); // same as source
    expect(target.originX).toBe("center");
    expect(target.originY).toBe("center");
    expect(target.selectable).toBe(false);
    expect(target.evented).toBe(false);
    expect(target.visible).toBe(false);
    expect(target.get("id")).toBe("mock-target-img");
  });
  it("should add event handlers to the fabric object", () => {
    const mockObject = new Rect({});
    const mockHandler = jest.fn();
    let cleanup = addSyncEventHandlers(mockObject, mockHandler);
    mockObject.fire("moving");
    expect(mockHandler).toHaveBeenCalledTimes(1);
    mockObject.fire("scaling");
    expect(mockHandler).toHaveBeenCalledTimes(2);
    mockObject.fire("rotating");
    expect(mockHandler).toHaveBeenCalledTimes(3);
    mockObject.fire("skewing");
    expect(mockHandler).toHaveBeenCalledTimes(4);
    mockObject.fire("modified");
    expect(mockHandler).toHaveBeenCalledTimes(5);
    mockHandler.mockClear();
    // removes the event handlers
    cleanup();
    mockObject.fire("moving");
    expect(mockHandler).toHaveBeenCalledTimes(0);
    mockObject.fire("scaling");
    expect(mockHandler).toHaveBeenCalledTimes(0);
    mockObject.fire("rotating");
    expect(mockHandler).toHaveBeenCalledTimes(0);
    mockObject.fire("skewing");
    expect(mockHandler).toHaveBeenCalledTimes(0);
    mockObject.fire("modified");
    expect(mockHandler).toHaveBeenCalledTimes(0);

    // only specified events should be added
    mockHandler.mockClear();
    cleanup = addSyncEventHandlers(mockObject, mockHandler, [
      "moving",
      "rotating",
    ]);
    mockObject.fire("moving");
    expect(mockHandler).toHaveBeenCalledTimes(1);
    mockObject.fire("scaling");
    expect(mockHandler).toHaveBeenCalledTimes(1);
    mockObject.fire("rotating");
    expect(mockHandler).toHaveBeenCalledTimes(2);
    mockObject.fire("skewing");
    expect(mockHandler).toHaveBeenCalledTimes(2);
    mockObject.fire("modified");
    expect(mockHandler).toHaveBeenCalledTimes(2);
    mockHandler.mockClear();
    // removes the event handlers
    cleanup();
    mockObject.fire("moving");
    expect(mockHandler).toHaveBeenCalledTimes(0);
    mockObject.fire("rotating");
    expect(mockHandler).toHaveBeenCalledTimes(0);
  });
  test.each(["moving", "scaling", "rotating", "skewing", "modified"])(
    "init: it should add event handlers to the fabric objects and sync them when they are fired",
    (event) => {
      const initialCroppedImgProps = {
        visible: false,
        selectable: false,
        evented: false,
        top: 1,
        left: 10,
        width: 100,
        height: 100,
        scaleX: 1,
        scaleY: 1,
        angle: 0,
        originX: "left",
        originY: "top",
      } as any;
      const initialOverlayProps = {
        visible: false,
        selectable: false,
        evented: false,
        top: 0,
        left: 0,
        width: 1000,
        height: 1000,
        scaleX: 1,
        scaleY: 1,
        angle: 0,
        originX: "left",
        originY: "top",
      } as any;
      const initialCroppingRectProps = {
        visible: false,
        selectable: false,
        evented: false,
        top: 2,
        left: 20,
        width: 200,
        height: 200,
        scaleX: 0.7,
        scaleY: 0.8,
        angle: 45,
        originX: "left",
        originY: "top",
      } as any;
      const initialClipPathProps = {
        visible: false,
        selectable: false,
        evented: false,
        top: 1,
        left: 10,
        width: 100,
        height: 100,
        scaleX: 1,
        scaleY: 1,
        angle: 0,
        originX: "left",
        originY: "top",
      } as any;
      const initialImgProps = {
        visible: false,
        selectable: false,
        evented: false,
        top: 1,
        left: 10,
        width: 100,
        height: 100,
        scaleX: 1,
        scaleY: 1,
        angle: 0,
        originX: "left",
        originY: "top",
      } as any;

      const croppedImg = new Rect(initialCroppedImgProps);
      const overlay = new Rect(initialOverlayProps);
      const croppingRect = new Rect(initialCroppingRectProps);
      const clipPath = new Rect(initialClipPathProps);
      const img = new Rect(initialImgProps);

      const cleanup = init({
        canvas: mockCanvas as any,
        croppedImg: croppedImg as unknown as FabricImage,
        overlay,
        croppingRect,
        clipPath,
        img: img as unknown as FabricImage,
      });

      const testIsSynced = (src: FabricObject, tgt: FabricObject) => {
        expect(tgt.top).toBe(src.top);
        expect(tgt.left).toBe(src.left);
        expect(tgt.width).toBe(src.width);
        expect(tgt.height).toBe(src.height);
        expect(tgt.scaleX).toBe(src.scaleX);
        expect(tgt.scaleY).toBe(src.scaleY);
        expect(tgt.angle).toBe(src.angle);
        expect(tgt.originX).toBe(src.originX);
        expect(tgt.originY).toBe(src.originY);
      };
      // when the cropping rect is modified, the clipPath should be synced
      croppingRect.fire(event as any);
      testIsSynced(croppingRect, clipPath);
      // reset modifications
      croppingRect.set(initialCroppingRectProps);
      clipPath.set(initialClipPathProps);
      // cropping rect should be synced with the croppedImg
      croppedImg.fire(event as any);
      testIsSynced(croppedImg, croppingRect);
      // reset modifications
      croppedImg.set(initialCroppedImgProps);
      croppingRect.set(initialCroppingRectProps);
      // when the img is modified, the croppedImg should be synced
      img.fire(event as any);
      testIsSynced(img, croppedImg);
      testIsSynced(img, clipPath);
      testIsSynced(img, croppingRect);
      // reset modifications
      img.set(initialImgProps);
      croppedImg.set(initialCroppedImgProps);
      croppingRect.set(initialCroppingRectProps);
      cleanup();
      // after cleanup, the event handlers should be removed
      croppingRect.fire(event as any);
      croppedImg.fire(event as any);
      img.fire(event as any);
      // nothing should be synced, everything should reamain unchanged
      testIsSynced(croppingRect, initialCroppingRectProps);
      testIsSynced(croppedImg, initialCroppedImgProps);
      testIsSynced(img, initialImgProps);
    }
  );
  test("getImg", () => {
    // Test case 1: current is null
    const existingImg = {
      type: "image",
      id: "test",
      src: "test-src",
      getSrc: () => "test-src",
    };
    const localMockCanvas = {
      getObjects: jest.fn(() => [
        existingImg,
        { type: "something-else", id: "none" },
      ]),
    } as any;
    expect(() => {
      getImg(localMockCanvas, "/src/not-found.png");
    }).toThrow("image not found");

    // Test case 2: current is not null
    const img = getImg(localMockCanvas, "test-src");
    expect(img).toBe(existingImg);
  });
  test("getClipPath", () => {
    // Test case 1: current is null
    const croppingRect = new Rect({
      top: 10,
      left: 20,
      width: 100,
      height: 100,
      originX: "left",
      originY: "top",
      scaleX: 1,
      scaleY: 1,
      angle: 0,
    });
    const clipPath = getClipPath(croppingRect);
    expect(clipPath.top).toBe(croppingRect.top);
    expect(clipPath.left).toBe(croppingRect.left);
    expect(clipPath.width).toBe(croppingRect.width);
    expect(clipPath.height).toBe(croppingRect.height);
    expect(clipPath.originX).toBe(croppingRect.originX);
    expect(clipPath.originY).toBe(croppingRect.originY);
    expect(clipPath.scaleX).toBe(croppingRect.scaleX);
    expect(clipPath.scaleY).toBe(croppingRect.scaleY);
    expect(clipPath.angle).toBe(croppingRect.angle);
    expect(clipPath.absolutePositioned).toBe(true);
    expect(clipPath.get("id")).toBe("clipPath");

    // Test case 2: current is not null
    const currentClipPath = new Rect({
      top: 50,
      left: 60,
      width: 200,
      height: 200,
      originX: "left",
      originY: "top",
      scaleX: 1,
      scaleY: 1,
      angle: 0,
      absolutePositioned: true,
      id: "currentClipPath",
    });
    const clipPath2 = getClipPath(croppingRect, currentClipPath);
    expect(clipPath2).toBe(currentClipPath);
  });
  test("getCroppedImg", async () => {
    // Test case 1: current is null
    const img = new Rect({
      left: 10,
      top: 20,
      width: 100,
      height: 100,
      scaleX: 1,
      scaleY: 1,
      angle: 0,
    });
    const croppedImg = await getCroppedImg(img as unknown as FabricImage);
    expect(croppedImg.left).toBe(img.left);
    expect(croppedImg.top).toBe(img.top);
    expect(croppedImg.width).toBe(img.width);
    expect(croppedImg.height).toBe(img.height);
    expect(croppedImg.scaleX).toBe(img.scaleX);
    expect(croppedImg.scaleY).toBe(img.scaleY);
    expect(croppedImg.angle).toBe(img.angle);
    expect(croppedImg.get("id")).toBe("croppedImg");
    expect(croppedImg.selectable).toBe(false);

    // Test case 2: current is not null
    const currentCroppedImg = new Rect({
      left: 50,
      top: 60,
      width: 200,
      height: 200,
      scaleX: 1,
      scaleY: 1,
      angle: 0,
      id: "currentCroppedImg",
      selectable: false,
    });
    const croppedImg2 = await getCroppedImg(
      img as unknown as FabricImage,
      currentCroppedImg as unknown as FabricImage
    );
    expect(croppedImg2).toBe(currentCroppedImg);
    expect(croppedImg.left).toBe(img.left);
    expect(croppedImg.top).toBe(img.top);
    expect(croppedImg.width).toBe(img.width);
    expect(croppedImg.height).toBe(img.height);
    expect(croppedImg.scaleX).toBe(img.scaleX);
    expect(croppedImg.scaleY).toBe(img.scaleY);
    expect(croppedImg.angle).toBe(img.angle);
    expect(croppedImg.get("id")).toBe("croppedImg");
    expect(croppedImg.selectable).toBe(false);
  });
  test("getOverlay", () => {
    let eventName = "";
    let callback: VoidFunction;
    const localMockCanvas = {
      on: jest.fn().mockImplementation((event, handler) => {
        eventName = event;
        callback = handler;
      }),
      width: 1234,
      height: 5678,
    };
    // Test case 1: current is null
    const overlay = getOverlay(localMockCanvas as unknown as Canvas);
    expect(overlay.fill).toBe("rgba(0, 0, 0, 0.5)");
    expect(overlay.selectable).toBe(false);
    expect(overlay.evented).toBe(false);
    expect(overlay.excludeFromExport).toBe(true);
    expect(overlay.get("id")).toBe("overlay");
    expect(localMockCanvas.on).toHaveBeenCalledTimes(1);
    expect(eventName).toBe("before:render");
    expect(callback!).toBeDefined();
    callback!();
    expect(overlay.width).toBe(localMockCanvas.width);
    expect(overlay.height).toBe(localMockCanvas.height);
    expect(overlay.left).toBe(0);
    expect(overlay.top).toBe(0);
    localMockCanvas.on.mockClear();

    // Test case 2: current is not null
    const currentOverlay = new Rect({
      fill: "rgba(255, 255, 255, 0.8)",
      selectable: true,
      evented: true,
      excludeFromExport: false,
      width: 100,
      height: 50,
      id: "currentOverlay",
    });
    const overlay2 = getOverlay(
      localMockCanvas as unknown as Canvas,
      currentOverlay
    );
    expect(overlay2).toBe(currentOverlay);
    expect(localMockCanvas.on).not.toHaveBeenCalled();
  });
  test("getCroppingRect", () => {
    // test case 1: current is null
    const obj = new Rect({
      left: 50,
      top: 60,
      width: 200,
      height: 200,
      scaleX: 1,
      scaleY: 1,
      angle: 0,
    });
    const croppingRect = getCroppingRect(obj);
    expect(croppingRect).not.toBe(obj);
    expect(croppingRect.originX).toBe("left");
    expect(croppingRect.originY).toBe("top");
    expect(croppingRect.fill).toBe(null);
    expect(croppingRect.stroke).toBe(null);
    expect(croppingRect.strokeWidth).toBe(2);
    expect(croppingRect.selectable).toBe(true);
    expect(croppingRect.hasControls).toBe(true);
    expect(croppingRect.lockSkewingX).toBe(true);
    expect(croppingRect.lockSkewingY).toBe(true);
    expect(croppingRect.borderColor).toBe("#22c55e");
    expect(croppingRect.borderDashArray).toEqual([5, 5]);
    expect(croppingRect.cornerColor).toBe("#22c55e");
    expect(croppingRect.excludeFromExport).toBe(true);
    expect(croppingRect.get("id")).toBe("croppingRect");
    expect(croppingRect.left).toBe(50);
    expect(croppingRect.top).toBe(60);
    expect(croppingRect.width).toBe(200);
    expect(croppingRect.height).toBe(200);
    expect(croppingRect.scaleX).toBe(1);
    expect(croppingRect.scaleY).toBe(1);
    expect(croppingRect.angle).toBe(0);

    // test case 2: current is not null
    const currentCroppingRect = new Rect({
      left: 100,
      top: 150,
      width: 300,
      height: 300,
      scaleX: 1,
      scaleY: 1,
      angle: 0,
      id: "currentCroppingRect",
    });
    const croppingRect2 = getCroppingRect(obj, currentCroppingRect);
    expect(croppingRect2).toBe(currentCroppingRect);
    expect(croppingRect2.get("id")).toBe("croppingRect");
    expect(croppingRect2.left).toBe(50);
    expect(croppingRect2.top).toBe(60);
    expect(croppingRect2.width).toBe(200);
    expect(croppingRect2.height).toBe(200);
    expect(croppingRect2.scaleX).toBe(1);
    expect(croppingRect2.scaleY).toBe(1);
    expect(croppingRect2.angle).toBe(0);
  });
  test("should create a cropped image with correct properties", async () => {
    // Mock canvas
    const canvas = {
      toDataURL: jest.fn().mockReturnValue("croppedDataUrl"),
    } as unknown as Canvas;
    // Mock source rectangle
    const sourceBoundingRect = {
      left: 10,
      top: 20,
      width: 100,
      height: 200,
    };
    const source = {
      getBoundingRect: jest.fn().mockReturnValue(sourceBoundingRect),
    } as unknown as Rect;
    // Mock getNewFabricImgFromSrc
    const getNewFabricImgFromSrc = jest
      .fn()
      .mockResolvedValue(new Rect({}) as unknown as FabricImage);

    const newCroppedImg = await createCrop(
      canvas,
      source,
      getNewFabricImgFromSrc
    );

    expect(source.getBoundingRect).toHaveBeenCalled();
    expect(canvas.toDataURL).toHaveBeenCalledWith({
      multiplier: 1,
      left: sourceBoundingRect.left,
      top: sourceBoundingRect.top,
      width: sourceBoundingRect.width,
      height: sourceBoundingRect.height,
    });
    expect(getNewFabricImgFromSrc).toHaveBeenCalledWith("croppedDataUrl");
    expect(newCroppedImg.left).toBe(sourceBoundingRect.left);
    expect(newCroppedImg.top).toBe(sourceBoundingRect.top);
    expect(newCroppedImg.width).toBe(sourceBoundingRect.width);
    expect(newCroppedImg.height).toBe(sourceBoundingRect.height);
    expect(newCroppedImg.scaleX).toBe(1);
    expect(newCroppedImg.scaleY).toBe(1);
    expect(newCroppedImg.angle).toBe(0);
    expect(newCroppedImg.originX).toBe("left");
    expect(newCroppedImg.originY).toBe("top");
    expect(newCroppedImg.selectable).toBe(true);
    expect(newCroppedImg.evented).toBe(true);
  });
});
