"use client";

import clsx from "clsx";
import {
  Canvas as FabricCanvas,
  FabricImage,
  FabricObject,
  Rect,
} from "fabric";
import { useState } from "react";
import Cropper, { Area, CropperProps } from "react-easy-crop";

interface CropProps {
  canvas: FabricCanvas | null;
  imgSrc: string;
  aspectRatio?: number;
  className?: string;
  onCropComplete: (croppedArea: Area, croppedAreaPixels: Area) => void;
}
const Crop = (props: CropProps) => {
  const [crop, setCrop] = useState<CropperProps["crop"]>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1.5);
  return (
    <div className={clsx(props.className, "flex flex-col w-full h-full")}>
      <div className="relative w-full h-full">
        <Cropper
          image={props.imgSrc}
          crop={crop}
          zoom={zoom}
          aspect={props.aspectRatio}
          onCropChange={setCrop}
          onCropComplete={props.onCropComplete}
          onZoomChange={setZoom}
        />
      </div>
      <input
        type="range"
        value={zoom}
        min={1}
        max={3}
        step={0.1}
        onChange={(e) => setZoom(parseFloat(e.target.value))}
        className="mt-2"
      />
    </div>
  );
};

export default Crop;
