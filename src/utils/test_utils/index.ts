import { within } from "@testing-library/react";
import { FabricImage } from "fabric";
export const getImgWithinElement = (el: HTMLElement): HTMLImageElement => {
  return within(el).getByRole("img") as HTMLImageElement;
};

export const getMockFabricImage = (src: string): FabricImage => {
  const mockImgEl = document.createElement("img");
  mockImgEl.src = src;
  return new FabricImage(mockImgEl);
};
