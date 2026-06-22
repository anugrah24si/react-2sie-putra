import { FaBell, FaSearch, FaSignOutAlt } from "react-icons/fa";
import { FcAreaChart } from "react-icons/fc";
import { SlSettings } from "react-icons/sl";
import { useAuth } from "../services/AuthContext";

export default function Header() {
    const { profile, signOut } = useAuth();

    return (
        <div id="header-container">
            {/* Search Bar */}
            <div id="search-bar">
                <input
                    id="search-input"
                    type="text"
                    placeholder="Search Here..."
                    aria-label="Search"
                />
                <FaSearch id="search-icon" />
            </div>

            {/* Icon & Profile Section */}
            <div id="icons-container">
                {/* Icons */}
                <div id="notification-icon">
                    <FaBell />
                </div>
                <div id="chart-icon">
                    <FcAreaChart />
                </div>
                <div id="settings-icon">
                    <SlSettings />
                </div>

                {/* Profile Section */}
                <div id="profile-container">
                    <span id="profile-text">
                        {profile?.full_name || "User"}
                    </span>
                    <img
                        id="profile-avatar"
                        src="/img/Gacor77.png"
                        className="w-10 h-10 rounded-full"
                        alt="Profile avatar"
                    />
                </div>

                {/* Logout Button */}
                <button
                    onClick={signOut}
                    className="ml-3 text-red-400 hover:text-red-600 transition-colors"
                    title="Logout"
                >
                    <FaSignOutAlt />
                </button>
            </div>
        </div>
    );
}
