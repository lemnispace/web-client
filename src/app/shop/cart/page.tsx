import { CartView } from "@/app/components/cart/CartView";
import { Container } from "@/components/container";
import {
  removeCartLine,
  updateCartLine,
} from "@/lib/shopify/mutations/cartMutations";
import { getCartId } from "@/utils/cookies/cartId";
import { getOrCreateCartWithManagedCookie } from "@/utils/fetchers";
import { parseClientResponse } from "@/utils/parsers";

const handleUpdateItemQuantity = async (lineId: string, quantity: number) => {
  const cartId = getCartId();
  if (!cartId) throw new Error("Unexpected error: cartId not found");
  const updatedCartResponse = await updateCartLine(cartId, lineId, quantity);
  parseClientResponse(updatedCartResponse, "error updating item quantity");
};

const handleRemoveItem = async (lineId: string) => {
  const cartId = getCartId();
  if (!cartId) throw new Error("Unexpected error: cartId not found");
  const updatedCartResponse = await removeCartLine(cartId, [lineId]);
  parseClientResponse(updatedCartResponse, "error removing item from cart");
};

export default async function CartPage() {
  const cart = await getOrCreateCartWithManagedCookie();

  return (
    <main className="bg-white flex-1">
      <Container
        className="py-16 sm:py-24 max-w-2xl lg:max-w-7xl"
        overrideMaxWidth
      >
        <CartView
          cart={cart}
          updateItemQuantity={handleUpdateItemQuantity}
          removeItem={handleRemoveItem}
        />
      </Container>
    </main>
  );
}
