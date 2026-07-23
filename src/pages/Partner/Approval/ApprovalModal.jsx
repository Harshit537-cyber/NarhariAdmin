import React, { useState, useEffect } from "react";
import "./ApprovalModal.css";
import { toast } from "react-toastify";

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

const PAGE_SIZE = 9;

const statusClass = (status) => {
  if (status === "Approved") return "approved";
  if (status === "Rejected") return "rejected";
  return "pending";
};

function ApprovalModal({ isOpen, onClose, partner, onApprove, approving }) {
  const [document, setDocument] = useState("selfie");

  // reset to the first document tab whenever a new partner is opened
  useEffect(() => {
    if (partner) setDocument("selfie");
  }, [partner]);

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
            <div className="doc-tabs">
              {Object.entries(DOCUMENT_LABELS).map(([key, label]) => {
                const uploaded = !!partner[key]?.url;
                return (
                  <button
                    key={key}
                    type="button"
                    className={`doc-tab ${document === key ? "active" : ""} ${
                      uploaded ? "has-doc" : ""
                    }`}
                    onClick={() => setDocument(key)}
                  >
                    <span className="doc-tab-dot" />
                    {label}
                  </button>
                );
              })}
            </div>
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
              onClick={() => {
                if (!docData?.url) {
                  toast.error("This document is not uploaded yet, cannot approve.");
                  return;
                }
                onApprove(partner._id, document);
              }}
              disabled={approving}
            >
              {approving
                ? "Approving..."
                : partner.profileApprovalStatus || "Pending"}
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
   PAGINATION — full-width, attractive page bar
========================================== */
function ChevronIcon({ direction = "left" }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      style={{
        transform: direction === "right" ? "rotate(180deg)" : "none",
      }}
    >
      <path
        d="M15 18L9 12L15 6"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Pagination({ currentPage, totalPages, totalItems, pageSize, onPageChange }) {
  if (totalPages <= 1) return null;

  const pageNumbers = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  start = Math.max(1, end - maxVisible + 1);

  for (let i = start; i <= end; i++) {
    pageNumbers.push(i);
  }

  const rangeStart = (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="pagination-bar">
      <span className="pagination-range">
        Showing <strong>{rangeStart}</strong>–<strong>{rangeEnd}</strong> of{" "}
        <strong>{totalItems}</strong> partners
      </span>

      <div className="pagination">
        <button
          className="pagination-btn pagination-btn--nav"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <ChevronIcon direction="left" />
        </button>

        {start > 1 && (
          <>
            <button className="pagination-btn" onClick={() => onPageChange(1)}>
              1
            </button>
            {start > 2 && <span className="pagination-ellipsis">…</span>}
          </>
        )}

        {pageNumbers.map((num) => (
          <button
            key={num}
            className={`pagination-btn ${num === currentPage ? "active" : ""}`}
            onClick={() => onPageChange(num)}
          >
            {num}
          </button>
        ))}

        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="pagination-ellipsis">…</span>}
            <button
              className="pagination-btn"
              onClick={() => onPageChange(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          className="pagination-btn pagination-btn--nav"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <ChevronIcon direction="right" />
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
  const [approvingId, setApprovingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const openModal = (partner) => setSelected(partner);
  const closeModal = () => setSelected(null);

  useEffect(() => {
    fetchPendingPartners();
  }, []);

  const fetchPendingPartners = async () => {
    try {
      setLoading(true);

      const response = await getPendingPartners();

      setPartners(response.data || response.partners || []);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching partners:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (partnerId, documentType) => {
    try {
      setApprovingId(partnerId);

      const response = await updatePartnerDocumentStatus(partnerId, {
        document: documentType,
        status: "Approved",
      });

      if (response.success) {
        toast.success(response.message || "Partner approved successfully");
        setPartners((prev) => {
          const updated = prev.filter((p) => p._id !== partnerId);
          // if removing the last item on the current page pushes the page
          // out of range, step back a page
          const newTotalPages = Math.max(1, Math.ceil(updated.length / PAGE_SIZE));
          if (currentPage > newTotalPages) {
            setCurrentPage(newTotalPages);
          }
          return updated;
        });
        closeModal();
      } else {
        toast.error(response.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setApprovingId(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(partners.length / PAGE_SIZE));
  const paginatedPartners = partners.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="profile-approval-page">
      <div className="page-header">
        <div className="page-header-titles">
          <span className="page-header-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z"
                fill="#ffffff"
              />
              <circle cx="19" cy="18" r="1.6" fill="#ffffff" opacity="0.85" />
            </svg>
          </span>
          <div>
            <h1>Partner document approval</h1>
            <p>Review KYC documents of partner profiles.</p>
          </div>
        </div>
        {!loading && partners.length > 0 && (
          <span className="page-header-badge">
            <span className="page-header-badge-dot" />
            {partners.length} awaiting review
          </span>
        )}
      </div>

      <div className="partner-grid">
        {paginatedPartners.map((p) => {
          const docKeys = Object.keys(DOCUMENT_LABELS);
          return (
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

              <div className="doc-status-row">
                {docKeys.map((key) => {
                  const uploaded = !!p[key]?.url;
                  return (
                    <span
                      key={key}
                      className={`doc-chip ${uploaded ? "is-uploaded" : "is-missing"}`}
                    >
                      <span className="doc-chip-dot" />
                      {DOCUMENT_LABELS[key]}
                    </span>
                  );
                })}
              </div>

              <div className="partner-card-actions">
                <button className="review-btn" onClick={() => openModal(p)}>
                  Review documents
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {!loading && partners.length === 0 && (
        <p className="empty-state">No pending partners to review.</p>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={partners.length}
        pageSize={PAGE_SIZE}
        onPageChange={handlePageChange}
      />

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