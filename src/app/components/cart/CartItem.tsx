"use client";

import { BaseCartLine } from "@/lib/shopify/types/cart";
import { formatPrice } from "@/utils/formatters";
import { XMarkIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import Link from "next/link";
import { QuantitySelector } from "./QuantitySelector";

interface CartItemProps {
  item: BaseCartLine;
}

export function CartItem({ item }: CartItemProps) {
  const variant = item.merchandise;

  return (
    <li className="flex py-6 sm:py-10">
      <div className="flex-shrink-0">
        <Image
          src={variant.image?.url ?? "https://placehold.co/96x96"}
          alt={variant.image?.altText || variant.title}
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
                  href={`/shop/products/${variant.product?.handle}`}
                  className="font-medium text-gray-700 hover:text-gray-800"
                >
                  {variant.product?.title}
                </Link>
              </h3>
            </div>
            <div className="mt-1 flex text-sm">
              <p className="text-gray-500">{variant.title}</p>
            </div>
            <p className="mt-1 text-sm font-medium text-gray-900">
              {formatPrice(variant.price)}
            </p>
          </div>

          <div className="mt-4 sm:mt-0 sm:pr-9">
            <QuantitySelector
              defaultValue={item.quantity}
              data-action="update"
              data-item-id={item.id}
              max={item.merchandise.quantityAvailable}
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
