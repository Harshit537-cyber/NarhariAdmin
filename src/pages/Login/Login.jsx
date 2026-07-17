import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../../api/Controller/authController";
import Swal from "sweetalert2";
import { FaShieldAlt } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import bgVideo from "../../assets/bgVideo.mp4";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  function validate() {
    const next = {};
    if (!email.trim()) next.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Invalid email address";
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
        email,
        password,
      });

      if (res.token) {
        await Swal.fire({
          icon: "success",
          title: "Access Granted",
          html: `
            <p style="font-size: 1.1rem; color: #cbd5e1; margin-top: 8px; margin-bottom: 0;">
              Welcome back to <span style="color: #ffd700; font-weight: 600; text-shadow: 0 0 10px rgba(255, 215, 0, 0.35);">Astronarhari</span>
            </p>
          `,
          background: "rgba(18, 18, 18, 0.95)",
          color: "#ffffff",
          iconColor: "#10b981",
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
        text: error.message || "Invalid Email or Password",
        confirmButtonColor: "#d33",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="an-login">
       <video
    className="bg-video"
    autoPlay
    loop
    muted
    playsInline
  >
    <source src={bgVideo} type="video/mp4" />
  </video>
      <div className="an-login-wrapper">
        <div className="an-login-left">
          <div className="an-left-top">
            <div className="an-left-logo">
              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M62 20C44 20 30 34 30 52C30 70 44 84 62 84C68 84 73.5 82.5 78 79.8C68.4 76.7 61.5 67.8 61.5 57.2C61.5 43.6 71 32.4 84 29.6C78.2 23.6 70.5 20 62 20Z"
                  fill="#FFD700"
                />
              </svg>
              <span>Astronarhari</span>
            </div>

            <div className="an-status-card">
              <div className="an-status-header">
                <span className="an-status-badge">SYSTEM STATUS</span>
                <span className="an-status-dot"></span>
              </div>

              <div className="an-status-item">
<div className="an-status-icon"><FaShieldAlt /></div>
                <div>
                  <p className="an-status-title">Secure Access</p>
                  <p className="an-status-sub">Active &amp; Encrypted</p>
                </div>
                <span className="an-status-check">✔</span>
              </div>

              <div className="an-status-item">
<div className="an-status-icon"><HiSparkles /></div>
                <div>
                  <p className="an-status-title">Live Sync</p>
                  <p className="an-status-sub">Optimized Nodes</p>
                </div>
                <span className="an-status-check">✔</span>
              </div>
            </div>
          </div>

          <div className="an-left-bottom">
            <h2>Admin Console</h2>
            <p>
              Access the unified control center. Monitor stock levels,
              logistic flows, and live operational metrics.
            </p>
          </div>
        </div>

        {/* ---------------- RIGHT PANEL (existing login card) ---------------- */}
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
          <p className="an-login-wordmark">Astronarhari</p>
          <p className="an-login-subheading">Sign in to your account</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="an-field">
              <label className="an-label">Enter Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? "error" : ""}
                placeholder="you@example.com"
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
    </div>
  );
}