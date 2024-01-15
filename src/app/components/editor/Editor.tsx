"use client";
import { Loader } from "@/components/loader";
import { ArrowPathIcon, PhotoIcon } from "@heroicons/react/24/outline";
import imglyRemoveBackground from "@imgly/background-removal";
import clsx from "clsx";
import { useMemo, useState } from "react";
import EditorMenu, { EditorControlItemProps } from "./EditorMenu";

export type ImgSource =
  | ImageData
  | ArrayBuffer
  | Uint8Array
  | Blob
  | URL
  | string;

const removeBackground = async (
  image_src: ImgSource,
  handleProgress?: (
    args_0: string,
    args_1: number,
    args_2: number,
    ...args_3: unknown[]
  ) => void
): Promise<string> => {
  // The result is a blob encoded as PNG. It can be converted to an URL to be used as HTMLImage.src
  const blob = await imglyRemoveBackground(image_src, {
    progress: handleProgress,
  });
  const url = URL.createObjectURL(blob);
  return url;
};

interface EditorProps {
  imgSrc: ImgSource;
  imgName?: string;
  customActions?: EditorControlItemProps[];
}

export default function Editor(props: EditorProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
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

  const handleRemoveBackground = () => {
    if (!src) {
      console.error("No image source");
      setStatus("error");
      return;
    }
    setStatus("loading");
    removeBackground(src)
      .then((url) => {
        setImgSrc(url);
        setStatus("idle");
      })
      .catch((e) => {
        console.error(e);
        setStatus("error");
      });
  };

  const handleReset = () => {
    setImgSrc(null);
    setStatus("idle");
  };

  const actions: EditorControlItemProps[] = [
    {
      label: "Reset",
      icon: <ArrowPathIcon className="h-6 w-6 stroke-white" />,
      onClick: handleReset,
    },
    {
      label: "BG Remove",
      icon: <PhotoIcon className="h-6 w-6 stroke-white" />,
      onClick: handleRemoveBackground,
    },
  ];
  if (props.customActions) {
    actions.push(...props.customActions);
  }

  return (
    <div className="mt-4 flex flex-col-reverse md:flex-row items-stretch justify-between border-2 border-neutral-800 rounded-lg bg-neutral-300 overflow-hidden">
      {/**CONTROLS*/}
      <EditorMenu actions={actions} disabled={status === "loading"} />
      <div className="flex flex-1 items-center justify-center px-4 py-4 md:px-8 overflow-auto relative">
        {status === "loading" && (
          <div className="h-full w-full bg-gray-900/50 flex items-center justify-center absolute cursor-wait z-50">
            <Loader
              status={status}
              className="fill-primary-500"
              pathColor="rgb(17 24 39 / 0.5)"
            />
          </div>
        )}
        {/*eslint-disable-next-line @next/next/no-img-element*/}
        <img
          src={src}
          alt={props.imgName}
          className={clsx(
            "h-full w-auto max-h-96 object-contain object-center",
            status === "loading" && "opacity-50"
          )}
        />
      </div>
    </div>
  );
}
