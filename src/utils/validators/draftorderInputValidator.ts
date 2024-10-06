import { LocalizationExtensionKey } from "@/lib/shopify/types/input";
import { CountryCode } from "@/lib/shopify/types/shopifyCountryCodes";
import { CurrencyCode } from "@/lib/shopify/types/shopifyCurrencyCodes";
import { z } from "zod";
import { MailingAddressInputSchema } from "./addressInputSchema";
import { AttributeInputSchema } from "./attributeInputSchema";
import { MetafieldInputSchema } from "./metafieldInputSchema";
import {
  optionalBooleanSchema,
  optionalStringSchema,
  requiredNumberSchema,
  requiredStringSchema,
} from "./schemaValidators";

/**
 * Schema for validating DraftOrderLineItemInput
 */
export const DraftOrderLineItemInputSchema = z.object({
  appliedDiscount: z.optional(
    z.lazy(() => DraftOrderAppliedDiscountInputSchema)
  ),
  customAttributes: z.optional(z.array(AttributeInputSchema)),
  quantity: requiredNumberSchema({
    name: "Quantity",
    description: "The line item quantity",
    min: 1,
  }),
  requiresShipping: optionalBooleanSchema({
    name: "Requires Shipping",
    description: "Whether physical shipping is required",
  }),
  sku: optionalStringSchema({
    name: "SKU",
    description: "The SKU number for custom line items",
  }),
  taxable: optionalBooleanSchema({
    name: "Taxable",
    description: "Whether the custom line item is taxable",
  }),
  title: optionalStringSchema({
    name: "Title",
    description: "Title of the line item",
  }),
  variantId: z.union([z.string(), z.null()]).optional(),
  weight: z.optional(z.lazy(() => WeightInputSchema)),
});

/**
 * Schema for validating DraftOrderAppliedDiscountInput
 */
export const DraftOrderAppliedDiscountInputSchema = z.object({
  description: optionalStringSchema({
    name: "Description",
    description: "Reason for the discount",
  }),
  title: optionalStringSchema({
    name: "Title",
    description: "Title of the discount",
  }),
  value: requiredNumberSchema({
    name: "Value",
    description: "The value of the discount",
  }),
  valueType: z.enum(["FIXED_AMOUNT", "PERCENTAGE"] as const),
});

/**
 * Schema for validating WeightInput
 */
export const WeightInputSchema = z.object({
  unit: z.enum(["GRAMS", "KILOGRAMS", "OUNCES", "POUNDS"] as const),
  value: requiredNumberSchema({
    name: "Weight Value",
    description: "The weight value",
  }),
});

/**
 * Schema for validating PurchasingCompanyInput
 */
export const PurchasingCompanyInputSchema = z.object({
  companyContactId: requiredStringSchema({
    name: "Company Contact ID",
    description: "ID of the company contact",
  }),
  companyId: requiredStringSchema({
    name: "Company ID",
    description: "ID of the company",
  }),
  companyLocationId: requiredStringSchema({
    name: "Company Location ID",
    description: "ID of the company location",
  }),
});

/**
 * Schema for validating PurchasingEntityInput
 */
export const PurchasingEntityInputSchema = z.object({
  customerId: z.union([z.string(), z.null()]).optional(),
  purchasingCompany: z
    .optional(z.lazy(() => PurchasingCompanyInputSchema))
    .nullable(),
});

/**
 * Schema for validating PaymentScheduleInput
 */
export const PaymentScheduleInputSchema = z.object({
  dueAt: optionalStringSchema({
    name: "Due At",
    description: "Date and time when payment is due",
  }),
  issuedAt: optionalStringSchema({
    name: "Issued At",
    description: "Date and time when payment was issued",
  }),
});

/**
 * Schema for validating PaymentTermsInput
 */
export const PaymentTermsInputSchema = z.object({
  paymentSchedules: z.optional(z.array(PaymentScheduleInputSchema)),
  paymentTermsTemplateId: optionalStringSchema({
    name: "Payment Terms Template ID",
    description: "ID of the payment terms template",
  }),
});

/**
 * Schema for validating LocalizationExtensionInput
 */
export const LocalizationExtensionInputSchema = z.object({
  key: z.nativeEnum(LocalizationExtensionKey),
  value: requiredStringSchema({
    name: "Value",
    description: "The localization extension value",
  }),
});

/**
 * Schema for validating ShippingLineInput
 */
export const ShippingLineInputSchema = z.object({
  shippingRateHandle: z.union([z.string(), z.null()]).optional(),
  title: optionalStringSchema({
    name: "Title",
    description: "Title of the shipping rate",
  }),
});

/**
 * Schema for validating DraftOrderInput
 */
export const DraftOrderInputSchema = z.object({
  appliedDiscount: z.optional(
    z.lazy(() => DraftOrderAppliedDiscountInputSchema)
  ),
  billingAddress: z.optional(z.lazy(() => MailingAddressInputSchema)),
  customAttributes: z.optional(z.array(AttributeInputSchema)),
  email: optionalStringSchema({
    name: "Email",
    description: "The customer's email address",
  }),
  lineItems: z.array(DraftOrderLineItemInputSchema).optional(),
  localizationExtensions: z.optional(z.array(LocalizationExtensionInputSchema)),
  marketRegionCountryCode: z.nativeEnum(CountryCode).optional(),
  metafields: z.optional(z.array(MetafieldInputSchema)),
  note: optionalStringSchema({
    name: "Note",
    description: "Optional note for the draft order",
  }),
  paymentTerms: z.optional(z.lazy(() => PaymentTermsInputSchema)),
  phone: optionalStringSchema({
    name: "Phone",
    description: "The customer's phone number",
  }),
  poNumber: optionalStringSchema({
    name: "PO Number",
    description: "The purchase order number",
  }),
  presentmentCurrencyCode: z.nativeEnum(CurrencyCode).optional(),
  purchasingEntity: z.optional(z.lazy(() => PurchasingEntityInputSchema)),
  reserveInventoryUntil: optionalStringSchema({
    name: "Reserve Inventory Until",
    description: "The time after which inventory reservation will expire",
  }),
  shippingAddress: z.optional(z.lazy(() => MailingAddressInputSchema)),
  shippingLine: z.optional(z.lazy(() => ShippingLineInputSchema)),
  sourceName: optionalStringSchema({
    name: "Source Name",
    description: "The source of the checkout",
  }),
  tags: z.array(z.string()).optional(),
  taxExempt: optionalBooleanSchema({
    name: "Tax Exempt",
    description: "Whether taxes are exempt",
  }),
  useCustomerDefaultAddress: optionalBooleanSchema({
    name: "Use Customer Default Address",
    description: "Whether to use the customer's default address",
  }),
  visibleToCustomer: optionalBooleanSchema({
    name: "Visible To Customer",
    description: "Whether the draft order is visible to the customer",
  }),
});
