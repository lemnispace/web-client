import { z } from "zod";
import { requiredStringSchema } from "./schemaValidators";

/**
 * Schema for validating AttributeInput
 */
export const AttributeInputSchema = z.object({
  key: requiredStringSchema({
    name: "Attribute Key",
    description: "The unique identifier for the attribute",
  }),
  value: requiredStringSchema({
    name: "Attribute Value",
    description: "The value of the attribute",
  }),
});
