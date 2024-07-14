import { CartView } from "@/app/components/cart/CartView";
import { Container } from "@/components/container";
import { getOrCreateCartWithManagedCookie } from "@/utils/fetchers";

export default async function CartPage() {
  const cart = await getOrCreateCartWithManagedCookie();

  return (
    <main className="bg-white flex-1">
      <Container
        className="py-16 sm:py-24 max-w-2xl lg:max-w-7xl"
        overrideMaxWidth
      >
        <CartView cart={cart} />
      </Container>
    </main>
  );
}
