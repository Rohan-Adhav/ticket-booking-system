import { useState } from "react";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/auth.api.js";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));

        // clear field error on change
        setError((prev) => ({
            ...prev,
            [name]: "",
            general: ""
        }));
    };

    const validate = () => {
        const newErrors = {};

        if (!form.email.trim()) {
            newErrors.email = "Email is required";
        }

        if (!form.password.trim()) {
            newErrors.password = "Password is required";
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();


        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setError(newErrors);
            return;
        }

        if (loading) return; // prevent double submit

        try {
            setLoading(true);

            const data = await login(form);

            localStorage.setItem("token", data.accessToken);
            localStorage.setItem("user", JSON.stringify(data.user));

            setForm({ email: "", password: "" });

            const role = data.user?.role;

            // role-based redirect 
            if (role === "admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }

        } catch (err) {

            console.log("ERROR SET:", err?.response?.data);

            const status = err?.response?.status;
            const message =
                err?.response?.data?.message ||
                "Login failed";

            // clean user-friendly messages
            if (status === 401) {
                setError({ general: "Invalid email or password" });
            } else {
                setError({ general: message });
            }

            console.error("LOGIN ERROR:", err); // dev only
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0b0f1a] px-4 sm:px-6 lg:px-8 relative overflow-hidden">

            {/* background glow */}
            <div className="absolute w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-purple-600 rounded-full blur-[140px] opacity-30 top-[-120px] left-[-120px]" />
            <div className="absolute w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-blue-500 rounded-full blur-[140px] opacity-30 bottom-[-140px] right-[-140px]" />

            <div className="relative w-full max-w-md sm:max-w-lg p-6 sm:p-8 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">

                <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">
                    Welcome Back
                </h2>

                <p className="text-center text-gray-300 text-sm sm:text-base mt-2">
                    Login to continue
                </p>

                {/* GLOBAL ERROR */}
                {error.general && (
                    <div className="mt-4 bg-red-500/20 border border-red-400 text-red-200 text-sm px-3 py-2 rounded-lg">
                        {error.general}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">

                    <Input
                        label="Email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="johndoe@gmail.com"
                        autoComplete="email"
                        error={error.email}
                    />

                    <Input
                        label="Password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="******"
                        autoComplete="current-password"
                        error={error.password}
                    />

                    <Button
                        type="submit"
                        disabled={loading}
                        loading={loading}
                    >
                        Login
                    </Button>

                </form>

                <p className="text-center text-gray-400 text-sm mt-6">
                    Don’t have an account?{" "}
                    <Link to="/register" className="text-purple-400 hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}