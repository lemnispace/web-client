import { useCallback, useMemo, useRef, useState } from "react";
import { ImgSource } from "./Editor";

export const getImgUrl = (src: ImgSource) => {
  if (typeof src === "string") {
    return src;
  }
  if (src instanceof URL) {
    return src.href;
  }
  if (src instanceof Blob) {
    return URL.createObjectURL(src);
  }
  if (src instanceof Uint8Array || src instanceof ArrayBuffer) {
    return URL.createObjectURL(new Blob([src]));
  }
  if (src instanceof ImageData) {
    return URL.createObjectURL(new Blob([src.data]));
  } else {
    throw new Error("Invalid image source");
  }
};

export const useImgSrc = (initialImgSrc: ImgSource) => {
  const [imgSrc, setImgSrc] = useState<ImgSource | null>(null);
  const initialImgSrcRef = useRef(initialImgSrc);

  const src = useMemo(() => {
    let s = imgSrc ?? initialImgSrc;
    if (initialImgSrcRef.current !== initialImgSrc) {
      // the initial image has changed, reset the src
      initialImgSrcRef.current = initialImgSrc;
      s = initialImgSrc;
      setImgSrc(null);
    }
    return getImgUrl(s);
  }, [initialImgSrc, imgSrc]);

  const updateImgSrc = useCallback(
    (update: ImgSource | null) => {
      if (src) URL.revokeObjectURL(src);
      setImgSrc(update);
    },
    [src]
  );

  return [src, updateImgSrc] as const;
};
