import { MetafieldTypes } from "@/lib/shopify/types/metafields";
import { z } from "zod";
import { VARIANT_METADATA_NAMESPACE, VariantMetadataKey } from "../constants";
import { optionalStringSchema, requiredStringSchema } from "./schemaValidators";

/**
 * Schema for validating BaseMetafieldInput
 */
const BaseMetafieldInputSchema = z.object({
  id: optionalStringSchema({
    name: "Metafield ID",
    description: "The unique ID of the metafield",
  }),
  key: z.optional(z.enum(VariantMetadataKey)),
  namespace: z.optional(z.enum([VARIANT_METADATA_NAMESPACE])),
  type: z.optional(z.enum(MetafieldTypes)),
  value: requiredStringSchema({
    name: "Metafield Value",
    description: "The data stored in the metafield",
  }),
});

/**
 * Schema for validating UpdateMetafieldInput
 */
const UpdateMetafieldInputSchema = BaseMetafieldInputSchema.extend({
  id: requiredStringSchema({
    name: "Metafield ID",
    description: "The unique ID of the metafield",
  }),
});

/**
 * Schema for validating CreateMetafieldInput
 */
const CreateMetafieldInputSchema = BaseMetafieldInputSchema.extend({
  key: z.enum(VariantMetadataKey),
  namespace: z.enum([VARIANT_METADATA_NAMESPACE]),
  type: z.enum(MetafieldTypes),
});

/**
 * Schema for validating MetafieldInput (union of Update and Create)
 */
export const MetafieldInputSchema = z.union([
  UpdateMetafieldInputSchema,
  CreateMetafieldInputSchema,
]);
