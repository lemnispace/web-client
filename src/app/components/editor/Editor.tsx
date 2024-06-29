"use client";
import { Button } from "@/components/button";
import { CropIcon } from "@/components/icons/crop";
import useMediaQuery from "@/utils/hooks/useMediaQuery";
import {
  BUTTON_TEXT,
  ERROR_TEXTS,
  IMAGE_EDITOR_INPUT_TEXT,
  IMAGE_EDITOR_MENU_TEXT,
  IMAGE_EDITOR_STATUS_TEXT,
} from "@/utils/text";
import { VariantTemplate } from "@/utils/types";
import { isDefined } from "@/utils/validators";
import {
  ArrowLeftIcon,
  ArrowPathIcon,
  ArrowsPointingInIcon,
  CloudArrowUpIcon,
  EyeIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Canvas as FabricCanvas } from "fabric";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Area } from "react-easy-crop";
import { ReactZoomPanPinchContentRef } from "react-zoom-pan-pinch";
import Canvas, { centerImgOnCanvas, resetImgState } from "./Canvas";
import Crop from "./Crop";
import { EditorLoader } from "./EditorLoader";
import EditorMenu, { EditorControlItemProps } from "./EditorMenu";
import PanZoom from "./PanZoom";
import TextInputDialog from "./TextInputDialog";
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
}

interface PreviewFormData {
  text?: string;
}

// Custom hook to manage the image sources state
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
  const data = Object.fromEntries(formData.entries()) as PreviewFormData;
  const errors = [];
  if (!data.text?.trim()) {
    errors.push("Text is required");
  }
  if (errors.length) {
    return errors;
  }
  return undefined;
};

export default function Editor(props: EditorProps) {
  const router = useRouter();
  const panZoomControlsRef = useRef<ReactZoomPanPinchContentRef | null>(null);
  const [fCanvas, setFcanvas] = useState<FabricCanvas | null>(null);
  const { status, statusMessage, updateStatus } = useEditorStatus();
  const [isCropActive, setIsCropActive] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const imgSources = useImgSourcesState(props.imgSrc);
  const handleRemoveBackground = () => {
    if (!imgSources.src) {
      console.error(ERROR_TEXTS.imageEditor.noImage);
      updateStatus({
        status: "error",
        message: ERROR_TEXTS.imageEditor.noImage,
      });
      return;
    }
    updateStatus({ status: "loading" });
    removeBackground(imgSources.src, (message, progress) => {
      const statusMessage = !!progress ? `${message}\n${progress}%` : message;
      updateStatus({ status: "loading", message: statusMessage });
    })
      .then((blob) => {
        imgSources.updateImgSrc(blob);
        updateStatus({ status: "idle" });
      })
      .catch((e) => {
        console.error(e);
        updateStatus({
          status: "error",
          message: ERROR_TEXTS.imageEditor.backgroundRemoval,
        });
      });
  };

  const handleReset = () => {
    imgSources.updateImgSrc(null);
    updateStatus({ status: "idle" });
    if (fCanvas) {
      const img = findCanvasImgObj(fCanvas, (o) => o.visible);
      img && resetImgState(img, fCanvas);
    }
    if (panZoomControlsRef.current) {
      panZoomControlsRef.current.resetTransform();
    }
  };

  const handleCenter = () => {
    if (fCanvas) {
      if (status === "error") {
        updateStatus({ status: "idle" });
      }
      const img = findCanvasImgObj(fCanvas, (o) => o.visible);
      img && centerImgOnCanvas(img, fCanvas);
      fCanvas.requestRenderAll();
    }
    if (panZoomControlsRef.current) {
      panZoomControlsRef.current.centerView();
    }
  };

  const handleCropComplete = (
    originalImgSrc: string,
    croppedAreaPixels: Area
  ) => {
    if (status === "error") {
      updateStatus({ status: "idle" });
    }
    getCroppedImg(originalImgSrc, croppedAreaPixels)
      .then((croppedImgUrl) => {
        croppedImgUrl && imgSources.setCropImgSrc(croppedImgUrl);
        setIsCropActive(false);
      })
      .catch(console.error);
  };

  const handleSubmitPreview = async (text: string | undefined) => {
    if (status === "error") {
      updateStatus({ status: "idle" });
    }
    const formData = new FormData();
    formData.append("text", text?.trim() || "");
    const formValidationErrors = validatePreviewFormData(formData);
    if (formValidationErrors) {
      const error = formValidationErrors.join(", ");
      updateStatus({ status: "error", message: error });
      return;
    }
    if (fCanvas) {
      // add file to form data
      const file = await canvasToFile(fCanvas);
      formData.append("file", file);
      try {
        setIsPreviewOpen(false);
        updateStatus({
          status: "loading",
          message: IMAGE_EDITOR_STATUS_TEXT.generateMosaic.progress,
        });
        const textMosaicImg = await fetchMosaic(formData);
        if (!textMosaicImg) {
          console.error(
            ERROR_TEXTS.imageEditor.mosaicGeneration,
            "- No image returned"
          );
          updateStatus({
            status: "error",
            message: ERROR_TEXTS.imageEditor.mosaicGeneration,
          });
          setIsPreviewOpen(true);
          return;
        }
        updateStatus({ status: "idle" });
        imgSources.updateImgSrc(textMosaicImg);
      } catch (error) {
        console.error(ERROR_TEXTS.imageEditor.mosaicGeneration, error);
        setIsPreviewOpen(false);
        updateStatus({
          status: "error",
          message: ERROR_TEXTS.imageEditor.mosaicGeneration,
        });
      }
    }
  };

  const handlePreview = () => {
    updateStatus({ status: "idle" });
    setIsPreviewOpen(true);
  };

  const handleReupload = () => {
    props.onUploadImage();
    setIsPreviewOpen(false);
    updateStatus({ status: "idle" });
  };

  const handleFinishEdit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (status === "error") {
      updateStatus({ status: "idle" });
    }
    if (fCanvas) {
      try {
        updateStatus({
          status: "loading",
          message: IMAGE_EDITOR_STATUS_TEXT.createCustomProduct.progress,
        });
        const file = await canvasToFile(fCanvas);
        await props.onEditComplete(file);
        updateStatus({
          status: "idle",
        });
      } catch (error) {
        console.error(error);
        updateStatus({
          status: "error",
          message: ERROR_TEXTS.general.default,
        });
      }
    }
  };

  const actions: EditorControlItemProps[] = [
    {
      label: IMAGE_EDITOR_MENU_TEXT.reset,
      icon: <ArrowPathIcon className="h-6 w-6 stroke-white" />,
      onClick: handleReset,
    },
    {
      label: IMAGE_EDITOR_MENU_TEXT.backgroundRemove,
      icon: <PhotoIcon className="h-6 w-6 stroke-white" />,
      onClick: handleRemoveBackground,
    },
    {
      label: IMAGE_EDITOR_MENU_TEXT.centerImg,
      icon: <ArrowsPointingInIcon className="h-6 w-6 stroke-white" />,
      onClick: handleCenter,
    },
    {
      label: IMAGE_EDITOR_MENU_TEXT.cropImg,
      icon: <CropIcon className="h-6 w-6 stroke-white" />,
      onClick: () => setIsCropActive(true),
    },
    {
      label: IMAGE_EDITOR_MENU_TEXT.previewImgEffect,
      icon: <EyeIcon className="h-6 w-6 stroke-white" />,
      onClick: handlePreview,
    },
    {
      label: IMAGE_EDITOR_MENU_TEXT.reuploadImg,
      icon: <CloudArrowUpIcon className="h-6 w-6 stroke-white" />,
      onClick: handleReupload,
    },
  ];

  return (
    <>
      <div
        className={clsx(
          "mt-4 relative flex flex-1 flex-col-reverse md:flex-row items-stretch justify-between border-2 border-neutral-800 rounded-lg overflow-hidden",
          isDefined(props.template.backgroundColor)
            ? `bg-[${props.template.backgroundColor}]`
            : "bg-neutral-900"
        )}
      >
        <EditorMenu
          actions={actions}
          disabled={status === "loading" || !fCanvas || isCropActive}
          className="flex-row md:flex-col"
        />
        <div
          className={clsx(
            "flex flex-1 w-full h-auto overflow-auto items-center relative",
            isCropActive && "bg-neutral-900"
          )}
        >
          <TextInputDialog
            open={isPreviewOpen}
            title={IMAGE_EDITOR_INPUT_TEXT.title}
            label={IMAGE_EDITOR_INPUT_TEXT.label}
            onClose={() => setIsPreviewOpen(false)}
            onSubmit={handleSubmitPreview}
            onChange={() => updateStatus({ status: "idle" })}
            cta={BUTTON_TEXT.generate}
            description={IMAGE_EDITOR_INPUT_TEXT.description}
            name="text"
            error={status === "error" ? statusMessage : undefined}
          />
          <EditorLoader status={status} statusMessage={statusMessage} />
          {isCropActive && (
            <Crop
              imgSrc={imgSources.originalImgSrc}
              aspectRatio={
                props.template.printAreaWidth / props.template.printAreaHeight
              }
              className="dark bg-transparent rounded-lg p-2 md:p-4"
              onCropComplete={handleCropComplete}
              onCancel={() => setIsCropActive(false)}
              canvas={fCanvas}
            />
          )}
          <PanZoom controlsRef={panZoomControlsRef}>
            <Canvas
              className={clsx("rounded-lg", isCropActive && "hidden")}
              imgSrc={imgSources.src}
              canvas={fCanvas}
              loadCanvas={setFcanvas}
              template={props.template}
            />
          </PanZoom>
        </div>
      </div>
      <div className="flex w-full flex-1 flex-row items-center justify-end my-10">
        <Button
          color="primary"
          onClick={handleFinishEdit}
          disabled={status === "loading"}
          className="w-full max-w-80 min-w-fit sm:w-6/12 lg:w-3/12 md:w-4/12"
        >
          {BUTTON_TEXT.finishEdit}
        </Button>
        <Button
          outline
          onClick={() => router.back()}
          disabled={status === "loading"}
          className="ml-4 max-w-40 min-w-fit w-full sm:w-4/12 lg:w-2/12 md:w-2/12"
        >
          <ArrowLeftIcon className="h-6 w-6 stroke-neutral-800" />
          {BUTTON_TEXT.back}
        </Button>
      </div>
    </>
  );
}
