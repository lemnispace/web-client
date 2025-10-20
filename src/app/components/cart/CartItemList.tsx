"use client";

import { CartItem as CartItemType } from "@/lib/commerce/types";
import { toInt } from "@/utils/parsers";
import { isDefined } from "@/utils/validators";
import { CartItem } from "./CartItem";

interface CartItemListProps {
  items: CartItemType[];
  onUpdateItem: (itemId: string, quantity: number) => Promise<void>;
  onRemoveItem: (itemId: string) => Promise<void>;
}

export function CartItemList({
  items,
  onUpdateItem,
  onRemoveItem,
}: CartItemListProps) {
  return (
    <section aria-labelledby="cart-heading" className="lg:col-span-7">
      <h2 id="cart-heading" className="sr-only">
        Items in your shopping cart
      </h2>

      <ul
        role="list"
        className="divide-y divide-gray-200 border-b border-t border-gray-200"
        onClick={(event) => {
          // Handle the onClick event from the remove button
          const target = event.target as HTMLElement;
          const removeButton = target.closest("button");
          if (removeButton && removeButton.dataset.action === "remove") {
            const cartItemId = removeButton.dataset.itemId;
            if (cartItemId) {
              onRemoveItem(cartItemId).catch((error) => {
                console.error("Failed to remove item:", error);
              });
            }
          }
        }}
        onChange={(event) => {
          // Handle the onChange event from the quantity selector
          const target = event.target as HTMLElement;
          const quantitySelect = target.closest("select");
          if (quantitySelect && quantitySelect.dataset.action === "update") {
            const quantity = toInt(quantitySelect.value);
            const cartItemId = quantitySelect.dataset.itemId;
            if (isDefined(quantity) && cartItemId) {
              if (quantity === 0) {
                onRemoveItem(cartItemId).catch((error) => {
                  console.error("Failed to remove item:", error);
                });
              } else {
                onUpdateItem(cartItemId, quantity).catch((error) => {
                  console.error("Failed to update item:", error);
                });
              }
            }
          }
        }}
      >
        {items.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </ul>
    </section>
  );
}
