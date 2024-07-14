"use client";

import { CustomProductResponse } from "@/app/api/products/route";
import { Button } from "@/components/button";
import { BUTTON_TEXT, IMAGE_EDITOR_TEXT } from "@/utils/text";
import {
  ClientResponse,
  Product,
  ProductVariant,
  VariantTemplate,
} from "@/utils/types";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { ChangeEvent, DragEvent, useRef, useState } from "react";
import Editor from "./Editor";
import FileDropZone from "./FileDropZone";
import { ImgData, getImgSrcFromFile } from "./utils";

interface ImgUploaderProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  productVariant: ProductVariant;
  product: Product;
  template?: VariantTemplate;
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
  className,
  productVariant,
  product,
  template,
  ...props
}: ImgUploaderProps) {
  const [uploadedImg, setUploadeImg] = useState<ImgData | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

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

  const handleBack = () => {
    const canGoBack = window.history.length > 1;
    canGoBack ? router.back() : router.push(product.href);
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
    <div
      className={clsx("flex flex-col h-full min-h-72 md:max-h-svh", className)}
      {...props}
    >
      <div className="flex w-full flex-row items-center justify-between">
        <h2 className="text-xl font-display text-gray-600">
          {IMAGE_EDITOR_TEXT.title}
        </h2>
        <Button plain onClick={handleBack} className="w-auto min-w-fit">
          <ArrowLeftIcon className="h-6 w-6 stroke-neutral-800 stroke-2" />
          {BUTTON_TEXT.back}
        </Button>
      </div>
      {uploadedImg && template && (
        <Editor
          imgSrc={uploadedImg.data}
          template={template}
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
                `${product.href}?selectedVariantId=${response.variantId}`
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
    </div>
  );
}
