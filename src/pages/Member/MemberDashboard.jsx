import { useState, useEffect } from "react";
import { useAuth } from "../../services/AuthContext";
import { dashboardAPI } from "../../services/dashboardAPI";

export default function MemberDashboard() {
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadDashboard();
    }, [user]);

    async function loadDashboard() {
        if (!user) return;
        try {
            setLoading(true);
            const result = await dashboardAPI.fetchMemberDashboard(user.id);
            setData(result);
        } catch (err) {
            setError("Failed to load dashboard data");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                <p className="text-gray-500">Loading dashboard...</p>
            </div>
        );
    }

    if (error) {
        return <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>;
    }

    if (!data || !data.profile) {
        return <div className="p-4 text-gray-500">No data available</div>;
    }

    const { profile, totalOrders, recentOrders, tierConfig } = data;

    // Find current tier config and next tier
    const currentTierConfig = tierConfig.find(t => t.tier_name === profile.tier);
    const currentTierIndex = tierConfig.findIndex(t => t.tier_name === profile.tier);
    const nextTier = tierConfig[currentTierIndex + 1] || null;
    const progressToNext = nextTier
        ? Math.min(100, Math.floor((profile.accumulated_points - currentTierConfig.min_points) / (nextTier.min_points - currentTierConfig.min_points) * 100))
        : 100;

    const formatRupiah = (amount) => {
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
    };

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Welcome, {profile.full_name}!
                </h1>
                <p className="text-gray-500 text-sm mt-1">{profile.email}</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Points Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <p className="text-sm text-gray-500 uppercase">Total Points</p>
                    <p className="text-3xl font-bold text-green-600 mt-1">{profile.accumulated_points}</p>
                </div>

                {/* Tier Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <p className="text-sm text-gray-500 uppercase">Current Tier</p>
                    <p className="text-3xl font-bold text-yellow-600 mt-1">{profile.tier}</p>
                    <p className="text-xs text-gray-400 mt-1">
                        Discount: {currentTierConfig?.discount_percentage || 0}%
                    </p>
                </div>

                {/* Orders Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <p className="text-sm text-gray-500 uppercase">Total Orders</p>
                    <p className="text-3xl font-bold text-blue-600 mt-1">{totalOrders}</p>
                </div>
            </div>

            {/* Tier Progress */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-3">Tier Progress</h3>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                    <span>{profile.tier}</span>
                    <span>{nextTier ? nextTier.tier_name : "Max Tier"}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                        className="bg-green-500 h-3 rounded-full transition-all"
                        style={{ width: `${progressToNext}%` }}
                    ></div>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                    {nextTier
                        ? `${nextTier.min_points - profile.accumulated_points} more points to reach ${nextTier.tier_name}`
                        : "You are at the highest tier!"}
                </p>
            </div>

            {/* Tier Benefits */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-3">Tier Benefits</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {tierConfig.map((tier) => (
                        <div
                            key={tier.id}
                            className={`p-3 rounded-lg border-2 text-center ${
                                tier.tier_name === profile.tier
                                    ? "border-green-500 bg-green-50"
                                    : "border-gray-200"
                            }`}
                        >
                            <p className="font-semibold text-sm">{tier.tier_name}</p>
                            <p className="text-xs text-gray-500">{tier.min_points}+ pts</p>
                            <p className="text-lg font-bold text-green-600">{tier.discount_percentage}%</p>
                            <p className="text-xs text-gray-400">discount</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-3">Recent Orders</h3>
                {recentOrders.length === 0 ? (
                    <p className="text-gray-500 text-sm">No orders yet. Start shopping!</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2 px-3">Date</th>
                                    <th className="text-left py-2 px-3">Items</th>
                                    <th className="text-left py-2 px-3">Total</th>
                                    <th className="text-left py-2 px-3">Status</th>
                                    <th className="text-left py-2 px-3">Points</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="border-b hover:bg-gray-50">
                                        <td className="py-2 px-3">
                                            {new Date(order.created_at).toLocaleDateString("id-ID")}
                                        </td>
                                        <td className="py-2 px-3">
                                            {order.order_items?.length || 0} items
                                        </td>
                                        <td className="py-2 px-3 font-medium">
                                            {formatRupiah(order.final_amount)}
                                        </td>
                                        <td className="py-2 px-3">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                order.status === "Completed" ? "bg-green-100 text-green-700" :
                                                order.status === "Processing" ? "bg-blue-100 text-blue-700" :
                                                order.status === "Cancelled" ? "bg-red-100 text-red-700" :
                                                "bg-yellow-100 text-yellow-700"
                                            }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-2 px-3 text-green-600 font-medium">
                                            +{order.points_earned || 0}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
