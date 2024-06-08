import { getErrorMessage } from "@/utils/getters";
import { isDefined, isFieldDefined } from "@/utils/validators";
import {
  CatalogVariant,
  CatalogVariantImagesResponse,
  CatalogVariantResponse,
  Orientation,
  PrintfileInfo,
  ProductTemplateResponse,
  SyncProduct,
  SyncProductsResponse,
  SyncVariant,
  SyncVariantsResponse,
} from "../types/printful";
import printfulConfig, { PrintfulConfig } from "./printfulConfig";

interface requestParams {
  params?: Array<[string, string | undefined]>;
  headers?: Headers;
  url: string;
  name: string;
}

export interface SyncVariantWithSyncProduct extends SyncVariant {
  syncProduct: SyncProduct;
}

export interface SyncVariantWithCatalogVariant
  extends SyncVariantWithSyncProduct {
  catalogVariant?: CatalogVariant;
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

  async getCatalogVariant(
    catalogVariantId: number
  ): Promise<CatalogVariantResponse> {
    return this.request<CatalogVariantResponse>({
      url: `v2/catalog-variants/${catalogVariantId}`,
      name: `getCatalogVariant with catalogVariantId: ${catalogVariantId}`,
    });
  }

  async getAllCatalogVariants(): Promise<SyncVariantWithCatalogVariant[]> {
    const syncProductsResponse = await this.getSyncProducts();
    const syncVariantsResponse: SyncVariantWithSyncProduct[][] =
      await Promise.all(
        syncProductsResponse.data.map(async (syncProduct) => {
          const syncVariants = await this.getAllSyncVariants(syncProduct.id);
          return syncVariants.data.map((syncVariant) => ({
            ...syncVariant,
            syncProduct,
          }));
        })
      );
    const allSyncVariants = syncVariantsResponse
      .flat()
      .filter(isFieldDefined("catalog_variant_id"));
    const catalogVariants = (
      await Promise.all(
        allSyncVariants.map((v) => this.getCatalogVariant(v.catalog_variant_id))
      )
    ).map((response) => response.data);
    // Combine the sync variants with the catalog variants
    const allCatalogVariants = allSyncVariants.map((syncVariant) => {
      const catalogVariant = catalogVariants.find(
        (v) => v.id === syncVariant.catalog_variant_id
      );
      return { ...syncVariant, catalogVariant };
    });
    return allCatalogVariants;
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
