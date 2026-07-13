import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import bgImage from "../../assets/austro.png";
import { loginAdmin } from "../../api/authController";
import Swal from "sweetalert2";
export default function Login() {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  function validate() {
    const next = {};
    if (!mobile.trim()) next.mobile = "Required";
    else if (!/^[0-9]{10}$/.test(mobile)) next.mobile = "Invalid mobile number";
    if (!password) next.password = "Required";
    return next;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const next = validate();
    setErrors(next);

    if (Object.keys(next).length > 0) return;

    setSubmitting(true);

    try {
      const res = await loginAdmin({
        mobile,
        password,
      });

      if (res.success) {
        await Swal.fire({
          icon: "success",
          title: "Access Granted",
          html: `
            <p style="font-size: 1.1rem; color: #cbd5e1; margin-top: 8px; margin-bottom: 0;">
              Welcome back to <span style="color: #ffd700; font-weight: 600; text-shadow: 0 0 10px rgba(255, 215, 0, 0.35);">Austronarhari</span>
            </p>
          `,
          background: "rgba(18, 18, 18, 0.95)", // Elegant dark theme
          color: "#ffffff",
          iconColor: "#10b981", // Vibrant green icon
          confirmButtonText: "Continue to Dashboard",
          timer: 3000,
          timerProgressBar: true,
          backdrop: "rgba(0, 0, 0, 0.75)",
          customClass: {
            popup: "swal-premium-popup",
            confirmButton: "swal-premium-button",
            timerProgressBar: "swal-premium-progress",
          },
        });

        navigate("/dashboard");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message || "Invalid Mobile or Password",
        confirmButtonColor: "#d33",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="an-login" style={{ "--bg-image": `url(${bgImage})` }}>
      <div className="an-login-card">
        <div className="an-login-emblem">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M62 20C44 20 30 34 30 52C30 70 44 84 62 84C68 84 73.5 82.5 78 79.8C68.4 76.7 61.5 67.8 61.5 57.2C61.5 43.6 71 32.4 84 29.6C78.2 23.6 70.5 20 62 20Z"
              fill="#FFD700"
            />
          </svg>
        </div>

        <h1 className="an-login-heading">Welcome Back</h1>
        <p className="an-login-wordmark">Austronarhari</p>
        <p className="an-login-subheading">Sign in to your account</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="an-field">
            <label className="an-label">Enter Mobile no.</label>
            <input
              type="tel"
              maxLength="10"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
              className={errors.mobile ? "error" : ""}
            />
          </div>

          <div className="an-field">
            <label className="an-label">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={errors.password ? "error" : ""}
            />
            <button
              type="button"
              className="an-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button type="submit" className="an-submit" disabled={submitting}>
            {submitting ? "Processing..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
