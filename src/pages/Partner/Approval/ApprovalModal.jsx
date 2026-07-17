import React, { useState } from "react";
import "./ApprovalModal.css";

export default function ApprovalModal({
  isOpen,
  onClose,
  partner,
  onAction,
}) {
  const [document, setDocument] = useState("selfie");

  if (!isOpen) return null;

  const handleClick = (status) => {
    onAction({
      partnerId: partner._id,
      document,
      status,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="approval-modal">

        <h2>Partner Document Approval</h2>

        <div className="approval-content">

          <div className="approval-row">
            <label>Partner</label>
            <span>{partner?.mobile}</span>
          </div>

          <div className="approval-row">
            <label>Current Status</label>

            <span
              className={`status-tag ${
                partner?.isVerified ? "approved" : "pending"
              }`}
            >
              {partner?.isVerified ? "Approved" : "Pending"}
            </span>
          </div>

          <div className="approval-row">
            <label>Document</label>

            <select
              value={document}
              onChange={(e) => setDocument(e.target.value)}
            >
              <option value="selfie">Selfie</option>
              <option value="nationalId">National ID</option>
              <option value="astrologyCertificate">
                Astrology Certificate
              </option>
              <option value="addressProof">
                Address Proof
              </option>
            </select>
          </div>

        </div>

        <div className="approval-actions">

          <button
            className="reject-btn"
            onClick={() => handleClick("Rejected")}
          >
            Reject
          </button>

          <button
            className="approve-btn"
            onClick={() => handleClick("Approved")}
          >
            Approve
          </button>

        </div>

        <button
          className="cancel-btn"
          onClick={onClose}
        >
          Close
        </button>

      </div>
    </div>
  );
}