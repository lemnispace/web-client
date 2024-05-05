"use client";

import { getDimensionsFromVariant } from "@/utils/getters";
import { IMAGE_EDITOR_TEXT } from "@/utils/text";
import { Product, ProductVariant } from "@/utils/types";
import { ChangeEvent, DragEvent, useRef, useState } from "react";
import Editor from "./Editor";
import FileDropZone from "./FileDropZone";
import { ImgData, getImgSrcFromFile } from "./utils";

interface ImgUploaderProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  onUploadComplete?: () => void;
  productVariant: ProductVariant;
  product: Product;
}

const createCustomProduct = async (
  file: File,
  productId: string,
  variantId: string
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("productId", productId);
  formData.append("variantId", variantId);
  await fetch("/api/products", {
    method: "POST",
    body: formData,
  });
};

export default function ImgEditor({
  onUploadComplete,
  className,
  productVariant,
  product,
  ...props
}: ImgUploaderProps) {
  const [uploadedImg, setUploadeImg] = useState<ImgData | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const previewImgUrl = productVariant.metafield?.reference?.image.url;
  const dimensions = getDimensionsFromVariant(productVariant);

  const handleOnChange = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    // get the img data from the event
    try {
      const file = e.target.files?.[0];
      if (!file) {
        throw new Error("No file found");
      }
      const img = await getImgSrcFromFile(file);
      setUploadeImg(img);
    } catch (error) {
      console.error(error);
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
          backgroundImgUrl={previewImgUrl}
          dimensions={dimensions}
          onUploadImage={() => {
            inputRef.current?.click();
          }}
          onEditComplete={async (imgFile) =>
            createCustomProduct(imgFile, product.id, productVariant.id)
          }
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
