import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../services/api";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "", mobile: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [selectedRole, setSelectedRole] = useState("admin");
    const [role, setRole] = useState('admin');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleToggle = (selectedRole) => {
        setRole(selectedRole);
    };

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const togglePassword = () => {
        setShowPassword((prev) => !prev);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await loginUser(form);

            // Store user info with selected role
            login({ ...res.data.user, role });

            if (role === "employee") {
                // 🔐 Send OTP email (you need to have this API endpoint)
                await sendOtpToEmail(res.data.user.email); // implement this function/API
                navigate("/OTPVerification"); // redirect to OTP page
            } else if (role === "admin") {
                navigate("/admin/dashboard");
            } else if (role === "manager") {
                navigate("/manager/dashboard");
            }
        } catch (err) {
            alert("Login failed");
        }
    };

    const roleButtonStyle = (role) => ({
        flex: 1,
        border: "1px solid #5e148b",
        backgroundColor: selectedRole === role ? "#5e148b" : "transparent",
        color: selectedRole === role ? "#fff" : "#5e148b",
        fontWeight: "bold",
    });

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
                // padding: "2rem",
                fontFamily: "'Segoe UI', sans-serif",
            }}
        >
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
                    marginBottom: "20px"
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label style={{ fontWeight: 'bold', fontSize: '18px', color: '#1a1a3d' }}>
                        Log In as
                    </label>

                    <div
                        style={{
                            display: 'flex',
                            border: '1px solid #ccc',
                            borderRadius: '6px',
                            overflow: 'hidden',
                        }}
                    >
                        <button
                            onClick={() => handleToggle('admin')}
                            style={{
                                padding: '6px 16px',
                                border: 'none',
                                backgroundColor: role === 'admin' ? '#5e148b' : '#fff',
                                color: role === 'admin' ? '#fff' : '#5e148b',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: '0.3s',
                            }}
                        >
                            Admin
                        </button>

                        <button
                            onClick={() => handleToggle('manager')}
                            style={{
                                padding: '6px 16px',
                                border: 'none',
                                backgroundColor: role === 'manager' ? '#5e148b' : '#fff',
                                color: role === 'manager' ? '#fff' : '#5e148b',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: '0.3s',
                            }}
                        >
                            Manager
                        </button>

                        <button
                            onClick={() => handleToggle('employee')}
                            style={{
                                padding: '6px 16px',
                                border: 'none',
                                backgroundColor: role === 'employee' ? '#5e148b' : '#fff',
                                color: role === 'employee' ? '#fff' : '#5e148b',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: '0.3s',
                            }}
                        >
                            Employee
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Conditionally render Mobile Number field */}
                    {role === "employee" && (
                        <div className="mb-3 mt-4">
                            <label className="form-label fw-semibold" style={{ textAlign: "left", display: "block" }}>
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
                        <label className="form-label fw-semibold" style={{ textAlign: "left", display: "block" }}>
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
                        <label className="form-label fw-semibold" style={{ textAlign: "left", display: "block" }}>
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

                    {/* Remember Me & Forgot Password */}
                    <div className="d-flex justify-content-between mb-3">
                        <div className="form-check">
                            <input type="checkbox" className="form-check-input" id="rememberMe" />
                            <label htmlFor="rememberMe" className="form-check-label">
                                Remember Me
                            </label>
                        </div>
                        <Link
                            to="/forgot-password"
                            className="text-muted small text-decoration-none"
                            style={{ color: "#5e148b" }}
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    {/* Login Button */}
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
                        <i className="bi bi-facebook me-1" /> Facebook
                    </button>
                    <button
                        className="btn w-50"
                        style={{
                            border: "1px solid #5e148b",
                            color: "#5e148b",
                            backgroundColor: "transparent",
                        }}
                    >
                        <i className="bi bi-google me-1" /> Google
                    </button>
                </div>

                <p className="text-center text-muted">
                    Don’t have an account yet?{" "}
                    <Link
                        to="/register"
                        className="register-link text-decoration-none"
                        style={{ color: "#5e148b" }}
                    >
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}
