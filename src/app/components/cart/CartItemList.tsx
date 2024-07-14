"use client";

import { BaseCartLine } from "@/lib/types/shopify";
import { handlerRemoveCartItem } from "../product/actions/cartActions";
import { CartItem } from "./CartItem";

interface CartItemListProps {
  items: BaseCartLine[];
}

export function CartItemList({ items }: CartItemListProps) {
  return (
    <section aria-labelledby="cart-heading" className="lg:col-span-7">
      <h2 id="cart-heading" className="sr-only">
        Items in your shopping cart
      </h2>

      <ul
        role="list"
        className="divide-y divide-gray-200 border-b border-t border-gray-200"
        onClick={(event) => {
          const target = event.target as HTMLElement;
          const removeButton = target.closest("button");
          if (removeButton && removeButton.dataset.action === "remove") {
            const cartItemId = removeButton.dataset.itemId;
            if (cartItemId) {
              const onRemoveItem = handlerRemoveCartItem.bind(null, {
                lineId: cartItemId,
              });
              onRemoveItem();
            }
          }
        }}
      >
        {items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onUpdateQuantity={(quantity) => {
              const onUpdateQuantity = handlerRemoveCartItem.bind(null, {
                lineId: item.id,
                quantity,
              });
              onUpdateQuantity();
            }}
          />
        ))}
      </ul>
    </section>
  );
}
