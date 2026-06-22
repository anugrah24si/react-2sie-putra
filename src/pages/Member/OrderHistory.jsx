import { useState, useEffect } from "react";
import { useAuth } from "../../services/AuthContext";
import { ordersAPI } from "../../services/ordersAPI";

export default function OrderHistory() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [expandedOrder, setExpandedOrder] = useState(null);

    useEffect(() => {
        loadOrders();
    }, [user]);

    async function loadOrders() {
        if (!user) return;
        try {
            setLoading(true);
            const data = await ordersAPI.fetchMemberOrders(user.id);
            setOrders(data);
        } catch (err) {
            setError("Failed to load orders");
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
                <p className="text-gray-500">Loading orders...</p>
            </div>
        );
    }

    if (error) {
        return <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>

            {orders.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center text-gray-500">
                    <p>No orders yet. Start shopping!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            {/* Order Header */}
                            <div
                                className="p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-gray-400">
                                            {new Date(order.created_at).toLocaleDateString("id-ID", {
                                                day: "numeric", month: "long", year: "numeric",
                                                hour: "2-digit", minute: "2-digit",
                                            })}
                                        </p>
                                        <p className="font-medium text-gray-800 mt-1">
                                            {order.order_items?.length || 0} items
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                        <p className="font-bold text-green-600 mt-2">
                                            {formatRupiah(order.final_amount)}
                                        </p>
                                    </div>
                                </div>
                                {order.points_earned > 0 && (
                                    <p className="text-xs text-green-500 mt-2">+{order.points_earned} points earned</p>
                                )}
                            </div>

                            {/* Expanded Order Details */}
                            {expandedOrder === order.id && (
                                <div className="border-t px-5 py-4 bg-gray-50">
                                    <p className="text-xs text-gray-500 mb-2 font-medium">Order Items:</p>
                                    <div className="space-y-2">
                                        {order.order_items?.map((item) => (
                                            <div key={item.id} className="flex justify-between text-sm">
                                                <span>{item.products?.title || "Product"} x{item.quantity}</span>
                                                <span className="font-medium">{formatRupiah(item.subtotal)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="border-t mt-3 pt-3 space-y-1 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Subtotal</span>
                                            <span>{formatRupiah(order.total_amount)}</span>
                                        </div>
                                        {order.discount_amount > 0 && (
                                            <div className="flex justify-between text-green-600">
                                                <span>Discount ({order.discount_percentage}%)</span>
                                                <span>-{formatRupiah(order.discount_amount)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between font-bold">
                                            <span>Total</span>
                                            <span>{formatRupiah(order.final_amount)}</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-3">
                                        Order ID: {order.id}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
