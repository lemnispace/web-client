"use client";
import clsx from "clsx";
import React from "react";

const MAX_QUANTITY = 20;

interface QuantitySelectorProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  max: number | undefined;
}

export function QuantitySelector({
  max = 1,
  className,
  ...props
}: QuantitySelectorProps) {
  return (
    <select
      className={clsx(
        "max-w-full rounded-md border border-gray-300 py-1.5 text-left text-base font-medium leading-5 text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm",
        className
      )}
      {...props}
    >
      {[...Array(Math.min(max, MAX_QUANTITY))].map((_, i) => (
        <option key={i + 1} value={i + 1}>
          {i + 1}
        </option>
      ))}
    </select>
  );
}
