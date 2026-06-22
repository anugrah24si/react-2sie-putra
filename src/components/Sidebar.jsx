import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../services/AuthContext";
import { FaHeadphonesAlt, FaList, FaPlus, FaThLarge, FaTrashAlt, FaCubes, FaStickyNote, FaBoxOpen } from "react-icons/fa";

// Admin menu items
const ADMIN_MENU = [
    { id: "dashboard", label: "Dashboard", path: "/dashboard", icon: FaThLarge },
    { id: "orders", label: "Orders", path: "/orders", icon: FaList },
    { id: "customers", label: "Customers", path: "/customers", icon: FaHeadphonesAlt },
    { id: "products", label: "Products", path: "/products", icon: FaBoxOpen },
    { id: "notes", label: "Notes", path: "/notes", icon: FaStickyNote },
    { id: "components", label: "Components", path: "/components", icon: FaCubes },
    { id: "fiturxyz", label: "Fitur XYZ", path: "/fiturxyz", icon: FaPlus },
];

export default function Sidebar() {
    const { profile } = useAuth();
    const location = useLocation();

    const menuItems = ADMIN_MENU;

    function isActive(path) {
        if (path === "/dashboard") return location.pathname === "/dashboard" || location.pathname === "/";
        return location.pathname.startsWith(path);
    }

    return (
        <div id="sidebar">
            {/* Logo Section */}
            <div id="sidebar-logo">
                <span id="logo-title">
                    Gacor <b id="logo-dot">.</b>
                </span>
                <span id="logo-subtitle">Dashboard Admin Gacor</span>
            </div>

            {/* Menu List Section */}
            <div id="sidebar-menu">
                <ul id="menu-list">
                    {menuItems.map((item) => (
                        <li key={item.id}>
                            <Link
                                to={item.path}
                                className="sidebar-menu-row"
                                data-active={isActive(item.path) ? "true" : "false"}
                            >
                                <span className="sidebar-menu-button">
                                    <item.icon />
                                    <span>{item.label}</span>
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Footer Section */}
            <div id="sidebar-footer">
                <div id="footer-card">
                    <div id="footer-text">
                        <span>{profile?.full_name || "Admin"}</span>
                        <span style={{ fontSize: "10px", opacity: 0.7 }}>{profile?.role}</span>
                    </div>
                    <img id="footer-avatar" src="/img/Gacor77.png" alt="Footer avatar" />
                </div>
                <span id="footer-brand">Gacor Restaurant Admin Dashboard</span>
            </div>
        </div>
    );
}
