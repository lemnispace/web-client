export type Orientation = "horizontal" | "vertical";

export type FillMode = "cover" | "fit";

export interface Printfile {
  printfileId: number;
  width: number;
  height: number;
  dpi: number;
  fillMode: FillMode;
  canRotate: boolean;
}

export interface VariantPrintfile {
  variantId: number;
  placements: Record<string, number>;
}

export interface PrintfileInfo {
  productId: number;
  availablePlacements: Record<string, string>;
  printfiles: Printfile[];
  variantPrintfiles: VariantPrintfile[];
  optionGroups: string[];
  options: string[];
}

export interface CatalogVariantImage {
  placement: string;
  imageUrl: string;
  backgroundColor: string;
  backgroundImage: string;
}

export interface CatalogVariantImageData {
  catalogVariantId: number;
  color: string;
  primaryHexColor: string;
  secondaryHexColor: string | null;
  images: CatalogVariantImage[];
}

export interface CatalogVariantImagesResponse {
  data: CatalogVariantImageData[];
  _links: {
    self: Link;
    variantDetails: Link;
  };
}

export interface SyncProductsResponse {
  data: SyncProduct[];
  _links: SyncProductsLinks;
  paging: Paging;
}

export interface SyncProduct {
  id: number;
  external_id: string;
  name: string;
  thumbnail_url: string;
  is_ignored: boolean;
  _links: SyncProductLinks;
}

export interface SyncProductLinks {
  self: Link;
  sync_variants: Link;
}

export interface Link {
  href: string;
}

export interface SyncProductsLinks {
  self: Link;
  next?: Link;
  previous?: Link;
  first: Link;
  last: Link;
}

export interface Paging {
  total: number;
  offset: number;
  limit: number;
}

export interface SyncVariantsResponse {
  data: SyncVariant[];
  extra: any[];
  paging: Paging;
  _links: SyncVariantsLinks;
}

export interface SyncVariant {
  id: number;
  external_id: string;
  sync_product_id: number;
  name: string;
  status: string;
  catalog_variant_id: number;
  warehouse_product_variant_id: number | null;
  retail_price: string;
  sku: string;
  currency: string;
  is_ignored: boolean;
  product_options: any[];
  placements: Placement[];
  _links: SyncVariantLinks;
}

export interface Placement {
  placement: string;
  technique: string;
  layers: Layer[];
  placement_options: any[];
  status: string;
  status_explanation: string;
}

export interface Layer {
  type: string;
  position: Position;
  url: string;
  layer_options: any[];
}

export interface Position {
  width: number;
  height: number;
  top: number;
  left: number;
}

export interface SyncVariantLinks {
  self: Link;
  sync_product: Link;
}

export interface SyncVariantsLinks {
  self: Link;
  next?: Link;
  first: Link;
  last: Link;
}

/**
 * Response schema for retrieving product templates.
 */
export interface ProductTemplateResponse {
  /**
   * Response status code (200 for successful response).
   */
  code: number;

  /**
   * Product template result.
   */
  result: ProductTemplate;
}

/**
 * Represents a product template.
 */
export interface ProductTemplate {
  /**
   * Resource version. If this changes, resources (positions, images, etc.) should be re-cached.
   */
  version: number;

  /**
   * Recommended minimum DPI for the given product.
   */
  min_dpi: number;

  /**
   * List of product variants mapped to templates.
   * From this information, you can determine which template should be used for a variant.
   */
  variant_mapping: TemplateVariantMapping[];

  /**
   * List of templates. Use variant_mapping to determine which template corresponds to which product variant.
   */
  templates: Template[];
}

/**
 * Represents a mapping of a product variant to templates.
 */
export interface TemplateVariantMapping {
  /**
   * Product variant ID.
   */
  variant_id: number;

  /**
   * Array of Template Variant Mapping items.
   */
  templates: TemplateVariantMappingItem[];
}

/**
 * Represents a mapping of a template to a placement for a variant.
 */
export interface TemplateVariantMappingItem {
  /**
   * Placement ID.
   */
  placement: string;

  /**
   * Corresponding template ID which should be used for this variant and placement combination.
   */
  template_id: number;
}

/**
 * Represents a template.
 */
export interface Template {
  /**
   * Template ID.
   */
  template_id: number;

  /**
   * Main template image URL.
   */
  image_url: string;

  /**
   * Background image URL (optional).
   */
  background_url: string | null;

  /**
   * HEX color code that should be used as a background color.
   */
  background_color: number | null;

  /**
   * Printfile ID that should be generated for this template.
   * See printfile API endpoint for list of Printfiles.
   */
  printfile_id: number;

  /**
   * Width of the whole template in pixels.
   */
  template_width: number;

  /**
   * Height of the whole template in pixels.
   */
  template_height: number;

  /**
   * Print area width (image is positioned in this area).
   */
  print_area_width: number;

  /**
   * Print area height (image is positioned in this area).
   */
  print_area_height: number;

  /**
   * Print area top offset (offset in template).
   */
  print_area_top: number;

  /**
   * Print area left offset (offset in template).
   */
  print_area_left: number;

  /**
   * Indicates whether the main template image (image_url) should be used as an overlay or as a background.
   */
  is_template_on_front: boolean;

  /**
   * Wall art product orientation.
   * Possible values: "horizontal", "vertical", "any".
   */
  orientation: "horizontal" | "vertical" | "any";

  /**
   * List of conflicting placements. Used to determine which placements can be used together.
   */
  conflicting_placements: TemplatePlacementConflict[];
}

/**
 * Represents a conflict between placements.
 */
export interface TemplatePlacementConflict {
  /**
   * Placement ID.
   */
  placement: string;

  /**
   * List of Placement IDs that are conflicting with the given placement.
   */
  conflicts: string[];
}
