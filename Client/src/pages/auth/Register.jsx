import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/api"; // Axios API helper
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("admin");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (selectedRole === "employee" && !form.mobile) {
      toast.error("Mobile is required for employee registration");
      return;
    }

    // Build the payload: Only include mobile if employee
    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      role: selectedRole,
    };
    if (selectedRole === "employee") payload.mobile = form.mobile;

    try {
      await registerUser(payload);
      toast.success(`${selectedRole} registered successfully!`);

      setForm({
        name: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        if (selectedRole === "admin") navigate("/admin/dashboard");
        else if (selectedRole === "manager") navigate("/manager/dashboard");
        else navigate("/employee/dashboard");
      }, 1000);
    } catch (err) {
      if (err.response?.data?.messages) {
        Object.values(err.response.data.messages).forEach((msg) => toast.error(msg));
      } else if (typeof err.response?.data?.message === "string") {
        toast.error(err.response.data.message);
      } else {
        toast.error("Registration failed.");
      }
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
      <ToastContainer position="top-right" autoClose={3000} />

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
          maxWidth: "500px",
        }}
      >
        <h5 className="text-center fw-bold">Create Account</h5>
        <p className="text-center text-muted mb-4">
          Please enter your details to register
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <label style={{ fontWeight: 'bold', fontSize: '18px', color: '#1a1a3d' }}>
            Register as
          </label>

          <div
            style={{
              display: 'flex',
              border: '1px solid #ccc',
              borderRadius: '6px',
              overflow: 'hidden',
            }}
          >
            {['admin', 'manager', 'employee'].map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                type="button"
                style={{
                  padding: '6px 16px',
                  border: 'none',
                  backgroundColor: selectedRole === role ? '#5e148b' : '#fff',
                  color: selectedRole === role ? '#fff' : '#5e148b',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: '0.3s',
                }}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold" style={{ textAlign: "left", display: "block" }}>Full Name :</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Enter your full name"
              required
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold" style={{ textAlign: "left", display: "block" }}>Email Address :</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter email address"
              required
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold" style={{ textAlign: "left", display: "block" }}>
              Mobile Number :
            </label>
            <input
              type="tel"
              name="mobile"
              className="form-control"
              placeholder="Enter mobile number"
              required={selectedRole === "employee"}
              value={form.mobile}
              onChange={handleChange}
              disabled={selectedRole !== "employee"}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold" style={{ textAlign: "left", display: "block" }}>Password :</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="form-control"
              placeholder="********"
              required
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold" style={{ textAlign: "left", display: "block" }}>Confirm Password :</label>
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              className="form-control"
              placeholder="********"
              required
              value={form.confirmPassword}
              onChange={handleChange}
            />
            <div
              style={{
                textAlign: "right",
                marginTop: "6px",
                cursor: "pointer",
                color: "#5e148b",
                fontSize: "0.9rem",
              }}
              onClick={togglePassword}
            >
              <i className={`bi ${showPassword ? "bi-eye" : "bi-eye-slash"}`}></i> Show Password
            </div>
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
            Register
          </button>
        </form>

        <p className="text-center text-muted mt-4">
          Already have an account?{" "}
          <Link to="/" className="text-decoration-none" style={{ color: "#5e148b" }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
