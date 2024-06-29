import { ForwardedRef } from "react";
import { Nullable } from "./types";

/**
 * Sets the value of a ref, either by calling a function ref or by assigning the value directly to the ref's current property.
 * @param ref - The ref object or function ref.
 * @param value - The value to set on the ref.
 */
export const setRef = <T>(
  ref: ForwardedRef<T> | undefined,
  value: Nullable<T>
) => {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
};
