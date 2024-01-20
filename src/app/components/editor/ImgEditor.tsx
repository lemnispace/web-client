"use client";

import { IMAGE_EDITOR_TEXT } from "@/utils/text";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import { ChangeEvent, DragEvent, useRef, useState } from "react";
import Editor from "./Editor";
import FileDropZone from "./FileDropZone";
import { ImgData, getImgSrcFromFile } from "./utils";

interface ImgUploaderProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  onUploadComplete?: () => void;
}

export default function ImgEditor({
  onUploadComplete,
  className,
  ...props
}: ImgUploaderProps) {
  const [uploadedImg, setUploadeImg] = useState<ImgData | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOnChange = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    // get the img data from the event
    const file = e.target.files?.[0];
    if (file) {
      const img = await getImgSrcFromFile(file);
      setUploadeImg(img);
    }
  };

  const handleOnDrop = async (e: DragEvent<HTMLInputElement>) => {
    e.preventDefault();
    // get the img data from the event
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const img = await getImgSrcFromFile(file);
      setUploadeImg(img);
    }
  };

  return (
    <div className={className} {...props}>
      <h2 className="text-xl font-display text-gray-600">
        {IMAGE_EDITOR_TEXT.title}
      </h2>
      {uploadedImg && (
        <Editor
          imgSrc={uploadedImg.data}
          imgName={uploadedImg.fileName}
          customActions={[
            {
              label: "Re-upload",
              icon: <CloudArrowUpIcon className="h-6 w-6 stroke-white" />,
              onClick: () => {
                inputRef.current?.click();
              },
            },
          ]}
        />
      )}
      <FileDropZone
        onChange={handleOnChange}
        onDrop={handleOnDrop}
        inputRef={inputRef}
        className={uploadedImg ? "hidden" : ""}
      />
    </div>
  );
}
