import { getErrorMessage } from "@/utils/getters";
import { isDefined } from "@/utils/validators";
import {
  CatalogVariantImagesResponse,
  Orientation,
  PrintfileInfo,
  ProductTemplateResponse,
  SyncProductsResponse,
  SyncVariantsResponse,
} from "../types/printful";
import printfulConfig, { PrintfulConfig } from "./printfulConfig";

interface requestParams {
  params?: Array<[string, string | undefined]>;
  headers?: Headers;
  url: string;
  name: string;
}

class PrintfulAPI {
  private static instance: PrintfulAPI;
  private readonly baseUrl: string;
  private readonly authToken: string;

  private constructor(config: PrintfulConfig) {
    this.authToken = config.authToken;
    this.baseUrl = config.apiUrl;
  }

  static getInstance(config: PrintfulConfig): PrintfulAPI {
    if (!PrintfulAPI.instance) {
      PrintfulAPI.instance = new PrintfulAPI(config);
    }
    return PrintfulAPI.instance;
  }

  private getAuthHeader() {
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${this.authToken}`);
    return headers;
  }

  private getSearchParamString(params?: Array<[string, string | undefined]>) {
    const searchParams = new URLSearchParams();
    params?.forEach(
      ([key, value]) => isDefined(value) && searchParams.append(key, value)
    );
    return searchParams.toString();
  }

  private getUrlWithParams(
    url: string,
    params?: Array<[string, string | undefined]>
  ) {
    const searchParams = this.getSearchParamString(params);
    return `${url}?${searchParams}`;
  }

  private async request<T>({
    url,
    params,
    headers,
    name,
  }: requestParams): Promise<T> {
    try {
      const urlWithParams = this.getUrlWithParams(
        `${this.baseUrl}/${url}`,
        params
      );
      const authHeaders = this.getAuthHeader();
      // combine headers
      const combinedHeaders = new Headers();
      headers?.forEach((value, key) => combinedHeaders.append(key, value));
      authHeaders.forEach((value, key) => combinedHeaders.append(key, value));

      const response = await fetch(urlWithParams, {
        headers: combinedHeaders,
      });
      if (!response.ok) {
        const errorMessage = await getErrorMessage(response);
        throw new Error(errorMessage);
      }
      return response.json();
    } catch (error) {
      console.error(`Error in ${name || "printful request"}:`, error);
      throw error;
    }
  }

  async getLayoutTemplates(
    catalogProductId: number,
    technique?: string,
    orientation?: Orientation
  ): Promise<ProductTemplateResponse> {
    return this.request<ProductTemplateResponse>({
      url: `mockup-generator/templates/${catalogProductId}`,
      params: [
        ["technique", technique],
        ["orientation", orientation],
      ],
      name: "getLayoutTemplates",
    });
  }

  async getPrintfileInfo(
    catalogProductId: number,
    technique?: string,
    orientation?: Orientation
  ): Promise<PrintfileInfo> {
    return this.request<PrintfileInfo>({
      url: `mockup-generator/printfiles/${catalogProductId}`,
      params: [
        ["technique", technique],
        ["orientation", orientation],
      ],
      name: "getPrintfileInfo",
    });
  }

  async getSyncProducts(): Promise<SyncProductsResponse> {
    return this.request<SyncProductsResponse>({
      url: "v2/sync-products",
      name: "getSyncProducts",
    });
  }

  private async getSyncVariantsFromLink(
    link: string,
    prevResponseData?: SyncVariantsResponse["data"]
  ): Promise<SyncVariantsResponse> {
    try {
      const response = await fetch(link, {
        headers: this.getAuthHeader(),
      });
      if (!response.ok) {
        const errorMessage = await getErrorMessage(response);
        throw new Error(errorMessage);
      }
      const syncVariantResponse: SyncVariantsResponse = await response.json();
      // If there is a next link, recursively fetch the next page
      if (syncVariantResponse._links.next) {
        const nextResponse = await this.getSyncVariantsFromLink(
          syncVariantResponse._links.next.href,
          prevResponseData?.concat(syncVariantResponse.data) ??
            syncVariantResponse.data
        );
        return nextResponse;
      }
      const data =
        prevResponseData?.concat(syncVariantResponse.data) ??
        syncVariantResponse.data;
      return { ...syncVariantResponse, data };
    } catch (error) {
      console.error("Error in getSyncVariantsFromLink:", error);
      throw error;
    }
  }

  async getAllSyncVariants(
    productId: number,
    limit = 100
  ): Promise<SyncVariantsResponse> {
    try {
      const url = this.getUrlWithParams(
        `${this.baseUrl}/v2/sync-products/${productId}/sync-variants`,
        [["limit", `${limit}`]]
      );
      return this.getSyncVariantsFromLink(url);
    } catch (error) {
      console.error("Error in getAllSyncVariants:", error);
      throw error;
    }
  }

  async getCatalogVariantImages(
    catalogVariantId: number
  ): Promise<CatalogVariantImagesResponse> {
    return this.request<CatalogVariantImagesResponse>({
      url: `v2/catalog-variants/${catalogVariantId}/images`,
      name: "getCatalogVariantImages",
    });
  }

  async getVariantData(
    productId: number,
    variantId: number,
    technique?: string,
    orientation?: Orientation
  ): Promise<{
    printfileInfo: PrintfileInfo;
    variantImages: CatalogVariantImagesResponse;
  }> {
    try {
      const printfileInfo = await this.getPrintfileInfo(
        productId,
        technique,
        orientation
      );
      const variantImages = await this.getCatalogVariantImages(variantId);

      return { printfileInfo, variantImages };
    } catch (error) {
      console.error("Error in getVariantData:", error);
      throw error;
    }
  }
}

const PrintfulClient = PrintfulAPI.getInstance(printfulConfig);
export default PrintfulClient;
