import { Link } from "react-router-dom";

export default function EmailSent() {
    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(to right, #f6f1fc, #e5d9f2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
                fontFamily: "'Segoe UI', sans-serif",
            }}
        >
            <div
                style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "1rem",
                    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
                    padding: "2.5rem",
                    width: "100%",
                    maxWidth: "420px",
                    textAlign: "center",
                }}
            >
                {/* Brand */}
                <h2
                    style={{
                        fontFamily: "'Pacifico', cursive",
                        color: "#5e148b",
                        marginBottom: "1.5rem",
                        fontSize: "2.3rem",
                    }}
                >
                    MegaCode
                </h2>

                {/* Green Check Circle */}
                <div
                    style={{
                        width: "70px",
                        height: "70px",
                        borderRadius: "50%",
                        backgroundColor: "#28a745",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 1rem",
                    }}
                >
                    <i className="bi bi-check-lg" style={{ color: "#fff", fontSize: "2rem" }} />
                </div>

                {/* Headline */}
                <h4 style={{ fontWeight: "600", marginBottom: "0.5rem", color: "#343a40" }}>
                    Email Sent!
                </h4>

                {/* Subtext */}
                <p style={{ color: "#6c757d", fontSize: "14px", marginBottom: "1.5rem" }}>
                    We’ve sent a reset link to your email. Please check it and follow instructions to change your password.
                </p>

                {/* Reset Password Button */}
                <Link to="/OTPVerification">
                    <button
                        className="btn w-100"
                        style={{
                            backgroundColor: "#5e148b",
                            color: "#fff",
                            fontWeight: "600",
                            padding: "10px",
                            borderRadius: "8px",
                        }}
                    >
                        Reset Password
                    </button>
                </Link>
            </div>
        </div>
    );
}
