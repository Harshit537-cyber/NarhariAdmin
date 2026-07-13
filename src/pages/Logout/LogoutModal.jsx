import React from "react";
import "./logoutModal.css";

export default function LogoutModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3 className="modal-title">Ready to Leave?</h3>
        <p className="modal-text">Are you sure you want to log out of Austronarhari?</p>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-confirm" onClick={onConfirm}>Logout</button>
        </div>
      </div>
    </div>
  );
}