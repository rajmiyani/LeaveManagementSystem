import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom"; // ✅ added useLocation
import { toast } from "react-toastify";

export default function LoginOTPVerification() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [otpValues, setOtpValues] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [email, setEmail] = useState(location.state?.email || ""); // ✅ get from state

  // Redirect if email is missing
  useEffect(() => {
    if (!location.state?.email) {
      toast.error("Email not found. Please login again.");
      navigate("/");
    }
  }, [location.state, navigate]);

  // Countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Input handler
  const handleChange = (e, idx) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return;
    const arr = [...otpValues];
    arr[idx] = value;
    setOtpValues(arr);
    if (value && idx < 3) document.getElementById(`otp-${idx + 1}`)?.focus();
  };

  // Verify OTP
  const handleVerify = async () => {
    const finalOtp = otpValues.join("");
    if (finalOtp.length !== 4) {
      toast.error("Please enter the full 4-digit OTP.");
      return;
    }
    if (!email) {
      toast.error("Missing email.");
      return;
    }
    try {
      const res = await axios.post("http://localhost:8080/auth/verify-otp", {
        email,
        otp: finalOtp,
        role: "employee",
        purpose: "login",
      });
      if (res.data?.status) {
        toast.success("OTP Verified Successfully!");
        login(res.data.user);
        navigate("/employee/dashboard");
      } else {
        toast.error(res.data?.message || "Invalid OTP.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed.");
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (timer > 0 || !email) return;
    setTimer(60);
    try {
      const res = await axios.post("http://localhost:8080/auth/resend-otp", {
        email,
        role: "employee",
        purpose: "login",
      });
      if (res.data?.status) {
        toast.success("OTP resent successfully.");
        setOtpValues(["", "", "", ""]);
      } else {
        toast.error(res.data?.message || "Failed to resend OTP.");
      }
    } catch {
      toast.error("Failed to resend OTP. Try again.");
    }
  };

  return (
    <OtpUI
      email={email}
      otpValues={otpValues}
      handleChange={handleChange}
      handleVerify={handleVerify}
      handleResend={handleResend}
      timer={timer}
    />
  );
}

// UI Component stays the same
function OtpUI({ email, otpValues, handleChange, handleVerify, handleResend, timer }) {
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
      <h2 style={{ fontFamily: "'Pacifico', cursive", color: "#5e148b", fontSize: "2.5rem", marginBottom: "1.5rem" }}>
        MegaCode
      </h2>

      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "1rem",
          padding: "2rem",
          textAlign: "center",
          width: "100%",
          maxWidth: "450px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h4 style={{ fontWeight: "bold", marginBottom: "8px" }}>Email OTP Verification</h4>
        <p style={{ color: "#6c757d", fontSize: "14px" }}>
          We've sent a code to <b>{email || "your email"}</b>
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "1.5rem" }}>
          {otpValues.map((digit, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e, i)}
              style={{
                width: "50px",
                height: "50px",
                textAlign: "center",
                fontSize: "20px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
            />
          ))}
        </div>

        <div style={{ marginTop: "1.5rem", fontSize: "14px" }}>
          Didn't receive the code?{" "}
          <button
            onClick={handleResend}
            disabled={timer > 0}
            style={{
              background: "none",
              border: "none",
              color: timer > 0 ? "#999" : "#5e148b",
              fontWeight: "bold",
              cursor: timer > 0 ? "not-allowed" : "pointer",
              padding: "0",
            }}
          >
            Resend Code
          </button>{" "}
          {timer > 0 && <span style={{ color: "red" }}>{timer}s</span>}
        </div>

        <button
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
            transition: "0.3s ease",
          }}
          onClick={handleVerify}
        >
          Verify & Proceed
        </button>
      </div>
    </div>
  );
}
