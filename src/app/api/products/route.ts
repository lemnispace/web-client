import { ShopifyCollectionService } from "@/lib/shopify/services/CollectionService";
import {
  CreateCustomProductParams,
  ShopifyProductService,
} from "@/lib/shopify/services/ProductService";
import { Collection } from "@/lib/shopify/types/collection";
import { getOrCreateVisitorId } from "@/utils/cookies/visitorId";
import { getNavigationLink } from "@/utils/getters";
import {
  parseApiResponse,
  parseClientResponse,
  parseValidationErrors,
} from "@/utils/parsers";
import { ApiResponse, ServerApiResponse } from "@/utils/types";
import { isErrorResponse } from "@/utils/validators";
import {
  requiredImageFileSchema,
  requiredStringSchema,
} from "@/utils/validators/schemaValidators";
import { NextResponse } from "next/server";
import { z } from "zod";

interface ValidationErrors {
  productId?: string[];
  file?: string[];
}

export interface CustomProductResponse {
  productId: string;
  productHandle: string;
  variantId: string;
  collection: Pick<Collection, "id" | "handle">;
}

type CreateCustomProductResponse = ApiResponse<
  ValidationErrors,
  unknown,
  CustomProductResponse
>;

const schema = z.object({
  productId: requiredStringSchema({
    name: "ProductId",
    description: "The ProductId of the product to use for customizations",
  }),
  variantId: requiredStringSchema({
    name: "VariantId",
    description:
      "The VariantId of the variant associated with the product to use for customizations",
  }),
  variantTitle: requiredStringSchema({
    name: "VariantTitle",
    description:
      "The variantTitle of the variant associated with the product to use for customizations",
  }),
  userId: requiredStringSchema({
    name: "UserId",
    description: "The userId of the user creating the custom product",
  }),
  file: requiredImageFileSchema(),
});

const validateFormData = (formData: FormData) => {
  const validatedFields = schema.safeParse({
    file: formData.get("file"),
    productId: formData.get("productId"),
    variantTitle: formData.get("variantTitle"),
    variantId: formData.get("variantId"),
    userId: formData.get("userId"),
  });
  const validationErrors = parseValidationErrors(validatedFields);
  if (!validatedFields.success || validationErrors) {
    console.error("Validation error:", validationErrors);
    return {
      errors: validationErrors ?? { code: "unknown", message: "no data found" },
    };
  }
  return { data: validatedFields.data };
};

const createCustomProduct = async (
  params: CreateCustomProductParams
): Promise<CreateCustomProductResponse> => {
  const productService = new ShopifyProductService({
    parseClientResponse,
    getNavigationLink,
  });
  const collectionService = new ShopifyCollectionService({
    parseClientResponse,
    getNavigationLink,
  });
  try {
    const customProductResponse =
      await productService.createCustomProduct(params);
    if (!customProductResponse.data) {
      throw new Error("No custom product data found");
    }
    const { customProduct, userId, referenceProductId, updatedCustomVariant } =
      customProductResponse.data;
    const collection = await collectionService.addProductToCollection(
      userId,
      customProduct,
      referenceProductId
    );

    return {
      status: 200,
      data: {
        productId: customProduct.id,
        productHandle: customProduct.handle,
        variantId: updatedCustomVariant.id,
        collection: {
          id: collection.id,
          handle: collection.handle,
        },
      },
    };
  } catch (error) {
    console.error("Error creating custom product:", error);
    return {
      data: undefined,
      status: 500,
      errors: error,
    };
  }
};

export const POST = async (
  req: Request
): Promise<ServerApiResponse<CustomProductResponse>> => {
  try {
    const visitorId = getOrCreateVisitorId();
    const formData = await req.formData();
    formData.append("userId", visitorId);
    const validatedFields = validateFormData(formData);
    if (validatedFields.errors) {
      return NextResponse.json(
        { errors: validatedFields.errors, data: undefined },
        { status: 400 }
      );
    }
    const createCustomProductResponse = await createCustomProduct(
      validatedFields.data
    );
    const result = await parseApiResponse(
      createCustomProductResponse,
      "Error creating custom product"
    );
    if (isErrorResponse(result)) {
      throw new Error(result.errors);
    }
    const { status, ...response } = result;
    return NextResponse.json(response, {
      status,
    });
  } catch (error) {
    console.error("Error creating custom product:", error);
    return NextResponse.json(
      { errors: "Error creating custom product", data: undefined },
      { status: 500 }
    );
  }
};
