"use client";

import { BaseCartLine } from "@/lib/types/shopify";
import { XMarkIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import Link from "next/link";
import { QuantitySelector } from "./QuantitySelector";

interface CartItemProps {
  item: BaseCartLine;
  onUpdateQuantity: (quantity: number) => void;
}

export function CartItem({ item, onUpdateQuantity }: CartItemProps) {
  const variant = item.merchandise as any; // Type assertion, ideally we'd have a more specific type

  return (
    <li className="flex py-6 sm:py-10">
      <div className="flex-shrink-0">
        <Image
          src={variant.image.url}
          alt={variant.image.altText || variant.product.title}
          width={96}
          height={96}
          className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48"
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
          <div>
            <div className="flex justify-between">
              <h3 className="text-sm">
                <Link
                  href={`/shop/products/${variant.product.handle}`}
                  className="font-medium text-gray-700 hover:text-gray-800"
                >
                  {variant.product.title}
                </Link>
              </h3>
            </div>
            <div className="mt-1 flex text-sm">
              <p className="text-gray-500">{variant.title}</p>
            </div>
            <p className="mt-1 text-sm font-medium text-gray-900">
              {variant.price.amount} {variant.price.currencyCode}
            </p>
          </div>

          <div className="mt-4 sm:mt-0 sm:pr-9">
            <QuantitySelector
              quantity={item.quantity}
              onUpdate={onUpdateQuantity}
              max={99} // You might want to use a real inventory check here
            />

            <div className="absolute right-0 top-0">
              <button
                type="button"
                className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
                data-action="remove"
                data-item-id={item.id}
              >
                <span className="sr-only">Remove</span>
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
