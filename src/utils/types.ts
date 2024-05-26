import {
  ProductPriceRange,
  ProductVariantMetafield,
  ProductVariantNode,
  ProductVariantOptionType,
} from "@/lib/types/shopify";
import { NextResponse } from "next/server";
import { VariantMetadataKey } from "./constants";

export interface ProductImg {
  src: string;
  alt?: string;
  width: number;
  height: number;
  id: string;
}

export type ProductVariantOption = {
  [K in ProductVariantOptionType]?: string;
};

export type ProductVariantMetafieldValue = Omit<ProductVariantMetafield, "key">;

export type ProductVariantMetafields = {
  [K in VariantMetadataKey]: ProductVariantMetafieldValue;
};
export interface ProductVariant
  extends ProductVariantOption,
    Omit<ProductVariantNode, "selectedOptions" | "image" | "metafields"> {
  image?: ProductImg;
  metafields?: ProductVariantMetafields;
}

export interface ProductItem {
  id: string;
  name: string;
  priceRange: ProductPriceRange;
  description: string;
  descriptionHtml: string;
  type?: string;
  tags: string[];
  variants?: ProductVariant[];
  href: string;
  img?: ProductImg;
}

export interface Product extends ProductItem {
  images?: ProductImg[];
}

export interface ProductWithCustomization extends Product {
  customProduct?: Product;
}

export interface BaseResponse {
  status: number;
}

export interface ValidationErrorResponse<T = unknown> extends BaseResponse {
  status: 400 | 401 | 403 | 404 | 422;
  errors: T;
  data?: undefined;
}

export interface ServerErrorResponse<T> extends BaseResponse {
  status: 500;
  errors: T;
  data?: undefined;
}

export interface SuccessResponse<T> extends BaseResponse {
  status: 200 | 201 | 204;
  data: T;
}

export type ApiResponse<VALIDATION_ERRORS, SERVER_ERRORS, DATA> =
  | ValidationErrorResponse<VALIDATION_ERRORS>
  | ServerErrorResponse<SERVER_ERRORS>
  | SuccessResponse<DATA>;

export type ServerParsedApiResponse<DATA> = ApiResponse<string, string, DATA>;
export type ServerApiResponse<DATA> = NextResponse<
  Omit<ServerParsedApiResponse<DATA>, "status">
>;

export type ClientResponse<DATA> = {
  data?: DATA;
  errors?: string;
};
