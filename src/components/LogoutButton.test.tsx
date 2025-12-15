import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ReactNode } from 'react'
import * as fc from 'fast-check'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { BrowserRouter } from 'react-router-dom'
import MotherDashboard from '@/pages/MotherDashboard'
import HealthWorker from '@/pages/HealthWorker'

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

// Test wrapper component with authentication and routing
const TestWrapper = ({ children, user }: { children: ReactNode; user?: { name: string; role: 'mother' | 'chw' } }) => {
  // Set up authenticated user in localStorage if provided
  if (user) {
    mockLocalStorage.setItem('user', JSON.stringify(user))
  }
  
  return (
    <BrowserRouter>
      <AuthProvider>
        {children}
      </AuthProvider>
    </BrowserRouter>
  )
}

describe('Logout Button Availability Property Tests', () => {
  beforeEach(() => {
    mockLocalStorage.clear()
    vi.clearAllMocks()
  })

  /**
   * **Feature: offline-auth, Property 7: Logout button availability**
   * **Validates: Requirements 5.4**
   */
  it('Property 7: Logout button availability - logout functionality should be accessible from all authenticated pages', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
          role: fc.oneof(fc.constant('mother'), fc.constant('chw'))
        }),
        ({ name, role }) => {
          // Clear localStorage and mocks before each test
          mockLocalStorage.clear()
          vi.clearAllMocks()
          
          const user = { name: name.trim(), role }
          
          // Test MotherDashboard for mother role
          if (role === 'mother') {
            render(
              <TestWrapper user={user}>
                <MotherDashboard />
              </TestWrapper>
            )
            
            // Should have at least one logout button
            const logoutButtons = screen.getAllByRole('button', { name: /logout/i })
            expect(logoutButtons.length).toBeGreaterThan(0)
          }
          
          // Test HealthWorker dashboard for chw role
          if (role === 'chw') {
            render(
              <TestWrapper user={user}>
                <HealthWorker />
              </TestWrapper>
            )
            
            // Should have at least one logout button
            const logoutButtons = screen.getAllByRole('button', { name: /logout/i })
            expect(logoutButtons.length).toBeGreaterThan(0)
          }
        }
      ),
      { numRuns: 2 }
    )
  })
})

describe('Logout Functionality Unit Tests', () => {
  beforeEach(() => {
    mockLocalStorage.clear()
    vi.clearAllMocks()
  })

  it('should display logout button on MotherDashboard when authenticated as mother', () => {
    const user = { name: 'Test Mother', role: 'mother' as const }
    
    render(
      <TestWrapper user={user}>
        <MotherDashboard />
      </TestWrapper>
    )
    
    // Should have at least one logout button
    const logoutButtons = screen.getAllByRole('button', { name: /logout/i })
    expect(logoutButtons.length).toBeGreaterThan(0)
  })

  it('should display logout button on HealthWorker dashboard when authenticated as chw', () => {
    const user = { name: 'Test CHW', role: 'chw' as const }
    
    render(
      <TestWrapper user={user}>
        <HealthWorker />
      </TestWrapper>
    )
    
    // Should have at least one logout button
    const logoutButtons = screen.getAllByRole('button', { name: /logout/i })
    expect(logoutButtons.length).toBeGreaterThan(0)
  })

  it('should clear authentication state when logout is clicked', () => {
    // This test will be implemented once we add the actual logout buttons
    // For now, we'll test the logout functionality directly through the context
    const TestComponent = () => {
      const { user, logout, isAuthenticated } = useAuth()
      return (
        <div>
          <span data-testid="auth-status">{isAuthenticated ? 'authenticated' : 'unauthenticated'}</span>
          <span data-testid="user-name">{user?.name || 'none'}</span>
          <button onClick={logout} data-testid="logout-btn">Logout</button>
        </div>
      )
    }

    const user = { name: 'Test User', role: 'mother' as const }
    
    render(
      <TestWrapper user={user}>
        <TestComponent />
      </TestWrapper>
    )
    
    // Initially should be authenticated
    expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated')
    expect(screen.getByTestId('user-name')).toHaveTextContent('Test User')
    
    // Click logout
    fireEvent.click(screen.getByTestId('logout-btn'))
    
    // Should be unauthenticated after logout
    expect(screen.getByTestId('auth-status')).toHaveTextContent('unauthenticated')
    expect(screen.getByTestId('user-name')).toHaveTextContent('none')
    
    // localStorage should be cleared
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('user')
  })

  it('should make logout accessible from different authenticated pages', () => {
    // Test that logout functionality is consistently available
    const pages = [
      { component: MotherDashboard, role: 'mother' as const, name: 'Mother Dashboard' },
      { component: HealthWorker, role: 'chw' as const, name: 'CHW Dashboard' }
    ]
    
    pages.forEach(({ component: Component, role, name }) => {
      const user = { name: `Test ${role}`, role }
      
      const { unmount } = render(
        <TestWrapper user={user}>
          <Component />
        </TestWrapper>
      )
      
      // Should have at least one logout button available on each page
      const logoutButtons = screen.getAllByRole('button', { name: /logout/i })
      expect(logoutButtons.length).toBeGreaterThan(0)
      
      unmount()
      mockLocalStorage.clear()
    })
  })
})