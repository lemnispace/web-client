"use client";

import { CustomProductResponse } from "@/app/api/products/route";
import { Button } from "@/components/button";
import { getDimensionsFromVariant } from "@/utils/getters";
import { BUTTON_TEXT, IMAGE_EDITOR_TEXT } from "@/utils/text";
import { ClientResponse, Product, ProductVariant } from "@/utils/types";
import { useRouter } from "next/navigation";
import { ChangeEvent, DragEvent, useRef, useState } from "react";
import Editor from "./Editor";
import FileDropZone from "./FileDropZone";
import { ImgData, getImgSrcFromFile } from "./utils";

interface ImgUploaderProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  onUploadComplete?: () => void;
  productVariant: ProductVariant;
  product: Product;
}

interface CreateCustomProductRequest {
  productId: string;
  variantId: string;
  variantTitle: string;
  file: File;
}
const createCustomProduct = async (req: CreateCustomProductRequest) => {
  const formData = new FormData();
  formData.append("file", req.file);
  formData.append("productId", req.productId);
  formData.append("variantTitle", req.variantTitle);
  formData.append("variantId", req.variantId);
  try {
    const response = await fetch("/api/products", {
      method: "POST",
      body: formData,
    });
    const data: ClientResponse<CustomProductResponse> = await response.json();
    if (!data.data) {
      throw new Error(data.errors);
    }
    return data.data;
  } catch (error) {
    console.error("Error creating custom product:", error);
    return null;
  }
};

export default function ImgEditor({
  onUploadComplete,
  className,
  productVariant,
  product,
  ...props
}: ImgUploaderProps) {
  const router = useRouter();
  const [uploadedImg, setUploadeImg] = useState<ImgData | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
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
          dimensions={dimensions}
          onUploadImage={() => {
            inputRef.current?.click();
          }}
          onEditComplete={async (imgFile) => {
            const response = await createCustomProduct({
              file: imgFile,
              productId: product.id,
              variantId: productVariant.id,
              variantTitle: productVariant.title,
            });
            if (response) {
              // redirect to the product details page:
              window.location.replace(
                `${product.href}?customProductId=${response.productId}`
              );
            }
          }}
        />
      )}
      <FileDropZone
        onChange={handleOnChange}
        onDrop={handleOnDrop}
        inputRef={inputRef}
        className={uploadedImg ? "hidden" : ""}
      />
      {!uploadedImg && (
        <div className="flex w-full flex-1 flex-col sm:flex-row items-center justify-end my-10">
          <Button
            outline
            onClick={() => router.back()}
            className="mt-4 sm:mt-0 sm:ml-4 w-full sm:w-4/12 lg:w-2/12 md:w-2/12"
          >
            {BUTTON_TEXT.back}
          </Button>
        </div>
      )}
    </div>
  );
}
