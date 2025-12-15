import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ReactNode } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Login } from './pages/Login'
import MotherDashboard from './pages/MotherDashboard'
import HealthWorker from './pages/HealthWorker'
import Chat from './pages/Chat'
import NotFound from './pages/NotFound'

// Mock localStorage for testing
const mockLocalStorage = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    })
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
})

// Mock QueryClient to avoid network requests
vi.mock('@tanstack/react-query', () => ({
  QueryClient: class MockQueryClient {},
  QueryClientProvider: ({ children }: { children: ReactNode }) => children,
}))

// Component to handle root route redirects based on authentication state
function RootRedirect() {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Redirect authenticated users to their appropriate dashboard
  const redirectPath = user.role === 'mother' ? '/mother-dashboard' : '/health-worker';
  return <Navigate to={redirectPath} replace />;
}

// Test App component without BrowserRouter
function TestApp() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes for mothers */}
        <Route element={<ProtectedRoute allowedRoles={['mother']} />}>
          <Route path="/mother-dashboard" element={<MotherDashboard />} />
        </Route>
        
        {/* Protected routes for CHWs */}
        <Route element={<ProtectedRoute allowedRoles={['chw']} />}>
          <Route path="/health-worker" element={<HealthWorker />} />
        </Route>
        
        {/* Protected routes for both roles */}
        <Route element={<ProtectedRoute allowedRoles={['mother', 'chw']} />}>
          <Route path="/chat" element={<Chat />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

describe('App Routing Configuration', () => {
  beforeEach(() => {
    mockLocalStorage.clear()
    vi.clearAllMocks()
  })

  describe('Protected Route Access with Different Authentication States', () => {
    it('should redirect unauthenticated users to login page', async () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <TestApp />
        </MemoryRouter>
      )
      
      await waitFor(() => {
        expect(screen.getByText('Welcome to MaaCare')).toBeInTheDocument()
      })
    })

    it('should allow access to mother dashboard for authenticated mother users', async () => {
      mockLocalStorage.getItem.mockImplementation((key: string) => {
        if (key === 'user') {
          return JSON.stringify({ name: 'Test Mother', role: 'mother' })
        }
        return null
      })

      render(
        <MemoryRouter initialEntries={['/mother-dashboard']}>
          <TestApp />
        </MemoryRouter>
      )
      
      await waitFor(() => {
        expect(screen.getByText(/Welcome back/)).toBeInTheDocument()
      })
    })

    it('should allow access to health worker dashboard for authenticated CHW users', async () => {
      mockLocalStorage.getItem.mockImplementation((key: string) => {
        if (key === 'user') {
          return JSON.stringify({ name: 'Test CHW', role: 'chw' })
        }
        return null
      })

      render(
        <MemoryRouter initialEntries={['/health-worker']}>
          <TestApp />
        </MemoryRouter>
      )
      
      await waitFor(() => {
        expect(screen.getByText('Community Health Worker Portal')).toBeInTheDocument()
      })
    })
  })

  describe('Redirects for Unauthorized Access Attempts', () => {
    it('should redirect mother users away from CHW dashboard', async () => {
      mockLocalStorage.getItem.mockImplementation((key: string) => {
        if (key === 'user') {
          return JSON.stringify({ name: 'Test Mother', role: 'mother' })
        }
        return null
      })

      render(
        <MemoryRouter initialEntries={['/health-worker']}>
          <TestApp />
        </MemoryRouter>
      )
      
      await waitFor(() => {
        expect(screen.getByText(/Welcome back/)).toBeInTheDocument()
      })
    })

    it('should redirect CHW users away from mother dashboard', async () => {
      mockLocalStorage.getItem.mockImplementation((key: string) => {
        if (key === 'user') {
          return JSON.stringify({ name: 'Test CHW', role: 'chw' })
        }
        return null
      })

      render(
        <MemoryRouter initialEntries={['/mother-dashboard']}>
          <TestApp />
        </MemoryRouter>
      )
      
      await waitFor(() => {
        expect(screen.getByText('Community Health Worker Portal')).toBeInTheDocument()
      })
    })
  })

  describe('Proper Dashboard Routing for Each Role', () => {
    it('should redirect authenticated mother to mother dashboard from root', async () => {
      mockLocalStorage.getItem.mockImplementation((key: string) => {
        if (key === 'user') {
          return JSON.stringify({ name: 'Test Mother', role: 'mother' })
        }
        return null
      })

      render(
        <MemoryRouter initialEntries={['/']}>
          <TestApp />
        </MemoryRouter>
      )
      
      await waitFor(() => {
        expect(screen.getByText(/Welcome back/)).toBeInTheDocument()
      })
    })

    it('should redirect authenticated CHW to health worker dashboard from root', async () => {
      mockLocalStorage.getItem.mockImplementation((key: string) => {
        if (key === 'user') {
          return JSON.stringify({ name: 'Test CHW', role: 'chw' })
        }
        return null
      })

      render(
        <MemoryRouter initialEntries={['/']}>
          <TestApp />
        </MemoryRouter>
      )
      
      await waitFor(() => {
        expect(screen.getByText('Community Health Worker Portal')).toBeInTheDocument()
      })
    })
  })
})