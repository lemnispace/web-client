import { CartView } from "@/app/components/cart/CartView";
import { Container } from "@/components/container";
import { ShopifyCartService } from "@/lib/shopify/services/ShopifyCartService";
import { getNavigationLink } from "@/utils/getters";
import { parseClientResponse } from "@/utils/parsers";
import { cookies } from "next/headers";

export default async function CartPage() {
  const cartService = new ShopifyCartService({
    parseClientResponse,
    getNavigationLink,
  });

  // Read cart_id from httpOnly cookie for SSR hydration
  const cartId = cookies().get("cart_id")?.value;
  const cart = await cartService.tryFetchCart(cartId);

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
