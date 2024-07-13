import { BaseCartLine } from "@/lib/types/shopify";
import { CartItem } from "./CartItem";

interface CartItemListProps {
  items: BaseCartLine[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

export function CartItemList({
  items,
  onRemoveItem,
  onUpdateQuantity,
}: CartItemListProps) {
  return (
    <section aria-labelledby="cart-heading" className="lg:col-span-7">
      <h2 id="cart-heading" className="sr-only">
        Items in your shopping cart
      </h2>

      <ul
        role="list"
        className="divide-y divide-gray-200 border-b border-t border-gray-200"
      >
        {items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onRemove={() => onRemoveItem(item.id)}
            onUpdateQuantity={(quantity) => onUpdateQuantity(item.id, quantity)}
          />
        ))}
      </ul>
    </section>
  );
}
