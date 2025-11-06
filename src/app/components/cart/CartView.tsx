import { Cart } from "@/lib/commerce/types";
import { CartItemList } from "./CartItemList";
import { CartSummary } from "./CartSummary";

interface CartViewProps {
  cart?: Cart | null;
  isLoading?: boolean;
  onUpdateItem: (itemId: string, quantity: number) => Promise<void>;
  onRemoveItem: (itemId: string) => Promise<void>;
}

export function CartView({
  cart,
  isLoading,
  onUpdateItem,
  onRemoveItem,
}: CartViewProps) {
  if (isLoading) {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Shopping Cart
          </h1>
          <div className="mt-6">
            <p className="text-gray-600">Loading your cart...</p>
            <div className="mt-4">
              <div className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Shopping Cart
          </h1>
          <div className="mt-6">
            <p className="text-gray-600">Your cart is empty.</p>
            <div className="mt-6">
              <a
                href="/shop"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Continue Shopping
              </a>
            </div>
          </div>
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
          <CartItemList
            items={cart.items}
            onUpdateItem={onUpdateItem}
            onRemoveItem={onRemoveItem}
          />
          <CartSummary
            subtotal={cart.subtotal}
            tax={cart.estimatedTax}
            total={cart.totalPrice}
            checkoutUrl={cart.checkoutUrl}
          />
        </form>
      </div>
    </div>
  );
}
