import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OtpVerification() {
  const [timer, setTimer] = useState(60);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const navigate = useNavigate();

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < otp.length - 1) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleResend = () => {
    setTimer(60);
    setOtp(["", "", "", ""]);
    // Add resend logic here
  };

  const handleVerify = () => {
    const finalOtp = otp.join("");
    if (finalOtp.length === 4) {
      // Normally call API here. For now just navigate
      navigate("/ResetPassword");
    } else {
      alert("Please enter all 4 digits.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #ede3f7, #e4d7f4)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Segoe UI', sans-serif",
        padding: "20px",
      }}
    >
      <h2
        style={{
          fontFamily: "'Pacifico', cursive",
          color: "#5e148b",
          fontSize: "2.5rem",
          marginBottom: "1.5rem",
        }}
      >
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
        <h4 style={{ fontWeight: "bold", marginBottom: "8px" }}>
          Email OTP Verification
        </h4>
        <p style={{ color: "#6c757d", fontSize: "14px" }}>
          We sent a code to <b>info@example.com</b>
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            marginTop: "1.5rem",
          }}
        >
          {otp.map((digit, i) => (
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
          Didn’t receive code?{" "}
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
