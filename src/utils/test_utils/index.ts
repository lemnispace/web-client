import { within } from "@testing-library/react";
export * from "./mocks";

export const getImgWithinElement = (el: HTMLElement): HTMLImageElement => {
  return within(el).getByRole("img") as HTMLImageElement;
};
