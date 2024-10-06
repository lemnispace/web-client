import { Image } from "./media";
import { MetafieldDefinition } from "./metafields";

/*
 *  ╔══════════════════════════════════════════════════════════════════════════════╗
 *  ║                                 Collection Types                             ║
 *  ╚══════════════════════════════════════════════════════════════════════════════╝
 */

export interface ProductTaxonomyNode {
  /**
   * The full name of the product taxonomy node.
   * For example, Animals & Pet Supplies > Pet Supplies > Dog Supplies > Dog Beds.
   */
  fullName: string;

  /**
   * The ID of the product taxonomy node.
   */
  id: string;

  /**
   * Whether the node is a leaf node.
   */
  isLeaf: boolean;

  /**
   * Whether the node is a root node.
   */
  isRoot: boolean;

  /**
   * The name of the product taxonomy node.
   * For example, Dog Beds.
   */
  name: string;
}

export interface SEO {
  description: string;
  title: string;
}

export type CollectionRuleColumn =
  | "IS_PRICE_REDUCED"
  | "PRODUCT_METAFIELD_DEFINITION"
  | "PRODUCT_TAXONOMY_NODE_ID"
  | "TAG"
  | "TITLE"
  | "TYPE"
  | "VARIANT_COMPARE_AT_PRICE"
  | "VARIANT_INVENTORY"
  | "VARIANT_METAFIELD_DEFINITION"
  | "VARIANT_PRICE"
  | "VARIANT_TITLE"
  | "VARIANT_WEIGHT"
  | "VENDOR";

export type CollectionRuleRelation =
  | "CONTAINS"
  | "ENDS_WITH"
  | "EQUALS"
  | "GREATER_THAN"
  | "IS_NOT_SET"
  | "IS_SET"
  | "LESS_THAN"
  | "NOT_CONTAINS"
  | "NOT_EQUALS"
  | "STARTS_WITH";

export type CollectionSortOrder =
  /**
   * Alphabetically, in ascending order (A - Z).
   */
  | "ALPHA_ASC"

  /**
   * Alphabetically, in descending order (Z - A).
   */
  | "ALPHA_DESC"

  /**
   * By best-selling products.
   */
  | "BEST_SELLING"

  /**
   * By date created, in ascending order (oldest - newest).
   */
  | "CREATED"

  /**
   * By date created, in descending order (newest - oldest).
   */
  | "CREATED_DESC"

  /**
   * In the order set manually by the merchant.
   */
  | "MANUAL"

  /**
   * By price, in ascending order (lowest - highest).
   */
  | "PRICE_ASC"

  /**
   * By price, in descending order (highest - lowest).
   */
  | "PRICE_DESC";

/**
 * Represents a group of products that can be displayed in online stores and other sales channels.
 */
export interface Collection {
  /**
   * A globally-unique ID.
   */
  id: string;

  /**
   * The name of the collection. It's displayed in the Shopify admin and is typically displayed in sales channels, such as an online store.
   */
  title: string;

  /**
   * A single-line, text-only description of the collection, stripped of any HTML tags and formatting that were included in the description.
   */
  description?: string;

  /**
   * The description of the collection, including any HTML tags and formatting. This content is typically displayed to customers, such as on an online store, depending on the theme.
   */
  descriptionHtml?: string;

  /**
   * A unique string that identifies the collection.
   */
  handle: string;

  /**
   * The image associated with the collection.
   */
  image?: Image;

  /**
   * The number of products in the collection.
   */
  productsCount?: number;

  /**
   * For a smart (automated) collection, specifies the rules that determine whether a product is included.
   */
  ruleSet?: CollectionRuleSet;

  /**
   * If the default SEO fields for page title and description have been modified, contains the modified information.
   */
  seo?: SEO;

  /**
   * The order in which the products in the collection are displayed by default in the Shopify admin and in sales channels, such as an online store.
   */
  sortOrder?: CollectionSortOrder;

  /**
   * The suffix of the Liquid template being used to show the collection in an online store.
   */
  templateSuffix?: string;

  /**
   * The date and time (ISO 8601 format) when the collection was last modified.
   */
  updatedAt: string;
}

/**
 * The set of rules that are used to determine which products are included in the collection.
 */
export interface CollectionRuleSet {
  /**
   * Whether products must match any or all of the rules to be included in the collection.
   * If true, then products must match at least one of the rules to be included in the collection.
   * If false, then products must match all of the rules to be included in the collection.
   */
  appliedDisjunctively: boolean;

  /**
   * The rules used to assign products to the collection.
   */
  rules: CollectionRule[];
}

/**
 * Represents a rule that's used to assign products to a collection.
 */
export interface CollectionRule {
  /**
   * The attribute that the rule focuses on. For example, title or product_type.
   */
  column: CollectionRuleColumn;

  /**
   * The value that the operator is applied to. For example, Hats.
   */
  condition: string;

  /**
   * The value that the operator is applied to.
   */
  conditionObject?: CollectionRuleConditionObject;

  /**
   * The type of operator that the rule is based on. For example, equals, contains, or not_equals.
   */
  relation: CollectionRuleRelation;
}

/**
 * Specifies the condition for the rule.
 */
type CollectionRuleConditionObject =
  | CollectionRuleMetafieldCondition
  | CollectionRuleProductCategoryCondition
  | CollectionRuleTextCondition;

/**
 * Identifies a metafield definition used as a rule for the smart collection.
 */
export interface CollectionRuleMetafieldCondition {
  /**
   * The metafield definition associated with the condition.
   */
  metafieldDefinition: MetafieldDefinition;
}

/**
 * Specifies the condition for a Product Category field.
 */
export interface CollectionRuleProductCategoryCondition {
  /**
   * The value of the condition.
   */
  value: ProductTaxonomyNode;
}

/**
 * Specifies the condition for a text field.
 */
export interface CollectionRuleTextCondition {
  /**
   * The value of the condition.
   */
  value: string;
}
