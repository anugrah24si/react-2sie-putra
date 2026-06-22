import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./services/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

// Lazy loading - Layouts
const MainLayout = React.lazy(() => import("./layout/MainLayout"));
const AuthLayout = React.lazy(() => import("./layout/AuthLayout"));
const MemberLayout = React.lazy(() => import("./layout/MemberLayout"));

// Lazy loading - Auth Pages
const Login = React.lazy(() => import("./pages/Auth/Login"));
const Register = React.lazy(() => import("./pages/Auth/Register"));
const Forgot = React.lazy(() => import("./pages/Auth/Forgot"));

// Lazy loading - Admin Pages
const Dashboard = React.lazy(() => import("./pages/Main/Dashboard"));
const Orders = React.lazy(() => import("./pages/Main/Orders"));
const Customers = React.lazy(() => import("./pages/Main/Customers"));
const Products = React.lazy(() => import("./pages/Main/Products"));
const ProductDetail = React.lazy(() => import("./pages/Main/ProductDetail"));

// Lazy loading - Member Pages
const MemberDashboard = React.lazy(() => import("./pages/Member/MemberDashboard"));
const MemberProducts = React.lazy(() => import("./pages/Member/MemberProducts"));
const CreateOrder = React.lazy(() => import("./pages/Member/CreateOrder"));
const OrderHistory = React.lazy(() => import("./pages/Member/OrderHistory"));
const MemberProfile = React.lazy(() => import("./pages/Member/MemberProfile"));

// Lazy loading - Preserved Pages (untouched)
const NotFound = React.lazy(() => import("./pages/Main/NotFound"));
const Components = React.lazy(() => import("./pages/Main/Components"));
const FiturXyz = React.lazy(() => import("./pages/Main/FiturXyz"));
const Note = React.lazy(() => import("./pages/Main/Note"));

// Loading fallback
function LoadingFallback() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
    );
}

// Redirect authenticated users away from auth pages
function PublicOnlyRoute({ children }) {
    const { user, profile, loading } = useAuth();

    if (loading) return <LoadingFallback />;
    if (user && profile) {
        if (profile.role === "admin") return <Navigate to="/dashboard" replace />;
        return <Navigate to="/member" replace />;
    }
    return children;
}

export default function App() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <Routes>
                {/* ===== AUTH ROUTES (Public Only) ===== */}
                <Route element={
                    <PublicOnlyRoute>
                        <AuthLayout />
                    </PublicOnlyRoute>
                }>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot" element={<Forgot />} />
                </Route>

                {/* ===== ADMIN ROUTES ===== */}
                <Route path="/dashboard" element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <MainLayout><Dashboard /></MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/orders" element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <MainLayout><Orders /></MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/customers" element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <MainLayout><Customers /></MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/products" element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <MainLayout><Products /></MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/products/:id" element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <MainLayout><ProductDetail /></MainLayout>
                    </ProtectedRoute>
                } />

                {/* ===== PRESERVED ROUTES (any authenticated user) ===== */}
                <Route path="/notes" element={
                    <ProtectedRoute allowedRoles={["admin", "member"]}>
                        <MainLayout><Note /></MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/components" element={
                    <ProtectedRoute allowedRoles={["admin", "member"]}>
                        <MainLayout><Components /></MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/fiturxyz" element={
                    <ProtectedRoute allowedRoles={["admin", "member"]}>
                        <MainLayout><FiturXyz /></MainLayout>
                    </ProtectedRoute>
                } />

                {/* ===== MEMBER ROUTES ===== */}
                <Route path="/member" element={
                    <ProtectedRoute allowedRoles={["member"]}>
                        <MemberLayout />
                    </ProtectedRoute>
                }>
                    <Route index element={<MemberDashboard />} />
                    <Route path="products" element={<MemberProducts />} />
                    <Route path="orders" element={<OrderHistory />} />
                    <Route path="orders/new" element={<CreateOrder />} />
                    <Route path="profile" element={<MemberProfile />} />
                </Route>

                {/* ===== ROOT REDIRECT ===== */}
                <Route path="/" element={<RootRedirect />} />

                {/* ===== 404 ===== */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    );
}

// Root path redirects based on auth state
function RootRedirect() {
    const { user, profile, loading } = useAuth();

    if (loading) return <LoadingFallback />;
    if (!user) return <Navigate to="/login" replace />;
    if (profile?.role === "admin") return <Navigate to="/dashboard" replace />;
    return <Navigate to="/member" replace />;
}
