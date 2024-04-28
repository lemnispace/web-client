"use client";

import { Button } from "@/components/button";
import { BUTTON_TEXT } from "@/utils/text";
import clsx from "clsx";
import { Canvas as FabricCanvas } from "fabric";
import { HTMLAttributes, useEffect, useState } from "react";
import Cropper, { Area, CropperProps } from "react-easy-crop";

interface CropProps extends HTMLAttributes<HTMLDivElement> {
  canvas: FabricCanvas | null;
  imgSrc: string;
  aspectRatio?: number;
  className?: string;
  onCropComplete: (originalImgSrc: string, croppedAreaPixels: Area) => void;
  onCancel(): void;
}

const Crop = ({
  className,
  imgSrc,
  onCropComplete,
  aspectRatio,
  onCancel,
  ...props
}: CropProps) => {
  const [crop, setCrop] = useState<CropperProps["crop"]>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1.5);
  const [cropResult, setCroppedAreaPixels] = useState<{
    croppedArea: Area;
    croppedAreaPixels: Area;
  } | null>(null);

  useEffect(() => {
    // cancel crop when user clicks the `esc` key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div
      className={clsx(className, "flex flex-col w-full min-h-96 h-[80vh]")}
      {...props}
    >
      <div className="relative w-full h-full">
        <Cropper
          image={imgSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspectRatio}
          onCropChange={setCrop}
          onCropComplete={(croppedArea, croppedAreaPixels) =>
            setCroppedAreaPixels({ croppedArea, croppedAreaPixels })
          }
          onZoomChange={setZoom}
        />
      </div>
      <div className="flex flex-row flex-wrap w-full mt-2 gap-2 md:mt-4">
        <input
          type="range"
          className="flex-1 accent-secondary-500"
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          onChange={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setZoom(parseFloat(e.target.value));
          }}
        />
        <Button
          className="rounded-lg text-sm text-neutral-300"
          plain
          onClick={onCancel}
        >
          {BUTTON_TEXT.cancel}
        </Button>
        <Button
          color="secondary"
          className="rounded-lg text-sm"
          onClick={() => {
            cropResult && onCropComplete(imgSrc, cropResult.croppedAreaPixels);
          }}
        >
          {BUTTON_TEXT.crop}
        </Button>
      </div>
    </div>
  );
};

export default Crop;
