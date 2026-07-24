import React, { useState, useEffect } from "react";
import "./ProfileApproval.css";
import { toast } from "react-toastify";
import {
  FaEye,
  FaUsers,
  FaCheckCircle,
  FaClock,
  FaFileAlt,
  FaCrown,
  FaBolt,
  FaShieldAlt,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaCheck,
  FaExclamationTriangle,
  FaUserCheck,
} from "react-icons/fa";
import { getPendingPartners, updatePartnerStatus } from "../../../api/Controller/pendingPartnerService";

const DOCUMENT_LABELS = {
  selfie: "Selfie",
  nationalId: "National ID",
  astrologyCertificate: "Astrology Cert.",
  addressProof: "Address Proof",
};

const PAGE_SIZE = 6;

function ProfileApprovalModal({ isOpen, onClose, partner, onApproveProfile, approving }) {
  const [activeDoc, setActiveDoc] = useState("selfie");

  useEffect(() => {
    if (partner) setActiveDoc("selfie");
  }, [partner]);

  if (!isOpen || !partner) return null;

  const docData = partner[activeDoc];

  return (
    <div className="ultra-modal-backdrop" onClick={onClose}>
      <div className="ultra-modal-box approval-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-top-header">
          <div className="modal-title-wrap">
            <FaUserCheck className="modal-header-icon" />
            <div>
              <h3>Partner Profile Approval</h3>
              <p className="subtle-modal-text">Inspect documents & approve partner profile</p>
            </div>
          </div>
          <button className="btn-close-modal" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="modal-partner-strip">
          <img
            className="partner-avatar-lg"
            src={
              partner.profilePic ||
              partner.avatar ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                partner.fullName || partner.name || partner.mobile || "User"
              )}`
            }
            alt=""
          />
          <div className="strip-info">
            <span className="strip-name">{partner.fullName || partner.name || "Unnamed Partner"}</span>
            <span className="strip-phone">{partner.mobile || partner.phone || "N/A"}</span>
          </div>
          <span className={`status-pill status-${(partner.profileApprovalStatus || "pending").toLowerCase()}`}>
            {partner.profileApprovalStatus || "Pending"}
          </span>
        </div>

        <div className="doc-switcher-container">
          <label className="section-mini-label">Inspect Uploaded Documents</label>
          <div className="doc-tab-buttons">
            {Object.entries(DOCUMENT_LABELS).map(([key, label]) => {
              const uploaded = !!partner[key]?.url;
              return (
                <button
                  key={key}
                  type="button"
                  className={`doc-switcher-tab ${activeDoc === key ? "active" : ""} ${
                    uploaded ? "is-present" : "is-absent"
                  }`}
                  onClick={() => setActiveDoc(key)}
                >
                  <span className="tab-indicator-dot" />
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="doc-preview-container">
          {docData?.url ? (
            <div className="preview-image-wrapper">
              <img
                className="doc-preview-img"
                src={docData.url}
                alt={DOCUMENT_LABELS[activeDoc]}
              />
            </div>
          ) : (
            <div className="preview-empty-state">
              <FaExclamationTriangle className="warning-icon" />
              <span>This document has not been uploaded yet</span>
            </div>
          )}
        </div>

        <div className="modal-actions-wrapper">
          <button
            type="button"
            className="btn-modal-action btn-approve"
            disabled={approving}
            onClick={() => onApproveProfile(partner._id, "Approved")}
          >
            <FaCheck /> {approving ? "Processing..." : "Approve Profile"}
          </button>

          <button
            type="button"
            className="btn-modal-action btn-reject"
            disabled={approving}
            onClick={() => onApproveProfile(partner._id, "Rejected")}
          >
            <FaTimes /> Reject Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProfileApproval() {
  const [partners, setPartners] = useState([]);
  const [approvedCount, setApprovedCount] = useState(28);
  const [loading, setLoading] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [approvingId, setApprovingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true);
        const response = await getPendingPartners();
        if (response.success && response.data) {
          setPartners(response.data);
        }
      } catch (error) {
        toast.error(error.message || "Failed to load pending partners");
      } finally {
        setLoading(false);
      }
    };
    
    fetchPartners();
  }, []);

  const openModal = (partner) => setSelectedPartner(partner);
  const closeModal = () => setSelectedPartner(null);

  const handleApproveProfile = async (partnerId, status) => {
    setApprovingId(partnerId);
    
    try {
      await updatePartnerStatus(partnerId, { status });
      toast.success(`Partner profile ${status.toLowerCase()} successfully!`);

      setPartners((prev) => {
        const updated = prev.filter((p) => p._id !== partnerId);
        const newTotalPages = Math.max(1, Math.ceil(updated.length / PAGE_SIZE));
        if (currentPage > newTotalPages) {
          setCurrentPage(newTotalPages);
        }
        return updated;
      });

      if (status === "Approved") {
        setApprovedCount((prev) => prev + 1);
      }

      closeModal();
    } catch (error) {
      toast.error(error.message || `Failed to ${status.toLowerCase()} profile`);
    } finally {
      setApprovingId(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(partners.length / PAGE_SIZE));
  const paginatedPartners = partners.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const totalDocumentsCount = partners.reduce((acc, curr) => {
    let count = 0;
    if (curr.selfie?.url) count++;
    if (curr.nationalId?.url) count++;
    if (curr.astrologyCertificate?.url) count++;
    if (curr.addressProof?.url) count++;
    return acc + count;
  }, 0);

  return (
    <div className="an-dashboard-container">
      <div className="ambient-orb orb-1"></div>
      <div className="ambient-orb orb-2"></div>
      <div className="ambient-orb orb-3"></div>

      <header className="db-header animate-fade-in">
        <div className="db-header-left">
          <div className="header-title-container">
            <span className="enterprise-badge">
              <FaCrown className="crown-icon" /> KYC APPROVAL HUB
            </span>
            <h1 className="wrapped-header-title">Partner Profile Approval</h1>
          </div>
          <p className="header-subtitle">
            Review partner KYC files and approve complete profiles for network onboarding.
          </p>
        </div>

        <div className="db-header-right">
          <div className="system-status-card">
            <div className="pulse-ring"></div>
            <span className="status-text">
              <FaBolt /> APPROVALS LIVE
            </span>
          </div>
        </div>
      </header>

      <div className="db-metrics-grid">
        <div className="khatarnak-card gold-theme animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div className="card-glass-shine"></div>
          <div className="card-top-bar">
            <div className="big-icon-box gold-glow">
              <FaClock />
            </div>
            <span className="trend-badge gold-pill">
              <FaClock /> AWAITING ACTION
            </span>
          </div>
          <div className="card-middle-data">
            <h2 className="giant-stat-number">{partners.length}</h2>
            <p className="giant-stat-label">Pending Profiles</p>
          </div>
          <div className="card-bottom-accent">
            <div className="glow-bar gold-bar"></div>
          </div>
        </div>

        <div className="khatarnak-card emerald-theme animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="card-glass-shine"></div>
          <div className="card-top-bar">
            <div className="big-icon-box emerald-glow">
              <FaCheckCircle />
            </div>
            <span className="trend-badge emerald-pill">
              <FaCheckCircle /> APPROVED
            </span>
          </div>
          <div className="card-middle-data">
            <h2 className="giant-stat-number">{approvedCount}</h2>
            <p className="giant-stat-label">Verified Partners</p>
          </div>
          <div className="card-bottom-accent">
            <div className="glow-bar emerald-bar"></div>
          </div>
        </div>

        <div className="khatarnak-card cyan-theme animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <div className="card-glass-shine"></div>
          <div className="card-top-bar">
            <div className="big-icon-box cyan-glow">
              <FaFileAlt />
            </div>
            <span className="trend-badge cyan-pill">
              <FaShieldAlt /> ATTACHED
            </span>
          </div>
          <div className="card-middle-data">
            <h2 className="giant-stat-number">{totalDocumentsCount}</h2>
            <p className="giant-stat-label">Uploaded Documents</p>
          </div>
          <div className="card-bottom-accent">
            <div className="glow-bar cyan-bar"></div>
          </div>
        </div>

        <div className="khatarnak-card purple-theme animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <div className="card-glass-shine"></div>
          <div className="card-top-bar">
            <div className="big-icon-box purple-glow">
              <FaUsers />
            </div>
            <span className="trend-badge purple-pill">
              <FaUsers /> TOTAL POOL
            </span>
          </div>
          <div className="card-middle-data">
            <h2 className="giant-stat-number">{partners.length + approvedCount}</h2>
            <p className="giant-stat-label">Total Applications</p>
          </div>
          <div className="card-bottom-accent">
            <div className="glow-bar purple-bar"></div>
          </div>
        </div>
      </div>

      <div className="db-content-grid">
        <div className="super-card main-table-card animate-fade-in-delayed">
          <div className="super-card-header">
            <div className="header-accent-title">
              <div className="title-vertical-bar gold"></div>
              <h2>Pending Profile Approvals Queue</h2>
            </div>
            <span className="giant-badge gold">{partners.length} Profiles Left</span>
          </div>

          {loading ? (
            <div className="khatarnak-loader">
              <div className="glowing-spinner"></div>
              <p>Loading Pending Partners Data...</p>
            </div>
          ) : partners.length === 0 ? (
            <div className="empty-state-box">
              <FaCheckCircle className="empty-icon" />
              <h3>All Clean!</h3>
              <p>No pending partner profiles awaiting approval.</p>
            </div>
          ) : (
            <>
              <div className="partner-cards-grid">
                {paginatedPartners.map((partner) => (
                  <div key={partner._id} className="partner-item-card">
                    <div className="card-header-flex">
                      <img
                        className="partner-avatar-img"
                        src={
                          partner.profilePic ||
                          partner.avatar ||
                          `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                            partner.fullName || partner.name || partner.mobile || "User"
                          )}`
                        }
                        alt=""
                      />
                      <div className="partner-head-meta">
                        <h4 className="partner-title-name">
                          {partner.fullName || partner.name || "Unnamed Partner"}
                        </h4>
                        <span className="partner-mobile-sub">{partner.mobile || partner.phone || "N/A"}</span>
                      </div>
                    </div>

                    <div className="doc-chips-row">
                      {Object.keys(DOCUMENT_LABELS).map((key) => {
                        const uploaded = !!partner[key]?.url;
                        return (
                          <span
                            key={key}
                            className={`doc-pill-chip ${uploaded ? "uploaded" : "missing"}`}
                          >
                            <span className="chip-status-dot" />
                            {DOCUMENT_LABELS[key]}
                          </span>
                        );
                      })}
                    </div>

                    <div className="card-footer-action">
                      <button
                        className="btn-pro btn-review-full"
                        onClick={() => openModal(partner)}
                      >
                        <FaEye /> Review & Approve Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pagination-bar-wrapper">
                  <span className="pagination-info-text">
                    Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                  </span>
                  <div className="pagination-controls">
                    <button
                      className="btn-square-icon"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    >
                      <FaChevronLeft />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                      <button
                        key={num}
                        className={`pagination-num-btn ${num === currentPage ? "active" : ""}`}
                        onClick={() => setCurrentPage(num)}
                      >
                        {num}
                      </button>
                    ))}
                    <button
                      className="btn-square-icon"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    >
                      <FaChevronRight />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="super-card sidebar-feed animate-fade-in-delayed">
          <div className="super-card-header">
            <div className="header-accent-title">
              <div className="title-vertical-bar"></div>
              <h2>Quick Review Feed</h2>
            </div>
            <span className="giant-badge">{partners.length} Pending</span>
          </div>

          <div className="sidebar-list-container">
            {partners.slice(0, 5).map((partner) => (
              <div key={partner._id} className="sidebar-item-row">
                <img
                  className="sidebar-avatar"
                  src={
                    partner.profilePic ||
                    partner.avatar ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                      partner.fullName || partner.name || partner.mobile || "User"
                    )}`
                  }
                  alt=""
                />
                <div className="sidebar-item-info">
                  <span className="sidebar-item-title">{partner.fullName || partner.name || "Partner"}</span>
                  <span className="sidebar-item-sub">{partner.mobile || partner.phone || "N/A"}</span>
                </div>
                <button
                  className="btn-square-icon"
                  onClick={() => openModal(partner)}
                >
                  <FaEye />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ProfileApprovalModal
        isOpen={!!selectedPartner}
        onClose={closeModal}
        partner={selectedPartner}
        onApproveProfile={handleApproveProfile}
        approving={!!selectedPartner && approvingId === selectedPartner._id}
      />
    </div>
  );
}