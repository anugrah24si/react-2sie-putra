import React, { Suspense, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";

// Lazy loading components
const MainLayout = React.lazy(() => import("./layout/MainLayout"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Orders = React.lazy(() => import("./pages/Main/Orders"));
const Customers = React.lazy(() => import("./pages/Main/Customers"));
const Products = React.lazy(() => import("./pages/Main/Products"));
const ProductDetail = React.lazy(() => import("./pages/Main/ProductDetail"));
const NotFound = React.lazy(() => import("./pages/Main/NotFound"));
const AuthLayout = React.lazy(() => import("./layout/AuthLayout"));
const Login = React.lazy(() => import("./pages/Auth/Login"));
const Register = React.lazy(() => import("./pages/Auth/Register"));
const Forgot = React.lazy(() => import("./pages/Auth/Forgot"));
const Loading = React.lazy(() => import("./components/Loading"));
const Components = React.lazy(() => import("./pages/Main/Components"));
const FiturXyz = React.lazy(() => import("./pages/Main/FiturXyz"));

// Data menu sidebar
const MENU_ITEMS = [
    { id: "dashboard", label: "Dashboard" },
    { id: "orders", label: "Orders" },
    { id: "customers", label: "Customers" },
    { id: "products", label: "Products" },
    { id: "components", label: "Components" },
    { id: "fiturxyz", label: "Fitur XYZ" },
];

// Data orders awal
const INITIAL_ORDERS = [
    { id: "001", customer: "Anugrah", item: "Ayam", total: "Rp.78.000", status: "Preparing" },
    { id: "002", customer: "Putra", item: "Kebab", total: "Rp.92.000", status: "On Delivery" },
    { id: "003", customer: "Fajar", item: "Burger", total: "Rp.105.000", status: "Delivered" },
    { id: "004", customer: "Traa", item: "Coffe", total: "Rp.64.000", status: "Canceled" },
    { id: "005", customer: "Toyy", item: "Pizza", total: "Rp.88.000", status: "Preparing" },
];

// Data customers awal
const INITIAL_CUSTOMERS = [
    { id: "001", name: "Anugrah", email: "Anugrah@email.com", totalOrder: 14, city: "Bandung", tier: "Gold" },
    { id: "002", name: "Putra", email: "Putra@email.com", totalOrder: 9, city: "Jakarta", tier: "Silver" },
    { id: "003", name: "Fajar", email: "Fajar@email.com", totalOrder: 21, city: "Surabaya", tier: "Platinum" },
    { id: "004", name: "Traa", email: "Traa@email.com", totalOrder: 5, city: "Malang", tier: "Bronze" },
    { id: "005", name: "Toyy", email: "Toyy@email.com", totalOrder: 12, city: "Semarang", tier: "Gold" },
];

// Helper: Ubah rupiah ke angka
function parseRupiah(value) {
    return Number(String(value).replace(/[^0-9]/g, "") || 0);
}

// Helper: Format angka ke rupiah
function formatRupiah(value) {
    return `Rp.${new Intl.NumberFormat("id-ID").format(value)}`;
}

// Helper: Generate ID berikutnya
function getNextId(items) {
    const maxId = items.reduce((max, item) => {
        const num = Number(String(item.id).replace(/[^0-9]/g, ""));
        return num > max ? num : max;
    }, 0);
    return String(maxId + 1).padStart(3, "0");
}

export default function App() {
    const location = useLocation();
    const currentPath = location.pathname.toLowerCase();

    // State sederhana
    const [activeSection, setActiveSection] = useState("dashboard");
    const [searchQuery, setSearchQuery] = useState("");
    const [orders, setOrders] = useState(INITIAL_ORDERS);
    const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);

    // Hitung statistik dashboard
    function getDashboardCards() {
        const totalOrders = orders.length;
        const totalDelivered = orders.filter(o => o.status === "Delivered").length;
        const totalCanceled = orders.filter(o => o.status === "Canceled").length;
        const totalRevenue = orders
            .filter(o => o.status !== "Canceled")
            .reduce((sum, o) => sum + parseRupiah(o.total), 0);

        return [
            { id: "orders", icon: "cart", value: String(totalOrders), label: "Total Orders" },
            { id: "delivered", icon: "truck", value: String(totalDelivered), label: "Total Delivered" },
            { id: "canceled", icon: "ban", value: String(totalCanceled), label: "Total Canceled" },
            { id: "revenue", icon: "money", value: formatRupiah(totalRevenue), label: "Total Revenue" },
        ];
    }

    // Filter data berdasarkan search
    function filterData(data, fields) {
        if (!searchQuery.trim()) return data;
        const query = searchQuery.toLowerCase();
        return data.filter(item =>
            fields.some(field => String(item[field]).toLowerCase().includes(query))
        );
    }

    const dashboardCards = getDashboardCards();
    const filteredOrders = filterData(orders, ["id", "customer", "item", "status"]);
    const filteredCustomers = filterData(customers, ["id", "name", "email", "city", "tier"]);

    // Handler untuk tambah order
    function handleAddOrder(orderData) {
        const newOrder = {
            id: getNextId(orders),
            customer: orderData.customer.trim(),
            item: orderData.item.trim(),
            total: formatRupiah(parseRupiah(orderData.total)),
            status: orderData.status,
        };
        setOrders([newOrder, ...orders]);

        const customerName = orderData.customer.trim().toLowerCase();
        const existingCustomer = customers.find(c => c.name.toLowerCase() === customerName);

        if (existingCustomer) {
            setCustomers(customers.map(c =>
                c.name.toLowerCase() === customerName
                    ? { ...c, totalOrder: c.totalOrder + 1 }
                    : c
            ));
        } else {
            const newCustomer = {
                id: getNextId(customers),
                name: orderData.customer.trim(),
                email: `${orderData.customer.trim().replace(/\s+/g, "").toLowerCase()}@email.com`,
                totalOrder: 1,
                city: "Unknown",
                tier: "Bronze",
            };
            setCustomers([newCustomer, ...customers]);
        }
    }

    // Handler untuk tambah customer
    function handleAddCustomer(customerData) {
        const newCustomer = {
            id: getNextId(customers),
            name: customerData.name.trim(),
            email: customerData.email.trim(),
            totalOrder: Number(customerData.totalOrder || 0),
            city: customerData.city.trim(),
            tier: customerData.tier,
        };
        setCustomers([newCustomer, ...customers]);
    }

    // Tentukan page title dan breadcrumb
    const pageInfo = {
        dashboard: { title: "Dashboard", breadcrumb: "Home / Home Detail / Home Very Detail" },
        orders: { title: "Orders", breadcrumb: "Home / Orders / Order List" },
        customers: { title: "Customers", breadcrumb: "Home / Customers / Customer List" },
        products: { title: "Products", breadcrumb: "Home / Products / Product List" },
        components: { title: "Components", breadcrumb: "Home / Components / Component List" },
        fiturxyz: { title: "Fitur XYZ", breadcrumb: "Home / Fitur XYZ / XYZ Page" },
    };

    // Tentukan active section berdasarkan path
    let currentSection = "dashboard";
    if (currentPath.includes("/orders")) currentSection = "orders";
    else if (currentPath.includes("/customers")) currentSection = "customers";
    else if (currentPath.includes("/products")) currentSection = "products";
    else if (currentPath.includes("/components")) currentSection = "components";
    else if (currentPath.includes("/fiturxyz")) currentSection = "fiturxyz";

    const currentPage = pageInfo[currentSection] || pageInfo.dashboard;

    // Check untuk halaman auth
    const isAuthPage = ["/login", "/register", "/forgot"].includes(currentPath);

    // Render halaman Auth
    if (isAuthPage) {
        return (
            <Suspense fallback={<div className="p-4 text-sm text-gray-500">Loading app...</div>}>
                <Routes>
                    <Route element={<AuthLayout />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot" element={<Forgot />} />
                    </Route>
                </Routes>
            </Suspense>
        );
    }

    // Main App Routes
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                {/* Routes dengan MainLayout (sidebar) */}
                <Route
                    path="/"
                    element={
                        <MainLayout
                            activeSection={currentSection}
                            menuItems={MENU_ITEMS}
                            onMenuClick={setActiveSection}
                            onAddMenu={() => { }}
                            onRemoveMenu={() => { }}
                            searchValue={searchQuery}
                            onSearchChange={(e) => setSearchQuery(e.target.value)}
                            pageTitle={currentPage.title}
                            pageBreadcrumb={currentPage.breadcrumb}
                        >
                            <Dashboard
                                activeSection="dashboard"
                                cards={dashboardCards}
                                orders={filteredOrders}
                                customers={filteredCustomers}
                                onAddOrder={handleAddOrder}
                                onAddCustomer={handleAddCustomer}
                                searchQuery={searchQuery}
                                isEmpty={dashboardCards.length === 0}
                                isOrdersEmpty={filteredOrders.length === 0}
                                isCustomersEmpty={filteredCustomers.length === 0}
                            />
                        </MainLayout>
                    }
                />

                <Route
                    path="/dashboard"
                    element={
                        <MainLayout
                            activeSection="dashboard"
                            menuItems={MENU_ITEMS}
                            onMenuClick={setActiveSection}
                            onAddMenu={() => { }}
                            onRemoveMenu={() => { }}
                            searchValue={searchQuery}
                            onSearchChange={(e) => setSearchQuery(e.target.value)}
                            pageTitle="Dashboard"
                            pageBreadcrumb="Home / Home Detail / Home Very Detail"
                        >
                            <Dashboard
                                activeSection="dashboard"
                                cards={dashboardCards}
                                orders={filteredOrders}
                                customers={filteredCustomers}
                                onAddOrder={handleAddOrder}
                                onAddCustomer={handleAddCustomer}
                                searchQuery={searchQuery}
                                isEmpty={dashboardCards.length === 0}
                                isOrdersEmpty={filteredOrders.length === 0}
                                isCustomersEmpty={filteredCustomers.length === 0}
                            />
                        </MainLayout>
                    }
                />

                <Route
                    path="/orders"
                    element={
                        <MainLayout
                            activeSection="orders"
                            menuItems={MENU_ITEMS}
                            onMenuClick={setActiveSection}
                            onAddMenu={() => { }}
                            onRemoveMenu={() => { }}
                            searchValue={searchQuery}
                            onSearchChange={(e) => setSearchQuery(e.target.value)}
                            pageTitle="Orders"
                            pageBreadcrumb="Home / Orders / Order List"
                        >
                            <Orders
                                orders={filteredOrders}
                                onAddOrder={handleAddOrder}
                                isEmpty={filteredOrders.length === 0}
                            />
                        </MainLayout>
                    }
                />

                <Route
                    path="/customers"
                    element={
                        <MainLayout
                            activeSection="customers"
                            menuItems={MENU_ITEMS}
                            onMenuClick={setActiveSection}
                            onAddMenu={() => { }}
                            onRemoveMenu={() => { }}
                            searchValue={searchQuery}
                            onSearchChange={(e) => setSearchQuery(e.target.value)}
                            pageTitle="Customers"
                            pageBreadcrumb="Home / Customers / Customer List"
                        >
                            <Customers
                                customers={filteredCustomers}
                                onAddCustomer={handleAddCustomer}
                                isEmpty={filteredCustomers.length === 0}
                            />
                        </MainLayout>
                    }
                />

                <Route
                    path="/products"
                    element={
                        <MainLayout
                            activeSection="products"
                            menuItems={MENU_ITEMS}
                            onMenuClick={setActiveSection}
                            onAddMenu={() => { }}
                            onRemoveMenu={() => { }}
                            searchValue={searchQuery}
                            onSearchChange={(e) => setSearchQuery(e.target.value)}
                            pageTitle="Products"
                            pageBreadcrumb="Home / Products / Product List"
                        >
                            <Products />
                        </MainLayout>
                    }
                />

                <Route
                    path="/products/:id"
                    element={
                        <MainLayout
                            activeSection="products"
                            menuItems={MENU_ITEMS}
                            onMenuClick={setActiveSection}
                            onAddMenu={() => { }}
                            onRemoveMenu={() => { }}
                            searchValue={searchQuery}
                            onSearchChange={(e) => setSearchQuery(e.target.value)}
                            pageTitle="Product Detail"
                            pageBreadcrumb="Home / Products / Product Detail"
                        >
                            <ProductDetail />
                        </MainLayout>
                    }
                />

                <Route
                    path="/components"
                    element={
                        <MainLayout
                            activeSection="components"
                            menuItems={MENU_ITEMS}
                            onMenuClick={setActiveSection}
                            onAddMenu={() => { }}
                            onRemoveMenu={() => { }}
                            searchValue={searchQuery}
                            onSearchChange={(e) => setSearchQuery(e.target.value)}
                            pageTitle="Components"
                            pageBreadcrumb="Home / Components / Component List"
                        >
                            <Components />
                        </MainLayout>
                    }
                />

                <Route
                    path="/fiturxyz"
                    element={
                        <MainLayout
                            activeSection="fiturxyz"
                            menuItems={MENU_ITEMS}
                            onMenuClick={setActiveSection}
                            onAddMenu={() => { }}
                            onRemoveMenu={() => { }}
                            searchValue={searchQuery}
                            onSearchChange={(e) => setSearchQuery(e.target.value)}
                            pageTitle="Fitur XYZ"
                            pageBreadcrumb="Home / Fitur XYZ / XYZ Page"
                        >
                            <FiturXyz />
                        </MainLayout>
                    }
                />

                {/* 404 Error Page - Standalone (tanpa layout) */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    );
}
