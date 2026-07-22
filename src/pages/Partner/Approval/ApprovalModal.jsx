import React, { useState, useEffect } from "react";
import "./ApprovalModal.css";

import {
  getPendingPartners,
  updatePartnerDocumentStatus,
} from "../../../api/Controller/partner";

const DOCUMENT_LABELS = {
  selfie: "Selfie",
  nationalId: "National ID",
  astrologyCertificate: "Astrology certificate",
  addressProof: "Address proof",
};

const statusClass = (status) => {
  if (status === "Approved") return "approved";
  if (status === "Rejected") return "rejected";
  return "pending";
};

function ApprovalModal({ isOpen, onClose, partner, onApprove, approving }) {
  const [document, setDocument] = useState("selfie");

  if (!isOpen || !partner) return null;

  const docData = partner[document];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="approval-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Partner document approval</h2>

        <div className="approval-content">
          <div className="approval-row approval-row--partner">
            <img
              className="partner-avatar"
              src={
                partner.profilePic ||
                "https://api.dicebear.com/7.x/initials/svg?seed=" +
                  encodeURIComponent(partner.fullName || partner.mobile)
              }
              alt=""
            />
            <div>
              <span className="partner-name">
                {partner.fullName || "Unnamed partner"}
              </span>
              <span className="partner-mobile">{partner.mobile}</span>
            </div>
          </div>

          <div className="approval-row">
            <label>Document</label>
            <select
              value={document}
              onChange={(e) => setDocument(e.target.value)}
            >
              {Object.entries(DOCUMENT_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="approval-row">
            <label>Document preview</label>
            {docData?.url ? (
              <img
                className="doc-preview"
                src={docData.url}
                alt={DOCUMENT_LABELS[document]}
              />
            ) : (
              <div className="doc-preview doc-preview--empty">
                Not uploaded yet
              </div>
            )}
          </div>

          <div className="approval-row">
            <label>Profile approval status</label>
            <button
              type="button"
              className={`status-action-btn ${statusClass(
                partner.profileApprovalStatus
              )}`}
              onClick={() => onApprove(partner._id)}
              disabled={approving}
            >
              {approving ? "Approving..." : partner.profileApprovalStatus || "Pending"}
            </button>
          </div>
        </div>

        <button className="cancel-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

/* ==========================================
   PROFILE APPROVAL — partner list + modal trigger
========================================== */
export default function ProfileApproval() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);
  const [approvingId, setApprovingId] = useState(null);

  const openModal = (partner) => setSelected(partner);
  const closeModal = () => setSelected(null);

  useEffect(() => {
    fetchPendingPartners();
  }, []);

  const fetchPendingPartners = async () => {
    try {
      setLoading(true);

      const response = await getPendingPartners();

      console.log("Pending Partners:", response);

      setPartners(response.data || response.partners || []);
    } catch (error) {
      console.error("Error fetching partners:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (partnerId) => {
    try {
      setApprovingId(partnerId);

      const response = await updatePartnerDocumentStatus(partnerId, {
        status: "Approved",
      });

      if (response.success) {
        setToast("Status approved successfully");
        setPartners((prev) => prev.filter((p) => p._id !== partnerId));
        closeModal();
      } else {
        setToast(response.message || "Something went wrong");
      }
    } catch (error) {
      setToast(error.message || "Something went wrong");
    } finally {
      setApprovingId(null);
      setTimeout(() => setToast(null), 2500);
    }
  };

  return (
    <div className="profile-approval-page">
      {toast && <div className="toast">{toast}</div>}

      <div className="page-header">
        <h1>Partner document approval</h1>
        <p>Review KYC documents of partner profiles.</p>
      </div>

      <div className="partner-grid">
        {partners.map((p) => (
          <div className="partner-card" key={p._id}>
            <div className="partner-card-top">
              <img
                className="partner-avatar"
                src={
                  p.profilePic ||
                  "https://api.dicebear.com/7.x/initials/svg?seed=" +
                    encodeURIComponent(p.fullName || p.mobile)
                }
                alt=""
              />
              <div>
                <span className="partner-name">
                  {p.fullName || "Unnamed partner"}
                </span>
                <span className="partner-mobile">{p.mobile}</span>
              </div>
            </div>

            <div className="partner-card-actions">
              <button className="review-btn" onClick={() => openModal(p)}>
                Review documents
              </button>
            </div>
          </div>
        ))}
      </div>

      <ApprovalModal
        isOpen={!!selected}
        onClose={closeModal}
        partner={selected}
        onApprove={handleApprove}
        approving={!!selected && approvingId === selected._id}
      />
    </div>
  );
}