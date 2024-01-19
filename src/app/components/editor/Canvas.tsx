"use client";

import {
  CanvasOptions,
  Canvas as FabricCanvas,
  FabricImage,
  FabricObject,
  ImageProps,
} from "fabric";
import React, { useEffect, useRef, useState } from "react";

interface CanvasProps extends React.HTMLAttributes<HTMLCanvasElement> {
  imgSrc?: string;
  canvas: FabricCanvas | null;
  loadCanvas: (c: FabricCanvas | null) => void;
}

interface InitCanvasOptions {
  el: HTMLCanvasElement | null;
  callbackFn: (c: FabricCanvas | null) => void;
  options?: Partial<CanvasOptions>;
}

export const findCanvasImgObj = (
  canvas: FabricCanvas,
  fn?: (o: FabricImage) => boolean
) => {
  return canvas
    ?.getObjects()
    .find((o) => o.type === "image" && (!fn || fn(o as FabricImage)));
};

// Center the image within the canvas
export const centerImgOnCanvas = (fImg: FabricObject, canvas: FabricCanvas) => {
  fImg
    .set({
      left: canvas.width / 2,
      top: canvas.height / 2,
      originX: "center",
      originY: "center",
    })
    .setCoords();
  fImg.fire("moving");
};

// Scale the image down while maintaining the aspect ratio
export const scaleImgToCanvas = (fImg: FabricObject, canvas: FabricCanvas) => {
  const padding = 40;
  const scaleFactor = Math.min(
    (canvas.width - padding) / fImg.width,
    (canvas.height - padding) / fImg.height
  );
  fImg.scale(scaleFactor);
  fImg.fire("scaling");
};

export const resetImgState = (fImg: FabricObject, canvas: FabricCanvas) => {
  scaleImgToCanvas(fImg, canvas);
  centerImgOnCanvas(fImg, canvas);
  fImg.rotate(0);
  fImg.fire("rotating");
  canvas.renderAll();
};

export const getNewFabricImgFromSrc = async (
  src: string,
  options?: Partial<ImageProps>
) => {
  return await FabricImage.fromURL(src, undefined, {
    snapAngle: 5,
    lockSkewingX: true,
    lockSkewingY: true,
    cornerColor: "#FCC325",
    borderColor: "#FCC325",
    ...options,
  });
};

const addImgToFabricCanvas = async (
  src: string,
  canvas: FabricCanvas,
  options?: Partial<ImageProps>
) => {
  const fImg = await getNewFabricImgFromSrc(src, options);

  scaleImgToCanvas(fImg, canvas);
  centerImgOnCanvas(fImg, canvas);
  canvas?.add(fImg);
  return fImg;
};

const initCanvas = ({ el, callbackFn, options }: InitCanvasOptions) => {
  if (el) {
    const c = new FabricCanvas(el, {
      uniScaleKey: null,
      selectionBorderColor: "#FDD66B",
      selectionColor: "#FDD66B45",
      preserveObjectStacking: true,
      ...options,
    });
    callbackFn(c);
  }
};

const destroyCanvas = (canvas: FabricCanvas | null) => {
  return canvas?.dispose();
};

export default function Canvas({
  imgSrc,
  className,
  canvas,
  loadCanvas,
  ...props
}: CanvasProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [canvasEl, setCanvasEl] = useState<HTMLCanvasElement | null>(null);
  const fImgRef = useRef<FabricImage | null>(null);

  useEffect(() => {
    // initialize the canvas
    if (canvasEl !== null && canvas === null) {
      initCanvas({ el: canvasEl, callbackFn: loadCanvas });
    }
    return () => {
      destroyCanvas(canvas)
        ?.then((r) => r && loadCanvas(null))
        .catch(console.error);
    };
  }, [canvasEl, canvas, loadCanvas]);

  useEffect(() => {
    if (canvas && imgSrc) {
      // replace the image in the canvas
      canvas.clear();
      addImgToFabricCanvas(imgSrc, canvas).then((fImg) => {
        fImgRef.current = fImg;
      });
    }
  }, [canvas, imgSrc]);

  // update the canvas size when the window is resized
  useEffect(() => {
    let resizeObserver: ResizeObserver | null = null;
    if (wrapperRef.current) {
      resizeObserver = new ResizeObserver(() => {
        if (canvas) {
          const bounds = wrapperRef.current?.getBoundingClientRect();
          if (bounds) {
            canvas.setDimensions({
              width: bounds.width,
              height: bounds.height,
            });
            if (fImgRef.current) {
              // resize image to fit the canvas but keep it in the same relative position
              scaleImgToCanvas(fImgRef.current, canvas);
            }
          }
        }
      });
      resizeObserver.observe(wrapperRef.current);
    }
    return () => {
      resizeObserver?.disconnect();
    };
  }, [canvas]);

  return (
    <div className={className} ref={wrapperRef}>
      <canvas {...props} ref={setCanvasEl} />
    </div>
  );
}
