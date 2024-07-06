"use client";

import { Strong, Text } from "@/components/text";
import { IMAGE_EDITOR_FILE_DROP_ZONE_TEXT } from "@/utils/text";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { DragEvent, useState } from "react";

interface FileDropZoneProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "id"> {
  containerClassName?: string;
  inputRef?: React.RefObject<HTMLInputElement>;
}

export default function FileDropZone({
  className,
  containerClassName,
  onDrop,
  inputRef,
  ...props
}: FileDropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      // Simulate a click on the file input when Enter or Space is pressed
      e.preventDefault();
      document.getElementById("dropzone-file")?.click();
    }
  };

  const handleOnDrop = (e: DragEvent<HTMLInputElement>) => {
    if (onDrop) {
      onDrop(e);
      setIsDragOver(false);
    }
  };
  const handleOnDragEnd = (e: DragEvent) => {
    if (!onDrop) return;
    e.preventDefault();
    setIsDragOver(false);
  };
  return (
    <div
      onDrop={handleOnDrop}
      onDragOver={(e) => {
        if (!onDrop) return;
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={handleOnDragEnd}
      onDragEnd={handleOnDragEnd}
      {...(isDragOver ? { "data-drag": true } : {})}
      className={clsx(
        className,
        "mt-4 flex items-center justify-center w-full border-2 border-dashed border-slate-500 focus:border-primary-500 focus:border-solid focus:outline-none rounded-lg cursor-pointer bg-slate-100 hover:bg-slate-200 data-[drag]:bg-slate-200"
      )}
      onKeyDown={handleKeyPress}
      tabIndex={0}
    >
      <label
        htmlFor="dropzone-file"
        className={clsx(
          className,
          "flex flex-col items-center justify-center w-full h-64 pt-5 pb-6"
        )}
      >
        <CloudArrowUpIcon
          className="h-12 w-12 stroke-slate-600"
          aria-hidden="true"
        />
        <Text className="text-sm text-gray-800">
          <Strong>
            {IMAGE_EDITOR_FILE_DROP_ZONE_TEXT.description.emphasis}
          </Strong>{" "}
          {IMAGE_EDITOR_FILE_DROP_ZONE_TEXT.description.text}
        </Text>
        <Text className="text-xs text-gray-600">
          PNG, JPEG, PPM, GIF, TIFF, and BMP
        </Text>
        <input
          ref={inputRef}
          id="dropzone-file"
          type="file"
          className="hidden"
          {...props}
          accept="image/jpeg, image/png, image/jpg image/gif, image/tiff, image/bmp"
        />
      </label>
    </div>
  );
}
