import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ResetPassword() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = () => {
        if (password === confirmPassword && password !== "") {
            // Passwords match, navigate to login
            navigate("/");
        } else {
            setError("Passwords do not match.");
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                minWidth: "100vw",
                background: "linear-gradient(135deg, #ede3f7, #e4d7f4)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Segoe UI', sans-serif",
                padding: "20px",
            }}
        >
            <h1
                style={{
                    fontFamily: "'Pacifico', cursive",
                    color: "#5e148b",
                    fontSize: "2.5rem",
                    marginBottom: "1.5rem",
                }}
            >
                MegaCode
            </h1>

            <div
                style={{
                    backgroundColor: "#fff",
                    borderRadius: "1rem",
                    padding: "2rem",
                    width: "100%",
                    maxWidth: "450px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                }}
            >
                <h4 style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
                    Reset Password
                </h4>
                <p style={{ color: "#6c757d", fontSize: "14px" }}>
                    Your new password must be different from previously used passwords.
                </p>

                {/* Error Message */}
                {error && (
                    <p style={{ color: "red", fontSize: "13px", marginTop: "10px" }}>
                        {error}
                    </p>
                )}

                {/* Password Field */}
                <div style={{ marginTop: "1.5rem" }}>
                    <label
                        style={{
                            fontWeight: "bold",
                            marginBottom: "4px",
                            textAlign: "left",
                            display: "block",
                        }}
                    >
                        Password :
                    </label>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            overflow: "hidden",
                        }}
                    >
                        <span style={{ padding: "10px" }}>
                            <i className="bi bi-lock"></i>
                        </span>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="***********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                border: "none",
                                padding: "10px",
                                flex: 1,
                                outline: "none",
                                background: "#fff",
                                color: "black"
                            }}
                        />
                        <span
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                padding: "10px",
                                background: "#fff",
                                cursor: "pointer",
                            }}
                        >
                            <i className={`bi ${showPassword ? "bi-eye" : "bi-eye-slash"}`} />
                        </span>
                    </div>
                </div>

                {/* Confirm Password */}
                <div style={{ marginTop: "1rem" }}>
                    <label
                        style={{
                            fontWeight: "bold",
                            marginBottom: "4px",
                            textAlign: "left",
                            display: "block",
                        }}
                    >
                        Confirm Password :
                    </label>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            overflow: "hidden",
                        }}
                    >
                        <span style={{ padding: "10px", background: "#fff" }}>
                            <i className="bi bi-lock"></i>
                        </span>
                        <input
                            type={showConfirm ? "text" : "password"}
                            placeholder="***********"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            style={{
                                border: "none",
                                padding: "10px",
                                flex: 1,
                                outline: "none",
                                background: "#fff",
                                color: "black"
                            }}
                        />
                        <span
                            onClick={() => setShowConfirm(!showConfirm)}
                            style={{
                                padding: "10px",
                                background: "#fff",
                                cursor: "pointer",
                            }}
                        >
                            <i
                                className={`bi ${showConfirm ? "bi-eye" : "bi-eye-slash"
                                    }`}
                            />
                        </span>
                    </div>
                </div>



                {/* Submit */}
                <button
                    onClick={handleSubmit}
                    style={{
                        backgroundColor: "#5e148b",
                        color: "#fff",
                        fontWeight: "bold",
                        width: "100%",
                        marginTop: "2rem",
                        padding: "12px",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "16px",
                        cursor: "pointer",
                    }}
                >
                    Submit
                </button>

                <p
                    style={{
                        textAlign: "center",
                        marginTop: "1rem",
                        fontSize: "14px",
                    }}
                >
                    Return to{" "}
                    <Link to="/" style={{ color: "#5e148b", fontWeight: "bold" }}>
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
