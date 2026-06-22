import { Navigate } from "react-router-dom";
import { useAuth } from "../services/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
    const { user, profile, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
        );
    }

    // Not authenticated -> redirect to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Profile not loaded yet (edge case)
    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
        );
    }

    // Check role access
    if (allowedRoles && !allowedRoles.includes(profile.role)) {
        // Redirect to appropriate dashboard based on role
        if (profile.role === "admin") {
            return <Navigate to="/dashboard" replace />;
        }
        if (profile.role === "member") {
            return <Navigate to="/member" replace />;
        }
        return <Navigate to="/login" replace />;
    }

    return children;
}
