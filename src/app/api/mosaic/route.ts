import { getErrorMessage } from "@/utils/getters";
import { NextResponse } from "next/server";
import { z } from "zod";

type ValidationErrors = {
  text?: string[];
  width?: string[];
  baseFontSize?: string[];
  isBlackAndWhite?: string[];
  contrastFactor?: string[];
  file?: string[];
};

type MosaicError = {
  mosaic: string;
};

type SuccessResponse = {
  data: Blob;
  status: number;
};

type ValidationErrorResponse = {
  data: undefined;
  status: 400;
  errors: ValidationErrors;
};

type MosaicErrorResponse = {
  data: undefined;
  status: number;
  errors: MosaicError;
};

export type FetchTextMosaicResponse =
  | SuccessResponse
  | ValidationErrorResponse
  | MosaicErrorResponse;

const TEXT_MOSAIC_API_URL = process.env.TEXT_MOSAIC_API_URL;

if (!TEXT_MOSAIC_API_URL) {
  throw new Error("Missing environment variable: TEXT_MOSAIC_API_URL");
}
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const schema = z.object({
  text: z
    .string({
      invalid_type_error: "Text must be a string",
      description: "The text to use for the mosaic",
      required_error: "Text is required",
    })
    .trim()
    .min(1),
  width: z
    .number({
      invalid_type_error: "Width must be a number",
      description: "The width of the mosaic",
    })
    .min(1)
    .max(7200)
    .safe()
    .nullable()
    .optional(),
  baseFontSize: z
    .number({
      invalid_type_error: "Base font size must be a number",
      description: "The base font size of the mosaic",
    })
    .safe()
    .positive()
    .max(100)
    .nullable()
    .optional(),
  isBlackAndWhite: z
    .boolean({
      invalid_type_error: "Is black and white must be a boolean",
      description: "Whether the mosaic should be black and white",
    })
    .nullable()
    .optional(),
  contrastFactor: z
    .number({
      invalid_type_error: "Contrast factor must be a number",
      description:
        "A floating point value controlling the enhancement. Factor 1.0 always returns a copy of the original image, lower factors mean less color (brightness, contrast, etc), and higher values more",
    })
    .safe()
    .positive()
    .nullable()
    .optional(),
  file: z
    .instanceof(File, {
      message: "File is required",
    })
    .refine(
      (file) => {
        return file.type.startsWith("image/");
      },
      {
        message: "File must be an image",
      }
    )
    .refine(
      (file) => {
        return file.size <= MAX_FILE_SIZE;
      },
      {
        message: "Image size must be less than 10MB",
      }
    ),
});
export const fetchTextMosaic = async (
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
  if (!validatedFields.success) {
    console.error(
      "Validation error:",
      validatedFields.error.flatten().fieldErrors
    );
    return {
      data: undefined,
      status: 400,
      errors: validatedFields.error.flatten().fieldErrors,
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
  if (validatedFields.data.isBlackAndWhite) {
    formData.append("is_black_and_white", "true");
  }
  if (validatedFields.data.contrastFactor) {
    formData.append(
      "contrast_factor",
      validatedFields.data.contrastFactor.toString()
    );
  }

  try {
    // Make the POST request to the endpoint using fetch
    const response = await fetch(TEXT_MOSAIC_API_URL, {
      method: "POST",
      body: formData,
    });
    // Handle the response
    if (response.ok) {
      // response is an "image/png"
      const data = await response.blob();
      return { data, status: response.status };
    } else {
      console.error(
        "Error generating mosaic:",
        JSON.stringify(response, null, 2)
      );
      const errorMessage = await getErrorMessage(response);
      return {
        data: undefined,
        status: response.status,
        errors: { mosaic: errorMessage },
      };
    }
  } catch (error) {
    const errorMessage = await getErrorMessage(
      error,
      "Error generating mosaic"
    );
    return {
      data: undefined,
      status: 500,
      errors: { mosaic: errorMessage },
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
