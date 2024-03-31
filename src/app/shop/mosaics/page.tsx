import { redirect } from "next/navigation";

export default async function ShopMosaic() {
  // the route /shop/mosaics require a query param like /shop/mosaics/[product-handle],
  // so we redirect to /shop if the user tries to access /shop/mosaics
  redirect("/shop");
}
