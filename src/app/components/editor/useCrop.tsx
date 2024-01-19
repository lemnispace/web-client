"use client";

import {
  Canvas as FabricCanvas,
  FabricImage,
  FabricObject,
  Rect,
} from "fabric";
import { useCallback, useEffect, useRef, useState } from "react";
import { findCanvasImgObj, getNewFabricImgFromSrc } from "./Canvas";

const getCanvasImg = (
  canvas: FabricCanvas,
  src: string
): FabricImage | null => {
  const img = findCanvasImgObj(canvas, (o) => o.getSrc() === src);
  return (img as FabricImage) || null;
};

// This function will sync the position, size, and rotation of two objects, setting the second object to match the first.
const syncObjects = (
  canvas: FabricCanvas,
  source: FabricObject,
  target: FabricObject
) => {
  target.set({
    top: source.top,
    left: source.left,
    width: source.width,
    height: source.height,
    scaleX: source.scaleX,
    scaleY: source.scaleY,
    originX: source.originX,
    originY: source.originY,
    angle: source.angle,
  });
  // Render the canvas to display the updated view
  canvas.requestRenderAll();
};

const freezeImg = (img: FabricImage) => {
  img.set({
    selectable: false,
    evented: false,
  });
};

const unfreezeImg = (img: FabricImage) => {
  img.set({
    selectable: true,
    evented: true,
  });
};

const hideFabricObj = (obj: FabricImage | Rect) => {
  obj.set({
    selectable: false,
    evented: false,
    visible: false,
  });
};

const showFabricObj = (obj: FabricImage | Rect) => {
  obj.set({
    selectable: true,
    evented: true,
    visible: true,
  });
};

const addSyncEventHandlers = (obj: FabricObject, handler: VoidFunction) => {
  obj.on("moving", handler);
  obj.on("scaling", handler);
  obj.on("rotating", handler);
  obj.on("skewing", handler);
  obj.on("modified", handler);

  // cleanup
  return () => {
    obj.off("moving", handler);
    obj.off("scaling", handler);
    obj.off("rotating", handler);
    obj.off("skewing", handler);
    obj.off("modified", handler);
  };
};

interface InitCanvasOptions {
  canvas: FabricCanvas;
  croppedImg: FabricImage;
  overlay: Rect;
  croppingRect: Rect;
  clipPath: Rect;
  img: FabricImage;
}
const init = ({
  croppedImg,
  overlay,
  croppingRect,
  clipPath,
  img,
  canvas,
}: InitCanvasOptions) => {
  // ensure the overlay, cropped image, the original image, and cropping rectangle are visible
  [croppedImg, overlay, croppingRect, clipPath, img].forEach(showFabricObj);
  // prevent image from being scaled or rotated while cropping
  freezeImg(img);
  freezeImg(croppedImg);

  const croppingRectCleanupHandlers = addSyncEventHandlers(croppingRect, () => {
    // this function will re-render the 'hole' in the overlay whenever the cropping rectangle changes.
    syncObjects(canvas, croppingRect, clipPath);
  });
  const imgCleanupHandlers = addSyncEventHandlers(img, () => {
    // sync img movements with cropped image
    syncObjects(canvas, img, croppedImg);
    syncObjects(canvas, img, croppingRect);
    syncObjects(canvas, img, clipPath);
  });
  const croppedImgCleanupHandlers = addSyncEventHandlers(croppedImg, () => {
    // this function will allow the cropped image to be moved, scaled, rotated, and skewed while maintaining the clipping path
    syncObjects(canvas, croppedImg, croppingRect);
  });

  // cleanup
  return () => {
    croppingRectCleanupHandlers();
    imgCleanupHandlers();
    croppedImgCleanupHandlers();
  };
};

const getImg = (
  canvas: FabricCanvas,
  imgSrc: string,
  current?: FabricImage | null
) => {
  if (!current) {
    const img = getCanvasImg(canvas, imgSrc);
    if (!img) {
      throw new Error("image not found");
    }
    return img;
  }
  return current;
};

const getClipPath = (croppingRect: Rect, current?: Rect | null) => {
  if (!current) {
    const clipPath = new Rect({
      top: croppingRect.top,
      left: croppingRect.left,
      width: croppingRect.width,
      height: croppingRect.height,
      originX: croppingRect.originX,
      originY: croppingRect.originY,
      scaleX: croppingRect.scaleX,
      scaleY: croppingRect.scaleY,
      angle: croppingRect.angle,
      absolutePositioned: true,
      id: "clipPath",
    });
    return clipPath;
  }
  return current;
};

// cloned image that will be cropped
const getCroppedImg = async (
  img: FabricImage,
  current?: FabricImage | null
) => {
  let croppedImg: FabricImage;
  if (current) {
    croppedImg = current;
  } else {
    croppedImg = await img.clone();
  }
  croppedImg.set({
    left: img.left,
    top: img.top,
    width: img.width,
    height: img.height,
    scaleX: img.scaleX,
    scaleY: img.scaleY,
    angle: img.angle,
    id: "croppedImg",
    selectable: false,
  });
  return croppedImg;
};

// overlay that will be used to 'hide' the rest of the image
const getOverlay = (canvas: FabricCanvas, current?: Rect | null) => {
  if (!current) {
    const overlay = new Rect({
      fill: "rgba(0, 0, 0, 0.5)", // Semi-transparent overlay
      selectable: false,
      evented: false,
      excludeFromExport: true, // This will prevent the overlay from being exported,
      id: "overlay",
    });
    // sync canvas size with overlay size
    canvas.on("before:render", () => {
      overlay.set({
        left: 0,
        top: 0,
        width: canvas.width,
        height: canvas.height,
      });
    });
    return overlay;
  }
  return current;
};

const createCrop = async (canvas: FabricCanvas, source: Rect) => {
  const sourceBoundingRect = source.getBoundingRect();
  // Use toDataURL to create a cropped version of the image
  const croppedDataUrl = canvas.toDataURL({
    multiplier: 1,
    left: sourceBoundingRect.left,
    top: sourceBoundingRect.top,
    width: sourceBoundingRect.width,
    height: sourceBoundingRect.height,
  });

  // Create a new FabricImage from the cropped data
  const newCroppedImg = await getNewFabricImgFromSrc(croppedDataUrl);
  newCroppedImg.set({
    left: sourceBoundingRect.left,
    top: sourceBoundingRect.top,
    width: sourceBoundingRect.width,
    height: sourceBoundingRect.height,
    scaleX: 1,
    scaleY: 1,
    angle: 0,
    selectable: true,
    evented: true,
  });
  return newCroppedImg;
};

// rectangle that will be used to crop the image
const getCroppingRect = (obj: FabricObject, current?: Rect | null) => {
  let croppingRect: Rect;
  if (!current) {
    croppingRect = new Rect({
      originX: "center",
      originY: "center",
      fill: null, // No fill, to allow click through
      stroke: null, // No stroke, to allow click through
      strokeWidth: 2,
      selectable: true,
      hasControls: true,
      lockSkewingX: true,
      lockSkewingY: true,
      borderColor: "#22c55e",
      borderDashArray: [5, 5],
      cornerColor: "#22c55e",
      excludeFromExport: true, // This will prevent the rectangle from being exported,
      id: "croppingRect",
    });
  } else {
    croppingRect = current;
  }
  croppingRect.set({
    left: obj.left,
    top: obj.top,
    width: obj.width,
    height: obj.height,
    scaleX: obj.scaleX,
    scaleY: obj.scaleY,
    angle: obj.angle, // Match the image rotation
  });
  return croppingRect;
};

export const useCrop = (canvas: FabricCanvas | null, imgSrc: string) => {
  const [isCropActive, setCropActive] = useState(false);
  const imgRef = useRef<FabricImage | null>(null);
  const croppedImgRef = useRef<FabricImage | null>(null);
  const overlayRef = useRef<Rect | null>(null);
  const croppingRectRef = useRef<Rect | null>(null);
  const clipPathRef = useRef<Rect | null>(null);
  const stopCleanupRef = useRef<(() => void) | null>(null);

  const destroyResources = useCallback(() => {
    if (!canvas) return;
    croppedImgRef.current && canvas.remove(croppedImgRef.current);
    overlayRef.current && canvas.remove(overlayRef.current);
    croppingRectRef.current && canvas.remove(croppingRectRef.current);
    clipPathRef.current && canvas.remove(clipPathRef.current);

    croppedImgRef.current = null;
    overlayRef.current = null;
    croppingRectRef.current = null;
    clipPathRef.current = null;
  }, [canvas]);

  const resetAll = useCallback(() => {
    if (canvas) {
      if (imgRef.current) {
        showFabricObj(imgRef.current);
        canvas.setActiveObject(imgRef.current);
      }
      stopCleanupRef.current?.();
      destroyResources();
      canvas.requestRenderAll();
      setCropActive(false);
    }
  }, [canvas, destroyResources]);

  useEffect(() => {
    if (imgRef.current && imgRef.current.getSrc() !== imgSrc) {
      // reset if imgSrc changes
      resetAll();
      imgRef.current = null;
      canvas?.discardActiveObject();
      canvas?.requestRenderAll();
    }
  }, [canvas, resetAll, imgSrc]);

  const initResources = useCallback(
    async (canvas: FabricCanvas, imgSrc: string) => {
      const img = getImg(canvas, imgSrc, imgRef.current);
      if (!imgRef.current) {
        imgRef.current = img;
      }
      const croppedImg = await getCroppedImg(img, croppedImgRef.current);
      const overlay = getOverlay(canvas, overlayRef.current);
      const croppingRect = getCroppingRect(img, croppingRectRef.current);
      const clipPath = getClipPath(croppingRect, clipPathRef.current);
      if (!croppedImg.clipPath) {
        // apply the clipping path to the cropped image (this is essentially what 'crops' the image)
        croppedImg.clipPath = clipPath;
      }
      if (!clipPathRef.current) {
        clipPathRef.current = clipPath;
      }
      if (!overlayRef.current) {
        overlayRef.current = overlay;
        canvas.add(overlay);
      }
      if (!croppingRectRef.current) {
        croppingRectRef.current = croppingRect;
        canvas.add(croppingRect);
      }
      if (!croppedImgRef.current) {
        croppedImgRef.current = croppedImg;
        canvas.add(croppedImg);
      }
      return {
        croppedImg,
        overlay,
        croppingRect,
        clipPath,
        img,
      };
    },
    []
  );

  const start = useCallback(async () => {
    if (canvas) {
      try {
        const { croppedImg, overlay, croppingRect, clipPath, img } =
          await initResources(canvas, imgSrc);
        stopCleanupRef.current?.();
        // ensure the overlay, cropped image, the original image, and cropping rectangle are visible
        [croppedImg, overlay, croppingRect, clipPath, img].forEach(
          showFabricObj
        );
        // prevent image from being scaled or rotated while cropping
        freezeImg(img);
        freezeImg(croppedImg);
        canvas.setActiveObject(croppingRect);

        init({
          canvas,
          croppedImg,
          overlay,
          croppingRect,
          clipPath,
          img,
        });
        canvas.requestRenderAll();
        setCropActive(true);
      } catch (e) {
        setCropActive(false);
        console.error("failed to start cropping. ", e);
      }
    }
  }, [canvas, imgSrc, initResources]);

  const prepareCrop = useCallback(async (canvas: FabricCanvas) => {
    if (
      !clipPathRef.current ||
      !overlayRef.current ||
      !croppingRectRef.current
    ) {
      throw new Error("missing resources");
    }
    // hide the overlay and cropping rectangle to exclude them from the created image
    overlayRef.current && hideFabricObj(overlayRef.current);
    croppingRectRef.current && hideFabricObj(croppingRectRef.current);
    canvas.discardActiveObject();
    return await createCrop(canvas, clipPathRef.current);
  }, []);

  const stop = useCallback(async () => {
    if (canvas && imgRef.current) {
      const img = imgRef.current;
      if (
        !croppedImgRef.current ||
        !clipPathRef.current ||
        !croppingRectRef.current
      ) {
        // no cropped image or clip path means the image was not cropped
        unfreezeImg(img);
        canvas.setActiveObject(img);
      } else {
        hideFabricObj(img);
        const newCroppedImg = await prepareCrop(canvas);
        destroyResources();
        canvas.add(newCroppedImg);
        canvas.setActiveObject(newCroppedImg);

        stopCleanupRef.current = () => {
          canvas.remove(newCroppedImg);
        };
      }
      canvas.requestRenderAll();
      setCropActive(false);
    }
  }, [canvas, destroyResources, prepareCrop]);

  return [start, stop, isCropActive, resetAll] as const;
};
