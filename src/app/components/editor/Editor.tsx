"use client";
import { CropIcon } from "@/components/icons/crop";
import { Loader } from "@/components/loader";
import { filterObject } from "@/utils/mappers";
import {
  ArrowPathIcon,
  ArrowsPointingInIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import imglyRemoveBackground from "@imgly/background-removal";
import { Canvas as FabricCanvas } from "fabric";
import React, { useState } from "react";
import Canvas, { centerImgOnCanvas, resetImgState } from "./Canvas";
import EditorMenu, { EditorControlItemProps } from "./EditorMenu";
import { useCrop } from "./useCrop";
import { useImgSrc } from "./useImgSrc";
import { findCanvasImgObj } from "./utils";

export type ImgSource =
  | ImageData
  | ArrayBuffer
  | Uint8Array
  | Blob
  | URL
  | string;

interface EditorProps {
  imgSrc: ImgSource;
  imgName?: string;
  customActions?: EditorControlItemProps[];
  dimensions?: { width: number; height: number };
  backgroundImgUrl?: string;
}

const removeBackground = async (
  image_src: ImgSource,
  handleProgress?: (
    args_0: string,
    args_1: number,
    args_2: number,
    ...args_3: unknown[]
  ) => void
): Promise<Blob> => {
  // The result is a blob encoded as PNG. It can be converted to an URL to be used as HTMLImage.src
  const blob = await imglyRemoveBackground(image_src, {
    progress: handleProgress,
  });
  return blob;
};

export default function Editor({
  dimensions,
  backgroundImgUrl,
  ...props
}: EditorProps) {
  const [fCanvas, setFcanvas] = useState<FabricCanvas | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [src, setImgSrc] = useImgSrc(props.imgSrc);
  const [startCrop, endCrop, isCropActive, resetCrop] = useCrop(fCanvas, src);

  const handleRemoveBackground = () => {
    if (!src) {
      console.error("No image source");
      setStatus("error");
      return;
    }
    setStatus("loading");
    removeBackground(src)
      .then((blob) => {
        setImgSrc(blob);
        setStatus("idle");
      })
      .catch((e) => {
        console.error(e);
        setStatus("error");
      });
  };

  const handleReset = () => {
    setImgSrc(null);
    setStatus("idle");
    if (fCanvas) {
      resetCrop();
      const img = findCanvasImgObj(fCanvas, (o) => o.visible);
      img && resetImgState(img, fCanvas);
    }
  };

  const handleCenter = () => {
    if (fCanvas) {
      const img = findCanvasImgObj(fCanvas, (o) => o.visible);
      img && centerImgOnCanvas(img, fCanvas);
      fCanvas.requestRenderAll();
    }
  };

  const handleCrop = () => {
    if (!isCropActive) {
      startCrop();
    } else {
      endCrop();
    }
  };

  const actions: EditorControlItemProps[] = [
    {
      label: "Reset",
      icon: <ArrowPathIcon className="h-6 w-6 stroke-white" />,
      onClick: handleReset,
    },
    {
      label: "BG Remove",
      icon: <PhotoIcon className="h-6 w-6 stroke-white" />,
      onClick: handleRemoveBackground,
      disabled: isCropActive,
    },
    {
      label: "Center",
      icon: <ArrowsPointingInIcon className="h-6 w-6 stroke-white" />,
      onClick: handleCenter,
    },
    {
      label: "Crop",
      icon: <CropIcon className="h-6 w-6 stroke-white" />,
      onClick: handleCrop,
    },
  ];

  if (props.customActions) {
    actions.push(...props.customActions);
  }

  return (
    <div className="mt-4 relative flex flex-col-reverse md:flex-row items-stretch justify-between border-2 border-neutral-800 rounded-lg bg-neutral-300 overflow-hidden min-h-96 h-screen">
      {status === "loading" && (
        <div className="h-full w-full bg-gray-900/50 flex items-center justify-center absolute cursor-wait z-50">
          <Loader
            status={status}
            className="fill-primary-500"
            pathColor="rgb(17 24 39 / 0.5)"
          />
        </div>
      )}
      <EditorMenu
        actions={actions}
        disabled={status === "loading" || !fCanvas}
        className="flex-row md:flex-col"
      />
      <div className="flex flex-1 px-4 py-4 md:px-8 overflow-auto items-center">
        <Canvas
          className="w-full bg-neutral-600 rounded-lg bg-cover bg-center bg-no-repeat max-h-full"
          style={filterObject({
            backgroundImage: backgroundImgUrl && `url('${backgroundImgUrl}')`,
            aspectRatio:
              dimensions && `${dimensions.width}/${dimensions.height}`,
          })}
          imgSrc={src}
          canvas={fCanvas}
          loadCanvas={setFcanvas}
        />
      </div>
    </div>
  );
}
