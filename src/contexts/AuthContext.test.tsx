import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, renderHook, act } from '@testing-library/react'
import { ReactNode } from 'react'
import * as fc from 'fast-check'
import { AuthProvider, useAuth } from './AuthContext'

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

// Test wrapper component
const TestWrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
)

describe('AuthContext Property Tests', () => {
  beforeEach(() => {
    mockLocalStorage.clear()
    vi.clearAllMocks()
  })

  /**
   * **Feature: offline-auth, Property 1: Login input validation**
   * **Validates: Requirements 1.3, 1.4**
   */
  it('Property 1: Login input validation - valid inputs should authenticate, invalid inputs should be rejected', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.string(),
          role: fc.oneof(fc.constant('mother'), fc.constant('chw'), fc.constant(null), fc.string())
        }),
        ({ name, role }) => {
          // Clear localStorage and mocks before each test
          mockLocalStorage.clear()
          vi.clearAllMocks()
          
          const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper })
          
          // Wait for initial loading to complete
          expect(result.current.isLoading).toBe(false)
          
          // Initial state should be unauthenticated
          expect(result.current.isAuthenticated).toBe(false)
          expect(result.current.user).toBe(null)
          
          act(() => {
            result.current.login(name, role)
          })
          
          const isValidName = typeof name === 'string' && name.trim().length > 0
          const isValidRole = role === 'mother' || role === 'chw'
          
          if (isValidName && isValidRole) {
            // Valid inputs should result in successful authentication
            expect(result.current.isAuthenticated).toBe(true)
            expect(result.current.user).toEqual({ name: name.trim(), role })
            expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
              'user',
              JSON.stringify({ name: name.trim(), role })
            )
          } else {
            // Invalid inputs should be rejected without state changes
            expect(result.current.isAuthenticated).toBe(false)
            expect(result.current.user).toBe(null)
            expect(mockLocalStorage.setItem).not.toHaveBeenCalled()
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * **Feature: offline-auth, Property 2: Authentication state round-trip**
   * **Validates: Requirements 2.1, 2.2**
   */
  it('Property 2: Authentication state round-trip - storing then restoring should preserve user data', () => {
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
          
          // First, login with valid credentials
          const { result: loginResult } = renderHook(() => useAuth(), { wrapper: TestWrapper })
          
          act(() => {
            loginResult.current.login(name, role)
          })
          
          // Verify login was successful
          expect(loginResult.current.isAuthenticated).toBe(true)
          expect(loginResult.current.user).toEqual({ name: name.trim(), role })
          
          // Simulate page refresh by creating a new AuthProvider instance
          // The localStorage should contain the user data
          const storedData = mockLocalStorage.getItem('user')
          expect(storedData).toBe(JSON.stringify({ name: name.trim(), role }))
          
          // Create a new hook instance to simulate app restart
          const { result: restoreResult } = renderHook(() => useAuth(), { wrapper: TestWrapper })
          
          // After restoration, the user data should be preserved
          expect(restoreResult.current.isLoading).toBe(false)
          expect(restoreResult.current.isAuthenticated).toBe(true)
          expect(restoreResult.current.user).toEqual({ name: name.trim(), role })
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * **Feature: offline-auth, Property 4: Logout state cleanup**
   * **Validates: Requirements 5.1**
   */
  it('Property 4: Logout state cleanup - logout should clear all authentication data', () => {
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
          
          const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper })
          
          // First, login with valid credentials
          act(() => {
            result.current.login(name, role)
          })
          
          // Verify login was successful and data is stored
          expect(result.current.isAuthenticated).toBe(true)
          expect(result.current.user).toEqual({ name: name.trim(), role })
          expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
            'user',
            JSON.stringify({ name: name.trim(), role })
          )
          
          // Now logout
          act(() => {
            result.current.logout()
          })
          
          // Verify all authentication data is cleared
          expect(result.current.isAuthenticated).toBe(false)
          expect(result.current.user).toBe(null)
          expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('user')
          
          // Verify localStorage no longer contains user data
          expect(mockLocalStorage.getItem('user')).toBe(null)
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * **Feature: offline-auth, Property 6: Error handling resilience**
   * **Validates: Requirements 2.4, 6.4**
   */
  it('Property 6: Error handling resilience - localStorage errors should be handled gracefully', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
          role: fc.oneof(fc.constant('mother'), fc.constant('chw')),
          errorType: fc.oneof(
            fc.constant('getItem'),
            fc.constant('setItem'),
            fc.constant('removeItem'),
            fc.constant('parseError')
          )
        }),
        ({ name, role, errorType }) => {
          // Clear localStorage and mocks before each test
          mockLocalStorage.clear()
          vi.clearAllMocks()
          
          // Set up localStorage to throw errors based on errorType
          if (errorType === 'getItem') {
            mockLocalStorage.getItem.mockImplementation(() => {
              throw new Error('localStorage access denied')
            })
          } else if (errorType === 'setItem') {
            mockLocalStorage.setItem.mockImplementation(() => {
              throw new Error('localStorage quota exceeded')
            })
          } else if (errorType === 'removeItem') {
            mockLocalStorage.removeItem.mockImplementation(() => {
              throw new Error('localStorage access denied')
            })
          } else if (errorType === 'parseError') {
            // Set invalid JSON data
            mockLocalStorage.getItem.mockReturnValue('invalid json data')
          }
          
          // The application should not crash when localStorage operations fail
          let result: any
          expect(() => {
            const hookResult = renderHook(() => useAuth(), { wrapper: TestWrapper })
            result = hookResult.result
          }).not.toThrow()
          
          // Application should still be functional
          expect(result.current.isLoading).toBe(false)
          
          if (errorType === 'setItem') {
            // When setItem fails, login should still work but not persist
            act(() => {
              result.current.login(name, role)
            })
            expect(result.current.isAuthenticated).toBe(true)
            expect(result.current.user).toEqual({ name: name.trim(), role })
          } else if (errorType === 'removeItem') {
            // When removeItem fails, logout should still clear the app state
            // First login successfully
            mockLocalStorage.setItem.mockRestore()
            act(() => {
              result.current.login(name, role)
            })
            expect(result.current.isAuthenticated).toBe(true)
            
            // Then logout (which will fail to remove from localStorage)
            act(() => {
              result.current.logout()
            })
            expect(result.current.isAuthenticated).toBe(false)
            expect(result.current.user).toBe(null)
          } else {
            // For getItem and parseError, the app should start unauthenticated
            expect(result.current.isAuthenticated).toBe(false)
            expect(result.current.user).toBe(null)
          }
        }
      ),
      { numRuns: 100 }
    )
  })
})