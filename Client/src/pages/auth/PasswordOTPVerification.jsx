import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import OtpUI from "./LoginOTPVerification"; // Reuse same UI

export default function PasswordOTPVerification() {
  const navigate = useNavigate();
  const location = useLocation();

  const { user: passedUser } = location.state || {};
  const [user, setUser] = useState(() => passedUser || null);
  const [otpValues, setOtpValues] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(60);

//   useEffect(() => {
//     if (passedUser) {
//       localStorage.setItem("otpUserPassword", JSON.stringify(passedUser));
//       setUser(passedUser);
//     } else {
//       const userLS = localStorage.getItem("otpUserPassword");
//       if (userLS) {
//         setUser(JSON.parse(userLS));
//       } else {
//         toast.error("Session expired. Please try again.");
//         navigate("/");
//       }
//     }
//   }, []);

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

  const handleChange = (e, idx) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return;
    const arr = [...otpValues];
    arr[idx] = value;
    setOtpValues(arr);
    if (value && idx < 3) document.getElementById(`otp-${idx + 1}`)?.focus();
  };

  const handleVerify = async () => {
    const finalOtp = otpValues.join("");
    if (finalOtp.length !== 4) {
      toast.error("Please enter the full 4-digit OTP.");
      return;
    }
    if (!user?.email) {
      toast.error("Missing user info.");
      return;
    }
    try {
      const res = await axios.post("http://localhost:8080/auth/verify-otp", {
        email: user.email,
        otp: finalOtp,
        role: user.role || "employee",
        purpose: "forgot-password",
      });
      if (res.data?.status) {
        toast.success("OTP Verified Successfully!");
        localStorage.removeItem("otpUserPassword");
        navigate("/reset-password", {
          state: {
            email: user.email,
            role: user.role || "employee",
          },
        });
      } else {
        toast.error(res.data?.message || "Invalid OTP.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed.");
    }
  };

  const handleResend = async () => {
    if (timer > 0 || !user?.email) return;
    setTimer(60);
    try {
      const res = await axios.post("http://localhost:8080/auth/resend-otp", {
        email: user.email,
        role: user.role || "employee",
        purpose: "forgot-password",
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
      user={user}
      otpValues={otpValues}
      handleChange={handleChange}
      handleVerify={handleVerify}
      handleResend={handleResend}
      timer={timer}
    />
  );
}
