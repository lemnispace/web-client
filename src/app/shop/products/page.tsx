import { redirect } from "next/navigation";

export default async function ShopProducts() {
  // the route /shop/products require a query param like /shop/products/[product-handle],
  // so we redirect to /shop if the user tries to access /shop/products
  redirect("/shop");
}
