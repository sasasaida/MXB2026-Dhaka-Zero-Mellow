import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ReactNode } from 'react'
import * as fc from 'fast-check'
import { ProtectedRoute } from './ProtectedRoute'
import { AuthProvider } from '@/contexts/AuthContext'

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

// Mock components for testing routing
const MockMotherDashboard = () => <div data-testid="mother-dashboard">Mother Dashboard</div>
const MockCHWDashboard = () => <div data-testid="chw-dashboard">CHW Dashboard</div>
const MockLogin = () => <div data-testid="login-page">Login Page</div>

// Test wrapper component that provides routing and auth context
const createTestApp = (
  initialRoute: string,
  user: { name: string; role: 'mother' | 'chw' } | null
) => {
  // Set up localStorage with user data if provided
  mockLocalStorage.clear()
  if (user) {
    mockLocalStorage.setItem('user', JSON.stringify(user))
  }

  return (
    <MemoryRouter initialEntries={[initialRoute]}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<MockLogin />} />
          <Route path="/mother-dashboard" element={<ProtectedRoute allowedRoles={['mother']} />}>
            <Route index element={<MockMotherDashboard />} />
          </Route>
          <Route path="/health-worker" element={<ProtectedRoute allowedRoles={['chw']} />}>
            <Route index element={<MockCHWDashboard />} />
          </Route>
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  )
}

describe('ProtectedRoute Property Tests', () => {
  beforeEach(() => {
    mockLocalStorage.clear()
    vi.clearAllMocks()
  })

  /**
   * **Feature: offline-auth, Property 3: Role-based dashboard routing**
   * **Validates: Requirements 1.5, 3.1, 4.1**
   */
  it('Property 3: Role-based dashboard routing - authenticated users should access appropriate dashboards', async () => {
    fc.assert(
      fc.asyncProperty(
        fc.record({
          name: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
          role: fc.oneof(fc.constant('mother'), fc.constant('chw')),
          requestedRoute: fc.oneof(
            fc.constant('/mother-dashboard'),
            fc.constant('/health-worker')
          )
        }),
        async ({ name, role, requestedRoute }) => {
          // Clear mocks before each test
          vi.clearAllMocks()

          const user = { name: name.trim(), role }
          
          // Determine expected behavior based on role and requested route
          const isAuthorizedForRoute = 
            (role === 'mother' && requestedRoute === '/mother-dashboard') ||
            (role === 'chw' && requestedRoute === '/health-worker')

          const testApp = createTestApp(requestedRoute, user)
          render(testApp)

          // Wait for auth context to initialize
          await waitFor(() => {
            if (isAuthorizedForRoute) {
              // User should see the appropriate dashboard
              if (requestedRoute === '/mother-dashboard') {
                expect(screen.getByTestId('mother-dashboard')).toBeInTheDocument()
              } else {
                expect(screen.getByTestId('chw-dashboard')).toBeInTheDocument()
              }
            } else {
              // User should be redirected to their appropriate dashboard (not the requested one)
              if (role === 'mother') {
                expect(screen.getByTestId('mother-dashboard')).toBeInTheDocument()
                expect(screen.queryByTestId('chw-dashboard')).not.toBeInTheDocument()
              } else {
                expect(screen.getByTestId('chw-dashboard')).toBeInTheDocument()
                expect(screen.queryByTestId('mother-dashboard')).not.toBeInTheDocument()
              }
              expect(screen.queryByTestId('login-page')).not.toBeInTheDocument()
            }
          })
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * **Feature: offline-auth, Property 5: Protected route access control**
   * **Validates: Requirements 5.3**
   */
  it('Property 5: Protected route access control - access should be granted only with appropriate authentication', async () => {
    fc.assert(
      fc.asyncProperty(
        fc.record({
          userState: fc.oneof(
            fc.constant(null), // No user
            fc.record({
              name: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
              role: fc.oneof(fc.constant('mother'), fc.constant('chw'))
            })
          ),
          route: fc.oneof(
            fc.constant('/mother-dashboard'),
            fc.constant('/health-worker')
          )
        }),
        async ({ userState, route }) => {
          // Clear mocks before each test
          vi.clearAllMocks()

          // Determine expected allowed roles for the route
          const allowedRoles = route === '/mother-dashboard' ? ['mother'] : ['chw']
          
          // Determine if access should be granted
          const shouldHaveAccess = userState !== null && 
            allowedRoles.includes(userState.role)

          const testApp = createTestApp(route, userState)
          render(testApp)

          // Wait for auth context to initialize
          await waitFor(() => {
            if (shouldHaveAccess) {
              // User should see the appropriate dashboard content
              if (route === '/mother-dashboard') {
                expect(screen.getByTestId('mother-dashboard')).toBeInTheDocument()
              } else {
                expect(screen.getByTestId('chw-dashboard')).toBeInTheDocument()
              }
              expect(screen.queryByTestId('login-page')).not.toBeInTheDocument()
            } else {
              // User should be redirected to login
              expect(screen.getByTestId('login-page')).toBeInTheDocument()
              expect(screen.queryByTestId('mother-dashboard')).not.toBeInTheDocument()
              expect(screen.queryByTestId('chw-dashboard')).not.toBeInTheDocument()
            }
          })
        }
      ),
      { numRuns: 100 }
    )
  })
})