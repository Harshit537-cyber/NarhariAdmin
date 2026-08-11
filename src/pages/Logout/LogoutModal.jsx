import React from "react";
import { FiLogOut, FiX } from "react-icons/fi";
import "./logoutModal.css";

export default function LogoutModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="logout-overlay" onClick={onClose}>
      <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <FiX />
        </button>

        <div className="logout-icon">
          <FiLogOut />
        </div>

        <h2>Logout</h2>

        <p>
          Are you sure you want to logout from
          <strong> NAMAH ASTRO Admin Panel</strong>?
        </p>

        <div className="logout-actions">
          <button className="cancel-btn" onClick={onClose}>
            Stay Here
          </button>

          <button className="logout-btn" onClick={onConfirm}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
