import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { loginAdmin, sendOtp } from "../../api/Controller/authController";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { FaShieldAlt, FaMobileAlt, FaKey, FaArrowRight, FaLock, FaCheckCircle } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

export default function Login() {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({});
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSendOtp() {
    if (!/^\d{10}$/.test(mobile)) {
      setErrors({ mobile: "Enter a valid 10-digit mobile number" });
      return;
    }

    setErrors({});
    setSendingOtp(true);

    try {
      const res = await sendOtp({ mobile, action: "login" });
      toast.success("OTP sent successfully to your mobile.");

      if (res.otp) {
        setOtp(res.otp);
      }

      setShowOtpModal(true);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: error.message || "Unable to send OTP at the moment.",
        customClass: {
          popup: "swal-white-popup",
        },
      });
    } finally {
      setSendingOtp(false);
    }
  }

  function validate() {
    const next = {};
    if (!mobile.trim()) {
      next.mobile = "Mobile number required";
    } else if (!/^\d{10}$/.test(mobile)) {
      next.mobile = "Enter a valid 10-digit mobile number";
    }

    if (!otp.trim()) {
      next.otp = "OTP is required";
    } else if (!/^\d{4,6}$/.test(otp)) {
      next.otp = "Enter a valid numeric OTP";
    }
    return next;
  }

  async function handleSubmit(e) {
    if (e) e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    try {
      const res = await loginAdmin({ mobile, otp });

      if (res.token) {
        toast.success("Login Successful! Welcome Back.");
        setShowOtpModal(false);
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(error.message || "Invalid or Expired OTP");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="an-wp-page">
      <div className="an-wp-bg-overlay" />

      <div className="an-wp-card">
        <div className="an-wp-hero">
          <div className="an-wp-hero-overlay" />
          
          <div className="an-wp-hero-content">
            <div className="an-wp-brand">
              <div className="an-wp-logo-icon">
                <HiSparkles />
              </div>
              <span>ASTRONARHARI</span>
            </div>

            <div className="an-wp-hero-body">
              <span className="an-wp-badge">ADMIN CONSOLE</span>
              <h1>Celestial Intelligence &amp; Management Portal</h1>
              <p>Manage calculations, user insights, and system metrics with enterprise precision.</p>
            </div>

            <div className="an-wp-features">
              <div className="an-wp-feature-item">
                <FaShieldAlt className="an-wp-f-icon" />
                <span>256-Bit Encrypted</span>
              </div>
              <div className="an-wp-feature-item">
                <FaCheckCircle className="an-wp-f-icon green" />
                <span>Engine Active</span>
              </div>
            </div>
          </div>
        </div>

        <div className="an-wp-form-side">
          <div className="an-wp-form-header">
            <div className="an-wp-lock-icon">
              <FaLock />
            </div>
            <h2>Welcome Back</h2>
            <p className="an-wp-sub">Sign in to Astronarhari Admin System</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleSendOtp(); }} noValidate className="an-wp-form">
            <div className="an-wp-field">
              <label>Mobile Number</label>
              <div className="an-wp-input-box">
                <span className="an-wp-prefix">+91</span>
                <FaMobileAlt className="an-wp-input-icon" />
                <input
                  type="tel"
                  value={mobile}
                  maxLength={10}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                  className={errors.mobile ? "error" : ""}
                  placeholder="Enter 10-digit number"
                />
              </div>
              {errors.mobile && <span className="an-wp-error">{errors.mobile}</span>}
            </div>

            <button
              type="submit"
              className="an-wp-btn"
              disabled={sendingOtp}
            >
              {sendingOtp ? (
                <span className="an-wp-spinner" />
              ) : (
                <>
                  <span>Send Verification OTP</span>
                  <FaArrowRight className="an-wp-arrow" />
                </>
              )}
            </button>
          </form>

          <div className="an-wp-footer">
            <p>Secured with OTP Authentication Protocol</p>
          </div>
        </div>
      </div>

      {showOtpModal && (
        <div className="an-wp-modal-overlay">
          <div className="an-wp-modal">
            <div className="an-wp-modal-badge">
              <FaKey />
            </div>
            <h3>Verify OTP</h3>
            <p>Security code sent to <strong>+91 {mobile}</strong></p>

            <div className="an-wp-otp-box">
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="• • • • • •"
                autoFocus
              />
              {errors.otp && <span className="an-wp-error center">{errors.otp}</span>}
            </div>

            <div className="an-wp-modal-btns">
              <button
                type="button"
                onClick={handleSubmit}
                className="an-wp-btn"
                disabled={submitting}
              >
                {submitting ? <span className="an-wp-spinner" /> : "Verify & Sign In"}
              </button>

              <button
                type="button"
                onClick={() => setShowOtpModal(false)}
                className="an-wp-btn-cancel"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}