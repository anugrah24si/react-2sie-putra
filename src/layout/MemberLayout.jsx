import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../services/AuthContext";
import { FaThLarge, FaBoxOpen, FaClipboardList, FaUser, FaSignOutAlt } from "react-icons/fa";

const MEMBER_MENU = [
    { id: "dashboard", label: "Dashboard", path: "/member", icon: FaThLarge },
    { id: "products", label: "Browse Products", path: "/member/products", icon: FaBoxOpen },
    { id: "orders", label: "My Orders", path: "/member/orders", icon: FaClipboardList },
    { id: "profile", label: "My Profile", path: "/member/profile", icon: FaUser },
];

export default function MemberLayout() {
    const { profile, signOut } = useAuth();
    const location = useLocation();

    function isActive(path) {
        if (path === "/member") return location.pathname === "/member";
        return location.pathname.startsWith(path);
    }

    return (
        <div className="min-h-screen w-full bg-gray-50 font-poppins text-gray-800">
            <div className="flex min-h-screen w-full flex-col lg:flex-row">
                {/* Sidebar */}
                <div className="w-full lg:w-64 bg-white shadow-lg flex flex-col">
                    <div className="p-6 border-b">
                        <h1 className="text-2xl font-bold">
                            Gacor <span className="text-green-500">.</span>
                        </h1>
                        <span className="text-xs text-gray-500">Member Panel</span>
                    </div>

                    <nav className="flex-1 p-4">
                        <ul className="space-y-2">
                            {MEMBER_MENU.map((item) => (
                                <li key={item.id}>
                                    <Link
                                        to={item.path}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                            isActive(item.path)
                                                ? "bg-green-50 text-green-600 font-semibold"
                                                : "text-gray-600 hover:bg-gray-100"
                                        }`}
                                    >
                                        <item.icon className="text-lg" />
                                        <span>{item.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="p-4 border-t">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">
                                {profile?.full_name?.charAt(0)?.toUpperCase() || "M"}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{profile?.full_name || "Member"}</p>
                                <p className="text-xs text-gray-500 truncate">{profile?.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={signOut}
                            className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 transition-colors w-full px-4 py-2 rounded-lg hover:bg-red-50"
                        >
                            <FaSignOutAlt />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <main className="flex-1 p-4 md:p-6 xl:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
