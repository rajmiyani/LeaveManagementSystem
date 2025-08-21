import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword, checkEmailRoles } from "../../services/api"; // 👈 Make sure `checkEmailRoles` is added

export default function ForgetPassword() {
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [needMobile, setNeedMobile] = useState(false);
    const navigate = useNavigate();

    const handleEmailBlur = async () => {
        if (!email) return;
        try {
            const res = await checkEmailRoles({ email });
            setNeedMobile(res.data.count > 1); 
        } catch (error) {
            console.error("Error checking email roles:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || (needMobile && !mobile)) {
            alert("Please enter all required fields.");
            return;
        }

        try {
            const res = await forgotPassword({ email, mobile_no: mobile });

            if (res.data.status) {
                alert("OTP sent to your email.");
                navigate("/EmailSent", {
                    state: {
                        email: res.data.email,
                        role: res.data.role,
                        purpose: "reset-password"
                    },
                });
            } else {
                alert(res.data.message || "Something went wrong.");
            }
        } catch (err) {
            alert(err.response?.data?.message || "Request failed.");
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
                    Enter your email {needMobile ? "and mobile number" : ""} to receive OTP.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="form-label fw-semibold">Email Address :</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Enter your registered email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={handleEmailBlur}
                            required
                        />
                    </div>

                    {needMobile && (
                        <div className="mb-4">
                            <label className="form-label fw-semibold">Mobile Number :</label>
                            <input
                                type="tel"
                                className="form-control"
                                placeholder="Enter your registered mobile number"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                required
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn w-100 login-btn border text-white"
                        style={{
                            backgroundColor: "#5e148b",
                            fontWeight: "bold",
                            padding: "12px",
                            borderRadius: "8px",
                            fontSize: "16px",
                        }}
                    >
                        Send OTP
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
