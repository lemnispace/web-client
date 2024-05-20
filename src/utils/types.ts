import {
  ProductPriceRange,
  ProductVariantNode,
  ProductVariantOptionType,
} from "@/lib/types/shopify";
import { NextResponse } from "next/server";

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

export interface ProductVariant
  extends ProductVariantOption,
    Omit<ProductVariantNode, "selectedOptions" | "image"> {
  image?: ProductImg;
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
  customProductId?: string;
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
