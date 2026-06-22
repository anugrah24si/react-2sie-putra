import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../services/AuthContext";
import { productsAPI } from "../../services/productsAPI";
import { ordersAPI } from "../../services/ordersAPI";
import { supabase } from "../../services/supabaseClient";

export default function CreateOrder() {
    const { user, profile } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [discount, setDiscount] = useState(0);

    useEffect(() => {
        loadProducts();
        loadDiscount();
    }, []);

    async function loadProducts() {
        try {
            const data = await productsAPI.fetchProducts();
            setProducts(data.filter((p) => p.stock > 0));
        } catch (err) {
            setError("Failed to load products");
        } finally {
            setLoading(false);
        }
    }

    async function loadDiscount() {
        if (!profile) return;
        const { data } = await supabase
            .from("tier_config")
            .select("discount_percentage")
            .eq("tier_name", profile.tier)
            .single();
        if (data) setDiscount(data.discount_percentage);
    }

    function addToCart(product) {
        const existing = cart.find((item) => item.product_id === product.id);
        if (existing) {
            if (existing.quantity >= product.stock) {
                setError(`Maximum stock for ${product.title} is ${product.stock}`);
                setTimeout(() => setError(""), 3000);
                return;
            }
            setCart(cart.map((item) =>
                item.product_id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, {
                product_id: product.id,
                title: product.title,
                price: Number(product.price),
                quantity: 1,
                stock: product.stock,
            }]);
        }
    }

    function updateQuantity(productId, newQty) {
        if (newQty <= 0) {
            setCart(cart.filter((item) => item.product_id !== productId));
            return;
        }
        const item = cart.find((i) => i.product_id === productId);
        if (item && newQty > item.stock) {
            setError(`Maximum stock is ${item.stock}`);
            setTimeout(() => setError(""), 3000);
            return;
        }
        setCart(cart.map((item) =>
            item.product_id === productId
                ? { ...item, quantity: newQty }
                : item
        ));
    }

    function removeFromCart(productId) {
        setCart(cart.filter((item) => item.product_id !== productId));
    }

    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discountAmount = Math.floor(totalAmount * discount / 100);
    const finalAmount = totalAmount - discountAmount;

    async function handleSubmit() {
        if (cart.length === 0) {
            setError("Please add at least one product to your order");
            return;
        }

        setSubmitting(true);
        setError("");

        try {
            await ordersAPI.createOrder(user.id, cart, discount);
            setSuccess("Order created successfully!");
            setCart([]);
            setTimeout(() => navigate("/member/orders"), 2000);
        } catch (err) {
            setError(err.message || "Failed to create order");
        } finally {
            setSubmitting(false);
        }
    }

    const formatRupiah = (amount) => {
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
    };

    if (loading) {
        return (
            <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Create New Order</h1>

            {error && (
                <div className="p-4 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>
            )}
            {success && (
                <div className="p-4 bg-green-100 text-green-700 rounded-lg text-sm">{success}</div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Product Selection */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="font-semibold text-gray-700">Select Products</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {products.map((product) => (
                            <div key={product.id} className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-sm">{product.title}</p>
                                    <p className="text-xs text-gray-500">{formatRupiah(product.price)} | Stock: {product.stock}</p>
                                </div>
                                <button
                                    onClick={() => addToCart(product)}
                                    className="bg-green-500 text-white text-xs px-3 py-1 rounded hover:bg-green-600 transition-colors"
                                >
                                    + Add
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Cart Summary */}
                <div className="bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-4">
                    <h2 className="font-semibold text-gray-700 mb-4">Order Summary</h2>

                    {cart.length === 0 ? (
                        <p className="text-sm text-gray-400">No items in cart</p>
                    ) : (
                        <div className="space-y-3">
                            {cart.map((item) => (
                                <div key={item.product_id} className="flex items-center justify-between text-sm border-b pb-2">
                                    <div className="flex-1">
                                        <p className="font-medium">{item.title}</p>
                                        <p className="text-xs text-gray-500">{formatRupiah(item.price)} x {item.quantity}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => updateQuantity(item.product_id, item.quantity - 1)} className="w-6 h-6 bg-gray-200 rounded text-xs">-</button>
                                        <span className="text-sm font-medium">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.product_id, item.quantity + 1)} className="w-6 h-6 bg-gray-200 rounded text-xs">+</button>
                                        <button onClick={() => removeFromCart(item.product_id)} className="text-red-500 text-xs ml-2">X</button>
                                    </div>
                                </div>
                            ))}

                            <div className="pt-3 space-y-1 text-sm">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>{formatRupiah(totalAmount)}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount ({discount}% - {profile?.tier})</span>
                                        <span>-{formatRupiah(discountAmount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                                    <span>Total</span>
                                    <span className="text-green-600">{formatRupiah(finalAmount)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
                            >
                                {submitting ? "Processing..." : "Place Order"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
