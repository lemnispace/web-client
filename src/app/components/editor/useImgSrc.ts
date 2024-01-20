import { useCallback, useMemo, useRef, useState } from "react";
import { ImgSource } from "./Editor";

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
    } else {
      throw new Error("Invalid image source");
    }
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
