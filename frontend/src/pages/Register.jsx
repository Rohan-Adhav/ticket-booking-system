import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/auth.api.js";

export default function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState("");


    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: ""
        }));

        setApiError("");
    };

    
    const validate = () => {
        const err = {};

        if (!form.name.trim()) err.name = "Name is required";

        if (!form.email.trim()) {
            err.email = "Email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
            err.email = "Enter a valid email";
        }

        if (!form.password) {
            err.password = "Password is required";
        } else if (form.password.length < 6) {
            err.password = "Password must be at least 6 characters";
        }

        if (!form.confirmPassword) {
            err.confirmPassword = "Confirm your password";
        } else if (form.password !== form.confirmPassword) {
            err.confirmPassword = "Passwords do not match";
        }

        return err;
    };

    
    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrors({});
        setApiError("");

        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            setLoading(true);

            const data = await register(form)

            navigate("/login");

        } catch (err) {
            console.error("REGISTER ERROR:", err);

            
            const status = err?.response?.status;

            let message = "Something went wrong. Please try again.";

            if (status === 409) {
                message = "User already exists with this email.";
            } else if (status === 400) {
                message = err?.response?.data?.message || "Invalid input.";
            } else if (!err?.response) {
                message = "Network error. Check your connection.";
            }

            setApiError(message);
        } finally {
            setLoading(false);
        }
    };

    
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0b0f1a] px-4">

            <div className="w-full max-w-md p-6 rounded-2xl bg-white/10 border border-white/20">

                <h2 className="text-white text-2xl font-bold text-center">
                    Create Account
                </h2>

                {/* ONLY USER FRIENDLY ERROR */}
                {apiError && (
                    <div className="mt-4 text-sm text-red-200 bg-red-500/20 p-2 rounded">
                        {apiError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">

                    <Input
                        label="Name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        error={errors.name}
                    />

                    <Input
                        label="Email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        error={errors.email}
                    />

                    <Input
                        label="Password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        error={errors.password}
                    />

                    <Input
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        error={errors.confirmPassword}
                    />

                    <Button type="submit" loading={loading}>
                        Register
                    </Button>
                </form>

                <p className="text-center text-gray-400 mt-4 text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-purple-400">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}