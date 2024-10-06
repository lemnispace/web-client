import { ClientResponse } from "@shopify/storefront-api-client";
import { GetNavigationLink } from "../utils/mappers";

export interface ShopifyServiceConfig {
    parseClientResponse<T>(
        response: ClientResponse<T>,
        defaultErrorMessage: string
    ): NonNullable<T>;
    getNavigationLink: GetNavigationLink;
}