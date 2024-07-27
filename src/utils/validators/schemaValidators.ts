import { z } from "zod";
import { MAX_IMG_FILE_SIZE, MAX_IMG_FILE_SIZE_MB } from "../constants";

interface BaseSchemaConfig {
  name: string;
}

interface CommonSchemaConfig extends BaseSchemaConfig {
  description: string;
}

interface StringSchemaConfig extends CommonSchemaConfig {
  minLength?: number;
}

interface NumberSchemaConfig extends CommonSchemaConfig {
  min?: number;
  max?: number;
}

interface BooleanSchemaConfig extends CommonSchemaConfig {}

/**
 * Validation function for required string values.
 * @param config - The configuration object for the string schema.
 * @returns A ZodSchema for the required string.
 */
export const requiredStringSchema = ({
  description,
  minLength = 1,
  name,
}: StringSchemaConfig) => {
  return z
    .string({
      invalid_type_error: `${name} must be a string`,
      description,
      required_error: `${name} is required`,
    })
    .trim()
    .min(minLength);
};

/**
 * Validation function for optional string values.
 * @param config - The configuration object for the string schema.
 * @returns A ZodSchema for the optional string.
 */
export const optionalStringSchema = ({
  description,
  minLength = 1,
  name,
}: StringSchemaConfig) => {
  return z
    .string({
      invalid_type_error: `${name} must be a string`,
      description,
    })
    .trim()
    .min(minLength)
    .optional()
    .nullable();
};

/**
 * Validation function for required number values.
 * @param config - The configuration object for the number schema.
 * @returns A ZodSchema for the required number.
 */
export const requiredNumberSchema = ({
  description,
  min,
  max,
  name,
}: NumberSchemaConfig) => {
  return z
    .number({
      invalid_type_error: `${name} must be a number`,
      description,
      required_error: `${name} is required`,
    })
    .safe()
    .min(min ?? Number.MIN_SAFE_INTEGER)
    .max(max ?? Number.MAX_SAFE_INTEGER);
};

/**
 * Validation function for optional number values.
 * @param config - The configuration object for the number schema.
 * @returns A ZodSchema for the optional number.
 */
export const optionalNumberSchema = ({
  description,
  min,
  max,
  name,
}: NumberSchemaConfig) => {
  return z
    .number({
      invalid_type_error: `${name} must be a number`,
      description,
    })
    .safe()
    .min(min ?? Number.MIN_SAFE_INTEGER)
    .max(max ?? Number.MAX_SAFE_INTEGER)
    .optional()
    .nullable();
};

/**
 * Validation function for required boolean values.
 * @param config - The configuration object for the boolean schema.
 * @returns A ZodSchema for the required boolean.
 */
export const requiredBooleanSchema = ({
  description,
  name,
}: BooleanSchemaConfig) => {
  return z.boolean({
    invalid_type_error: `${name} must be a boolean`,
    description,
    required_error: `${name} is required`,
  });
};

/**
 * Validation function for optional boolean values.
 * @param config - The configuration object for the boolean schema.
 * @returns A ZodSchema for the optional boolean.
 */
export const optionalBooleanSchema = ({
  description,
  name,
}: BooleanSchemaConfig) => {
  return z
    .boolean({
      invalid_type_error: `${name} must be a boolean`,
      description,
    })
    .optional()
    .nullable();
};

/**
 * Validation function for required image file.
 * @param name - The name of the image file field.
 * @returns A ZodSchema for the required image file.
 */
export const requiredImageFileSchema = (
  { name }: BaseSchemaConfig = { name: "File" }
) =>
  z
    .instanceof(File, {
      message: `${name} is required`,
    })
    .refine(
      (file) => {
        return file.type.startsWith("image/");
      },
      {
        message: `${name} must be an image`,
      }
    )
    .refine(
      (file) => {
        return file.size <= MAX_IMG_FILE_SIZE;
      },
      {
        message: `Image size must be less than ${MAX_IMG_FILE_SIZE_MB}MB`,
      }
    );

/**
 * Validation function for optional image file.
 * @param name - The name of the image file field.
 * @returns A ZodSchema for the optional image file.
 */
export const optionalImageFileSchema = (
  { name }: BaseSchemaConfig = { name: "File" }
) =>
  z
    .instanceof(File, {
      message: `${name} must be a file`,
    })
    .refine(
      (file) => {
        return file.type.startsWith("image/");
      },
      {
        message: `${name} must be an image`,
      }
    )
    .refine(
      (file) => {
        return file.size <= MAX_IMG_FILE_SIZE;
      },
      {
        message: `Image size must be less than ${MAX_IMG_FILE_SIZE_MB}MB`,
      }
    )
    .optional()
    .nullable();
