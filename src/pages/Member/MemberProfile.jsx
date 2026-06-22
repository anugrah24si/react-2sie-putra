import { useState, useEffect } from "react";
import { useAuth } from "../../services/AuthContext";
import { profilesAPI } from "../../services/profilesAPI";
import { supabase } from "../../services/supabaseClient";

export default function MemberProfile() {
    const { user, profile, refreshProfile } = useAuth();
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [formData, setFormData] = useState({
        full_name: "",
        phone: "",
        city: "",
    });
    const [pointsHistory, setPointsHistory] = useState([]);
    const [loadingPoints, setLoadingPoints] = useState(true);

    useEffect(() => {
        if (profile) {
            setFormData({
                full_name: profile.full_name || "",
                phone: profile.phone || "",
                city: profile.city || "",
            });
        }
        loadPointsHistory();
    }, [profile]);

    async function loadPointsHistory() {
        if (!user) return;
        try {
            const { data } = await supabase
                .from("points_transactions")
                .select("*")
                .eq("member_id", user.id)
                .order("created_at", { ascending: false })
                .limit(20);
            setPointsHistory(data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingPoints(false);
        }
    }

    async function handleSave() {
        if (!formData.full_name.trim()) {
            setError("Full name is required");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            await profilesAPI.updateProfile(user.id, {
                full_name: formData.full_name.trim(),
                phone: formData.phone.trim(),
                city: formData.city.trim(),
            });
            setSuccess("Profile updated successfully!");
            setEditing(false);
            await refreshProfile();
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError(err.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    }

    if (!profile) {
        return (
            <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>

            {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
            {success && <div className="p-4 bg-green-100 text-green-700 rounded-lg text-sm">{success}</div>}

            {/* Profile Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-semibold text-gray-700">Personal Information</h2>
                    {!editing ? (
                        <button
                            onClick={() => setEditing(true)}
                            className="text-sm bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                        >
                            Edit
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="text-sm bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
                            >
                                {loading ? "Saving..." : "Save"}
                            </button>
                            <button
                                onClick={() => { setEditing(false); setError(""); }}
                                className="text-sm bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs text-gray-500 uppercase">Full Name</label>
                        {editing ? (
                            <input
                                type="text"
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                className="w-full mt-1 p-2 border rounded-lg"
                            />
                        ) : (
                            <p className="mt-1 font-medium">{profile.full_name}</p>
                        )}
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 uppercase">Email</label>
                        <p className="mt-1 font-medium text-gray-600">{profile.email}</p>
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 uppercase">Phone</label>
                        {editing ? (
                            <input
                                type="text"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full mt-1 p-2 border rounded-lg"
                            />
                        ) : (
                            <p className="mt-1 font-medium">{profile.phone || "-"}</p>
                        )}
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 uppercase">City</label>
                        {editing ? (
                            <input
                                type="text"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                className="w-full mt-1 p-2 border rounded-lg"
                            />
                        ) : (
                            <p className="mt-1 font-medium">{profile.city || "-"}</p>
                        )}
                    </div>
                </div>

                {/* Read-only membership info */}
                <div className="mt-6 pt-6 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="text-xs text-gray-500 uppercase">Role</label>
                        <p className="mt-1 font-medium capitalize">{profile.role}</p>
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 uppercase">Tier</label>
                        <p className="mt-1 font-medium text-yellow-600">{profile.tier}</p>
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 uppercase">Total Points</label>
                        <p className="mt-1 font-medium text-green-600">{profile.accumulated_points}</p>
                    </div>
                </div>
            </div>

            {/* Points History */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="font-semibold text-gray-700 mb-4">Points History</h2>

                {loadingPoints ? (
                    <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
                    </div>
                ) : pointsHistory.length === 0 ? (
                    <p className="text-sm text-gray-500">No points transactions yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2 px-3">Date</th>
                                    <th className="text-left py-2 px-3">Type</th>
                                    <th className="text-left py-2 px-3">Points</th>
                                    <th className="text-left py-2 px-3">Status</th>
                                    <th className="text-left py-2 px-3">Reason</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pointsHistory.map((tx) => (
                                    <tr key={tx.id} className="border-b">
                                        <td className="py-2 px-3">
                                            {new Date(tx.created_at).toLocaleDateString("id-ID")}
                                        </td>
                                        <td className="py-2 px-3 capitalize">{tx.type}</td>
                                        <td className={`py-2 px-3 font-medium ${tx.type === "earned" ? "text-green-600" : "text-red-600"}`}>
                                            {tx.type === "earned" ? "+" : "-"}{tx.points_amount}
                                        </td>
                                        <td className="py-2 px-3">
                                            <span className={`px-2 py-1 rounded text-xs ${
                                                tx.status === "completed" ? "bg-green-100 text-green-700" :
                                                tx.status === "canceled" ? "bg-red-100 text-red-700" :
                                                "bg-yellow-100 text-yellow-700"
                                            }`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                        <td className="py-2 px-3 text-gray-500 text-xs truncate max-w-[200px]">
                                            {tx.reason || "-"}
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
