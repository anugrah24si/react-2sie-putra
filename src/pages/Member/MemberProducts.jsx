import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { productsAPI } from "../../services/productsAPI";

export default function MemberProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        loadProducts();
    }, []);

    async function loadProducts() {
        try {
            setLoading(true);
            const data = await productsAPI.fetchProducts();
            setProducts(data);
        } catch (err) {
            setError("Failed to load products");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const filteredProducts = searchQuery.trim() === ""
        ? products
        : products.filter((p) =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase())
        );

    const formatRupiah = (amount) => {
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
    };

    if (loading) {
        return (
            <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                <p className="text-gray-500">Loading products...</p>
            </div>
        );
    }

    if (error) {
        return <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Browse Products</h1>
                <Link
                    to="/member/orders/new"
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    Create Order
                </Link>
            </div>

            {/* Search */}
            <div>
                <input
                    type="text"
                    placeholder="Search by name or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-3 bg-white rounded-lg border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
                <div className="text-center py-10 text-gray-500">No products found</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition-shadow">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="font-semibold text-gray-800">{product.title}</h3>
                                    <p className="text-xs text-gray-400">{product.code}</p>
                                </div>
                                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded font-medium">
                                    {product.category}
                                </span>
                            </div>

                            {product.brand && (
                                <p className="text-sm text-gray-500 mb-2">Brand: {product.brand}</p>
                            )}

                            <div className="flex items-center justify-between mt-4">
                                <p className="text-lg font-bold text-green-600">
                                    {formatRupiah(product.price)}
                                </p>
                                <span className={`text-xs px-2 py-1 rounded font-medium ${
                                    product.stock > 20 ? "bg-green-100 text-green-700" :
                                    product.stock > 0 ? "bg-yellow-100 text-yellow-700" :
                                    "bg-red-100 text-red-700"
                                }`}>
                                    {product.stock > 0 ? `Stock: ${product.stock}` : "Out of Stock"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <p className="text-sm text-gray-400">
                Showing {filteredProducts.length} of {products.length} products
            </p>
        </div>
    );
}
