import React, { useState, useEffect } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { FaShieldAlt, FaMobileAlt, FaKey, FaArrowRight, FaLock, FaCheckCircle } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

// Firebase Authentication Imports
import { auth } from "../../firebase/firebase"; // Path check kar lein
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

export default function Login() {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({});
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);

  const navigate = useNavigate();

  // 1. ReCAPTCHA ko SIRF EK BAAR Initialize karein (React StrictMode SAFE)
  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            // reCAPTCHA solved automatically
          },
          "expired-callback": () => {
            toast.error("reCAPTCHA expired. Please try again.");
          },
        }
      );
    }
  }, []);

  // 2. Send OTP Handler
  async function handleSendOtp(e) {
    if (e) e.preventDefault();

    if (!/^\d{10}$/.test(mobile)) {
      setErrors({ mobile: "Enter a valid 10-digit mobile number" });
      return;
    }

    setErrors({});
    setSendingOtp(true);

    try {
      // Pehle se bane huye recaptchaVerifier ko reuse kar rahe hain (NO new RecaptchaVerifier call)
      const appVerifier = window.recaptchaVerifier;
      const formattedPhoneNumber = `+91${mobile}`; // Country Code (India)

      const confirmation = await signInWithPhoneNumber(
        auth,
        formattedPhoneNumber,
        appVerifier
      );

      setConfirmationResult(confirmation);
      toast.success("OTP sent successfully to your mobile.");
      setShowOtpModal(true);
    } catch (error) {
      console.error("Firebase OTP Error:", error);

      // Agar error aaye toh reCAPTCHA reset karein (Delete na karein)
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.render().then((widgetId) => {
          if (window.grecaptcha) {
            window.grecaptcha.reset(widgetId);
          }
        });
      }

      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text:
          error.code === "auth/invalid-app-credential"
            ? "Firebase Settings Error: Add 'localhost' in Firebase Console > Auth > Settings > Authorized Domains."
            : error.message || "Unable to send OTP at the moment.",
        customClass: {
          popup: "swal-white-popup",
        },
      });
    } finally {
      setSendingOtp(false);
    }
  }

  // Input Validation
  function validate() {
    const next = {};
    if (!mobile.trim()) {
      next.mobile = "Mobile number required";
    } else if (!/^\d{10}$/.test(mobile)) {
      next.mobile = "Enter a valid 10-digit mobile number";
    }

    if (!otp.trim()) {
      next.otp = "OTP is required";
    } else if (!/^\d{6}$/.test(otp)) {
      next.otp = "Enter a valid 6-digit OTP";
    }
    return next;
  }

  // 3. Verify OTP Handler
  async function handleSubmit(e) {
    if (e) e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    try {
      if (!confirmationResult) {
        toast.error("OTP Session Expired. Please request OTP again.");
        return;
      }

      const userCredential = await confirmationResult.confirm(otp);
      const user = userCredential.user;

      const token = await user.getIdToken();
      localStorage.setItem("authToken", token);

      toast.success("Login Successful! Welcome Back.");
      setShowOtpModal(false);
      navigate("/dashboard");
    } catch (error) {
      console.error("Verification Error:", error);
      toast.error("Invalid or Expired OTP");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="an-wp-page">
      {/* Invisible Recaptcha Container (Ye page load par hamesha hona chahiye) */}
      <div id="recaptcha-container"></div>

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

          <form onSubmit={handleSendOtp} noValidate className="an-wp-form">
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

      {/* OTP Verification Modal */}
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