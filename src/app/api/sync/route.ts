import { ShopAPIProvider } from "@/lib/commerce/providers/shop-api";
import { env } from "@/utils/env";
import { NextResponse } from "next/server";

/**
 * Sync Printful Catalog
 *
 * This endpoint triggers an asynchronous sync of the Printful product catalog to shop-api.
 * The shop-api backend handles all the complex logic of fetching from Printful,
 * mapping variants, and storing products in DynamoDB.
 *
 * Returns 202 Accepted immediately while sync runs in background.
 */
export async function POST() {
  try {
    const shopAPI = new ShopAPIProvider({
      baseUrl: env.SHOP_API_URL,
      apiKey: env.SHOP_API_KEY,
    });

    const result = await shopAPI.syncPrintfulCatalog();

    // Return 202 Accepted for async operation
    return NextResponse.json(result, { status: 202 });
  } catch (error) {
    console.error("Error syncing Printful catalog:", error);
    return NextResponse.json(
      { error: "Error syncing Printful catalog" },
      { status: 500 }
    );
  }
}
