import { useState, useEffect } from "react";
import { ordersAPI } from "../../services/ordersAPI";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [expandedOrder, setExpandedOrder] = useState(null);

    useEffect(() => { loadOrders(); }, []);

    async function loadOrders() {
        try {
            setLoading(true);
            const data = await ordersAPI.fetchOrders();
            setOrders(data);
        } catch (err) {
            setError("Failed to load orders");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function handleStatusChange(orderId, newStatus) {
        if (!window.confirm(`Change status to "${newStatus}"?`)) return;
        try {
            setError("");
            await ordersAPI.updateOrderStatus(orderId, newStatus);
            setSuccess(`Order status updated to ${newStatus}!`);
            await loadOrders();
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError(err.message || "Failed to update status");
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

    function getNextStatuses(currentStatus) {
        switch (currentStatus) {
            case "Pending": return ["Processing", "Cancelled"];
            case "Processing": return ["Completed", "Cancelled"];
            default: return [];
        }
    }

    if (loading && orders.length === 0) {
        return (
            <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                <p className="text-gray-500">Loading orders...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
            {success && <div className="p-4 bg-green-100 text-green-700 rounded-lg text-sm">{success}</div>}

            <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-700 mb-4">All Orders ({orders.length})</h3>

                {orders.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No orders found</p>
                ) : (
                    <div className="space-y-3">
                        {orders.map((order) => (
                            <div key={order.id} className="border rounded-xl overflow-hidden">
                                {/* Order row */}
                                <div
                                    className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <p className="font-medium text-gray-800">
                                                    {order.profiles?.full_name || "Unknown"}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    {new Date(order.created_at).toLocaleDateString("id-ID", {
                                                        day: "numeric", month: "short", year: "numeric",
                                                        hour: "2-digit", minute: "2-digit"
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <p className="font-bold text-green-600">
                                                {formatRupiah(order.final_amount)}
                                            </p>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded details */}
                                {expandedOrder === order.id && (
                                    <div className="border-t px-4 py-4 bg-gray-50">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Order Items */}
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium mb-2">Order Items:</p>
                                                <div className="space-y-1">
                                                    {order.order_items?.map((item) => (
                                                        <div key={item.id} className="flex justify-between text-sm">
                                                            <span>{item.products?.title || "Product"} x{item.quantity}</span>
                                                            <span>{formatRupiah(item.subtotal)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="border-t mt-2 pt-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span>Subtotal</span>
                                                        <span>{formatRupiah(order.total_amount)}</span>
                                                    </div>
                                                    {order.discount_amount > 0 && (
                                                        <div className="flex justify-between text-green-600">
                                                            <span>Discount ({order.discount_percentage}%)</span>
                                                            <span>-{formatRupiah(order.discount_amount)}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex justify-between font-bold">
                                                        <span>Final</span>
                                                        <span>{formatRupiah(order.final_amount)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Status Actions */}
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium mb-2">Actions:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {getNextStatuses(order.status).map((status) => (
                                                        <button
                                                            key={status}
                                                            onClick={(e) => { e.stopPropagation(); handleStatusChange(order.id, status); }}
                                                            className={`text-xs px-3 py-2 rounded-lg font-medium transition-colors ${
                                                                status === "Completed" ? "bg-green-500 text-white hover:bg-green-600" :
                                                                status === "Processing" ? "bg-blue-500 text-white hover:bg-blue-600" :
                                                                "bg-red-500 text-white hover:bg-red-600"
                                                            }`}
                                                        >
                                                            Mark as {status}
                                                        </button>
                                                    ))}
                                                </div>
                                                {order.points_earned > 0 && (
                                                    <p className="text-xs text-green-500 mt-3">Points earned: +{order.points_earned}</p>
                                                )}
                                                <p className="text-xs text-gray-400 mt-2">ID: {order.id}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
