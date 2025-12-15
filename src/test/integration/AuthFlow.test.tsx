// src/test/integration/AuthFlow.test.tsx
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../../contexts/AuthContext';
import App from '../../App';

// Test wrapper component that provides all necessary providers
function TestWrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          {children}
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

// Helper function to render App with all providers
function renderApp() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  );
}

describe('Authentication Flow Integration Tests', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    // Clean up localStorage after each test
    localStorage.clear();
  });

  describe('Complete login-to-dashboard flow for both roles', () => {
    it('should complete mother login flow and redirect to mother dashboard', async () => {
      const user = userEvent.setup();
      renderApp();

      // Should start at login page since no user is authenticated
      await waitFor(() => {
        expect(screen.getByText(/welcome to maacare/i)).toBeInTheDocument();
      });

      // Select mother role (should be selected by default)
      const motherRadio = screen.getByLabelText(/expecting mother/i);
      expect(motherRadio).toBeChecked();

      // Enter name
      const nameInput = screen.getByLabelText(/your name or id/i);
      await user.type(nameInput, 'Jane Doe');

      // Submit login
      const loginButton = screen.getByRole('button', { name: /continue/i });
      await user.click(loginButton);

      // Should redirect to mother dashboard
      await waitFor(() => {
        expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
      });

      // Verify localStorage contains user data
      const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
      expect(savedUser.name).toBe('Jane Doe');
      expect(savedUser.role).toBe('mother');
    });

    it('should complete CHW login flow and redirect to health worker dashboard', async () => {
      const user = userEvent.setup();
      renderApp();

      // Should start at login page since no user is authenticated
      await waitFor(() => {
        expect(screen.getByText(/welcome to maacare/i)).toBeInTheDocument();
      });

      // Select CHW role
      const chwRadio = screen.getByLabelText(/community health worker/i);
      await user.click(chwRadio);

      // Enter name
      const nameInput = screen.getByLabelText(/your name or id/i);
      await user.type(nameInput, 'Dr. Smith');

      // Submit login
      const loginButton = screen.getByRole('button', { name: /continue/i });
      await user.click(loginButton);

      // Should redirect to health worker dashboard
      await waitFor(() => {
        expect(screen.getByText(/community health worker portal/i)).toBeInTheDocument();
      });

      // Verify localStorage contains user data
      const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
      expect(savedUser.name).toBe('Dr. Smith');
      expect(savedUser.role).toBe('chw');
    });
  });

  describe('Session persistence across page refreshes', () => {
    it('should restore mother session after page refresh', async () => {
      // Pre-populate localStorage with mother user data
      const motherUser = { name: 'Jane Doe', role: 'mother' };
      localStorage.setItem('user', JSON.stringify(motherUser));

      renderApp();

      // Should automatically redirect to mother dashboard
      await waitFor(() => {
        expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
      });

      // User data should still be in localStorage
      const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
      expect(savedUser.name).toBe('Jane Doe');
      expect(savedUser.role).toBe('mother');
    });

    it('should restore CHW session after page refresh', async () => {
      // Pre-populate localStorage with CHW user data
      const chwUser = { name: 'Dr. Smith', role: 'chw' };
      localStorage.setItem('user', JSON.stringify(chwUser));

      renderApp();

      // Should automatically redirect to health worker dashboard
      await waitFor(() => {
        expect(screen.getByText(/community health worker portal/i)).toBeInTheDocument();
      });

      // User data should still be in localStorage
      const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
      expect(savedUser.name).toBe('Dr. Smith');
      expect(savedUser.role).toBe('chw');
    });

    it('should redirect to login when no session exists', async () => {
      // Ensure localStorage is empty
      localStorage.clear();

      renderApp();

      // Should redirect to login page
      await waitFor(() => {
        expect(screen.getByText(/welcome to maacare/i)).toBeInTheDocument();
      });
    });

    it('should clear corrupted session data and redirect to login', async () => {
      // Set corrupted data in localStorage
      localStorage.setItem('user', 'invalid-json');

      renderApp();

      // Should redirect to login page and clear corrupted data
      await waitFor(() => {
        expect(screen.getByText(/welcome to maacare/i)).toBeInTheDocument();
      });

      // Corrupted data should be cleared
      expect(localStorage.getItem('user')).toBeNull();
    });
  });

  describe('Logout and re-authentication flow', () => {
    it('should logout from mother dashboard and allow re-authentication', async () => {
      const user = userEvent.setup();
      
      // Pre-populate localStorage with mother user data
      const motherUser = { name: 'Jane Doe', role: 'mother' };
      localStorage.setItem('user', JSON.stringify(motherUser));

      renderApp();

      // Should start at mother dashboard
      await waitFor(() => {
        expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
      });

      // Click logout button
      const logoutButton = screen.getByRole('button', { name: /logout/i });
      await user.click(logoutButton);

      // Should redirect to login page
      await waitFor(() => {
        expect(screen.getByText(/welcome to maacare/i)).toBeInTheDocument();
      });

      // localStorage should be cleared
      expect(localStorage.getItem('user')).toBeNull();

      // Should be able to login again as CHW
      const chwRadio = screen.getByLabelText(/community health worker/i);
      await user.click(chwRadio);

      const nameInput = screen.getByLabelText(/your name or id/i);
      await user.type(nameInput, 'Dr. New');

      const loginButton = screen.getByRole('button', { name: /continue/i });
      await user.click(loginButton);

      // Should redirect to health worker dashboard
      await waitFor(() => {
        expect(screen.getByText(/community health worker portal/i)).toBeInTheDocument();
      });

      // Verify new user data in localStorage
      const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
      expect(savedUser.name).toBe('Dr. New');
      expect(savedUser.role).toBe('chw');
    });

    it('should logout from CHW dashboard and allow re-authentication', async () => {
      const user = userEvent.setup();
      
      // Pre-populate localStorage with CHW user data
      const chwUser = { name: 'Dr. Smith', role: 'chw' };
      localStorage.setItem('user', JSON.stringify(chwUser));

      renderApp();

      // Should start at health worker dashboard
      await waitFor(() => {
        expect(screen.getByText(/community health worker portal/i)).toBeInTheDocument();
      });

      // Click logout button
      const logoutButton = screen.getByRole('button', { name: /logout/i });
      await user.click(logoutButton);

      // Should redirect to login page
      await waitFor(() => {
        expect(screen.getByText(/welcome to maacare/i)).toBeInTheDocument();
      });

      // localStorage should be cleared
      expect(localStorage.getItem('user')).toBeNull();

      // Should be able to login again as mother
      const motherRadio = screen.getByLabelText(/expecting mother/i);
      await user.click(motherRadio);

      const nameInput = screen.getByLabelText(/your name or id/i);
      await user.type(nameInput, 'Jane New');

      const loginButton = screen.getByRole('button', { name: /continue/i });
      await user.click(loginButton);

      // Should redirect to mother dashboard
      await waitFor(() => {
        expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
      });

      // Verify new user data in localStorage
      const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
      expect(savedUser.name).toBe('Jane New');
      expect(savedUser.role).toBe('mother');
    });
  });
});