import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '../LoginForm';
import { useAuth } from '@/app/hooks/useAuth';
import { useRouter } from 'next/navigation';

// Mock the hooks
jest.mock('@/app/hooks/useAuth');
jest.mock('next/navigation');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('LoginForm', () => {
  const mockLogin = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    } as any);
  });

  it('should render email and password fields', () => {
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: null,
      customer: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      register: jest.fn(),
      logout: jest.fn(),
    });

    render(<LoginForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('should render submit button', () => {
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: null,
      customer: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      register: jest.fn(),
      logout: jest.fn(),
    });

    render(<LoginForm />);

    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should update email field when user types', () => {
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: null,
      customer: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      register: jest.fn(),
      logout: jest.fn(),
    });

    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    expect(emailInput.value).toBe('test@example.com');
  });

  it('should update password field when user types', () => {
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: null,
      customer: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      register: jest.fn(),
      logout: jest.fn(),
    });

    render(<LoginForm />);

    const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(passwordInput.value).toBe('password123');
  });

  it('should call login on form submit with correct credentials', async () => {
    mockLogin.mockResolvedValue({
      customer: {
        id: 'cust_123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      },
      accessToken: 'token123',
      refreshToken: 'refresh123',
    });

    mockUseAuth.mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: null,
      customer: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      register: jest.fn(),
      logout: jest.fn(),
    });

    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('should redirect to /account on successful login', async () => {
    mockLogin.mockResolvedValue({
      customer: {
        id: 'cust_123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      },
      accessToken: 'token123',
      refreshToken: 'refresh123',
    });

    mockUseAuth.mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: null,
      customer: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      register: jest.fn(),
      logout: jest.fn(),
    });

    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/account');
    });
  });

  it('should display error message when login fails', () => {
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: 'Invalid credentials',
      customer: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      register: jest.fn(),
      logout: jest.fn(),
    });

    render(<LoginForm />);

    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });

  it('should disable inputs and button during loading', () => {
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      isLoading: true,
      error: null,
      customer: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      register: jest.fn(),
      logout: jest.fn(),
    });

    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button');

    expect(emailInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });

  it('should show "Signing in..." text when loading', () => {
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      isLoading: true,
      error: null,
      customer: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      register: jest.fn(),
      logout: jest.fn(),
    });

    render(<LoginForm />);

    expect(screen.getByText('Signing in...')).toBeInTheDocument();
  });

  it('should not redirect if login throws an error', async () => {
    mockLogin.mockRejectedValue(new Error('Network error'));

    mockUseAuth.mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: null,
      customer: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      register: jest.fn(),
      logout: jest.fn(),
    });

    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });

    // Should not redirect on error
    expect(mockPush).not.toHaveBeenCalled();
  });
});
