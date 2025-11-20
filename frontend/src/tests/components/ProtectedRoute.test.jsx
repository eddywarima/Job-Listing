import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProtectedRoute from '../../components/ProtectedRoute';
import { AuthProvider } from '../../context/AuthContext';

// Mock useAuth hook
const mockUseAuth = vi.fn();
vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock Loader component
vi.mock('../../components/Loader', () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));

const TestComponent = () => <div>Protected Content</div>;

describe('ProtectedRoute Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loader when loading', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true,
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('should redirect to login when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
    });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </MemoryRouter>
    );

    // Should redirect to login
    expect(window.location.pathname).toBe('/login');
  });

  it('should render children when user is authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: { _id: '123', email: 'test@example.com' },
      loading: false,
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should redirect when user does not have required role', () => {
    mockUseAuth.mockReturnValue({
      user: { _id: '123', email: 'test@example.com', role: 'job_seeker' },
      loading: false,
    });

    render(
      <MemoryRouter>
        <ProtectedRoute requireRole="employer">
          <TestComponent />
        </ProtectedRoute>
      </MemoryRouter>
    );

    // Should redirect to unauthorized
    expect(window.location.pathname).toBe('/unauthorized');
  });

  it('should allow access when user has required role', () => {
    mockUseAuth.mockReturnValue({
      user: { _id: '123', email: 'test@example.com', role: 'employer' },
      loading: false,
    });

    render(
      <MemoryRouter>
        <ProtectedRoute requireRole="employer">
          <TestComponent />
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});



