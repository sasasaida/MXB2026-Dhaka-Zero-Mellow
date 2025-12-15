// src/components/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
    allowedRoles: ('mother' | 'chw')[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>; // Or a loading spinner
    }

    // If no user is authenticated, redirect to login
    if (!user || !user.role) {
        return <Navigate to="/login" replace />;
    }

    // If user is authenticated but doesn't have the right role, redirect to their appropriate dashboard
    if (!allowedRoles.includes(user.role)) {
        const redirectPath = user.role === 'mother' ? '/mother-dashboard' : '/health-worker';
        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
}