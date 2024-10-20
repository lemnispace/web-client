import { createCartId } from "@/utils/cookies/cartId";
import { ClientResponse } from "@shopify/storefront-api-client";
import {
  addToCart,
  createCart,
  updateCartLine,
} from "../mutations/cartMutations";
import { fetchCart } from "../queries/cartQuery";
import { CartInput, CartLineInput, CartLineUpdateInput } from "../types/input";
import { ShopifyServiceConfig } from "../types/services";

export class ShopifyCartService {
  parseClientResponse: ShopifyServiceConfig["parseClientResponse"];
  getNavigationLink: ShopifyServiceConfig["getNavigationLink"];

  constructor(config: ShopifyServiceConfig) {
    this.parseClientResponse = config.parseClientResponse;
    this.getNavigationLink = config.getNavigationLink;
  }

  createCartWithManagedCookie = async (input: CartInput = {}) => {
    // create new cart if no cartId is provided or fetching the cart fails
    const createCartResponse = await createCart(input);
    const parsedCreateCartResponse = this.parseClientResponse(
      createCartResponse,
      "error creating cart"
    );
    const cart = parsedCreateCartResponse.cartCreate.cart;
    createCartId(cart.id);
    return cart;
  };

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

  fetchCart = async (cartId: string) => {
    const fetchedCartResponse = await fetchCart(cartId);
    return this.parseClientResponse(fetchedCartResponse, "error fetching cart")
      .cart;
  };

  addToCart = async (cartId: string, lines: CartLineInput[]) => {
    const addToCartResponse = await addToCart(cartId, lines);
    return this.parseClientResponse(addToCartResponse, "error adding to cart")
      .cartLinesAdd.cart;
  };

  updateCartLine = async (cartId: string, lines: CartLineUpdateInput[]) => {
    const updateCartLineResponse = await updateCartLine(cartId, lines);
    return this.parseClientResponse(
      updateCartLineResponse,
      "error updating cart"
    ).cartLinesUpdate.cart;
  };
}
