// src/contexts/AuthContext.tsx
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

type Role = 'mother' | 'chw' | null;
type User = { name: string; role: Role };

interface AuthContextType {
    user: User | null;
    login: (name: string, role: Role) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to safely access localStorage
const safeLocalStorage = {
    getItem: (key: string): string | null => {
        try {
            return localStorage.getItem(key);
        } catch (error) {
            console.warn('Failed to read from localStorage:', error);
            return null;
        }
    },
    setItem: (key: string, value: string): boolean => {
        try {
            localStorage.setItem(key, value);
            return true;
        } catch (error) {
            console.warn('Failed to write to localStorage:', error);
            return false;
        }
    },
    removeItem: (key: string): boolean => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.warn('Failed to remove from localStorage:', error);
            return false;
        }
    }
};

// Helper function to validate user data
const isValidUser = (user: any): user is User => {
    return (
        user &&
        typeof user === 'object' &&
        typeof user.name === 'string' &&
        user.name.trim().length > 0 &&
        (user.role === 'mother' || user.role === 'chw')
    );
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for saved user in localStorage on initial load
        const savedUserString = safeLocalStorage.getItem('user');
        if (savedUserString) {
            try {
                const savedUser = JSON.parse(savedUserString);
                if (isValidUser(savedUser)) {
                    setUser(savedUser);
                } else {
                    // Clear invalid data
                    safeLocalStorage.removeItem('user');
                }
            } catch (error) {
                console.warn('Failed to parse saved user data:', error);
                // Clear corrupted data
                safeLocalStorage.removeItem('user');
            }
        }
        setIsLoading(false);
    }, []);

    const login = (name: string, role: Role) => {
        // Validate input
        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            return;
        }
        if (role !== 'mother' && role !== 'chw') {
            return;
        }

        const user = { name: name.trim(), role };
        setUser(user);
        
        // Attempt to save to localStorage, but don't fail if it doesn't work
        const success = safeLocalStorage.setItem('user', JSON.stringify(user));
        if (!success) {
            console.warn('Failed to persist user data to localStorage');
        }
    };

    const logout = () => {
        setUser(null);
        safeLocalStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                isAuthenticated: !!user,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};