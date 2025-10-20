"use client";

import { CartItem as CartItemType } from "@/lib/commerce/types";
import { formatPrice } from "@/utils/formatters";
import { XMarkIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import Link from "next/link";
import { QuantitySelector } from "./QuantitySelector";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  // Use handle for routing if available, fallback to productId (will 404 but better than breaking)
  const productSlug = item.product?.handle || item.productId;

  return (
    <li className="flex py-6 sm:py-10">
      <div className="flex-shrink-0">
        <Image
          src={item.product?.image ?? "https://placehold.co/96x96"}
          alt={item.product?.title || "Product image"}
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
                  href={`/shop/products/${productSlug}`}
                  className="font-medium text-gray-700 hover:text-gray-800"
                >
                  {item.product?.title || "Product"}
                </Link>
              </h3>
            </div>
            {item.variant?.title && (
              <div className="mt-1 flex text-sm">
                <p className="text-gray-500">{item.variant.title}</p>
              </div>
            )}
            <p className="mt-1 text-sm font-medium text-gray-900">
              {formatPrice(item.price)}
            </p>
          </div>

          <div className="mt-4 sm:mt-0 sm:pr-9">
            <QuantitySelector
              defaultValue={item.quantity}
              data-action="update"
              data-item-id={item.id}
              max={99}
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
