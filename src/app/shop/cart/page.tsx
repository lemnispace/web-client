import { CartView } from "@/app/components/cart/CartView";
import { Container } from "@/components/container";
import { ShopifyCartService } from "@/lib/shopify/services/CartService";
import { getNavigationLink } from "@/utils/getters";
import { parseClientResponse } from "@/utils/parsers";

export default async function CartPage() {
  const cartService = new ShopifyCartService({
    parseClientResponse,
    getNavigationLink,
  });
  const cart = await cartService.tryFetchCart();

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
