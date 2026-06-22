import { useState, useEffect } from "react";
import { profilesAPI } from "../../services/profilesAPI";

export default function Customers() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        full_name: "", email: "", phone: "", city: "", tier: "Bronze"
    });

    useEffect(() => { loadCustomers(); }, []);

    async function loadCustomers() {
        try {
            setLoading(true);
            const data = await profilesAPI.fetchMembers();
            setCustomers(data);
        } catch (err) {
            setError("Failed to load customers");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    function resetForm() {
        setFormData({ full_name: "", email: "", phone: "", city: "", tier: "Bronze" });
        setShowForm(false);
        setEditingId(null);
    }

    function startEdit(customer) {
        setFormData({
            full_name: customer.full_name || "",
            email: customer.email || "",
            phone: customer.phone || "",
            city: customer.city || "",
            tier: customer.tier || "Bronze",
        });
        setEditingId(customer.id);
        setShowForm(true);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!formData.full_name.trim()) { setError("Name is required"); return; }
        if (!formData.email.trim()) { setError("Email is required"); return; }

        try {
            setLoading(true);
            if (editingId) {
                await profilesAPI.updateProfile(editingId, {
                    full_name: formData.full_name.trim(),
                    phone: formData.phone.trim(),
                    city: formData.city.trim(),
                    tier: formData.tier,
                });
                setSuccess("Customer updated successfully!");
            }
            resetForm();
            await loadCustomers();
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError(err.message || "Operation failed");
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id) {
        if (!window.confirm("Are you sure you want to delete this customer?")) return;
        try {
            setLoading(true);
            await profilesAPI.deleteProfile(id);
            setSuccess("Customer deleted!");
            await loadCustomers();
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError(err.message || "Delete failed");
        } finally {
            setLoading(false);
        }
    }

    function getTierClass(tier) {
        if (tier === "Platinum") return "bg-purple-100 text-purple-700";
        if (tier === "Gold") return "bg-yellow-100 text-yellow-700";
        if (tier === "Silver") return "bg-gray-200 text-gray-700";
        return "bg-orange-100 text-orange-700";
    }

    if (loading && customers.length === 0) {
        return (
            <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                <p className="text-gray-500">Loading customers...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
            {success && <div className="p-4 bg-green-100 text-green-700 rounded-lg text-sm">{success}</div>}

            {/* Edit Form */}
            {showForm && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="font-semibold text-gray-700 mb-4">
                        {editingId ? "Edit Customer" : "Add Customer"}
                    </h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text" placeholder="Full Name *"
                            value={formData.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            className="p-3 border rounded-lg"
                            required
                        />
                        <input
                            type="email" placeholder="Email *"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="p-3 border rounded-lg"
                            disabled={!!editingId}
                            required
                        />
                        <input
                            type="text" placeholder="Phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="p-3 border rounded-lg"
                        />
                        <input
                            type="text" placeholder="City"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            className="p-3 border rounded-lg"
                        />
                        <select
                            value={formData.tier}
                            onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                            className="p-3 border rounded-lg"
                        >
                            <option value="Bronze">Bronze</option>
                            <option value="Silver">Silver</option>
                            <option value="Gold">Gold</option>
                            <option value="Platinum">Platinum</option>
                        </select>
                        <div className="flex gap-2">
                            <button type="submit" className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600">
                                {editingId ? "Update" : "Add"}
                            </button>
                            <button type="button" onClick={resetForm} className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Customer Grid */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-700">Customers ({customers.length})</h3>
                </div>

                {customers.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No customers found</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {customers.map((customer) => (
                            <div key={customer.id} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="font-semibold text-gray-800">{customer.full_name}</p>
                                        <p className="text-sm text-gray-500">{customer.email}</p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded font-medium ${getTierClass(customer.tier)}`}>
                                        {customer.tier}
                                    </span>
                                </div>
                                <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
                                    <span>{customer.city || "No city"}</span>
                                    <span>{customer.accumulated_points || 0} pts</span>
                                </div>
                                <div className="mt-3 flex gap-2">
                                    <button onClick={() => startEdit(customer)} className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(customer.id)} className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded hover:bg-red-100">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
