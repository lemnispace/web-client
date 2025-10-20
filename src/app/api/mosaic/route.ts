import { env } from "@/utils/env";
import { getErrorMessage } from "@/utils/getters";
import { parseValidationErrors } from "@/utils/parsers";
import { ApiResponse, ValidationErrors } from "@/utils/types";
import {
  requiredImageFileSchema,
  requiredStringSchema,
} from "@/utils/validators/schemaValidators";
import { NextResponse } from "next/server";
import { z } from "zod";

type MosaicError = {
  message: string;
};

type FetchTextMosaicResponse = ApiResponse<ValidationErrors, MosaicError, Blob>;

const schema = z.object({
  text: requiredStringSchema({
    name: "Text",
    description: "The text to use for the mosaic",
  }),
  // Use coerce for numeric fields since FormData.get() returns strings
  width: z.coerce.number().min(1).max(7200).optional(),
  baseFontSize: z.coerce.number().min(1).max(100).optional(),
  isBlackAndWhite: z
    .union([z.boolean(), z.literal("true"), z.literal("false")])
    .transform((val) => val === true || val === "true")
    .optional(),
  contrastFactor: z.coerce.number().min(0).optional(),
  file: requiredImageFileSchema(),
});

const fetchTextMosaic = async (
  _formData: FormData
): Promise<FetchTextMosaicResponse> => {
  const validatedFields = schema.safeParse({
    text: _formData.get("text"),
    width: _formData.get("width"),
    baseFontSize: _formData.get("base_font_size"),
    isBlackAndWhite: _formData.get("is_black_and_white"),
    contrastFactor: _formData.get("contrast_factor"),
    file: _formData.get("file"),
  });
  const validationErrors = parseValidationErrors(validatedFields);
  if (!validatedFields.data || validationErrors) {
    console.error("Validation error:", validationErrors);
    return {
      status: 400,
      errors: validationErrors ?? { code: "unknown", message: "no data found" },
      data: undefined,
    };
  }

  // Create a new FormData object with the validated fields
  const formData = new FormData();
  formData.append("text", validatedFields.data.text);
  formData.append("file", validatedFields.data.file);
  if (validatedFields.data.width) {
    formData.append("width", validatedFields.data.width.toString());
  }
  if (validatedFields.data.baseFontSize) {
    formData.append(
      "base_font_size",
      validatedFields.data.baseFontSize.toString()
    );
  }
  if (validatedFields.data.isBlackAndWhite != null) {
    formData.append(
      "is_black_and_white",
      validatedFields.data.isBlackAndWhite.toString()
    );
  }
  if (validatedFields.data.contrastFactor) {
    formData.append(
      "contrast_factor",
      validatedFields.data.contrastFactor.toString()
    );
  }

  try {
    // Make the POST request to the endpoint using fetch
    const response = await fetch(env.TEXT_MOSAIC_API_URL, {
      method: "POST",
      body: formData,
    });
    // Handle the response
    if (response.ok) {
      // response is an "image/png"
      const data = await response.blob();
      return { data, status: 200 };
    } else {
      console.error(
        "Error generating mosaic:",
        JSON.stringify(response, null, 2)
      );
      const errorMessage = await getErrorMessage(response);
      throw new Error(errorMessage);
    }
  } catch (error) {
    const errorMessage = await getErrorMessage(
      error,
      "Error generating mosaic"
    );
    return {
      data: undefined,
      status: 500,
      errors: { message: errorMessage },
    };
  }
};

export const POST = async (req: Request) => {
  const formData = await req.formData();
  const result = await fetchTextMosaic(formData);
  if ("errors" in result && result.errors) {
    return NextResponse.json(result.errors, {
      status: result.status,
    });
  }
  if (!result.data) {
    // should never happen
    return NextResponse.json(
      { mosaic: "Error generating mosaic" },
      { status: 500 }
    );
  }
  return new NextResponse(result.data, {
    status: result.status,
    headers: {
      "Content-Type": "image/png",
    },
  });
};
