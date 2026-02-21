import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { ShieldX } from 'lucide-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
    const { isAuthenticated, isAdmin, isLoading } = useUser();
    const location = useLocation();

    // Show loading spinner while session is being restored
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    // Not authenticated → redirect to login, remember current path
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    // Authenticated but not admin and admin is required → show Access Denied
    if (requireAdmin && !isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShieldX size={40} className="text-red-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Accès Refusé</h1>
                    <p className="text-gray-500 mb-6">
                        Vous n'avez pas les permissions nécessaires pour accéder à cette page.
                        Seuls les administrateurs peuvent y accéder.
                    </p>
                    <a
                        href="/"
                        className="inline-block px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors"
                    >
                        Retour à l'accueil
                    </a>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
