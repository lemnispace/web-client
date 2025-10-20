/**
 * Test for updateOrderStatus method
 */

import { ShopAPIProvider } from "../shop-api";
import type { Order, OrderStatusUpdate } from "../../types";

describe("ShopAPIProvider - updateOrderStatus", () => {
  let provider: ShopAPIProvider;
  const mockBaseUrl = "http://localhost:8080";
  const mockApiKey = "test-api-key";

  beforeEach(() => {
    provider = new ShopAPIProvider({
      baseUrl: mockBaseUrl,
      apiKey: mockApiKey,
    });
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should update order status successfully", async () => {
    const orderId = "order_123";
    const adminToken = "admin_token_xyz";
    const statusUpdate: OrderStatusUpdate = {
      status: "shipped",
      notes: "Package shipped via FedEx",
    };

    const mockUpdatedOrder: Order = {
      id: orderId,
      customerId: "customer_456",
      items: [],
      subtotal: 100,
      tax: 10,
      shipping: 5,
      totalPrice: 115,
      status: "shipped",
      shippingAddress: {
        firstName: "John",
        lastName: "Doe",
        address1: "123 Main St",
        city: "New York",
        country: "US",
        zip: "10001",
      },
      billingAddress: {
        firstName: "John",
        lastName: "Doe",
        address1: "123 Main St",
        city: "New York",
        country: "US",
        zip: "10001",
      },
      shippingMethod: "standard",
      paymentMethod: "credit_card",
      createdAt: "2025-01-01T00:00:00Z",
      updatedAt: "2025-01-02T00:00:00Z",
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUpdatedOrder,
    });

    const result = await provider.updateOrderStatus(
      orderId,
      statusUpdate,
      adminToken
    );

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockBaseUrl}/v1/orders/${orderId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": mockApiKey,
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(statusUpdate),
      }
    );

    expect(result).toEqual(mockUpdatedOrder);
    expect(result.status).toBe("shipped");
  });

  it("should throw error when update fails", async () => {
    const orderId = "order_123";
    const adminToken = "admin_token_xyz";
    const statusUpdate: OrderStatusUpdate = {
      status: "cancelled",
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 403,
      statusText: "Forbidden",
      json: async () => ({ message: "Unauthorized to update order status" }),
    });

    await expect(
      provider.updateOrderStatus(orderId, statusUpdate, adminToken)
    ).rejects.toThrow("Unauthorized to update order status");
  });

  it("should include Authorization header with admin token", async () => {
    const orderId = "order_789";
    const adminToken = "super_secret_admin_token";
    const statusUpdate: OrderStatusUpdate = {
      status: "processing",
      notes: "Order is being processed",
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: orderId,
        status: "processing",
      }),
    });

    await provider.updateOrderStatus(orderId, statusUpdate, adminToken);

    const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
    const headers = fetchCall[1].headers;

    expect(headers.Authorization).toBe(`Bearer ${adminToken}`);
  });

  it("should handle different order statuses", async () => {
    const orderId = "order_999";
    const adminToken = "admin_token";

    const statuses: Array<OrderStatusUpdate["status"]> = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "refunded",
    ];

    for (const status of statuses) {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: orderId,
          status,
        }),
      });

      const result = await provider.updateOrderStatus(
        orderId,
        { status },
        adminToken
      );

      expect(result.status).toBe(status);
    }

    expect(global.fetch).toHaveBeenCalledTimes(statuses.length);
  });
});
