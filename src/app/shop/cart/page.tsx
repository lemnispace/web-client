import { CartView } from "@/app/components/cart/CartView";
import { Container } from "@/components/container";
import { ShopAPIProvider } from "@/lib/commerce/providers/shop-api";
import { env } from "@/utils/env";
import { cookies } from "next/headers";

export default async function CartPage() {
  const shopAPI = new ShopAPIProvider({
    baseUrl: env.SHOP_API_URL,
    apiKey: env.SHOP_API_KEY,
  });

  // Read cart_id from httpOnly cookie for SSR hydration
  const cartId = cookies().get("cart_id")?.value;

  // Fetch cart from shop-api, or null if no cart exists
  let cart = null;
  if (cartId) {
    try {
      cart = await shopAPI.getCart(cartId);
    } catch (error) {
      console.error("Error fetching cart for SSR:", error);
      // Cart doesn't exist or error occurred, leave as null
    }
  }

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
