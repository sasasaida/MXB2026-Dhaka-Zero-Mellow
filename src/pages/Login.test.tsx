import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ReactNode } from 'react'
import { Login } from './Login'
import { AuthProvider } from '@/contexts/AuthContext'

// Mock react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

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
  <BrowserRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
)

describe('Login Component', () => {
  beforeEach(() => {
    mockLocalStorage.clear()
    vi.clearAllMocks()
    mockNavigate.mockClear()
  })

  describe('Role Selection Functionality', () => {
    it('should display both role options', () => {
      render(<Login />, { wrapper: TestWrapper })
      
      expect(screen.getByLabelText('Expecting Mother')).toBeInTheDocument()
      expect(screen.getByLabelText('Community Health Worker')).toBeInTheDocument()
    })

    it('should have mother role selected by default', () => {
      render(<Login />, { wrapper: TestWrapper })
      
      const motherRadio = screen.getByLabelText('Expecting Mother') as HTMLInputElement
      const chwRadio = screen.getByLabelText('Community Health Worker') as HTMLInputElement
      
      expect(motherRadio.checked).toBe(true)
      expect(chwRadio.checked).toBe(false)
    })

    it('should allow role selection change', () => {
      render(<Login />, { wrapper: TestWrapper })
      
      const motherRadio = screen.getByLabelText('Expecting Mother') as HTMLInputElement
      const chwRadio = screen.getByLabelText('Community Health Worker') as HTMLInputElement
      
      // Click CHW radio
      fireEvent.click(chwRadio)
      
      expect(motherRadio.checked).toBe(false)
      expect(chwRadio.checked).toBe(true)
      
      // Click mother radio
      fireEvent.click(motherRadio)
      
      expect(motherRadio.checked).toBe(true)
      expect(chwRadio.checked).toBe(false)
    })
  })

  describe('Form Validation', () => {
    it('should not navigate when name input is empty', async () => {
      render(<Login />, { wrapper: TestWrapper })
      
      const submitButton = screen.getByRole('button', { name: /continue/i })
      fireEvent.click(submitButton)
      
      // Wait a bit to ensure no navigation occurs
      await new Promise(resolve => setTimeout(resolve, 200))
      
      expect(mockNavigate).not.toHaveBeenCalled()
    })

    it('should not navigate when name input is whitespace only', async () => {
      render(<Login />, { wrapper: TestWrapper })
      
      const nameInput = screen.getByLabelText('Your Name or ID')
      fireEvent.change(nameInput, { target: { value: '   ' } })
      
      const submitButton = screen.getByRole('button', { name: /continue/i })
      fireEvent.click(submitButton)
      
      // Wait a bit to ensure no navigation occurs
      await new Promise(resolve => setTimeout(resolve, 200))
      
      expect(mockNavigate).not.toHaveBeenCalled()
    })

    it('should accept valid name input and navigate to mother dashboard', async () => {
      render(<Login />, { wrapper: TestWrapper })
      
      const nameInput = screen.getByLabelText('Your Name or ID')
      fireEvent.change(nameInput, { target: { value: 'John Doe' } })
      
      const submitButton = screen.getByRole('button', { name: /continue/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/mother-dashboard')
      }, { timeout: 2000 })
    })

    it('should navigate to correct dashboard based on role', async () => {
      render(<Login />, { wrapper: TestWrapper })
      
      const nameInput = screen.getByLabelText('Your Name or ID')
      const chwRadio = screen.getByLabelText('Community Health Worker')
      
      fireEvent.change(nameInput, { target: { value: 'Jane Smith' } })
      fireEvent.click(chwRadio)
      
      const submitButton = screen.getByRole('button', { name: /continue/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/health-worker')
      }, { timeout: 2000 })
    })
  })

  describe('User Interface Behavior', () => {
    it('should show loading state during submission', async () => {
      render(<Login />, { wrapper: TestWrapper })
      
      const nameInput = screen.getByLabelText('Your Name or ID')
      fireEvent.change(nameInput, { target: { value: 'John Doe' } })
      
      const submitButton = screen.getByRole('button', { name: /continue/i })
      fireEvent.click(submitButton)
      
      // Check for loading state immediately after click
      await waitFor(() => {
        expect(screen.getByText('Signing in...')).toBeInTheDocument()
      }, { timeout: 50 })
    })

    it('should disable form elements during submission', async () => {
      render(<Login />, { wrapper: TestWrapper })
      
      const nameInput = screen.getByLabelText('Your Name or ID')
      const motherRadio = screen.getByLabelText('Expecting Mother')
      const chwRadio = screen.getByLabelText('Community Health Worker')
      
      fireEvent.change(nameInput, { target: { value: 'John Doe' } })
      
      const submitButton = screen.getByRole('button', { name: /continue/i })
      fireEvent.click(submitButton)
      
      // Elements should be disabled during submission
      await waitFor(() => {
        expect(nameInput).toBeDisabled()
        expect(motherRadio).toBeDisabled()
        expect(chwRadio).toBeDisabled()
        expect(submitButton).toBeDisabled()
      }, { timeout: 50 })
    })
  })

  describe('Integration with AuthContext', () => {
    it('should call login function with correct parameters', async () => {
      render(<Login />, { wrapper: TestWrapper })
      
      const nameInput = screen.getByLabelText('Your Name or ID')
      const chwRadio = screen.getByLabelText('Community Health Worker')
      
      fireEvent.change(nameInput, { target: { value: 'Test User' } })
      fireEvent.click(chwRadio)
      
      const submitButton = screen.getByRole('button', { name: /continue/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          'user',
          JSON.stringify({ name: 'Test User', role: 'chw' })
        )
      }, { timeout: 2000 })
    })
  })
})