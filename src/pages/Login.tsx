// src/pages/Login.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function Login() {
    const [name, setName] = useState('');
    const [role, setRole] = useState<'mother' | 'chw'>('mother');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const validateInput = (name: string, role: 'mother' | 'chw'): string | null => {
        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            return 'Please enter your name or ID';
        }
        if (role !== 'mother' && role !== 'chw') {
            return 'Please select a valid role';
        }
        return null;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        const validationError = validateInput(name, role);
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsSubmitting(true);

        // Use setTimeout to simulate async behavior and allow state updates to be visible
        setTimeout(() => {
            try {
                // Attempt login
                login(name, role);
                
                // Navigate to appropriate dashboard
                navigate(role === 'mother' ? '/mother-dashboard' : '/health-worker');
            } catch (err) {
                setError('An unexpected error occurred. Please try again.');
                setIsSubmitting(false);
            }
        }, 100); // Small delay to allow loading state to be visible
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center">Welcome to MaaCare</h2>
                
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
                
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Your Name or ID
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    if (error) setError(''); // Clear error when user starts typing
                                }}
                                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                                    error && error.includes('name') ? 'border-red-300' : 'border-gray-300'
                                }`}
                                placeholder="Enter your name or ID"
                                disabled={isSubmitting}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">I am a</label>
                            <div className="mt-2 space-y-2">
                                <div className="flex items-center">
                                    <input
                                        id="mother"
                                        name="role"
                                        type="radio"
                                        checked={role === 'mother'}
                                        onChange={() => {
                                            setRole('mother');
                                            if (error) setError(''); // Clear error when user changes selection
                                        }}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                        disabled={isSubmitting}
                                    />
                                    <label htmlFor="mother" className="ml-2 block text-sm text-gray-700">
                                        Expecting Mother
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        id="chw"
                                        name="role"
                                        type="radio"
                                        checked={role === 'chw'}
                                        onChange={() => {
                                            setRole('chw');
                                            if (error) setError(''); // Clear error when user changes selection
                                        }}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                        disabled={isSubmitting}
                                    />
                                    <label htmlFor="chw" className="ml-2 block text-sm text-gray-700">
                                        Community Health Worker
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                                isSubmitting 
                                    ? 'bg-indigo-400 cursor-not-allowed' 
                                    : 'bg-indigo-600 hover:bg-indigo-700'
                            }`}
                        >
                            {isSubmitting ? 'Signing in...' : 'Continue'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}