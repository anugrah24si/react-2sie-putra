import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { productsAPI } from "../../services/productsAPI";

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProduct();
    }, [id]);

    async function loadProduct() {
        try {
            setLoading(true);
            const data = await productsAPI.fetchProductById(id);
            setProduct(data);
        } catch (err) {
            setError(`Product not found`);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete() {
        if (!window.confirm("Delete this product?")) return;
        try {
            await productsAPI.deleteProduct(id);
            navigate("/products");
        } catch (err) {
            setError(err.message);
        }
    }

    const formatRupiah = (amount) => {
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
    };

    const getStockStatus = (stock) => {
        if (stock > 50) return { label: "Stock Melimpah", color: "text-green-600", bg: "border-green-500" };
        if (stock > 20) return { label: "Stock Tersedia", color: "text-blue-600", bg: "border-blue-500" };
        if (stock > 0) return { label: "Stock Terbatas", color: "text-yellow-600", bg: "border-yellow-500" };
        return { label: "Stok Habis", color: "text-red-600", bg: "border-red-500" };
    };

    if (loading) {
        return (
            <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                <p className="text-gray-500">Loading product...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <button onClick={() => navigate("/products")} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                    Back to Products
                </button>
            </div>
        );
    }

    if (!product) return null;

    const stockStatus = getStockStatus(product.stock);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button onClick={() => navigate("/products")} className="text-sm text-gray-500 hover:text-gray-700">
                    &larr; Back to Products
                </button>
                <div className="flex gap-2">
                    <button onClick={handleDelete} className="text-sm bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100">
                        Delete
                    </button>
                </div>
            </div>

            {/* Product Detail Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left: Main Info */}
                    <div className="md:col-span-2 space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">{product.title}</h1>
                            <p className="text-sm text-gray-400 mt-1 font-mono">{product.code}</p>
                        </div>

                        {product.description && (
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-semibold">Description</label>
                                <p className="mt-1 text-gray-700">{product.description}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-semibold">Category</label>
                                <p className="mt-1">
                                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm">{product.category}</span>
                                </p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-semibold">Brand</label>
                                <p className="mt-1 font-medium">{product.brand || "-"}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-semibold">Price</label>
                                <p className="mt-1 text-2xl font-bold text-green-600">{formatRupiah(product.price)}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-semibold">Created</label>
                                <p className="mt-1 text-sm text-gray-600">
                                    {new Date(product.created_at).toLocaleDateString("id-ID", {
                                        day: "numeric", month: "long", year: "numeric"
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Stock Card */}
                    <div className="space-y-4">
                        <div className={`p-5 rounded-xl border-2 ${stockStatus.bg}`}>
                            <p className="text-xs text-gray-500 uppercase">Stock Status</p>
                            <p className={`text-2xl font-bold mt-2 ${stockStatus.color}`}>
                                {product.stock} Items
                            </p>
                            <p className="text-sm text-gray-500 mt-1">{stockStatus.label}</p>
                        </div>

                        <div className="p-5 rounded-xl bg-gray-50">
                            <p className="text-xs text-gray-500 uppercase">Product ID</p>
                            <p className="text-xs font-mono mt-2 break-all text-gray-600">{product.id}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
