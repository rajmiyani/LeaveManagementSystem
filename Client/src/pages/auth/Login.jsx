import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { loginUser, sendOtpToEmail } from "../../services/api"; // Make sure sendOtpToEmail is imported
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "", mobile: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState("admin");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleToggle = (selectedRole) => {
        setRole(selectedRole);
        if (selectedRole !== "employee") {
            setForm((prev) => ({ ...prev, mobile: "" }));
        }
    };

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const togglePassword = () => {
        setShowPassword((prev) => !prev);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (role === "employee" && !form.mobile) {
            toast.error("Mobile number is required for employee login.");
            return;
        }

        try {
            const payload = {
                email: form.email,
                password: form.password,
                role: role,
            };

            const res = await loginUser(payload);

            if (!res.data.status) {
                toast.error(res.data.message || "Login failed.");
                return;
            }

            // ✅ Store token in localStorage in array of objects format
            if (res.data.token) {
                let tokens = JSON.parse(localStorage.getItem("userTokens")) || [];

                // Check if this role already exists in the array
                const existingIndex = tokens.findIndex((t) => t.role === role);

                const tokenData = {
                    role: role,
                    token: res.data.token,
                    user: res.data.user || { email: form.email }
                };

                if (existingIndex !== -1) {
                    tokens[existingIndex] = tokenData; // update existing role
                } else {
                    tokens.push(tokenData); // add new
                }

                localStorage.setItem("userTokens", JSON.stringify(tokens));
            }

            if (role === "employee" && res.data.step === "otp") {
                login({ id: res.data.id, email: res.data.email, role });
                toast.success(res.data.message);
                navigate("/login-otp-verification", {
                    state: { email: form.email }
                });
            } else {
                login({ ...res.data.user, role });

                toast.success(res.data.message);
                if (role === "admin") navigate("/admin/dashboard");
                else if (role === "manager") navigate("/manager/dashboard");
                else navigate("/employee/dashboard");
            }

        } catch (err) {
            const msg =
                err.response?.data?.message ||
                "Login failed. Please check your credentials and try again.";
            toast.error(msg);
        }
    };


    return (
        <div
            style={{
                minHeight: "100%",
                minWidth: "100vw",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                background: "linear-gradient(135deg, #ede3f7, #e4d7f4)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Segoe UI', sans-serif",
                padding: "2rem",
            }}
        >
            <ToastContainer position="top-right" autoClose={3000} />

            <h1
                style={{
                    fontFamily: "'Pacifico', cursive",
                    color: "#5e148b",
                    fontSize: "2.5rem",
                    marginBottom: "1rem",
                }}
            >
                MegaCode
            </h1>

            <div
                style={{
                    backgroundColor: "#fff",
                    borderRadius: "1.5rem",
                    padding: "2.5rem",
                    width: "100%",
                    maxWidth: "500px",
                    marginBottom: "20px",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <label
                        style={{ fontWeight: "bold", fontSize: "18px", color: "#1a1a3d" }}
                    >
                        Log In as
                    </label>
                    <div
                        style={{
                            display: "flex",
                            border: "1px solid #ccc",
                            borderRadius: "6px",
                            overflow: "hidden",
                        }}
                    >
                        {["admin", "manager", "employee"].map((r) => (
                            <button
                                key={r}
                                onClick={() => handleToggle(r)}
                                type="button"
                                style={{
                                    padding: "6px 16px",
                                    border: "none",
                                    backgroundColor: role === r ? "#5e148b" : "#fff",
                                    color: role === r ? "#fff" : "#5e148b",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    transition: "0.3s",
                                }}
                            >
                                {r.charAt(0).toUpperCase() + r.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    {role === "employee" && (
                        <div className="mb-3 mt-4">
                            <label
                                className="form-label fw-semibold"
                                style={{ textAlign: "left", display: "block" }}
                            >
                                Mobile Number :
                            </label>
                            <div className="input-group">
                                <span className="input-group-text bg-white">
                                    <i className="bi bi-phone" />
                                </span>
                                <input
                                    type="tel"
                                    name="mobile"
                                    className="form-control"
                                    placeholder="Enter mobile number"
                                    required
                                    value={form.mobile}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    )}

                    {/* Email */}
                    <div className="mb-3 mt-4">
                        <label
                            className="form-label fw-semibold"
                            style={{ textAlign: "left", display: "block" }}
                        >
                            Email Address :
                        </label>
                        <div className="input-group">
                            <span className="input-group-text bg-white">
                                <i className="bi bi-envelope" />
                            </span>
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                placeholder="Enter Email Address"
                                required
                                value={form.email}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="mb-3">
                        <label
                            className="form-label fw-semibold"
                            style={{ textAlign: "left", display: "block" }}
                        >
                            Password :
                        </label>
                        <div className="input-group">
                            <span className="input-group-text bg-white">
                                <i className="bi bi-lock" />
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                className="form-control"
                                placeholder="***********"
                                required
                                value={form.password}
                                onChange={handleChange}
                            />
                            <span
                                className="input-group-text bg-white"
                                style={{ cursor: "pointer" }}
                                onClick={togglePassword}
                            >
                                <i className={`bi ${showPassword ? "bi-eye" : "bi-eye-slash"}`} />
                            </span>
                        </div>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: "12px",
                        }}
                    >
                        <div className="form-check" style={{ fontSize: "0.95rem" }}>
                            <input className="form-check-input" type="checkbox" id="rememberMe" />
                            <label className="form-check-label" htmlFor="rememberMe">
                                Remember Me
                            </label>
                        </div>

                        <Link
                            to="/forgot-password"
                            className="text-decoration-none"
                            style={{ color: "#5e148b", fontSize: "0.95rem" }}
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="btn w-100 login-btn border text-white"
                        style={{
                            backgroundColor: "#5e148b",
                            fontWeight: "bold",
                            marginTop: "2rem",
                            padding: "12px",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "16px",
                            cursor: "pointer",
                        }}
                    >
                        Login
                    </button>
                </form>

                <hr className="my-4" />
                <div className="text-center text-muted mb-3">OR</div>

                <div className="d-flex gap-3 mb-3">
                    <button
                        className="btn w-50"
                        style={{
                            border: "1px solid #5e148b",
                            color: "#5e148b",
                            backgroundColor: "transparent",
                        }}
                    >
                        <i className="bi bi-facebook me-1" />
                        Facebook
                    </button>
                    <button
                        className="btn w-50"
                        style={{
                            border: "1px solid #5e148b",
                            color: "#5e148b",
                            backgroundColor: "transparent",
                        }}
                    >
                        <i className="bi bi-google me-1" />
                        Google
                    </button>
                </div>

                <p className="text-center text-muted">
                    Don’t have an account yet?{" "}
                    <Link to="/register" className="register-link text-decoration-none" style={{ color: "#5e148b" }}>
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}
