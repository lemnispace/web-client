"use client";

import {
  Canvas as FabricCanvas,
  FabricImage,
  FabricObject,
  Group,
  Rect,
} from "fabric";
import { useCallback, useEffect, useRef, useState } from "react";
import { findCanvasImgFromSrc, getNewFabricImgFromSrc } from "./utils";

// This function will sync the position, size, and rotation of two objects, setting the second object to match the first.
export const syncObjects = (
  canvas: FabricCanvas,
  source: FabricObject,
  target: FabricObject,
  getProps?: (src: FabricObject, target: FabricObject) => Partial<FabricObject>
) => {
  const props = getProps
    ? getProps(source, target)
    : {
        top: source.top,
        left: source.left,
        width: source.width,
        height: source.height,
        scaleX: source.scaleX,
        scaleY: source.scaleY,
        originX: source.originX,
        originY: source.originY,
        angle: source.angle,
      };
  target.set(props).setCoords();
  // Render the canvas to display the updated view
  canvas.requestRenderAll();
};

export const freezeFabricObj = (img: FabricObject) => {
  img.set({
    selectable: false,
    evented: false,
  });
};

export const unfreezeFabricObj = (img: FabricObject) => {
  img.set({
    selectable: true,
    evented: true,
  });
};

export const hideFabricObj = (obj: FabricObject) => {
  freezeFabricObj(obj);
  obj.set({
    visible: false,
  });
};

export const showFabricObj = (obj: FabricObject) => {
  unfreezeFabricObj(obj);
  obj.set({
    visible: true,
  });
};

export const addSyncEventHandlers = (
  obj: FabricObject,
  handler: VoidFunction,
  events: ("moving" | "scaling" | "rotating" | "skewing" | "modified")[] = [
    "moving",
    "scaling",
    "rotating",
    "skewing",
    "modified",
  ]
) => {
  events.forEach((event) => {
    obj.on(event, handler);
  });
  // cleanup
  return () => {
    events.forEach((event) => {
      obj.off(event, handler);
    });
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
export const init = ({
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
  freezeFabricObj(img);
  freezeFabricObj(croppedImg);

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

export const getImg = (
  canvas: FabricCanvas,
  imgSrc: string,
  current?: FabricImage | null
) => {
  if (!current) {
    const img = findCanvasImgFromSrc(canvas, imgSrc);
    if (!img) {
      throw new Error("image not found");
    }
    return img;
  }
  return current;
};

export const getClipPath = (croppingRect: Rect, current?: Rect | null) => {
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
export const getCroppedImg = async (
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
export const getOverlay = (canvas: FabricCanvas, current?: Rect | null) => {
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

export const createCrop = async (
  canvas: FabricCanvas,
  source: Rect,
  getNewImgFromSrc = getNewFabricImgFromSrc
) => {
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
  const newCroppedImg = await getNewImgFromSrc(croppedDataUrl);
  newCroppedImg
    .set({
      left: sourceBoundingRect.left,
      top: sourceBoundingRect.top,
      width: sourceBoundingRect.width,
      height: sourceBoundingRect.height,
      scaleX: 1,
      scaleY: 1,
      angle: 0,
      originX: "left",
      originY: "top",
      selectable: true,
      evented: true,
      id: "newCroppedImg",
    })
    .setCoords();
  return newCroppedImg;
};

// rectangle that will be used to crop the image
export const getCroppingRect = (obj: FabricObject, current?: Rect | null) => {
  let croppingRect: Rect;
  if (!current) {
    croppingRect = new Rect({
      originX: "left",
      originY: "top",
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
    });
  } else {
    croppingRect = current;
  }
  croppingRect.set({
    id: "croppingRect",
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

export const addImgGroup = (
  canvas: FabricCanvas,
  img: FabricImage,
  croppedImg: FabricImage
) => {
  const croppedImgGroup = new Group([croppedImg, img], {
    top: img.top,
    left: img.left,
  });
  canvas.add(croppedImgGroup);
  return croppedImgGroup;
};

export const useCrop = (canvas: FabricCanvas | null, imgSrc: string) => {
  const [isCropActive, setCropActive] = useState(false);
  const imgRef = useRef<FabricImage | null>(null);
  const croppedImgRef = useRef<FabricImage | null>(null);
  const overlayRef = useRef<Rect | null>(null);
  const croppingRectRef = useRef<Rect | null>(null);
  const clipPathRef = useRef<Rect | null>(null);
  const newCroppedImgRef = useRef<FabricImage | null>(null);
  const newCroppedImgGroupRef = useRef<Group | null>(null);

  const destroyCroppingResources = useCallback(() => {
    if (!canvas) return;
    canvas.discardActiveObject();
    croppedImgRef.current && canvas.remove(croppedImgRef.current);
    overlayRef.current && canvas.remove(overlayRef.current);
    croppingRectRef.current && canvas.remove(croppingRectRef.current);
    clipPathRef.current && canvas.remove(clipPathRef.current);
    newCroppedImgRef.current && canvas.remove(newCroppedImgRef.current);
    if (newCroppedImgGroupRef.current) {
      newCroppedImgGroupRef.current.removeAll();
      canvas.remove(newCroppedImgGroupRef.current);
    }
    // doesn't destroy the imgRef because it is used to reset the canvas

    croppedImgRef.current = null;
    overlayRef.current = null;
    croppingRectRef.current = null;
    clipPathRef.current = null;
    newCroppedImgGroupRef.current = null;
    newCroppedImgRef.current = null;
  }, [canvas]);

  const resetAll = useCallback(() => {
    if (canvas) {
      destroyCroppingResources();
      if (imgRef.current) {
        showFabricObj(imgRef.current);
        // reset the image to its original state
        canvas.remove(imgRef.current);
        canvas.add(imgRef.current);
      }
      canvas.requestRenderAll();
      setCropActive(false);
    }
  }, [canvas, destroyCroppingResources]);

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
      const croppingRect = getCroppingRect(
        newCroppedImgRef.current ?? img,
        croppingRectRef.current
      );
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
        destroyCroppingResources();
        const { croppedImg, overlay, croppingRect, clipPath, img } =
          await initResources(canvas, imgSrc);
        // ensure the overlay, cropped image, the original image, and cropping rectangle are visible
        [croppedImg, overlay, croppingRect, clipPath, img].forEach(
          showFabricObj
        );
        // prevent image from being scaled or rotated while cropping
        freezeFabricObj(img);
        freezeFabricObj(croppedImg);
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
  }, [canvas, imgSrc, initResources, destroyCroppingResources]);

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
    const newCroppedImg = await createCrop(canvas, clipPathRef.current);
    return newCroppedImg;
  }, []);

  const stop = useCallback(async () => {
    if (canvas && imgRef.current) {
      if (
        !croppedImgRef.current ||
        !clipPathRef.current ||
        !croppingRectRef.current
      ) {
        // no cropped image or clip path means the image was not cropped
        unfreezeFabricObj(imgRef.current);
        canvas.setActiveObject(imgRef.current);
      } else {
        hideFabricObj(imgRef.current);
        const newCroppedImg = await prepareCrop(canvas);
        // setup the new cropped image
        const croppedImgGroup = addImgGroup(
          canvas,
          imgRef.current,
          newCroppedImg
        );
        destroyCroppingResources();
        newCroppedImgGroupRef.current = croppedImgGroup;
        newCroppedImgRef.current = newCroppedImg;
        canvas.setActiveObject(newCroppedImgGroupRef.current);
      }
      canvas.requestRenderAll();
      setCropActive(false);
    }
  }, [canvas, destroyCroppingResources, prepareCrop]);

  return [start, stop, isCropActive, resetAll] as const;
};
