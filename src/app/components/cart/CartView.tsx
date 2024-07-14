import { Cart } from "@/lib/types/shopify";
import { CartItemList } from "./CartItemList";
import { CartSummary } from "./CartSummary";

interface CartViewProps {
  cart: Cart;
}

export function CartView({ cart }: CartViewProps) {
  if (!cart || cart.lines.edges.length === 0) {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Shopping Cart
          </h1>
          <p className="mt-6">Your cart is empty.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Shopping Cart
        </h1>
        <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <CartItemList items={cart.lines.edges.map((edge) => edge.node)} />
          <CartSummary
            subtotal={cart.cost.subtotalAmount?.amount}
            tax={cart.cost.totalTaxAmount?.amount}
            total={cart.cost.totalAmount?.amount}
            checkoutUrl={cart.checkoutUrl}
          />
        </form>
      </div>
    </div>
  );
}
