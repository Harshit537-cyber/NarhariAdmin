import React from "react";
import "./Userviewmodal.css";
import { FaTimes } from "react-icons/fa";
export default function UserViewModal({ user, onClose, title  }) {
  if (!user) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-box view-modal-box">
        <div className="view-modal-header">
  <h3 className="view-modal-title">{title}</h3>

  <button className="modal-close-btn" onClick={onClose}>
    <FaTimes />
  </button>
</div>

        <div className="view-details-list">
          <div className="view-row">
            <span className="view-label">Name</span>
            <span className="view-value">{user.fullName || user.name || "-"}</span>
          </div>

          <div className="view-row">
            <span className="view-label">Email</span>
            <span className="view-value">{user.email || "-"}</span>
          </div>

          <div className="view-row">
            <span className="view-label">Mobile</span>
            <span className="view-value">{user.mobile || "N/A"}</span>
          </div>
<div className="view-row">
  <span className="view-label">Gender</span>
  <span className="view-value">{user.gender || "-"}</span>
</div>

<div className="view-row">
  <span className="view-label">Zodiac</span>
  <span className="view-value">{user.zodiac || "-"}</span>
</div>

<div className="view-row">
  <span className="view-label">Date of Birth</span>
  <span className="view-value">
    {user.dateOfBirth
      ? new Date(user.dateOfBirth).toLocaleDateString()
      : "-"}
  </span>
</div>

<div className="view-row">
  <span className="view-label">Time of Birth</span>
  <span className="view-value">{user.timeOfBirth || "-"}</span>
</div>

<div className="view-row">
  <span className="view-label">Place of Birth</span>
  <span className="view-value">{user.placeOfBirth || "-"}</span>
</div>

<div className="view-row">
  <span className="view-label">Wallet Balance</span>
  <span className="view-value">₹ {user.walletBalance ?? 0}</span>
</div>


          <div className="view-row">
            <span className="view-label">Role</span>
            <span className={`role-badge role-${user.role}`}>{user.role}</span>
          </div>

          <div className="view-row">
            <span className="view-label">Status</span>
            <span className={`status-badge ${user.isActive ? "active" : "pending-approval"}`}>
              {user.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          {!user.isActive && (
            <>
              <div className="view-row">
                <span className="view-label">Deactivated By</span>
                <span className="view-value">{user.deactivatedBy || "-"}</span>
              </div>
              <div className="view-row">
                <span className="view-label">Deactivated At</span>
                <span className="view-value">
                  {user.deactivatedAt ? new Date(user.deactivatedAt).toLocaleString() : "-"}
                </span>
              </div>
              <div className="view-row">
                <span className="view-label">Reactivate At</span>
                <span className="view-value">
                  {user.reactivateAt ? new Date(user.reactivateAt).toLocaleString() : "-"}
                </span>
              </div>
              <div className="view-row">
                <span className="view-label">Reason</span>
                <span className="view-value">{user.deactivationReason || "-"}</span>
              </div>
              <div className="view-row">
                <span className="view-label">Reason Note</span>
                <span className="view-value">{user.deactivationReasonNote || "-"}</span>
              </div>
            </>
          )}

          <div className="view-row">
            <span className="view-label">Joined</span>
            <span className="view-value">
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
            </span>
          </div>
        </div>

      
      </div>
    </div>
  );
}