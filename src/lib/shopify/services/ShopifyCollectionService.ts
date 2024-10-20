import {
  PRODUCT_METADATA_NAMESPACE,
  PRODUCT_METADATA_ORIGIN_PRODUCT_KEY,
} from "../constants";
import { collectionCreate } from "../mutations/collectionMutations";
import { productUpdate } from "../mutations/productMutations";
import { fetchCollection } from "../queries/collectionQuery";
import { ProductNode } from "../types/product";
import { ShopifyServiceConfig } from "../types/services";
import { mapCustomProduct } from "../utils/mappers";

export class ShopifyCollectionService {
  parseClientResponse: ShopifyServiceConfig["parseClientResponse"];
  getNavigationLink: ShopifyServiceConfig["getNavigationLink"];

  constructor(config: ShopifyServiceConfig) {
    this.parseClientResponse = config.parseClientResponse;
    this.getNavigationLink = config.getNavigationLink;
  }

  getCollection = async (handle: string) => {
    const collectionResponse = await fetchCollection(handle, 1);
    return this.parseClientResponse(
      collectionResponse,
      "Error fetching collection"
    ).collectionByHandle;
  };

  createCollection = async (userId: string, productIds: string[]) => {
    const createCollectionResponse = await collectionCreate({
      title: userId,
      products: productIds,
    });
    const createdCollection = this.parseClientResponse(
      createCollectionResponse,
      "Error creating collection"
    );
    if (!createdCollection.collectionCreate.collection) {
      throw new Error("Failed to create collection");
    }
    return createdCollection.collectionCreate.collection;
  };

  getOrCreateCollection = async (userId: string, productIds: string[]) => {
    const collection = await this.getCollection(userId);
    if (!collection) {
      return await this.createCollection(userId, productIds);
    }
    return collection;
  };

  addProductToCollection = async (
    userId: string,
    productNode: ProductNode,
    referenceProductId: string
  ) => {
    const collection = await this.getOrCreateCollection(userId, [
      productNode.id,
    ]);
    const product = mapCustomProduct(productNode, this.getNavigationLink);
    const productUpdateResponse = await productUpdate({
      id: product.id,
      collectionsToJoin: [collection.id],
      metafields: [
        {
          type: "product_reference",
          id: product.metafields?.[PRODUCT_METADATA_ORIGIN_PRODUCT_KEY]?.id,
          namespace: PRODUCT_METADATA_NAMESPACE,
          key: PRODUCT_METADATA_ORIGIN_PRODUCT_KEY,
          value: referenceProductId,
        },
      ],
    });
    const updatedProduct = this.parseClientResponse(
      productUpdateResponse,
      "Error updating product"
    );
    if (!updatedProduct.productUpdate.product) {
      throw new Error("Failed to update product");
    }
    return collection;
  };
}
