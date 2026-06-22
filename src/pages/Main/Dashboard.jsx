import { useState, useEffect } from "react";
import { FaShoppingCart, FaTruck, FaBan, FaDollarSign, FaUsers, FaBoxOpen } from "react-icons/fa";
import { dashboardAPI } from "../../services/dashboardAPI";

function StatCard({ icon: Icon, value, label, color }) {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="text-white text-xl" />
            </div>
            <div>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
                <p className="text-sm text-gray-500">{label}</p>
            </div>
        </div>
    );
}

export default function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadDashboard();
    }, []);

    async function loadDashboard() {
        try {
            const result = await dashboardAPI.fetchAdminDashboard();
            setData(result);
        } catch (err) {
            setError("Failed to load dashboard data");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const formatRupiah = (amount) => {
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
    };

    function getStatusColor(status) {
        if (status === "Completed") return "bg-green-100 text-green-700";
        if (status === "Processing") return "bg-blue-100 text-blue-700";
        if (status === "Cancelled") return "bg-red-100 text-red-700";
        return "bg-yellow-100 text-yellow-700";
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

    if (!data) return null;

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={FaUsers} value={data.totalCustomers} label="Total Customers" color="bg-blue-500" />
                <StatCard icon={FaBoxOpen} value={data.totalProducts} label="Total Products" color="bg-purple-500" />
                <StatCard icon={FaShoppingCart} value={data.totalOrders} label="Total Orders" color="bg-orange-500" />
                <StatCard icon={FaDollarSign} value={formatRupiah(data.totalRevenue)} label="Total Revenue" color="bg-green-500" />
            </div>

            {/* Members per Tier */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Members per Tier</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(data.membersPerTier).map(([tier, count]) => (
                        <div key={tier} className="text-center p-4 bg-gray-50 rounded-lg">
                            <p className="text-2xl font-bold text-gray-800">{count}</p>
                            <p className="text-sm text-gray-500">{tier}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Recent Orders</h3>
                {data.recentOrders.length === 0 ? (
                    <p className="text-gray-500 text-sm">No orders yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2 px-3">Date</th>
                                    <th className="text-left py-2 px-3">Customer</th>
                                    <th className="text-left py-2 px-3">Total</th>
                                    <th className="text-left py-2 px-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.recentOrders.map((order) => (
                                    <tr key={order.id} className="border-b hover:bg-gray-50">
                                        <td className="py-2 px-3">
                                            {new Date(order.created_at).toLocaleDateString("id-ID")}
                                        </td>
                                        <td className="py-2 px-3">
                                            {order.profiles?.full_name || "Unknown"}
                                        </td>
                                        <td className="py-2 px-3 font-medium">
                                            {formatRupiah(order.final_amount)}
                                        </td>
                                        <td className="py-2 px-3">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
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
