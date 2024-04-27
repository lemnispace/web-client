"use client";
import { CropIcon } from "@/components/icons/crop";
import { Loader } from "@/components/loader";
import { filterObject } from "@/utils/mappers";
import {
  ArrowPathIcon,
  ArrowsPointingInIcon,
  EyeIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Canvas as FabricCanvas } from "fabric";
import React, { useCallback, useEffect, useState } from "react";
import { Area } from "react-easy-crop";
import Canvas, { centerImgOnCanvas, resetImgState } from "./Canvas";
import Crop from "./Crop";
import EditorMenu, { EditorControlItemProps } from "./EditorMenu";
import { fetchMosaic } from "./fetchMosaic";
import { useImgSrc } from "./useImgSrc";
import {
  ImgSource,
  findCanvasImgObj,
  getCroppedImg,
  removeBackground,
} from "./utils";

interface EditorProps {
  imgSrc: ImgSource;
  imgName?: string;
  customActions?: EditorControlItemProps[];
  dimensions?: { width: number; height: number };
  backgroundImgUrl?: string;
}
// track the state of the image source
const useImgSourcesState = (imgSrc: ImgSource) => {
  const [originalImgSrc, setImgSrc] = useImgSrc(imgSrc);
  const [cropImgSrc, setCropImgSrc] = useState<string | null>(null);
  const src = cropImgSrc || originalImgSrc;
  useEffect(() => {
    setCropImgSrc(null);
    // whenever the original image source changes, reset the crop image source
  }, [originalImgSrc]);

  return { originalImgSrc, updateImgSrc: setImgSrc, src, setCropImgSrc };
};

export default function Editor({ dimensions, ...props }: EditorProps) {
  const [fCanvas, setFcanvas] = useState<FabricCanvas | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const imgSources = useImgSourcesState(props.imgSrc);
  const [isTextMosaicPreview, setIsTextMosaicPreview] = useState(false);
  const [isCropActive, setIsCropActive] = useState(false);
  const handleRemoveBackground = () => {
    if (!imgSources.src) {
      console.error("No image to process");
      setStatusMessage("No image to process");
      setStatus("error");
      return;
    }
    // Reset the status message
    setStatusMessage("");
    setStatus("loading");
    removeBackground(imgSources.src, (message, progress) => {
      setStatusMessage(!!progress ? `${message}\n${progress}%` : message);
    })
      .then((blob) => {
        imgSources.updateImgSrc(blob);
        setStatus("idle");
        setStatusMessage("");
      })
      .catch((e) => {
        console.error(e);
        setStatus("error");
        setStatusMessage("Error removing background");
      });
  };

  const handleReset = () => {
    imgSources.updateImgSrc(null);
    setIsTextMosaicPreview(false);
    setStatus("idle");
    setStatusMessage("");
    if (fCanvas) {
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

  const handleCropComplete = (
    originalImgSrc: string,
    croppedAreaPixels: Area
  ) => {
    getCroppedImg(originalImgSrc, croppedAreaPixels)
      .then((croppedImgUrl) => {
        croppedImgUrl && imgSources.setCropImgSrc(croppedImgUrl);
        setIsCropActive(false);
      })
      .catch(console.error);
  };

  const handlePreview = async () => {
    if (fCanvas) {
      try {
        setStatus("loading");
        setStatusMessage(
          "Turning your pixels into a unique text masterpiece. Almost there!"
        );
        const textMosaicImg = await fetchMosaic(fCanvas, "Hello, World!");
        if (!textMosaicImg) {
          console.error("Error generating mosaic: No image returned");
          setStatus("error");
          setStatusMessage("Error generating mosaic");
          return;
        }
        setStatus("idle");
        setStatusMessage("");
        imgSources.updateImgSrc(textMosaicImg);
        setIsTextMosaicPreview(true);
      } catch (error) {
        console.error("Error generating mosaic:", error);
        setStatus("error");
        setStatusMessage("Error generating mosaic");
      }
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
      disabled: isTextMosaicPreview,
    },
    {
      label: "Center",
      icon: <ArrowsPointingInIcon className="h-6 w-6 stroke-white" />,
      onClick: handleCenter,
    },
    {
      label: "Crop",
      icon: <CropIcon className="h-6 w-6 stroke-white" />,
      onClick: () => setIsCropActive(true),
    },
    {
      label: "Preview",
      icon: <EyeIcon className="h-6 w-6 stroke-white" />,
      onClick: handlePreview,
      disabled: isTextMosaicPreview,
    },
  ];

  if (props.customActions) {
    actions.push(...props.customActions);
  }

  return (
    <form className="mt-4 relative flex flex-col-reverse md:flex-row items-stretch justify-between border-2 border-neutral-800 rounded-lg bg-neutral-300 overflow-hidden">
      <EditorMenu
        actions={actions}
        disabled={status === "loading" || !fCanvas || isCropActive}
        className="flex-row md:flex-col"
      />
      <div
        className={clsx(
          "flex flex-1 px-4 py-4 md:mx-auto md:max-w-2xl lg:max-w-3xl md:px-8 overflow-auto items-center relative",
          isCropActive && "bg-neutral-900"
        )}
      >
        {status === "loading" && (
          <div className="-ml-4 md:-ml-8 h-full w-full bg-gray-900/75 flex flex-col items-center justify-center absolute cursor-wait z-50">
            <Loader
              status={status}
              className="fill-secondary-500 w-10 h-10"
              pathColor="#E5E5E5"
            />
            {!!statusMessage && (
              <p className="text-neutral-200 font-semibold py-2 text-xs sm:text-sm md:text-base text-center">
                {statusMessage}
              </p>
            )}
          </div>
        )}
        {isCropActive && (
          <Crop
            imgSrc={imgSources.originalImgSrc}
            aspectRatio={dimensions && dimensions.width / dimensions.height}
            className="bg-transparent rounded-lg p-2 md:p-4"
            onCropComplete={handleCropComplete}
            onCancel={() => setIsCropActive(false)}
            canvas={fCanvas}
          />
        )}
        <Canvas
          className={clsx(
            "w-full bg-neutral-600 rounded-lg border-dashed border-2 border-white",
            isCropActive && "hidden"
          )}
          style={filterObject({
            aspectRatio:
              dimensions && `${dimensions.width}/${dimensions.height}`,
          })}
          imgSrc={imgSources.src}
          canvas={fCanvas}
          loadCanvas={setFcanvas}
        />
      </div>
    </form>
  );
}
