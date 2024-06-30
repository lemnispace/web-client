"use client";

import { CropIcon } from "@/components/icons/crop";
import {
  ERROR_TEXTS,
  IMAGE_EDITOR_MENU_TEXT,
  IMAGE_EDITOR_STATUS_TEXT,
} from "@/utils/text";
import { VariantTemplate } from "@/utils/types";
import {
  ArrowPathIcon,
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  CloudArrowUpIcon,
  PaintBrushIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { Canvas as FabricCanvas } from "fabric";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Area } from "react-easy-crop";
import { ReactZoomPanPinchContentRef } from "react-zoom-pan-pinch";
import { centerImgOnCanvas, resetImgState } from "./Canvas";
import { EditorControlItemProps } from "./EditorMenu";
import { fetchMosaic } from "./fetchMosaic";
import useEditorStatus from "./useEditorStatus";
import { useImgSrc } from "./useImgSrc";
import {
  ImgSource,
  canvasToFile,
  findCanvasImgObj,
  getCroppedImg,
  removeBackground,
} from "./utils";

interface EditorProps {
  imgSrc: ImgSource;
  imgName?: string;
  customActions?: EditorControlItemProps[];
  onUploadImage: () => void;
  onEditComplete: (file: File) => Promise<void>;
  template: VariantTemplate;
  backHref: string;
}

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

const validatePreviewFormData = (formData: FormData) => {
  const data = Object.fromEntries(formData.entries()) as { text?: string };
  return !data.text?.trim() ? ["Text is required"] : undefined;
};

const useEditorActions = (props: EditorProps) => {
  const [fCanvas, setFCanvas] = useState<FabricCanvas | null>(null);
  const [isCropActive, setIsCropActive] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPanZoomActive, setIsPanZoomActive] = useState(false);
  const [isBackgroundRemoved, setIsBackgroundRemoved] = useState(false);
  const { status, statusMessage, updateStatus } = useEditorStatus();
  const imgSources = useImgSourcesState(props.imgSrc);
  const panZoomControlsRef = useRef<ReactZoomPanPinchContentRef | null>(null);

  const handleRemoveBackground = useCallback(async () => {
    if (!imgSources.src) {
      updateStatus({
        status: "error",
        message: ERROR_TEXTS.imageEditor.noImage,
      });
      return;
    }
    updateStatus({ status: "loading" });
    try {
      const blob = await removeBackground(imgSources.src, (message) => {
        updateStatus({
          status: "loading",
          message,
        });
      });
      imgSources.updateImgSrc(blob);
      setIsBackgroundRemoved(true);
      updateStatus({ status: "idle" });
    } catch (e) {
      console.error(e);
      updateStatus({
        status: "error",
        message: ERROR_TEXTS.imageEditor.backgroundRemoval,
      });
    }
  }, [imgSources, updateStatus]);

  const handleReset = useCallback(() => {
    imgSources.updateImgSrc(null);
    updateStatus({ status: "idle" });
    setIsBackgroundRemoved(false);
    if (fCanvas) {
      const img = findCanvasImgObj(fCanvas, (o) => o.visible);
      img && resetImgState(img, fCanvas);
    }
    panZoomControlsRef.current?.resetTransform();
  }, [fCanvas, imgSources, updateStatus]);

  const handleCenter = useCallback(() => {
    if (fCanvas) {
      updateStatus({ status: "idle" });
      const img = findCanvasImgObj(fCanvas, (o) => o.visible);
      img && centerImgOnCanvas(img, fCanvas);
      fCanvas.requestRenderAll();
    }
    isPanZoomActive && panZoomControlsRef.current?.resetTransform();
  }, [fCanvas, updateStatus, isPanZoomActive]);

  const handleCropComplete = useCallback(
    (originalImgSrc: string, croppedAreaPixels: Area) => {
      updateStatus({ status: "idle" });
      getCroppedImg(originalImgSrc, croppedAreaPixels)
        .then((croppedImgUrl) => {
          croppedImgUrl && imgSources.setCropImgSrc(croppedImgUrl);
          setIsCropActive(false);
        })
        .catch(console.error);
    },
    [imgSources, updateStatus]
  );

  const handleSubmitPreview = useCallback(
    async (text: string | undefined) => {
      updateStatus({ status: "idle" });
      const formData = new FormData();
      formData.append("text", text?.trim() || "");
      const formValidationErrors = validatePreviewFormData(formData);
      if (formValidationErrors) {
        updateStatus({
          status: "error",
          message: formValidationErrors.join(", "),
        });
        return;
      }
      if (fCanvas) {
        try {
          setIsPreviewOpen(false);
          updateStatus({
            status: "loading",
            message: IMAGE_EDITOR_STATUS_TEXT.generateMosaic.progress,
          });
          const file = await canvasToFile(fCanvas);
          formData.append("file", file);
          const textMosaicImg = await fetchMosaic(formData);
          if (!textMosaicImg) {
            throw new Error("No image returned");
          }
          updateStatus({ status: "idle" });
          imgSources.updateImgSrc(textMosaicImg);
        } catch (error) {
          console.error(ERROR_TEXTS.imageEditor.mosaicGeneration, error);
          updateStatus({
            status: "error",
            message: ERROR_TEXTS.imageEditor.mosaicGeneration,
          });
        }
      }
    },
    [fCanvas, imgSources, updateStatus]
  );

  const handleFinishEdit = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      updateStatus({ status: "idle" });
      if (fCanvas) {
        try {
          updateStatus({
            status: "loading",
            message: IMAGE_EDITOR_STATUS_TEXT.createCustomProduct.progress,
          });
          const file = await canvasToFile(fCanvas);
          await props.onEditComplete(file);
          updateStatus({ status: "idle" });
        } catch (error) {
          console.error(error);
          updateStatus({
            status: "error",
            message: ERROR_TEXTS.general.default,
          });
        }
      }
    },
    [fCanvas, props, updateStatus]
  );

  const actions: EditorControlItemProps[] = [
    {
      label: IMAGE_EDITOR_MENU_TEXT.reset.label,
      icon: <ArrowPathIcon className="h-6 w-6 stroke-white" />,
      onClick: handleReset,
    },
    {
      label: IMAGE_EDITOR_MENU_TEXT.panZoom.label,
      icon: <ArrowsPointingOutIcon className="h-6 w-6 stroke-white" />,
      onClick: () => setIsPanZoomActive((prev) => !prev),
      active: isPanZoomActive,
    },
    {
      label: IMAGE_EDITOR_MENU_TEXT.backgroundRemove.label,
      icon: <PhotoIcon className="h-6 w-6 stroke-white" />,
      onClick: handleRemoveBackground,
      active: isBackgroundRemoved,
      disabled: isBackgroundRemoved,
    },
    {
      label: IMAGE_EDITOR_MENU_TEXT.centerImg.label,
      icon: <ArrowsPointingInIcon className="h-6 w-6 stroke-white" />,
      onClick: handleCenter,
    },
    {
      label: IMAGE_EDITOR_MENU_TEXT.cropImg.label,
      icon: <CropIcon className="h-6 w-6 stroke-white" />,
      onClick: () => setIsCropActive(true),
      active: isCropActive,
    },
    {
      label: IMAGE_EDITOR_MENU_TEXT.textMosaicEffect.label,
      icon: <PaintBrushIcon className="h-6 w-6 stroke-white" />,
      onClick: () => setIsPreviewOpen(true),
      active: isPreviewOpen,
    },
    {
      label: IMAGE_EDITOR_MENU_TEXT.reuploadImg.label,
      icon: <CloudArrowUpIcon className="h-6 w-6 stroke-white" />,
      onClick: props.onUploadImage,
    },
  ];

  return {
    actions,
    fCanvas,
    setFCanvas,
    isCropActive,
    setIsCropActive,
    isPreviewOpen,
    setIsPreviewOpen,
    isPanZoomActive,
    status,
    statusMessage,
    imgSources,
    panZoomControlsRef,
    handleCropComplete,
    handleSubmitPreview,
    handleFinishEdit,
  };
};

export default useEditorActions;
