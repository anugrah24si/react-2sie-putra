import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { productsAPI } from "../../services/productsAPI";
import { useAuth } from "../../services/AuthContext";

export default function Products() {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: "", code: "", description: "", category: "", brand: "", price: "", stock: ""
    });

    useEffect(() => { loadProducts(); }, []);

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

    function resetForm() {
        setFormData({ title: "", code: "", description: "", category: "", brand: "", price: "", stock: "" });
        setShowForm(false);
        setEditingId(null);
    }

    function startEdit(product) {
        setFormData({
            title: product.title || "",
            code: product.code || "",
            description: product.description || "",
            category: product.category || "",
            brand: product.brand || "",
            price: String(product.price || ""),
            stock: String(product.stock || ""),
        });
        setEditingId(product.id);
        setShowForm(true);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!formData.title.trim()) { setError("Title is required"); return; }
        if (!formData.code.trim()) { setError("Code is required"); return; }
        if (!formData.category.trim()) { setError("Category is required"); return; }
        if (Number(formData.price) <= 0) { setError("Price must be greater than 0"); return; }
        if (Number(formData.stock) < 0) { setError("Stock cannot be negative"); return; }

        try {
            setLoading(true);
            const productData = {
                title: formData.title.trim(),
                code: formData.code.trim(),
                description: formData.description.trim(),
                category: formData.category.trim(),
                brand: formData.brand.trim(),
                price: Number(formData.price),
                stock: Number(formData.stock) || 0,
            };

            if (editingId) {
                await productsAPI.updateProduct(editingId, productData);
                setSuccess("Product updated!");
            } else {
                await productsAPI.createProduct(productData, user.id);
                setSuccess("Product created!");
            }
            resetForm();
            await loadProducts();
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError(err.message || "Operation failed");
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id) {
        if (!window.confirm("Delete this product?")) return;
        try {
            await productsAPI.deleteProduct(id);
            setSuccess("Product deleted!");
            await loadProducts();
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError(err.message || "Delete failed");
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

    if (loading && products.length === 0) {
        return (
            <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                <p className="text-gray-500">Loading products...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
            {success && <div className="p-4 bg-green-100 text-green-700 rounded-lg text-sm">{success}</div>}

            {/* Actions Bar */}
            <div className="flex items-center gap-4">
                <input
                    type="text"
                    placeholder="Search by name or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 p-3 bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                    onClick={() => { resetForm(); setShowForm(true); }}
                    className="bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 font-medium whitespace-nowrap"
                >
                    + Add Product
                </button>
            </div>

            {/* Add/Edit Form */}
            {showForm && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="font-semibold text-gray-700 mb-4">
                        {editingId ? "Edit Product" : "Add Product"}
                    </h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" placeholder="Title *" value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="p-3 border rounded-lg" required />
                        <input type="text" placeholder="Code *" value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                            className="p-3 border rounded-lg" required disabled={!!editingId} />
                        <input type="text" placeholder="Category *" value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="p-3 border rounded-lg" required />
                        <input type="text" placeholder="Brand" value={formData.brand}
                            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                            className="p-3 border rounded-lg" />
                        <input type="number" placeholder="Price *" value={formData.price} min="1"
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className="p-3 border rounded-lg" required />
                        <input type="number" placeholder="Stock" value={formData.stock} min="0"
                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                            className="p-3 border rounded-lg" />
                        <textarea placeholder="Description" value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="p-3 border rounded-lg md:col-span-2" rows="2" />
                        <div className="flex gap-2 md:col-span-2">
                            <button type="submit" className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600">
                                {editingId ? "Update" : "Create"}
                            </button>
                            <button type="button" onClick={resetForm} className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Products Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left py-3 px-4 font-semibold">Title</th>
                                <th className="text-left py-3 px-4 font-semibold">Code</th>
                                <th className="text-left py-3 px-4 font-semibold">Category</th>
                                <th className="text-left py-3 px-4 font-semibold">Brand</th>
                                <th className="text-left py-3 px-4 font-semibold">Price</th>
                                <th className="text-left py-3 px-4 font-semibold">Stock</th>
                                <th className="text-left py-3 px-4 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-4">
                                        <Link to={`/products/${product.id}`} className="text-green-600 hover:underline font-medium">
                                            {product.title}
                                        </Link>
                                    </td>
                                    <td className="py-3 px-4 font-mono text-xs">{product.code}</td>
                                    <td className="py-3 px-4">
                                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">{product.category}</span>
                                    </td>
                                    <td className="py-3 px-4">{product.brand || "-"}</td>
                                    <td className="py-3 px-4 font-semibold">{formatRupiah(product.price)}</td>
                                    <td className="py-3 px-4">
                                        <span className={`text-xs px-2 py-1 rounded ${product.stock > 20 ? "bg-green-100 text-green-700" : product.stock > 0 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex gap-2">
                                            <button onClick={() => startEdit(product)} className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100">Edit</button>
                                            <button onClick={() => handleDelete(product.id)} className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded hover:bg-red-100">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-4 py-3 text-sm text-gray-500">
                    Showing {filteredProducts.length} of {products.length} products
                </div>
            </div>
        </div>
    );
}
