import axios from "axios";

// Create an Axios instance with base config
const API = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json"
  }
});

// ----------------------
// AUTH APIs
// ----------------------

// Register a new user (Admin / Manager / Employee)
export const registerUser = (data) => API.post("/auth/register", data);

// Login user based on role
export const loginUser = (data) => API.post("/auth/login", data);

// Verify OTP (for employee login)
export const verifyOtp = (data) => API.post("/auth/verify-otp", data);

// Resend OTP
export const resendOtp = (email) => API.post("/auth/resend-otp", { email });

// Forgot password (sends OTP to email)
export const forgotPassword = (data) => API.post("/auth/forgot-password", data);

// Reset password using OTP
export const resetPassword = (data) => API.post("/auth/reset-password", data);

// Optional: Check all roles available with given email
export const checkEmailRoles = (data) => API.post("/auth/check-email-roles", data);

// Send OTP to email (if needed separately)
export const sendOtpToEmail = (email) => API.post("/auth/send-otp", { email });



// ----------------------
// Admin Panel APIs
// ----------------------

export const AddDepartment = (data) => API.post("/admin/add-department", data);