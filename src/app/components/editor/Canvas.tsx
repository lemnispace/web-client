"use client";

import {
  CanvasOptions,
  Canvas as FabricCanvas,
  FabricImage,
  FabricObject,
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

export const findCanvasImgObj = (canvas: FabricCanvas) => {
  return canvas?.getObjects().find((o) => o.type === "image");
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
};

// Scale the image down while maintaining the aspect ratio
export const scaleImgToCanvas = (fImg: FabricObject, canvas: FabricCanvas) => {
  const scaleFactor = Math.min(
    canvas.width / fImg.width,
    canvas.height / fImg.height
  );
  fImg.scale(scaleFactor);
};

const addImgToFabricCanvas = async (src: string, canvas: FabricCanvas) => {
  const fImg = await FabricImage.fromURL(src, undefined, {});
  scaleImgToCanvas(fImg, canvas);
  centerImgOnCanvas(fImg, canvas);
  canvas?.add(fImg);
  return fImg;
};

const initCanvas = ({ el, callbackFn, options }: InitCanvasOptions) => {
  if (el) {
    const c = new FabricCanvas(el, options);
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
