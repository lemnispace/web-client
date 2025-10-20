"use client";

import { CartView } from "@/app/components/cart/CartView";
import { Container } from "@/components/container";
import { useCart } from "@/app/hooks/useCart";

export default function CartPage() {
  const { cart, isLoading, updateItem, removeItem } = useCart();

  return (
    <main className="bg-white flex-1">
      <Container
        className="py-16 sm:py-24 max-w-2xl lg:max-w-7xl"
        overrideMaxWidth
      >
        <CartView
          cart={cart}
          isLoading={isLoading}
          onUpdateItem={updateItem}
          onRemoveItem={removeItem}
        />
      </Container>
    </main>
  );
}
