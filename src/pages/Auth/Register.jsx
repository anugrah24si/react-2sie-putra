import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";
import { BsFillExclamationDiamondFill } from "react-icons/bs";
import { ImSpinner2 } from "react-icons/im";

export default function Register() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [dataForm, setDataForm] = useState({
        full_name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setDataForm({ ...dataForm, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Validations
        if (!dataForm.full_name.trim()) {
            setError("Full name is required");
            return;
        }
        if (!dataForm.email.trim()) {
            setError("Email is required");
            return;
        }
        if (dataForm.password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }
        if (dataForm.password !== dataForm.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const { error: authError } = await supabase.auth.signUp({
                email: dataForm.email,
                password: dataForm.password,
                options: {
                    data: {
                        full_name: dataForm.full_name.trim(),
                    },
                },
            });

            if (authError) {
                setError(authError.message);
                return;
            }

            setSuccess("Registration successful! Please check your email to verify your account, then login.");
            setDataForm({ full_name: "", email: "", password: "", confirmPassword: "" });

            // Redirect to login after 3 seconds
            setTimeout(() => navigate("/login"), 3000);
        } catch (err) {
            setError(err.message || "An unknown error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
                Create Your Account
            </h2>

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
                    <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                    </label>
                    <input
                        type="text"
                        id="full_name"
                        name="full_name"
                        value={dataForm.full_name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400"
                        placeholder="Your full name"
                    />
                </div>

                <div className="mb-5">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={dataForm.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400"
                        placeholder="you@example.com"
                    />
                </div>

                <div className="mb-5">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={dataForm.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400"
                        placeholder="********"
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={dataForm.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400"
                        placeholder="********"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                >
                    {loading ? "Loading..." : "Register"}
                </button>
            </form>

            <div className="mt-4 text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link to="/login" className="text-green-500 hover:underline">Login</Link>
            </div>
        </div>
    );
}
