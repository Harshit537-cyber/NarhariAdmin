import React, { useState, useEffect } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaShieldAlt, FaPhoneAlt, FaUser, FaLock } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import bgVideo from "../../assets/bgVideo.mp4";

export default function Login() {
  const [step, setStep] = useState("send");
  const [action, setAction] = useState("login");
  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(120);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let interval = null;
    if (step === "verify" && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  function validateSend() {
    const next = {};
    if (!mobile.trim()) {
      next.mobile = "Mobile number is required";
    } else if (!/^[0-9]{10}$/.test(mobile.trim())) {
      next.mobile = "Enter a valid 10-digit mobile number";
    }
    return next;
  }

  function validateVerify() {
    const next = {};
    if (!name.trim()) {
      next.name = "Name is required";
    }
    if (!otp.trim()) {
      next.otp = "OTP is required";
    } else if (!/^[0-9]{4,6}$/.test(otp.trim())) {
      next.otp = "Enter a valid OTP";
    }
    return next;
  }

  async function handleSendOTP(e) {
    e.preventDefault();
    const next = validateSend();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    try {
      setTimer(120);
      setStep("verify");
      await Swal.fire({
        icon: "info",
        title: "OTP Sent",
        text: `A verification code has been dispatched to your mobile number for ${action === "login" ? "Login" : "Registration"}.`,
        background: "rgba(18, 18, 18, 0.95)",
        color: "#ffffff",
        confirmButtonColor: "#b8860b",
        timer: 2000,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Request Failed",
        text: error.message || "Failed to send OTP. Please try again.",
        confirmButtonColor: "#d33",
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVerifyOTP(e) {
    e.preventDefault();
    const next = validateVerify();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    try {
      await Swal.fire({
        icon: "success",
        title: action === "login" ? "Access Granted" : "Registration Successful",
        html: `
          <p style="font-size: 1.1rem; color: #cbd5e1; margin-top: 8px; margin-bottom: 0;">
            Welcome to <span style="color: #ffd700; font-weight: 600; text-shadow: 0 0 10px rgba(255, 215, 0, 0.35);">Astronarhari</span>
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
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Verification Failed",
        text: error.message || "Invalid OTP, please try again.",
        confirmButtonColor: "#d33",
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResend() {
    if (timer > 0) return;
    setSubmitting(true);
    try {
      setTimer(120);
      await Swal.fire({
        icon: "success",
        title: "OTP Resent",
        background: "rgba(18, 18, 18, 0.95)",
        color: "#ffffff",
        confirmButtonColor: "#b8860b",
        timer: 2000,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Could not resend OTP.",
        confirmButtonColor: "#d33",
      });
    } finally {
      setSubmitting(false);
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="an-login">
      <video className="bg-video" autoPlay loop muted playsInline>
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
                <div className="an-status-icon">
                  <FaShieldAlt />
                </div>
                <div>
                  <p className="an-status-title">Secure Access</p>
                  <p className="an-status-sub">Active &amp; Encrypted</p>
                </div>
                <span className="an-status-check">✔</span>
              </div>

              <div className="an-status-item">
                <div className="an-status-icon">
                  <HiSparkles />
                </div>
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
              Access the unified control center. Monitor stock levels, logistic
              flows, and live operational metrics.
            </p>
          </div>
        </div>

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
          <p className="an-login-subheading">Sign in securely using OTP</p>

          <div className="an-animated-container">
            {step === "send" ? (
              <form
                onSubmit={handleSendOTP}
                noValidate
                className="an-fade-in"
                key="send-form"
              >
                <div className="an-field">
                  <label className="an-label">Choose Action</label>
                  <div className="an-action-toggle-group">
                    <button
                      type="button"
                      className={`an-action-btn ${action === "login" ? "active" : ""}`}
                      onClick={() => setAction("login")}
                    >
                      Login
                    </button>
                    <button
                      type="button"
                      className={`an-action-btn ${action === "register" ? "active" : ""}`}
                      onClick={() => setAction("register")}
                    >
                      Register
                    </button>
                  </div>
                </div>

                <div className="an-field">
                  <label className="an-label">Mobile Number</label>
                  <div className="an-input-wrapper">
                    <FaPhoneAlt className="an-input-icon" />
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className={errors.mobile ? "error" : ""}
                      placeholder="Enter 10-digit number"
                      maxLength={10}
                    />
                  </div>
                  {errors.mobile && (
                    <span className="an-error-text">{errors.mobile}</span>
                  )}
                </div>

                <button
                  type="submit"
                  className="an-submit"
                  disabled={submitting}
                >
                  {submitting ? "Sending..." : "Send OTP"}
                </button>
              </form>
            ) : (
              <form
                onSubmit={handleVerifyOTP}
                noValidate
                className="an-fade-in"
                key="verify-form"
              >
                <div className="an-user-summary">
                  <p>
                    <strong>Action:</strong> {action === "login" ? "Login" : "Registration"}
                  </p>
                  <p>
                    <strong>Sent to Mobile:</strong> {mobile}
                  </p>
                </div>

                <div className="an-field">
                  <label className="an-label">Full Name</label>
                  <div className="an-input-wrapper">
                    <FaUser className="an-input-icon" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={errors.name ? "error" : ""}
                      placeholder="Enter your name"
                    />
                  </div>
                  {errors.name && (
                    <span className="an-error-text">{errors.name}</span>
                  )}
                </div>

                <div className="an-field">
                  <label className="an-label">Verification Code (OTP)</label>
                  <div className="an-input-wrapper">
                    <FaLock className="an-input-icon" />
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className={errors.otp ? "error" : ""}
                      placeholder="Enter security code"
                      maxLength={6}
                    />
                  </div>
                  {errors.otp && (
                    <span className="an-error-text">{errors.otp}</span>
                  )}
                </div>

                <div className="an-timer-container">
                  {timer > 0 ? (
                    <p className="an-timer-text">
                      Resend available in:{" "}
                      <span className="an-timer-countdown">
                        {formatTime(timer)}
                      </span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      className="an-resend-button"
                      onClick={handleResend}
                      disabled={submitting}
                    >
                      Resend Security Code
                    </button>
                  )}
                </div>

                <div className="an-button-group">
                  <button
                    type="submit"
                    className="an-submit"
                    disabled={submitting}
                  >
                    {submitting ? "Verifying..." : "Confirm & Authorize"}
                  </button>
                  <button
                    type="button"
                    className="an-back-button"
                    onClick={() => setStep("send")}
                    disabled={submitting}
                  >
                    Go Back
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}