import React, { useState, useEffect } from "react";import "./ApprovalModal.css";

import { getPendingPartners } from "../../../api/Controller/partner"; 


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


function ApprovalModal({ isOpen, onClose, partner, onAction }) {
  const [document, setDocument] = useState("selfie");

  if (!isOpen || !partner) return null;

  const docData = partner[document];

  const handleClick = (status) => {
    onAction({ partnerId: partner._id, document, status });
  };
if (loading) {
  return <h2>Loading...</h2>;
}
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
            <label>Document status</label>
            <span className={`status-tag ${statusClass(docData?.status)}`}>
              {docData?.status || "Pending"}
            </span>
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
        </div>

        <div className="approval-actions">
          <button className="reject-btn" onClick={() => handleClick("Rejected")}>
            Reject
          </button>
          <button className="approve-btn" onClick={() => handleClick("Approved")}>
            Approve
          </button>
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
const [loading, setLoading] = useState(true);  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);

  const openModal = (partner) => setSelected(partner);
  const closeModal = () => setSelected(null);

  const handleAction = ({ partnerId, document, status }) => {
    setPartners((prev) =>
      prev.map((p) =>
        p._id === partnerId
          ? { ...p, [document]: { ...p[document], status } }
          : p
      )
    );
    setToast(`${DOCUMENT_LABELS[document]} ${status.toLowerCase()}`);
    closeModal();
    setTimeout(() => setToast(null), 2500);
  };
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
  return (
    <div className="profile-approval-page">
      {toast && <div className="toast">{toast}</div>}

      <div className="page-header">
        <h1>Partner document approval</h1>
        <p>Review KYC documents and approve or reject partner profiles.</p>
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
            <span className={`status-tag ${p.isVerified ? "approved" : "pending"}`}>
              {p.isVerified ? "Approved" : "Pending"}
            </span>
            <button className="review-btn" onClick={() => openModal(p)}>
              Review documents
            </button>
          </div>
        ))}
      </div>

      <ApprovalModal
        isOpen={!!selected}
        onClose={closeModal}
        partner={selected}
        onAction={handleAction}
      />
    </div>
  );
}