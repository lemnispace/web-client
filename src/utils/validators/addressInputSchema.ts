import { z } from "zod";
import { optionalStringSchema } from "./schemaValidators";

/**
 * Schema for validating MailingAddressInput
 */
export const MailingAddressInputSchema = z.object({
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
