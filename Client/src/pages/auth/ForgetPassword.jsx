import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // ✅ Import useNavigate

export default function ForgetPassword() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate(); // ✅ Initialize navigator

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!email) return alert("Please enter your email address");

        // Optionally, call an API here...

        // ✅ Navigate to EmailSent page
        navigate("/EmailSent");
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
                padding: "2rem",
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
                    maxWidth: "600px",
                }}
            >
                <h5 className="text-center fw-bold">Forgot Password</h5>
                <p className="text-center text-muted mb-4">
                    Enter your email address and we’ll send you a link to reset your password
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            className="form-label fw-semibold"
                            style={{ textAlign: "left", display: "block" }}
                        >
                            Email Address :
                        </label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            placeholder="Enter your registered email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn w-100 login-btn border text-white"
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
                        Send Reset Link
                    </button>
                </form>

                <p className="text-center text-muted mt-4">
                    Go back to{" "}
                    <Link to="/" className="text-decoration-none" style={{ color: "#5e148b" }}>
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
