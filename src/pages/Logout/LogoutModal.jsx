import React, { useEffect } from "react";
import { FiLogOut, FiX } from "react-icons/fi";
import "./logoutModal.css";

export default function LogoutModal({ isOpen, onClose, onConfirm }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="logout-overlay" onClick={onClose}>
      <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="Close">
          <FiX />
        </button>

        <div className="icon-wrapper">
          <div className="icon-pulse"></div>
          <div className="logout-icon">
            <FiLogOut />
          </div>
        </div>

        <div className="modal-content">
          <h2>Ready to leave?</h2>
          <p>
            You are about to log out from{" "}
            <span className="brand-highlight">NAMAH ASTRO</span> Admin Panel.
          </p>
        </div>

        <div className="logout-actions">
          <button className="cancel-btn" onClick={onClose}>
            Stay Logged In
          </button>
          <button className="logout-btn" onClick={onConfirm}>
            <FiLogOut size={16} />
            <span>Yes, Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}