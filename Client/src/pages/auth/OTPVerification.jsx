// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useAuth } from "../../context/AuthContext";
// import { useNavigate, useLocation } from "react-router-dom";
// import { toast } from "react-toastify";

// export default function OtpVerification() {
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Get navigation state, or null if direct/reload
//   const { user: passedUser, purpose: navPurpose } = location.state || {};

//   const [user, setUser] = useState(() => passedUser || null);
//   const [purpose, setPurpose] = useState(() => navPurpose || null);
//   const [otpValues, setOtpValues] = useState(["", "", "", ""]);
//   const [timer, setTimer] = useState(60);

//   // On mount, get user/purpose from state if present, or localStorage for refresh/revisit
//   useEffect(() => {
//     if (passedUser && navPurpose) {
//       // Fresh navigation: cache for reloads
//       localStorage.setItem("otpUser", JSON.stringify(passedUser));
//       localStorage.setItem("otpPurpose", navPurpose);
//       setUser(passedUser);
//       setPurpose(navPurpose);
//     } else {
//       // Try restore if page reloaded
//       const userLS = localStorage.getItem("otpUser");
//       const purposeLS = localStorage.getItem("otpPurpose");
//       if (userLS && purposeLS) {
//         setUser(JSON.parse(userLS));
//         setPurpose(purposeLS);
//       } else {
//         toast.error("Session expired. Please try again.");
//         navigate("/");
//       }
//     }
//     // eslint-disable-next-line
//   }, []);

//   // Timer for resend
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setTimer((prev) => {
//         if (prev <= 1) {
//           clearInterval(interval);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);
//     return () => clearInterval(interval);
//   }, []);

//   // Handle OTP digit change
//   const handleChange = (e, idx) => {
//     const value = e.target.value;
//     if (!/^\d?$/.test(value)) return;
//     const arr = [...otpValues];
//     arr[idx] = value;
//     setOtpValues(arr);
//     if (value && idx < 3) document.getElementById(`otp-${idx + 1}`)?.focus();
//   };

//   // Submit handler
//   const handleVerify = async () => {
//     const finalOtp = otpValues.join("");
//     if (finalOtp.length !== 4) {
//       toast.error("Please enter the full 4-digit OTP.");
//       return;
//     }
//     if (!user?.email) {
//       toast.error("Missing user info. Please try again.");
//       return;
//     }
//     try {
//       const res = await axios.post("http://localhost:8080/auth/verify-otp", {
//         email: user.email,
//         otp: finalOtp,
//         role: user.role || "employee",
//         purpose,
//       });
//       if (res.data?.status) {
//         toast.success("OTP Verified Successfully!");
//         // On success, clear localStorage to avoid stale info
//         localStorage.removeItem("otpUser");
//         localStorage.removeItem("otpPurpose");

//         if (purpose === "login") {
//           login(res.data.user); // set logged in user
//           navigate("/employee/dashboard");
//         } else if (purpose === "forgot-password") {
//           navigate("/reset-password", {
//             state: {
//               email: user.email,
//               role: user.role || "employee",
//             },
//           });
//         } else {
//           toast.error("Unknown verification purpose.");
//         }
//       } else {
//         toast.error(res.data?.message || "Invalid OTP.");
//       }
//     } catch (err) {
//       toast.error(
//         err.response?.data?.message || "OTP verification failed. Try again."
//       );
//     }
//   };

//   // Resend handler
//   const handleResend = async () => {
//     if (timer > 0 || !user?.email) return;
//     setTimer(60);
//     try {
//       const res = await axios.post("http://localhost:8080/auth/resend-otp", {
//         email: user.email,
//         role: user.role || "employee",
//         purpose,
//       });
//       if (res.data?.status) {
//         toast.success("OTP resent successfully.");
//         setOtpValues(["", "", "", ""]);
//       } else {
//         toast.error(res.data?.message || "Failed to resend OTP.");
//       }
//     } catch {
//       toast.error("Failed to resend OTP. Try again.");
//     }
//   };

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         minWidth: "100vw",
//         background: "linear-gradient(135deg, #ede3f7, #e4d7f4)",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         fontFamily: "'Segoe UI', sans-serif",
//         padding: "20px",
//       }}
//     >
//       <h2
//         style={{
//           fontFamily: "'Pacifico', cursive",
//           color: "#5e148b",
//           fontSize: "2.5rem",
//           marginBottom: "1.5rem",
//         }}
//       >
//         MegaCode
//       </h2>

//       <div
//         style={{
//           backgroundColor: "#fff",
//           borderRadius: "1rem",
//           padding: "2rem",
//           textAlign: "center",
//           width: "100%",
//           maxWidth: "450px",
//           boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
//         }}
//       >
//         <h4 style={{ fontWeight: "bold", marginBottom: "8px" }}>
//           Email OTP Verification
//         </h4>
//         <p style={{ color: "#6c757d", fontSize: "14px" }}>
//           We've sent a code to <b>{user?.email || "your email"}</b>
//         </p>

//         <div
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             gap: "12px",
//             marginTop: "1.5rem",
//           }}
//         >
//           {otpValues.map((digit, i) => (
//             <input
//               key={i}
//               id={`otp-${i}`}
//               type="text"
//               maxLength="1"
//               value={digit}
//               onChange={(e) => handleChange(e, i)}
//               style={{
//                 width: "50px",
//                 height: "50px",
//                 textAlign: "center",
//                 fontSize: "20px",
//                 borderRadius: "10px",
//                 border: "1px solid #ccc",
//                 boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
//               }}
//             />
//           ))}
//         </div>

//         <div style={{ marginTop: "1.5rem", fontSize: "14px" }}>
//           Didn't receive the code?{" "}
//           <button
//             onClick={handleResend}
//             disabled={timer > 0}
//             style={{
//               background: "none",
//               border: "none",
//               color: timer > 0 ? "#999" : "#5e148b",
//               fontWeight: "bold",
//               cursor: timer > 0 ? "not-allowed" : "pointer",
//               padding: "0",
//             }}
//           >
//             Resend Code
//           </button>{" "}
//           {timer > 0 && <span style={{ color: "red" }}>{timer}s</span>}
//         </div>

//         <button
//           style={{
//             backgroundColor: "#5e148b",
//             color: "#fff",
//             fontWeight: "bold",
//             width: "100%",
//             marginTop: "2rem",
//             padding: "12px",
//             border: "none",
//             borderRadius: "8px",
//             fontSize: "16px",
//             cursor: "pointer",
//             transition: "0.3s ease",
//           }}
//           onClick={handleVerify}
//         >
//           Verify & Proceed
//         </button>
//       </div>
//     </div>
//   );
// }
