import { ClientResponse } from "@shopify/storefront-api-client";
import { fetchCart } from "../queries/cartQuery";
import { ShopifyServiceConfig } from "../types/services";

export class ShopifyCartService {
  parseClientResponse: ShopifyServiceConfig["parseClientResponse"];
  getNavigationLink: ShopifyServiceConfig["getNavigationLink"];

  constructor(config: ShopifyServiceConfig) {
    this.parseClientResponse = config.parseClientResponse;
    this.getNavigationLink = config.getNavigationLink;
  }

  private tryParseClientResponse = <T>(response: ClientResponse<T>) => {
    try {
      return this.parseClientResponse(response, "");
    } catch (error) {
      console.warn(error);
      return undefined;
    }
  };

  tryFetchCart = async (cartId?: string) => {
    try {
      if (cartId) {
        const fetchedCartResponse = await fetchCart(cartId);
        const fetchedCart = this.tryParseClientResponse(fetchedCartResponse);
        if (fetchedCart) {
          return fetchedCart.cart;
        }
      }
    } catch (error) {
      console.warn(error);
    }
    return undefined;
  };
}
