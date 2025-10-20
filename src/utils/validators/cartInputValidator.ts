import { MetafieldTypes } from "@/lib/shopify/types/metafields";
import { CountryCode } from "@/lib/shopify/types/shopifyCountryCodes";
import { z } from "zod";
import {
  optionalNumberSchema,
  optionalStringSchema,
  requiredStringSchema,
} from "./schemaValidators";

/**
 * Schema for validating attribute inputs.
 */
const AttributeInputSchema = z.object({
  key: requiredStringSchema({
    name: "Attribute key",
    description: "Key of the attribute",
  }),
  value: requiredStringSchema({
    name: "Attribute value",
    description: "Value of the attribute",
  }),
});

/**
 * Schema for validating cart line input.
 */
export const CartLineUpdateInputSchema = z.object({
  attributes: z.array(AttributeInputSchema).max(250).optional(),
  merchandiseId: optionalStringSchema({
    name: "Merchandise ID",
    description: "ID of the merchandise",
  }),
  id: requiredStringSchema({
    name: "Merchandise Line ID",
    description: "The ID of the merchandise line",
  }),
  quantity: optionalNumberSchema({
    name: "Quantity",
    description: "The quantity of the line item. Set to 0 to remove the item.",
    min: 0, // Allow 0 for item removal
  }).default(1),
  sellingPlanId: optionalStringSchema({
    name: "Selling Plan ID",
    description:
      "The ID of the selling plan that the merchandise is being purchased with",
  }),
});
/**
 * Schema for validating cart line input.
 */
export const CartLineInputSchema = z.object({
  attributes: z.array(AttributeInputSchema).max(250).optional(),
  merchandiseId: requiredStringSchema({
    name: "Merchandise ID",
    description: "ID of the merchandise",
  }),
  quantity: optionalNumberSchema({
    name: "Quantity",
    description: "Quantity of the merchandise",
    min: 1,
  }).default(1),
  sellingPlanId: optionalStringSchema({
    name: "Selling Plan ID",
    description: "ID of the selling plan",
  }),
});

/**
 * Schema for validating cart input metafield.
 */
const CartInputMetafieldInputSchema = z.object({
  key: requiredStringSchema({
    name: "Metafield Key",
    description: "Key of the metafield",
  }),
  value: requiredStringSchema({
    name: "Metafield Value",
    description: "Value of the metafield",
  }),
  type: z.enum(MetafieldTypes),
});

/**
 * Schema for validating mailing address input.
 */
const MailingAddressInputSchema = z.object({
  address1: optionalStringSchema({
    name: "Address Line 1",
    description: "First line of the address",
  }),
  address2: optionalStringSchema({
    name: "Address Line 2",
    description: "Second line of the address",
  }),
  city: optionalStringSchema({
    name: "City",
    description: "City of the address",
  }),
  company: optionalStringSchema({
    name: "Company",
    description: "Company name",
  }),
  country: optionalStringSchema({
    name: "Country",
    description: "Country of the address",
  }),
  firstName: optionalStringSchema({
    name: "First Name",
    description: "First name of the recipient",
  }),
  lastName: optionalStringSchema({
    name: "Last Name",
    description: "Last name of the recipient",
  }),
  phone: optionalStringSchema({ name: "Phone", description: "Phone number" }),
  province: optionalStringSchema({
    name: "Province",
    description: "Province or state of the address",
  }),
  zip: optionalStringSchema({ name: "ZIP", description: "ZIP or postal code" }),
});

/**
 * Schema for the delivery address input.
 */
const DeliveryAddressInputSchema = z.object({
  customerAddressId: optionalStringSchema({
    name: "Customer Address ID",
    description: "ID of the customer's address",
  }),
  deliveryAddress: MailingAddressInputSchema.optional(),
});

/**
 * Schema for validating the buyer identity input in the cart.
 */
const CartBuyerIdentityInputSchema = z.object({
  countryCode: z.nativeEnum(CountryCode).optional(),
  customerAccessToken: optionalStringSchema({
    name: "Customer Access Token",
    description: "Token for customer access",
  }),
  deliveryAddressPreferences: z.array(DeliveryAddressInputSchema).optional(),
  email: optionalStringSchema({
    name: "Email",
    description: "Customer's email",
  }),
  phone: optionalStringSchema({
    name: "Phone",
    description: "Customer's phone number",
  }),
});

/**
 * Represents the schema for validating cart input data.
 */
export const CartInputSchema = z.object({
  attributes: z.array(AttributeInputSchema).optional(),
  buyerIdentity: CartBuyerIdentityInputSchema.optional(),
  discountCodes: z
    .array(
      requiredStringSchema({
        name: "Discount Code",
        description: "Discount code to be applied",
      })
    )
    .optional(),
  lines: z.array(CartLineInputSchema).optional(),
  metafields: z.array(CartInputMetafieldInputSchema).optional(),
  note: optionalStringSchema({
    name: "Note",
    description: "Additional note for the cart",
  }),
});
