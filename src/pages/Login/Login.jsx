import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

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
      next.email = "Invalid email";
    if (!password) next.password = "Required";
    return next;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setSubmitting(true);
    setTimeout(() => {
      navigate("/dashboard");
      setSubmitting(false);
    }, 1000);
  }

  return (
    <div className="an-login">
      <div className="an-login-card">
        <div className="an-login-emblem">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M62 20C44 20 30 34 30 52C30 70 44 84 62 84C68 84 73.5 82.5 78 79.8C68.4 76.7 61.5 67.8 61.5 57.2C61.5 43.6 71 32.4 84 29.6C78.2 23.6 70.5 20 62 20Z"
              fill="#b8860b"
            />
          </svg>
        </div>

        <h1 className="an-login-heading">Welcome Back</h1>
        <p className="an-login-wordmark">Astronarhari</p>
        <p className="an-login-subheading">Sign in to your account</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="an-field">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? "error" : ""}
            />
          </div>
          <div className="an-field">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
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

        <p className="an-login-footer">
          New here? <a href="#signup">Create an account</a>
        </p>
      </div>
    </div>
  );
}
