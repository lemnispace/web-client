"use client";

import imglyRemoveBackground from "@imgly/background-removal";
import { useMemo, useRef, useState } from "react";

export type ImgSource =
  | ImageData
  | ArrayBuffer
  | Uint8Array
  | Blob
  | URL
  | string;

const removeBackground = async (image_src: ImgSource): Promise<string> => {
  // The result is a blob encoded as PNG. It can be converted to an URL to be used as HTMLImage.src
  const blob = await imglyRemoveBackground(image_src);
  const url = URL.createObjectURL(blob);
  return url;
};

interface EditorProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  imgSrc: ImgSource;
  imgName?: string;
}

export default function Editor(props: EditorProps) {
  // keep track of the original image source to allow for resetting or undoing changes
  const originalImgSrcRef = useRef<ImgSource | null>(null);
  if (props.imgSrc !== originalImgSrcRef.current) {
    originalImgSrcRef.current = props.imgSrc;
  }
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const src = useMemo(() => {
    let s = imgSrc ?? props.imgSrc;
    if (typeof s === "string") {
      return s;
    }
    if (s instanceof URL) {
      return s.href;
    }
    if (s instanceof Blob) {
      return URL.createObjectURL(s);
    }
    if (s instanceof Uint8Array || s instanceof ArrayBuffer) {
      return URL.createObjectURL(new Blob([s]));
    }
    if (s instanceof ImageData) {
      return URL.createObjectURL(new Blob([s.data]));
    }
  }, [props.imgSrc, imgSrc]);
  return (
    <div>
      {/*eslint-disable-next-line @next/next/no-img-element*/}
      <img src={src} alt={props.imgName} />
    </div>
  );
}
