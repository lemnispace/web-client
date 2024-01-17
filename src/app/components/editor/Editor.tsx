"use client";
import { Loader } from "@/components/loader";
import {
  ArrowPathIcon,
  ArrowsPointingInIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import imglyRemoveBackground from "@imgly/background-removal";
import clsx from "clsx";
import { Canvas as FabricCanvas } from "fabric";
import React, { useState } from "react";
import Canvas, { centerImgOnCanvas, findCanvasImgObj } from "./Canvas";
import EditorMenu, { EditorControlItemProps } from "./EditorMenu";
import { useImgSrc } from "./useImgSrc";

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

export default function Editor(props: EditorProps) {
  const [fCanvas, setFcanvas] = useState<FabricCanvas | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [src, setImgSrc] = useImgSrc(props.imgSrc);

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
  };

  const handleCenter = () => {
    if (fCanvas) {
      const img = findCanvasImgObj(fCanvas);
      img && centerImgOnCanvas(img, fCanvas);
      fCanvas.renderAll();
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
    },
    {
      label: "Center",
      icon: <ArrowsPointingInIcon className="h-6 w-6 stroke-white" />,
      onClick: handleCenter,
    },
  ];

  if (props.customActions) {
    actions.push(...props.customActions);
  }

  return (
    <div className="mt-4 relative flex flex-col-reverse md:flex-row items-stretch justify-between border-2 border-neutral-800 rounded-lg bg-neutral-300 overflow-hidden min-h-64 h-screen">
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
        disabled={status === "loading"}
        className="flex-row md:flex-col"
      />
      <div className="flex flex-1 px-4 py-4 md:px-8 overflow-auto">
        <Canvas
          className={clsx("h-full w-full bg-neutral-600 rounded-lg")}
          imgSrc={src}
          canvas={fCanvas}
          loadCanvas={setFcanvas}
        />
      </div>
    </div>
  );
}
