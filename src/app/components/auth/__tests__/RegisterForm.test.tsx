import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterForm from '../RegisterForm';
import { useAuth } from '@/app/hooks/useAuth';
import { useRouter } from 'next/navigation';

// Mock the hooks
jest.mock('@/app/hooks/useAuth');
jest.mock('next/navigation');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('RegisterForm', () => {
  const mockRegister = jest.fn();
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

  it('should render all required input fields', () => {
    mockUseAuth.mockReturnValue({
      register: mockRegister,
      isLoading: false,
      error: null,
      customer: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      login: jest.fn(),
      logout: jest.fn(),
    });

    render(<RegisterForm />);

    expect(screen.getByLabelText('Email *')).toBeInTheDocument();
    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone')).toBeInTheDocument();
    expect(screen.getByLabelText('Password *')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password *')).toBeInTheDocument();
  });

  it('should render marketing checkbox', () => {
    mockUseAuth.mockReturnValue({
      register: mockRegister,
      isLoading: false,
      error: null,
      customer: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      login: jest.fn(),
      logout: jest.fn(),
    });

    render(<RegisterForm />);

    expect(screen.getByLabelText(/i want to receive marketing emails/i)).toBeInTheDocument();
  });

  it('should render submit button', () => {
    mockUseAuth.mockReturnValue({
      register: mockRegister,
      isLoading: false,
      error: null,
      customer: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      login: jest.fn(),
      logout: jest.fn(),
    });

    render(<RegisterForm />);

    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('should update form fields when user types', () => {
    mockUseAuth.mockReturnValue({
      register: mockRegister,
      isLoading: false,
      error: null,
      customer: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      login: jest.fn(),
      logout: jest.fn(),
    });

    render(<RegisterForm />);

    const emailInput = screen.getByLabelText('Email *') as HTMLInputElement;
    const firstNameInput = screen.getByLabelText('First Name') as HTMLInputElement;
    const lastNameInput = screen.getByLabelText('Last Name') as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(firstNameInput.value).toBe('John');
    expect(lastNameInput.value).toBe('Doe');
  });

  it('should show validation error when password is less than 8 characters', async () => {
    mockUseAuth.mockReturnValue({
      register: mockRegister,
      isLoading: false,
      error: null,
      customer: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      login: jest.fn(),
      logout: jest.fn(),
    });

    render(<RegisterForm />);

    const emailInput = screen.getByLabelText('Email *');
    const passwordInput = screen.getByLabelText('Password *');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password *');
    const submitButton = screen.getByRole('button', { name: /create account/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'short' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'short' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
    });

    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('should show validation error when passwords do not match', async () => {
    mockUseAuth.mockReturnValue({
      register: mockRegister,
      isLoading: false,
      error: null,
      customer: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      login: jest.fn(),
      logout: jest.fn(),
    });

    render(<RegisterForm />);

    const emailInput = screen.getByLabelText('Email *');
    const passwordInput = screen.getByLabelText('Password *');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password *');
    const submitButton = screen.getByRole('button', { name: /create account/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password456' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });

    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('should call register on form submit with valid data', async () => {
    mockRegister.mockResolvedValue({
      customer: {
        id: 'cust_123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '1234567890',
      },
      accessToken: 'token123',
      refreshToken: 'refresh123',
    });

    mockUseAuth.mockReturnValue({
      register: mockRegister,
      isLoading: false,
      error: null,
      customer: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      login: jest.fn(),
      logout: jest.fn(),
    });

    render(<RegisterForm />);

    const emailInput = screen.getByLabelText('Email *');
    const firstNameInput = screen.getByLabelText('First Name');
    const lastNameInput = screen.getByLabelText('Last Name');
    const phoneInput = screen.getByLabelText('Phone');
    const passwordInput = screen.getByLabelText('Password *');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password *');
    const submitButton = screen.getByRole('button', { name: /create account/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '1234567890',
        password: 'password123',
        acceptsMarketing: false,
      });
    });
  });

  it('should include marketing checkbox value in registration data', async () => {
    mockRegister.mockResolvedValue({
      customer: {
        id: 'cust_123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      },
      accessToken: 'token123',
      refreshToken: 'refresh123',
    });

    mockUseAuth.mockReturnValue({
      register: mockRegister,
      isLoading: false,
      error: null,
      customer: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      login: jest.fn(),
      logout: jest.fn(),
    });

    render(<RegisterForm />);

    const emailInput = screen.getByLabelText('Email *');
    const passwordInput = screen.getByLabelText('Password *');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password *');
    const marketingCheckbox = screen.getByLabelText('I want to receive marketing emails');
    const submitButton = screen.getByRole('button', { name: /create account/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(marketingCheckbox);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith(
        expect.objectContaining({
          acceptsMarketing: true,
        })
      );
    });
  });

  it('should redirect to /account on successful registration', async () => {
    mockRegister.mockResolvedValue({
      customer: {
        id: 'cust_123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      },
      accessToken: 'token123',
      refreshToken: 'refresh123',
    });

    mockUseAuth.mockReturnValue({
      register: mockRegister,
      isLoading: false,
      error: null,
      customer: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      login: jest.fn(),
      logout: jest.fn(),
    });

    render(<RegisterForm />);

    const emailInput = screen.getByLabelText('Email *');
    const passwordInput = screen.getByLabelText('Password *');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password *');
    const submitButton = screen.getByRole('button', { name: /create account/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/account');
    });
  });

  it('should display error message from useAuth', () => {
    mockUseAuth.mockReturnValue({
      register: mockRegister,
      isLoading: false,
      error: 'Email already exists',
      customer: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      login: jest.fn(),
      logout: jest.fn(),
    });

    render(<RegisterForm />);

    expect(screen.getByText('Email already exists')).toBeInTheDocument();
  });

  it('should disable all inputs and button during loading', () => {
    mockUseAuth.mockReturnValue({
      register: mockRegister,
      isLoading: true,
      error: null,
      customer: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      login: jest.fn(),
      logout: jest.fn(),
    });

    render(<RegisterForm />);

    const emailInput = screen.getByLabelText('Email *');
    const firstNameInput = screen.getByLabelText('First Name');
    const passwordInput = screen.getByLabelText('Password *');
    const submitButton = screen.getByRole('button');

    expect(emailInput).toBeDisabled();
    expect(firstNameInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });

  it('should show "Creating account..." text when loading', () => {
    mockUseAuth.mockReturnValue({
      register: mockRegister,
      isLoading: true,
      error: null,
      customer: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      login: jest.fn(),
      logout: jest.fn(),
    });

    render(<RegisterForm />);

    expect(screen.getByText('Creating account...')).toBeInTheDocument();
  });

  it('should not redirect if registration throws an error', async () => {
    mockRegister.mockRejectedValue(new Error('Network error'));

    mockUseAuth.mockReturnValue({
      register: mockRegister,
      isLoading: false,
      error: null,
      customer: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      login: jest.fn(),
      logout: jest.fn(),
    });

    render(<RegisterForm />);

    const emailInput = screen.getByLabelText('Email *');
    const passwordInput = screen.getByLabelText('Password *');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password *');
    const submitButton = screen.getByRole('button', { name: /create account/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalled();
    });

    // Should not redirect on error
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should clear validation error when submitting with valid password', async () => {
    mockRegister.mockResolvedValue({
      customer: {
        id: 'cust_123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      },
      accessToken: 'token123',
      refreshToken: 'refresh123',
    });

    mockUseAuth.mockReturnValue({
      register: mockRegister,
      isLoading: false,
      error: null,
      customer: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      login: jest.fn(),
      logout: jest.fn(),
    });

    render(<RegisterForm />);

    const emailInput = screen.getByLabelText('Email *');
    const passwordInput = screen.getByLabelText('Password *');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password *');
    const submitButton = screen.getByRole('button', { name: /create account/i });

    // First, trigger validation error
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'short' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'short' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
    });

    // Then fix the password and submit again
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText('Password must be at least 8 characters')).not.toBeInTheDocument();
    });
  });
});
