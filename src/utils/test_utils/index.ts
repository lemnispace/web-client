import { within } from "@testing-library/react";

export function getImgWithinElement(el: HTMLElement): HTMLImageElement {
  return within(el).getByRole("img") as HTMLImageElement;
}
