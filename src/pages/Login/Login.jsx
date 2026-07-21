import React, { useState, useEffect } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { loginAdmin ,sendOtp } from "../../api/Controller/authController";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { FaShieldAlt, FaPhoneAlt, FaUser, FaLock } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import bgVideo from "../../assets/bgVideo.mp4";
import { sendFirebaseOtp, verifyFirebaseOtp } from "../../firebase/firebaseAuth";
export default function Login() {
const [mobile, setMobile] = useState("");
const [otp, setOtp] = useState("");
const [otpSent, setOtpSent] = useState(false);
  const [errors, setErrors] = useState({});
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  
async function handleSendOtp() {
  if (!/^\d{10}$/.test(mobile)) {
    setErrors({ mobile: "Enter a valid 10-digit mobile number" });
    return;
  }

  try {
    await sendFirebaseOtp(mobile);
    toast.success("OTP has been sent successfully.");
    setOtpSent(true);
    setShowOtpModal(true);
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Failed",
      text: error.message || "Unable to send OTP",
    });
  }
}
 function validate() {
  const next = {};

  if (!mobile.trim()) {
    next.mobile = "Required";
  } else if (!/^\d{10}$/.test(mobile)) {
    next.mobile = "Enter a valid 10-digit mobile number";
  }

  if (!otp.trim()) {
    next.otp = "Required";
  } else if (!/^\d+$/.test(otp)) {
    next.otp = "OTP must contain only digits";
  }

  return next;
}

 async function handleSubmit(e) {
  e.preventDefault();

  const next = validate();
  setErrors(next);
  if (Object.keys(next).length > 0) return;

  setSubmitting(true);

  try {
    const firebaseUser = await verifyFirebaseOtp(otp);
    const idToken = await firebaseUser.getIdToken();

    // idToken apne backend ko bhejo
    const res = await loginAdmin({ idToken });

    if (res.token) {
      toast.success("Login Successfully");
      setShowOtpModal(false);
      navigate("/dashboard");
    }
  } catch (error) {
    toast.error(error.message || "Invalid OTP");
  } finally {
    setSubmitting(false);
  }
}
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

          <form onSubmit={handleSubmit} noValidate>
            <div className="an-field">
             <label className="an-label">Mobile Number</label>

<input
  type="tel"
  value={mobile}
  maxLength={10}
  onChange={(e) =>
    setMobile(e.target.value.replace(/\D/g, ""))
  }
  className={errors.mobile ? "error" : ""}
  placeholder="Enter Mobile Number"
/>
            </div>

            <button
  type="button"
  className="an-submit"
  onClick={handleSendOtp}
>
  Send OTP
</button>

           
          </form>
        </div>
      </div>
   <div id="recaptcha-container"></div>
   {showOtpModal && (
  <div className="otp-modal-overlay">
    <div className="otp-modal">

      <h2>Verify OTP</h2>

      <p>Enter the 6-digit OTP sent to your mobile number.</p>

      <input
        type="text"
        maxLength={6}
        value={otp}
        onChange={(e) =>
          setOtp(e.target.value.replace(/\D/g, ""))
        }
        placeholder="Enter OTP"
      />

      <div className="otp-modal-buttons">

       <button
  type="button"
  onClick={handleSubmit}
  className="an-submit"
  disabled={submitting}
>
  {submitting ? "Verifying..." : "Verify OTP"}
</button>

        <button
          onClick={() => setShowOtpModal(false)}
          className="otp-cancel"
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