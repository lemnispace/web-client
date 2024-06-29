"use client";

import { toFloat } from "@/utils/parsers";
import { setRef } from "@/utils/setters";
import { VariantTemplate } from "@/utils/types";
import clsx from "clsx";
import {
  CanvasOptions,
  Canvas as FabricCanvas,
  FabricImage,
  FabricObject,
  ImageProps,
} from "fabric";
import Image from "next/image";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import useClearSelection from "./useClearSelection";
import { getNewFabricImgFromSrc } from "./utils";

export const initCanvas = ({ el, callbackFn, options }: InitCanvasOptions) => {
  if (el) {
    const c = new FabricCanvas(el, {
      uniScaleKey: null,
      selectionBorderColor: "#FDD66B",
      selectionColor: "#FDD66B45",
      preserveObjectStacking: true,
      centeredRotation: true,
      centeredScaling: false,
      ...options,
    });
    callbackFn(c);
  }
};
interface CanvasProps extends React.HTMLAttributes<HTMLCanvasElement> {
  imgSrc?: string;
  canvas: FabricCanvas | null;
  loadCanvas: (c: FabricCanvas | null) => void;
  template: VariantTemplate;
}

interface InitCanvasOptions {
  el: HTMLCanvasElement | null;
  callbackFn: (c: FabricCanvas | null) => void;
  options?: Partial<CanvasOptions>;
}

// Center the image within the canvas
export const centerImgOnCanvas = (fImg: FabricObject, canvas: FabricCanvas) => {
  canvas.centerObject(fImg);
  fImg.fire("moving");
};

// Scale the image down while maintaining the aspect ratio
export const scaleImgToCanvas = (
  fImg: FabricObject,
  canvas: FabricCanvas,
  padding = 40
) => {
  // canvas dimensions can become 0 when the canvas is not visible
  if (canvas.width <= 0 || canvas.height <= 0) {
    return;
  }
  if (padding > canvas.width || padding > canvas.height) {
    console.warn("Padding cannot be larger than the canvas width or height");
  }
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

export const resizeCanvas = (
  canvas: FabricCanvas | null,
  wrapper: HTMLDivElement | null,
  img: FabricImage | null
) => {
  if (canvas && wrapper) {
    const bounds = wrapper.getBoundingClientRect();
    const computedStyle = getComputedStyle(wrapper);
    const paddingTop = toFloat(computedStyle.paddingTop) || 0;
    const paddingBottom = toFloat(computedStyle.paddingBottom) || 0;
    const paddingLeft = toFloat(computedStyle.paddingLeft) || 0;
    const paddingRight = toFloat(computedStyle.paddingRight) || 0;
    const canvasWidth = bounds.width - paddingLeft - paddingRight;
    const canvasHeight = bounds.height - paddingTop - paddingBottom;
    canvas.setDimensions({
      width: canvasWidth,
      height: canvasHeight,
    });
    if (img) {
      // resize image to fit the canvas but keep it in the same relative position
      scaleImgToCanvas(img, canvas);
    }
  }
};

export const addImgToFabricCanvas = async (
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

const destroyCanvas = (canvas: FabricCanvas | null) => {
  return canvas?.dispose();
};

function Canvas(
  {
    imgSrc,
    className,
    canvas,
    loadCanvas,
    style,
    template,
    ...props
  }: CanvasProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [canvasEl, setCanvasEl] = useState<HTMLCanvasElement | null>(null);
  const fImgRef = useRef<FabricImage | null>(null);
  useClearSelection(canvas, canvasEl);

  useEffect(() => {
    // initialize the canvas
    if (canvasEl !== null && canvas === null) {
      initCanvas({ el: canvasEl, callbackFn: loadCanvas });
    }
    return () => {
      destroyCanvas(canvas)
        ?.then((success) => success && loadCanvas(null))
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
        resizeCanvas(canvas, wrapperRef.current, fImgRef.current);
      });
      resizeObserver.observe(wrapperRef.current);
    }
    return () => {
      resizeObserver?.disconnect();
    };
  }, [canvas]);

  return (
    <div
      className={clsx("relative", className)}
      style={{
        width: template.templateWidth,
        height: template.templateHeight,
      }}
    >
      {template?.imageUrl && (
        <Image
          src={template.imageUrl}
          alt="template background image"
          className="absolute z-0 top-0 left-0 w-full h-full"
          width={template.templateWidth}
          height={template.templateHeight}
          priority
        />
      )}
      {/**
       * The canvas is wrapped in an additional div to allow for resizing the canvas without ruining the aspect ratio
       */}
      <div
        ref={(divRef) => {
          wrapperRef.current = divRef;
          setRef(ref, divRef);
        }}
        className="relative"
        style={{
          width: template.printAreaWidth,
          height: template.printAreaHeight,
          top: template.printAreaTop,
          left: template.printAreaLeft,
        }}
      >
        <canvas
          {...props}
          ref={setCanvasEl}
          style={{
            ...style,
            width: template.printAreaWidth,
            height: template.printAreaHeight,
            top: template.printAreaTop,
            left: template.printAreaLeft,
          }}
        />
      </div>
    </div>
  );
}

export default forwardRef<HTMLDivElement, CanvasProps>(Canvas);
