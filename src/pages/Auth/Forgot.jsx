import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";
import { BsFillExclamationDiamondFill } from "react-icons/bs";
import { ImSpinner2 } from "react-icons/im";

export default function Forgot() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [email, setEmail] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!email.trim()) {
            setError("Please enter your email address");
            return;
        }

        setLoading(true);

        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin + "/login",
            });

            if (resetError) {
                setError(resetError.message);
                return;
            }

            setSuccess("Password reset link sent! Please check your email.");
            setEmail("");
        } catch (err) {
            setError(err.message || "An unknown error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2 text-center">
                Forgot Your Password?
            </h2>

            <p className="text-sm text-gray-500 mb-6 text-center">
                Enter your email address and we'll send you a link to reset your password.
            </p>

            {error && (
                <div className="bg-red-200 mb-5 p-5 text-sm font-light text-gray-600 rounded flex items-center">
                    <BsFillExclamationDiamondFill className="text-red-600 me-2 text-lg" />
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-200 mb-5 p-5 text-sm font-light text-gray-700 rounded">
                    {success}
                </div>
            )}

            {loading && (
                <div className="bg-gray-200 mb-5 p-5 text-sm rounded flex items-center">
                    <ImSpinner2 className="me-2 animate-spin" />
                    Mohon Tunggu...
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-5">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400"
                        placeholder="you@example.com"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                >
                    {loading ? "Loading..." : "Send Reset Link"}
                </button>
            </form>

            <div className="mt-4 text-center text-sm text-gray-500">
                Remember your password?{" "}
                <Link to="/login" className="text-green-500 hover:underline">Login</Link>
            </div>
        </div>
    );
}
