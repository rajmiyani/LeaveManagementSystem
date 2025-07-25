import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080", // Or your deployed API URL
});

// Auth APIs
export const loginUser = (data) => API.post("/api/login", data);

export const registerUser = (data) => {
  let endpoint = "/api/register"; // fallback

  if (data.role === "admin") endpoint = "/api/register-admin";
  else if (data.role === "manager") endpoint = "/api/register-manager";
  else if (data.role === "employee") endpoint = "/api/register-employee";

  return API.post(endpoint, data);
};

export const verifyEmployeeOtp = (data) => API.post("/api/verify-employee-otp", data);
export const forgotPassword = (data) => API.post("/api/forgot-password", data);
export const resetPassword = (data) => API.post("/api/reset-password", data);



// export const sendOtpToEmail = async (email) => {
//   try {
//     const response = await API.post("/api/send-otp", { email }); // ensure backend supports this
//     return response.data;
//   } catch (error) {
//     console.error("OTP error:", error);
//     throw error;
//   }
// };
