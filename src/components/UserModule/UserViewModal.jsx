import React from "react";
import "./UserViewModal.css";

/**
 * Reusable "View User" modal.
 * Parent se `user` object aur `onClose` function pass karna hai.
 * Agar user null hai to kuch render nahi hoga.
 */
export default function UserViewModal({ user, onClose }) {
  if (!user) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box view-modal-box">
        <h3 className="view-modal-title">✦ User Details</h3>

        <div className="view-details-list">
          <div className="view-row">
            <span className="view-label">Name</span>
            <span className="view-value">{user.name || "-"}</span>
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

        <div className="modal-actions">
          <button className="btn-chat" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}