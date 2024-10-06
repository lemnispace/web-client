import { TemplatePlacementConflict } from "@/lib/printful/types";
import {
  ProductMetafield,
  ProductVariantMetafield,
} from "@/lib/shopify/types/metafields";
import { ProductPriceRange } from "@/lib/shopify/types/pricing";
import {
  ProductVariantNode,
  ProductVariantOptionType,
} from "@/lib/shopify/types/product";
import { NextResponse } from "next/server";
import { ProductMetadataKey, VariantMetadataKey } from "./constants";
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
  [K in VariantMetadataKey]?: ProductVariantMetafieldValue;
};

export type ProductMetafieldValue = Omit<ProductMetafield, "key">;
export type ProductMetafields = {
  [K in ProductMetadataKey]?: ProductMetafieldValue;
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
  metafields?: ProductMetafields;
}

export interface ProductWithCustomization extends Product {
  customVariants?: ProductVariant[];
  customProductId?: string;
}

export interface ProductVariantWithCustomization extends ProductVariant {
  hasCustomization: boolean;
  customization: ProductVariant | undefined;
  customProductId?: string;
}

export interface VariantTemplate {
  templateId: number;
  imageUrl: string;
  backgroundUrl?: string | null;
  backgroundColor?: string | null;
  printfileId: number;
  templateWidth: number;
  templateHeight: number;
  printAreaWidth: number;
  printAreaHeight: number;
  printAreaTop: number;
  printAreaLeft: number;
  isTemplateOnFront: boolean;
  orientation: "horizontal" | "vertical" | "any";
  conflictingPlacements: TemplatePlacementConflict[];
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
  | ValidationErrorResponse<ValidationErrors[] | VALIDATION_ERRORS>
  | ServerErrorResponse<SERVER_ERRORS>
  | SuccessResponse<DATA>;

export interface ValidationErrors {
  code: string;
  message: string;
}

export type ServerParsedApiResponse<DATA> = ApiResponse<string, string, DATA>;
export type ServerApiResponse<DATA> = NextResponse<
  Omit<ServerParsedApiResponse<DATA>, "status">
>;

export type ClientResponse<DATA> = {
  data?: DATA;
  errors?: string;
};

export type CursorCSSValues =
  | "auto"
  | "default"
  | "none"
  | "context-menu"
  | "help"
  | "pointer"
  | "progress"
  | "wait"
  | "cell"
  | "crosshair"
  | "text"
  | "vertical-text"
  | "alias"
  | "copy"
  | "move"
  | "no-drop"
  | "not-allowed"
  | "grab"
  | "grabbing"
  | "all-scroll"
  | "col-resize"
  | "row-resize"
  | "n-resize"
  | "e-resize"
  | "s-resize"
  | "w-resize"
  | "ne-resize"
  | "nw-resize"
  | "se-resize"
  | "sw-resize"
  | "ew-resize"
  | "ns-resize"
  | "nesw-resize"
  | "nwse-resize"
  | "zoom-in"
  | "zoom-out";
