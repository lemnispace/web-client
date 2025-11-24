import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useCart } from "@/app/hooks/useCart";
import { useRouter } from "next/navigation";
import CheckoutPage from "../page";

jest.mock("@/app/hooks/useCart");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

const mockUseCart = useCart as jest.MockedFunction<typeof useCart>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe("CheckoutPage", () => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  };

  beforeEach(() => {
    mockUseRouter.mockReturnValue(mockRouter as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render loading state", () => {
    mockUseCart.mockReturnValue({
      cart: null,
      isLoading: true,
      error: null,
      addItem: jest.fn(),
      removeItem: jest.fn(),
      updateItem: jest.fn(),
      clearCart: jest.fn(),
    });

    render(<CheckoutPage />);
    expect(screen.getByText("Loading checkout...")).toBeInTheDocument();
  });

  it("should render empty cart message", () => {
    mockUseCart.mockReturnValue({
      cart: {
        id: "cart-1",
        items: [],
        subtotal: 0,
        estimatedTax: 0,
        estimatedShipping: 0,
        totalPrice: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      isLoading: false,
      error: null,
      addItem: jest.fn(),
      removeItem: jest.fn(),
      updateItem: jest.fn(),
      clearCart: jest.fn(),
    });

    render(<CheckoutPage />);
    expect(screen.getByText("Your cart is empty.")).toBeInTheDocument();
  });

  it("should render cart items with product images correctly", () => {
    const mockCart = {
      id: "cart-1",
      items: [
        {
          id: "item-1",
          productId: "prod-1",
          variantId: "var-1",
          quantity: 2,
          price: 2999,
          product: {
            title: "White Glossy Mug",
            image: "/products/mug.png",
          },
          variant: {
            title: "11 oz",
          },
        },
        {
          id: "item-2",
          productId: "prod-2",
          variantId: "var-2",
          quantity: 1,
          price: 1999,
          product: {
            title: "Black T-Shirt",
            image: "/products/tshirt.png",
          },
        },
      ],
      subtotal: 7997,
      estimatedTax: 0,
      estimatedShipping: 0,
      totalPrice: 7997,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockUseCart.mockReturnValue({
      cart: mockCart,
      isLoading: false,
      error: null,
      addItem: jest.fn(),
      removeItem: jest.fn(),
      updateItem: jest.fn(),
      clearCart: jest.fn(),
    });

    render(<CheckoutPage />);

    // Verify cart items render without errors
    expect(screen.getByText("White Glossy Mug")).toBeInTheDocument();
    expect(screen.getByText("Black T-Shirt")).toBeInTheDocument();
    expect(screen.getByText("Quantity: 2")).toBeInTheDocument();
    expect(screen.getByText("Quantity: 1")).toBeInTheDocument();
  });

  it("should handle cart items without product images", () => {
    const mockCart = {
      id: "cart-1",
      items: [
        {
          id: "item-1",
          productId: "prod-1",
          variantId: "var-1",
          quantity: 1,
          price: 2999,
          product: {
            title: "Product Without Image",
            // No image field
          },
        },
      ],
      subtotal: 2999,
      estimatedTax: 0,
      estimatedShipping: 0,
      totalPrice: 2999,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockUseCart.mockReturnValue({
      cart: mockCart,
      isLoading: false,
      error: null,
      addItem: jest.fn(),
      removeItem: jest.fn(),
      updateItem: jest.fn(),
      clearCart: jest.fn(),
    });

    // This should not throw an error
    expect(() => render(<CheckoutPage />)).not.toThrow();
    expect(screen.getByText("Product Without Image")).toBeInTheDocument();
  });

  it("should handle cart items without product data", () => {
    const mockCart = {
      id: "cart-1",
      items: [
        {
          id: "item-1",
          productId: "prod-1",
          variantId: "var-1",
          quantity: 1,
          price: 2999,
          // No product field at all
        },
      ],
      subtotal: 2999,
      estimatedTax: 0,
      estimatedShipping: 0,
      totalPrice: 2999,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockUseCart.mockReturnValue({
      cart: mockCart,
      isLoading: false,
      error: null,
      addItem: jest.fn(),
      removeItem: jest.fn(),
      updateItem: jest.fn(),
      clearCart: jest.fn(),
    });

    // This should not throw an error
    expect(() => render(<CheckoutPage />)).not.toThrow();
  });
});
