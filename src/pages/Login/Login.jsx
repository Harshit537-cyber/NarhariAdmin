import React, { useState, useEffect } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { 
  FaShieldAlt, 
  FaMobileAlt, 
  FaKey, 
  FaArrowRight, 
  FaLock, 
  FaCheckCircle, 
  FaUser, 
  FaEnvelope, 
  FaMapMarkerAlt 
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

import { auth } from "../../firebase/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [step, setStep] = useState(1);

  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const [errors, setErrors] = useState({});
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [firebaseToken, setFirebaseToken] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => {},
          "expired-callback": () => {
            toast.error("reCAPTCHA expired. Please try again.");
          },
        }
      );
    }
  }, []);

  const resetForm = () => {
    setMobile("");
    setOtp("");
    setName("");
    setEmail("");
    setAddress("");
    setErrors({});
    setStep(1);
    setShowOtpModal(false);
  };

  const toggleMode = (mode) => {
    setIsRegister(mode);
    resetForm();
  };

  async function handleSendOtp(e) {
    if (e) e.preventDefault();

    if (!/^\d{10}$/.test(mobile)) {
      setErrors({ mobile: "Enter a valid 10-digit mobile number" });
      return;
    }

    setErrors({});
    setSendingOtp(true);

    try {
      const appVerifier = window.recaptchaVerifier;
      const formattedPhoneNumber = `+91${mobile}`;

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

  function validateOtp() {
    const next = {};
    if (!otp.trim()) {
      next.otp = "OTP is required";
    } else if (!/^\d{6}$/.test(otp)) {
      next.otp = "Enter a valid 6-digit OTP";
    }
    return next;
  }

  async function handleVerifyOtp(e) {
    if (e) e.preventDefault();
    const next = validateOtp();
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
      setFirebaseToken(token);

      setShowOtpModal(false);

      if (isRegister) {
        toast.success("Mobile Verified! Complete your profile.");
        setStep(2);
      } else {
        localStorage.setItem("authToken", token);
        toast.success("Login Successful! Welcome Back.");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Verification Error:", error);
      toast.error("Invalid or Expired OTP");
    } finally {
      setSubmitting(false);
    }
  }

  function validateRegisterFields() {
    const next = {};
    if (!name.trim()) next.name = "Full Name is required";
    if (!email.trim()) {
      next.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "Enter a valid email address";
    }
    if (!address.trim()) next.address = "Address is required";
    return next;
  }

  async function handleRegisterSubmit(e) {
    if (e) e.preventDefault();
    const next = validateRegisterFields();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    try {
      const response = await fetch("https://your-api-domain.com/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${firebaseToken}`,
        },
        body: JSON.stringify({
          name,
          email,
          address,
          mobile,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("authToken", data.token || firebaseToken);
        toast.success("Registration Successful! Welcome.");
        navigate("/dashboard");
      } else {
        toast.error(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Register Error:", error);
      toast.error("Network error. Could not complete registration.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="an-wp-page">
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
          <div className="an-wp-tabs">
            <button
              type="button"
              className={!isRegister ? "active" : ""}
              onClick={() => toggleMode(false)}
            >
              Sign In
            </button>
            <button
              type="button"
              className={isRegister ? "active" : ""}
              onClick={() => toggleMode(true)}
            >
              Register
            </button>
          </div>

          <div className="an-wp-form-header">
            <div className="an-wp-lock-icon">
              <FaLock />
            </div>
            <h2>{isRegister ? "Create Account" : "Welcome Back"}</h2>
            <p className="an-wp-sub">
              {isRegister
                ? "Register to access Astronarhari Portal"
                : "Sign in to Astronarhari Admin System"}
            </p>
          </div>

          {(!isRegister || (isRegister && step === 1)) && (
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

              <button type="submit" className="an-wp-btn" disabled={sendingOtp}>
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
          )}

          {isRegister && step === 2 && (
            <form onSubmit={handleRegisterSubmit} noValidate className="an-wp-form">
              <div className="an-wp-field">
                <label>Full Name</label>
                <div className="an-wp-input-box">
                  <FaUser className="an-wp-input-icon" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={errors.name ? "error" : ""}
                    placeholder="Enter full name"
                  />
                </div>
                {errors.name && <span className="an-wp-error">{errors.name}</span>}
              </div>

              <div className="an-wp-field">
                <label>Email Address</label>
                <div className="an-wp-input-box">
                  <FaEnvelope className="an-wp-input-icon" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={errors.email ? "error" : ""}
                    placeholder="Enter email address"
                  />
                </div>
                {errors.email && <span className="an-wp-error">{errors.email}</span>}
              </div>

              <div className="an-wp-field">
                <label>Address</label>
                <div className="an-wp-input-box">
                  <FaMapMarkerAlt className="an-wp-input-icon" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className={errors.address ? "error" : ""}
                    placeholder="Enter address"
                  />
                </div>
                {errors.address && <span className="an-wp-error">{errors.address}</span>}
              </div>

              <button type="submit" className="an-wp-btn" disabled={submitting}>
                {submitting ? (
                  <span className="an-wp-spinner" />
                ) : (
                  <>
                    <span>Complete Registration</span>
                    <FaArrowRight className="an-wp-arrow" />
                  </>
                )}
              </button>
            </form>
          )}

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
                onClick={handleVerifyOtp}
                className="an-wp-btn"
                disabled={submitting}
              >
                {submitting ? <span className="an-wp-spinner" /> : "Verify OTP"}
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