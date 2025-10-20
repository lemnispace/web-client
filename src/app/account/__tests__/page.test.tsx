import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import AccountPage from "../page";
import { useAuth } from "@/app/hooks/useAuth";
import userEvent from "@testing-library/user-event";

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock useAuth hook
jest.mock("@/app/hooks/useAuth", () => ({
  useAuth: jest.fn(),
}));

describe("AccountPage", () => {
  const mockPush = jest.fn();
  const mockLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it("shows loading state when isLoading is true", () => {
    (useAuth as jest.Mock).mockReturnValue({
      customer: null,
      isAuthenticated: false,
      isLoading: true,
      logout: mockLogout,
    });

    render(<AccountPage />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("redirects to /login when not authenticated", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      customer: null,
      isAuthenticated: false,
      isLoading: false,
      logout: mockLogout,
    });

    render(<AccountPage />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });

  it("displays customer profile information when authenticated", () => {
    const mockCustomer = {
      id: "customer-1",
      email: "test@example.com",
      firstName: "John",
      lastName: "Doe",
      phone: "+1234567890",
    };

    (useAuth as jest.Mock).mockReturnValue({
      customer: mockCustomer,
      isAuthenticated: true,
      isLoading: false,
      logout: mockLogout,
    });

    render(<AccountPage />);

    expect(screen.getByText("Account Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Profile Information")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
    expect(screen.getByText("+1234567890")).toBeInTheDocument();
  });

  it("does not display phone field when customer has no phone", () => {
    const mockCustomer = {
      id: "customer-1",
      email: "test@example.com",
      firstName: "John",
      lastName: "Doe",
    };

    (useAuth as jest.Mock).mockReturnValue({
      customer: mockCustomer,
      isAuthenticated: true,
      isLoading: false,
      logout: mockLogout,
    });

    render(<AccountPage />);

    expect(screen.queryByText("Phone")).not.toBeInTheDocument();
  });

  it("displays order history placeholder section", () => {
    const mockCustomer = {
      id: "customer-1",
      email: "test@example.com",
      firstName: "John",
      lastName: "Doe",
    };

    (useAuth as jest.Mock).mockReturnValue({
      customer: mockCustomer,
      isAuthenticated: true,
      isLoading: false,
      logout: mockLogout,
    });

    render(<AccountPage />);

    expect(screen.getByText("Order History")).toBeInTheDocument();
    expect(
      screen.getByText("Your recent orders will appear here.")
    ).toBeInTheDocument();
  });

  it("calls logout function when Sign Out button is clicked", async () => {
    const user = userEvent.setup();
    const mockCustomer = {
      id: "customer-1",
      email: "test@example.com",
      firstName: "John",
      lastName: "Doe",
    };

    (useAuth as jest.Mock).mockReturnValue({
      customer: mockCustomer,
      isAuthenticated: true,
      isLoading: false,
      logout: mockLogout,
    });

    render(<AccountPage />);

    const signOutButton = screen.getByRole("button", { name: /sign out/i });
    expect(signOutButton).toBeInTheDocument();

    await user.click(signOutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it("renders with responsive design classes", () => {
    const mockCustomer = {
      id: "customer-1",
      email: "test@example.com",
      firstName: "John",
      lastName: "Doe",
    };

    (useAuth as jest.Mock).mockReturnValue({
      customer: mockCustomer,
      isAuthenticated: true,
      isLoading: false,
      logout: mockLogout,
    });

    const { container } = render(<AccountPage />);

    // Check for responsive container classes
    expect(container.querySelector(".max-w-7xl")).toBeInTheDocument();
    expect(container.querySelector(".sm\\:px-6")).toBeInTheDocument();
    expect(container.querySelector(".lg\\:px-8")).toBeInTheDocument();
  });

  it("renders nothing when not loading and customer is null", () => {
    (useAuth as jest.Mock).mockReturnValue({
      customer: null,
      isAuthenticated: true,
      isLoading: false,
      logout: mockLogout,
    });

    const { container } = render(<AccountPage />);

    expect(container.firstChild).toBeNull();
  });
});
