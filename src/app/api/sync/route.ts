import { getDefaultProvider } from "@/lib/commerce";
import { ServerApiResponse } from "@/utils/types";
import { NextResponse } from "next/server";

interface SyncResponse {
  message: string;
  status: string;
}

/**
 * Sync Printful Catalog
 *
 * This endpoint triggers an asynchronous sync of the Printful product catalog to shop-api.
 * The shop-api backend handles all the complex logic of fetching from Printful,
 * mapping variants, and storing products in DynamoDB.
 *
 * Returns 202 Accepted immediately while sync runs in background.
 */
export const POST = async (): Promise<ServerApiResponse<SyncResponse>> => {
  try {
    const commerce = getDefaultProvider();
    const result = await commerce.syncPrintfulCatalog();

    // Return 202 Accepted for async operation
    return NextResponse.json({ data: result }, { status: 202 });
  } catch (error) {
    console.error("Error syncing Printful catalog:", error);
    return NextResponse.json(
      { errors: "Error syncing Printful catalog", data: undefined },
      { status: 500 }
    );
  }
};
