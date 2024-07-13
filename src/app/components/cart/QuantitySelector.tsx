import React from "react";

interface QuantitySelectorProps {
  quantity: number;
  onUpdate: (quantity: number) => void;
  max: number;
}

export function QuantitySelector({
  quantity,
  onUpdate,
  max,
}: QuantitySelectorProps) {
  return (
    <select
      value={quantity}
      onChange={(e) => onUpdate(Number(e.target.value))}
      className="max-w-full rounded-md border border-gray-300 py-1.5 text-left text-base font-medium leading-5 text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
    >
      {[...Array(Math.min(max, 8))].map((_, i) => (
        <option key={i + 1} value={i + 1}>
          {i + 1}
        </option>
      ))}
    </select>
  );
}
