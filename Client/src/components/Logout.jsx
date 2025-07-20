import React from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import logoutImg from "../assets/LOGO.png"; // Use your image path

const LogoutPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authUser");
    navigate("/");
  };

  return (
    <div className="container-fluid d-flex flex-column justify-content-center align-items-center min-vh-100 bg-light text-center px-3">
      <img
        src={logoutImg}
        alt="Logout Illustration"
        className="img-fluid mb-4"
        style={{ maxWidth: "300px" }}
      />
      <h2 className="mb-2">Are you sure you want to logout?</h2>
      <p className="text-muted mb-4">You will be redirected to the login page.</p>
      <button className="btn btn-danger btn-lg d-flex align-items-center gap-2" onClick={handleLogout}>
        <FaSignOutAlt /> Logout
      </button>
    </div>
  );
};

export default LogoutPage;
