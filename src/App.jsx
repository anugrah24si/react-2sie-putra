import React, { Suspense, useState, useMemo } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";

const MainLayout = React.lazy(() => import("./layout/MainLayout"));
const Dashboard = React.lazy(() => import("./pages/Main/Dashboard"));
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

// Data awal untuk menu sidebar
const initialMenuItems = [
    { id: "dashboard", label: "Dashboard", removable: false },
    { id: "orders", label: "Orders", removable: false },
    { id: "customers", label: "Customers", removable: false },
    { id: "products", label: "Products", removable: false },
    { id: "components", label: "Components", removable: false },
    { id: "fiturxyz", label: "Fitur XYZ", removable: false },
];

// Data awal untuk orders (pesanan)
const orderRows = [
    { id: "001", customer: "Anugrah", item: "Ayam", total: "Rp.78.000", status: "Preparing" },
    { id: "002", customer: "Putra", item: "Kebab", total: "Rp.92.000", status: "On Delivery" },
    { id: "003", customer: "Fajar", item: "Burger", total: "Rp.105.000", status: "Delivered" },
    { id: "004", customer: "Traa", item: "Coffe", total: "Rp.64.000", status: "Canceled" },
    { id: "005", customer: "Toyy", item: "Pizza", total: "Rp.88.000", status: "Preparing" },
];

// Data awal untuk customers (pelanggan)
const customerRows = [
    { id: "001", name: "Anugrah", email: "Anugrah@email.com", totalOrder: 14, city: "Bandung", tier: "Gold" },
    { id: "002", name: "Putra", email: "Putra@email.com", totalOrder: 9, city: "Jakarta", tier: "Silver" },
    { id: "003", name: "Fajar", email: "Fajar@email.com", totalOrder: 21, city: "Surabaya", tier: "Platinum" },
    { id: "004", name: "Traa", email: "Traa@email.com", totalOrder: 5, city: "Malang", tier: "Bronze" },
    { id: "005", name: "Toyy", email: "Toyy@email.com", totalOrder: 12, city: "Semarang", tier: "Gold" },
];

/**
 * parseRupiah - Mengubah teks rupiah seperti Rp.78.000 menjadi angka
 */
function parseRupiah(value) {
    const onlyDigits = String(value).replace(/[^0-9]/g, "");
    return Number(onlyDigits || 0);
}

/**
 * formatRupiah - Memformat angka menjadi tampilan rupiah sederhana
 */
function formatRupiah(value) {
    return `Rp.${new Intl.NumberFormat("id-ID").format(value)}`;
}

/**
 * getNextId - Menghasilkan ID 3 digit berikutnya dari daftar item
 */
function getNextId(items) {
    const maxId = items.reduce((maxValue, item) => {
        const numeric = Number(String(item.id).replace(/[^0-9]/g, ""));
        return numeric > maxValue ? numeric : maxValue;
    }, 0);

    return String(maxId + 1).padStart(3, "0");
}

export default function App() {
    const location = useLocation();
    const isAuthPage = ["/login", "/register", "/forgot"].includes(location.pathname);

    const [activeSection, setActiveSection] = useState("dashboard");
    const [searchQuery, setSearchQuery] = useState("");
    const [menuItems, setMenuItems] = useState(initialMenuItems);
    const [ordersData, setOrdersData] = useState(orderRows);
    const [customersData, setCustomersData] = useState(customerRows);

    /**
     * dashboardCards - Menghitung statistik dashboard dari data orders
     */
    const dashboardCards = useMemo(() => {
        const totalOrders = ordersData.length;
        const totalDelivered = ordersData.filter((item) => item.status === "Delivered").length;
        const totalCanceled = ordersData.filter((item) => item.status === "Canceled").length;
        const totalRevenue = ordersData.reduce(
            (total, item) => total + (item.status === "Canceled" ? 0 : parseRupiah(item.total)),
            0,
        );

        return [
            { id: "orders", icon: "cart", value: String(totalOrders), label: "Total Orders" },
            { id: "delivered", icon: "truck", value: String(totalDelivered), label: "Total Delivered" },
            { id: "canceled", icon: "ban", value: String(totalCanceled), label: "Total Canceled" },
            { id: "revenue", icon: "money", value: formatRupiah(totalRevenue), label: "Total Revenue" },
        ];
    }, [ordersData]);

    const filteredMenuItems = useMemo(() => {
        return menuItems;
    }, [menuItems]);

    const filteredDashboardCards = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        if (activeSection !== "dashboard" || !query) {
            return dashboardCards;
        }

        return dashboardCards.filter((card) =>
            card.label.toLowerCase().includes(query),
        );
    }, [activeSection, dashboardCards, searchQuery]);

    const filteredOrders = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        if (activeSection !== "orders" || !query) {
            return ordersData;
        }

        return ordersData.filter((order) =>
            [order.id, order.customer, order.item, order.status]
                .join(" ")
                .toLowerCase()
                .includes(query),
        );
    }, [activeSection, ordersData, searchQuery]);

    const filteredCustomers = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        if (activeSection !== "customers" || !query) {
            return customersData;
        }

        return customersData.filter((customer) =>
            [customer.id, customer.name, customer.email, customer.city, customer.tier]
                .join(" ")
                .toLowerCase()
                .includes(query),
        );
    }, [activeSection, customersData, searchQuery]);

    function handleSectionChange(sectionId) {
        setActiveSection(sectionId);
    }

    function handleSearchChange(event) {
        setSearchQuery(event.target.value);
    }

    function handleAddMenu() {
        const newNumber = menuItems.filter((item) => item.id.startsWith("menu-")).length + 1;

        setMenuItems((currentItems) => [
            ...currentItems,
            {
                id: `menu-${newNumber}`,
                label: `Menu ${newNumber}`,
                removable: true,
            },
        ]);
    }

    function handleAddOrder(orderPayload) {
        const newOrderId = getNextId(ordersData);
        const normalizedTotal = formatRupiah(parseRupiah(orderPayload.total));

        setOrdersData((currentOrders) => [
            {
                id: newOrderId,
                customer: orderPayload.customer.trim(),
                item: orderPayload.item.trim(),
                total: normalizedTotal,
                status: orderPayload.status,
            },
            ...currentOrders,
        ]);

        setCustomersData((currentCustomers) => {
            const targetName = orderPayload.customer.trim().toLowerCase();
            const existingCustomer = currentCustomers.find(
                (customer) => customer.name.toLowerCase() === targetName,
            );

            if (existingCustomer) {
                return currentCustomers.map((customer) =>
                    customer.name.toLowerCase() === targetName
                        ? { ...customer, totalOrder: customer.totalOrder + 1 }
                        : customer,
                );
            }

            return [
                {
                    id: getNextId(currentCustomers),
                    name: orderPayload.customer.trim(),
                    email: `${orderPayload.customer.trim().replace(/\s+/g, "").toLowerCase()}@email.com`,
                    totalOrder: 1,
                    city: "Unknown",
                    tier: "Bronze",
                },
                ...currentCustomers,
            ];
        });
    }

    function handleAddCustomer(customerPayload) {
        const newCustomerId = getNextId(customersData);

        setCustomersData((currentCustomers) => [
            {
                id: newCustomerId,
                name: customerPayload.name.trim(),
                email: customerPayload.email.trim(),
                totalOrder: Number(customerPayload.totalOrder || 0),
                city: customerPayload.city.trim(),
                tier: customerPayload.tier,
            },
            ...currentCustomers,
        ]);
    }

    function handleRemoveMenu(menuId) {
        setMenuItems((currentItems) => {
            const targetItem = currentItems.find((item) => item.id === menuId);

            if (!targetItem?.removable) {
                return currentItems;
            }

            const nextItems = currentItems.filter((item) => item.id !== menuId);

            if (activeSection === menuId) {
                const fallbackSection = nextItems[0]?.id ?? null;
                setActiveSection(fallbackSection);
            }

            return nextItems;
        });
    }

    const pageTitle =
        activeSection === "orders"
            ? "Orders"
            : activeSection === "customers"
                ? "Customers"
                : activeSection === "products"
                    ? "Products"
                    : activeSection === "components"
                        ? "Components"
                        : activeSection === "fiturxyz"
                            ? "Fitur XYZ"
                            : "Dashboard";

    const pageBreadcrumb =
        activeSection === "orders"
            ? "Home / Orders / Order List"
            : activeSection === "customers"
                ? "Home / Customers / Customer List"
                : activeSection === "products"
                    ? "Home / Products / Product List"
                    : activeSection === "components"
                        ? "Home / Components / Component List"
                        : activeSection === "fiturxyz"
                            ? "Home / Fitur XYZ / XYZ Page"
                            : "Home / Home Detail / Home Very Detail";

    const isDashboardEmpty = filteredDashboardCards.length === 0;
    const isOrdersEmpty = filteredOrders.length === 0;
    const isCustomersEmpty = filteredCustomers.length === 0;

    if (isAuthPage) {
        return (
            <Suspense fallback={<div className="p-4 text-sm text-gray-500">Loading app...</div>}>
                <Routes>
                    <Route element={<AuthLayout />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot" element={<Forgot />} />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        );
    }

    return (
        <Suspense fallback={<Loading />}>
            <MainLayout
                activeSection={activeSection}
                menuItems={filteredMenuItems}
                onMenuClick={handleSectionChange}
                onAddMenu={handleAddMenu}
                onRemoveMenu={handleRemoveMenu}
                searchValue={searchQuery}
                onSearchChange={handleSearchChange}
                pageTitle={pageTitle}
                pageBreadcrumb={pageBreadcrumb}
            >
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Dashboard
                                activeSection={activeSection}
                                cards={filteredDashboardCards}
                                orders={filteredOrders}
                                customers={filteredCustomers}
                                onAddOrder={handleAddOrder}
                                onAddCustomer={handleAddCustomer}
                                searchQuery={searchQuery}
                                isEmpty={isDashboardEmpty}
                                isOrdersEmpty={isOrdersEmpty}
                                isCustomersEmpty={isCustomersEmpty}
                            />
                        }
                    />

                    <Route
                        path="/orders"
                        element={
                            <Orders
                                orders={filteredOrders}
                                onAddOrder={handleAddOrder}
                                isEmpty={isOrdersEmpty}
                            />
                        }
                    />

                    <Route
                        path="/customers"
                        element={
                            <Customers
                                customers={filteredCustomers}
                                onAddCustomer={handleAddCustomer}
                                isEmpty={isCustomersEmpty}
                            />
                        }
                    />

                    <Route
                        path="/products/:id"
                        element={<ProductDetail />}
                    />

                    <Route
                        path="/products"
                        element={<Products isEmpty={false} />}
                    />

                    <Route
                        path="/components"
                        element={<Components />}
                    />

                    <Route
                        path="/fiturxyz"
                        element={<FiturXyz />}
                    />

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </MainLayout>
        </Suspense>
    );
}
