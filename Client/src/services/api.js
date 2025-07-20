import axios from "axios";

const API = axios.create({
    baseURL: 'http://localhost:8000'
});

// Login API call
export const loginUser = (data) => API.post("/auth/login", data);

// Register API call
export const registerUser = (data) => API.post("/auth/register", data);


export const sendOtpToEmail = async (email) => {
    try {
        const response = await fetch("/api/send-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) throw new Error("Failed to send OTP");
        return await response.json();
    } catch (error) {
        console.error("OTP error:", error);
        throw error;
    }
};