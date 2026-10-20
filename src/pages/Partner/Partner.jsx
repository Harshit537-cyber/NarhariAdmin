import React, { useState, useEffect, useMemo } from "react";
import "./Partner.css";
import {
  getAllPartners,
  deletePartner,
  togglePartnerStatus,
  updatePartnerMinRate
} from "../../api/Controller/partner";
import {
  FaEye,
  FaEdit,
  FaTrashAlt,
  FaSearch,
  FaCheckCircle,
  FaStar,
  FaMapMarkerAlt,
  FaBriefcase,
  FaPhoneAlt,
  FaClock,
  FaCrown,
  FaBolt,
  FaUsers,
  FaArrowUp,
  FaChevronLeft,
  FaChevronRight,
  FaGraduationCap,
  FaLanguage,
  FaVideo,
  FaComments,
  FaWallet,
  FaIdCard
} from "react-icons/fa";
import DeleteModal from "./DeleteModal";
import EditPartnerModal from "./Editpartner";
import { toast } from "react-toastify";
import ViewPartnerModal from "./ViewPartnerModal";

export default function Partner() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [rateModalOpen, setRateModalOpen] = useState(false);
  const [rateLoading, setRateLoading] = useState(false);
  const [newMinRate, setNewMinRate] = useState("");

  const [summary, setSummary] = useState({});
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusReason, setStatusReason] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [statusReasonNote, setStatusReasonNote] = useState("");
  const [totalPartners, setTotalPartners] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(t);
  }, [searchTerm]);

  useEffect(() => {
    fetchPartners(currentPage, debouncedSearch);
  }, [currentPage, debouncedSearch]);

  const fetchPartners = async (page = currentPage, search = debouncedSearch) => {
    try {
      setLoading(true);
      const res = await getAllPartners(page, 10, search);
      setPartners(res.data || []);
      setTotalPages(res.pagination?.totalPages || 1);
      setTotalPartners(res.pagination?.total || 0);
      setSummary(res.summary || {});
    } catch (err) {
      setError(err.message || "Failed to load partners");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (partner) => {
    setSelectedPartner(partner);
    setEditOpen(true);
  };

  const handleView = (partner) => {
    setSelectedPartner(partner);
    setViewOpen(true);
  };

  const handleToggleStatus = (partner) => {
    setSelectedPartner(partner);
    setStatusReason("");
    setStatusReasonNote("");
    setStatusModalOpen(true);
  };

  const handleOpenRateModal = (partner) => {
    setSelectedPartner(partner);
    setNewMinRate(partner.minRate ?? "");
    setRateModalOpen(true);
  };

  const handleConfirmRateUpdate = async () => {
    if (!selectedPartner) return;

    if (newMinRate === "" || isNaN(newMinRate) || Number(newMinRate) < 0) {
      toast.error("Please enter a valid rate");
      return;
    }

    try {
      setRateLoading(true);
      await updatePartnerMinRate(selectedPartner._id, Number(newMinRate));

      setPartners((prev) =>
        prev.map((p) =>
          p._id === selectedPartner._id
            ? { ...p, minRate: Number(newMinRate) }
            : p
        )
      );

      toast.success("Rate updated and notification sent successfully");
      setRateModalOpen(false);
      setSelectedPartner(null);
      setNewMinRate("");
    } catch (err) {
      toast.error(err.message || "Failed to update rate");
    } finally {
      setRateLoading(false);
    }
  };

  const confirmStatusChange = async () => {
    if (!selectedPartner) return;

    const isCurrentlyActive = !!selectedPartner.isActive;

    const data = {
      reason: statusReason.trim() || (isCurrentlyActive ? "Deactivated by admin" : "Activated by admin"),
      reasonNote: statusReasonNote.trim() || (isCurrentlyActive ? "Partner deactivated by admin" : "Partner activated by admin"),
    };

    try {
      setStatusLoading(true);
      await togglePartnerStatus(selectedPartner._id, data);

      setPartners((prev) =>
        prev.map((p) =>
          p._id === selectedPartner._id ? { ...p, isActive: !isCurrentlyActive } : p
        )
      );

      toast.success(
        isCurrentlyActive ? "Partner deactivated successfully" : "Partner activated successfully"
      );

      setStatusModalOpen(false);
      setSelectedPartner(null);
      setStatusReason("");
      setStatusReasonNote("");
    } catch (err) {
      console.error("Toggle status error:", err);
      toast.error(err.message || "Failed to update partner status");
    } finally {
      setStatusLoading(false);
    }
  };

  const confirmDelete = async () => {
    try {
      await deletePartner(selectedPartner._id);
      setPartners((prev) =>
        prev.filter((partner) => partner._id !== selectedPartner._id)
      );
      toast.success("Partner deleted successfully");
      setDeleteOpen(false);
      setSelectedPartner(null);
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Failed to delete partner");
    }
  };

  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const verifiedCount = partners.filter((p) => p.isVerified).length;
    const kycPendingCount = partners.filter(
      (p) => (p.kycStatus || "").toLowerCase() === "pending"
    ).length;
    const newToday = partners.filter(
      (p) => new Date(p.createdAt).toDateString() === today
    ).length;

    return {
      total: summary.totalPartners ?? totalPartners,
      active: summary.activePartners ?? partners.filter((p) => p.isActive).length,
      verifiedCount,
      kycPendingCount,
      newToday
    };
  }, [partners, summary, totalPartners]);

  const filteredPartners = useMemo(() => {
    return partners.filter((partner) => {
      if (filterType === "active") return partner.isActive;
      if (filterType === "verified") return partner.isVerified;
      if (filterType === "kycPending")
        return (partner.kycStatus || "").toLowerCase() === "pending";
      return true;
    });
  }, [partners, filterType]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "P");

  const formatCurrency = (val) => {
    const num = Number(val);
    if (isNaN(num)) return "0";
    return num.toLocaleString("en-IN");
  };

  return (
    <div className="an-partner-container">
      <div className="ambient-orb orb-1"></div>
      <div className="ambient-orb orb-2"></div>
      <div className="ambient-orb orb-3"></div>

      <header className="db-header animate-fade-in">
        <div className="db-header-left">
          <div className="header-title-container">
            <span className="enterprise-badge">
              <FaCrown className="crown-icon" /> COSMIC PARTNER NETWORK
            </span>
            <h1 className="wrapped-header-title">Partner Management</h1>
          </div>
          <p className="header-subtitle">
            Real-time telemetry, profiles, and status controls for celestial guides.
          </p>
        </div>

        <div className="db-header-right">
          <div className="system-status-card">
            <div className="pulse-ring"></div>
            <span className="status-text"><FaBolt /> SYSTEM LIVE</span>
          </div>
        </div>
      </header>

      <div className="db-metrics-grid">
        <div className="khatarnak-card cyan-theme animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div className="card-glass-shine"></div>
          <div className="card-top-bar">
            <div className="big-icon-box cyan-glow">
              <FaUsers />
            </div>
            <span className="trend-badge cyan-pill">
              <FaArrowUp /> +{stats.newToday} TODAY
            </span>
          </div>

          <div className="card-middle-data">
            <h2 className="giant-stat-number">{stats.total.toLocaleString()}</h2>
            <p className="giant-stat-label">Total Partners</p>
          </div>

          <div className="card-bottom-accent">
            <div className="glow-bar cyan-bar"></div>
          </div>
        </div>

        <div className="khatarnak-card emerald-theme animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="card-glass-shine"></div>
          <div className="card-top-bar">
            <div className="big-icon-box emerald-glow">
              <FaCheckCircle />
            </div>
            <span className="trend-badge emerald-pill">
              <FaCheckCircle /> VERIFIED
            </span>
          </div>

          <div className="card-middle-data">
            <h2 className="giant-stat-number">{stats.verifiedCount.toLocaleString()}</h2>
            <p className="giant-stat-label">Verified Profiles</p>
          </div>

          <div className="card-bottom-accent">
            <div className="glow-bar emerald-bar"></div>
          </div>
        </div>

        <div className="khatarnak-card gold-theme animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <div className="card-glass-shine"></div>
          <div className="card-top-bar">
            <div className="big-icon-box gold-glow">
              <FaClock />
            </div>
            <span className="trend-badge gold-pill">
              <FaBolt /> ACTION NEEDED
            </span>
          </div>

          <div className="card-middle-data">
            <h2 className="giant-stat-number">{stats.kycPendingCount.toLocaleString()}</h2>
            <p className="giant-stat-label">KYC Verification Pending</p>
          </div>

          <div className="card-bottom-accent">
            <div className="glow-bar gold-bar"></div>
          </div>
        </div>
      </div>

      <div className="pt-controls-bar animate-fade-in">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, mobile, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-tabs">
          <button
            className={`filter-btn ${filterType === "all" ? "active" : ""}`}
            onClick={() => setFilterType("all")}
          >
            All ({totalPartners})
          </button>
          <button
            className={`filter-btn ${filterType === "active" ? "active" : ""}`}
            onClick={() => setFilterType("active")}
          >
            Active ({summary.activePartners ?? 0})
          </button>
          <button
            className={`filter-btn ${filterType === "verified" ? "active" : ""}`}
            onClick={() => setFilterType("verified")}
          >
            Verified
          </button>
          <button
            className={`filter-btn ${filterType === "kycPending" ? "active" : ""}`}
            onClick={() => setFilterType("kycPending")}
          >
            KYC Pending
          </button>
        </div>
      </div>

      <div className="pt-content-grid animate-fade-in-delayed">
        {loading ? (
          <div className="khatarnak-loader">
            <div className="glowing-spinner"></div>
            <p>Fetching Cosmic Partners Database...</p>
          </div>
        ) : error ? (
          <div className="table-error-box">{error}</div>
        ) : filteredPartners.length === 0 ? (
          <div className="table-error-box">No partners found matching your search criteria.</div>
        ) : (
          <div className="partner-cards-grid">
            {filteredPartners.map((partner) => {
              const kycStatus = (partner.kycStatus || "Not Submitted").toLowerCase();
              const isKycApproved = kycStatus === "approved";
              const isKycPending = kycStatus === "pending";

              return (
                <div className="khatarnak-card partner-card-item" key={partner._id}>
                  <div className="card-glass-shine"></div>

                  <div className="partner-card-header">
                    <div className="status-badges-cluster">
                      <span className={`bold-role-tag ${partner.isActive ? "role-user" : "role-admin"}`}>
                        {partner.isActive ? "ACTIVE" : "INACTIVE"}
                      </span>
                      <span className={`bold-role-tag kyc-${isKycApproved ? "verified" : isKycPending ? "pending" : "none"}`}>
                        <FaIdCard /> {partner.kycStatus || "KYC Not Submitted"}
                      </span>
                    </div>

                    <div className="badges-group">
                      {partner.isVerified && (
                        <span className="trend-badge cyan-pill" title="Verified Profile">
                          <FaCheckCircle /> Verified
                        </span>
                      )}
                      <span className="trend-badge gold-pill">
                        <FaStar /> {Number(partner.averageRating || 0).toFixed(1)} ({partner.totalReviews || 0})
                      </span>
                    </div>
                  </div>

                  <div className="partner-card-body">
                    <div className="avatar-wrapper">
                      {partner.profilePic ? (
                        <img
                          src={partner.profilePic}
                          alt={partner.fullName || "Partner"}
                          className="partner-avatar-img"
                          onError={(e) => {
                            e.target.style.display = "none";
                            if (e.target.nextSibling) {
                              e.target.nextSibling.style.display = "flex";
                            }
                          }}
                        />
                      ) : null}
                      <div
                        className="giant-avatar"
                        style={{
                          display: partner.profilePic ? "none" : "flex",
                        }}
                      >
                        {getInitial(partner.fullName)}
                      </div>
                      <span
                        className={`online-status-dot ${partner.isOnline ? (partner.isBusy ? "busy" : "online") : "offline"}`}
                        title={partner.isOnline ? (partner.isBusy ? "Busy" : "Online") : "Offline"}
                      ></span>
                    </div>

                    <h3 className="partner-name">
                      {partner.fullName || "Name Not Set"}
                    </h3>

                    <p className="partner-mobile">
                      <FaPhoneAlt /> {partner.mobile || "No Mobile"}
                    </p>

                    <div className="partner-meta-row">
                      {partner.city && (
                        <span className="meta-item" title="Location">
                          <FaMapMarkerAlt /> {partner.city}
                        </span>
                      )}
                      <span className="meta-item" title="Experience">
                        <FaBriefcase /> {partner.experience || 0} Yrs Exp
                      </span>
                      {partner.qualification && (
                        <span className="meta-item" title="Qualification">
                          <FaGraduationCap /> {partner.qualification}
                        </span>
                      )}
                    </div>

                    <div className="partner-sub-details">
                      {partner.languages && partner.languages.length > 0 && (
                        <div className="detail-pill-row" title="Languages">
                          <FaLanguage className="detail-icon" />
                          <span>{partner.languages.join(", ")}</span>
                        </div>
                      )}

                      <div className="channels-pill-row">
                        <span className={`channel-indicator ${partner.allowAudioCalls ? "enabled" : "disabled"}`} title="Audio Call">
                          <FaPhoneAlt /> Call
                        </span>
                        <span className={`channel-indicator ${partner.allowVideoCalls ? "enabled" : "disabled"}`} title="Video Call">
                          <FaVideo /> Video
                        </span>
                        <span className={`channel-indicator ${partner.allowChat ? "enabled" : "disabled"}`} title="Chat">
                          <FaComments /> Chat
                        </span>
                        <span className="channel-indicator wallet-indicator" title="Wallet Balance">
                          <FaWallet /> ₹{formatCurrency(partner.walletBalance || 0)}
                        </span>
                      </div>
                    </div>

                    <div className="specialties-row">
                      {partner.specialties && partner.specialties.length > 0 ? (
                        partner.specialties.slice(0, 4).map((spec, i) => (
                          <span key={i} className="spec-tag">
                            {spec}
                          </span>
                        ))
                      ) : (
                        <span className="spec-tag empty">General Astrology</span>
                      )}
                      {partner.specialties && partner.specialties.length > 4 && (
                        <span className="spec-tag extra">
                          +{partner.specialties.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="partner-card-footer">
                    <div
                      className="rate-box-highlight"
                      onClick={() => handleOpenRateModal(partner)}
                      style={{ cursor: "pointer" }}
                      title="Click to update consultation rate"
                    >
                      <span className="rate-badge-title">
                        CONSULTATION RATE <FaEdit style={{ marginLeft: "4px", fontSize: "11px" }} />
                      </span>
                      <div className="rate-amount-display">
                        <span className="currency-symbol">₹</span>
                        <span className="rate-number">
                          {formatCurrency(partner.minRate)}
                        </span>
                        <span className="rate-duration">/min</span>
                      </div>
                    </div>

                    <div className="card-right-controls">
                      <label
                        className="toggle-switch"
                        title={partner.isActive ? "Deactivate Partner" : "Activate Partner"}
                      >
                        <input
                          type="checkbox"
                          checked={!!partner.isActive}
                          onChange={() => handleToggleStatus(partner)}
                        />
                        <span className="toggle-slider"></span>
                      </label>

                      <div className="action-button-group">
                        <button
                          className="btn-square-icon"
                          onClick={() => handleOpenRateModal(partner)}
                          title="Update Rate"
                        >
                          <FaWallet />
                        </button>
                        <button
                          className="btn-square-icon"
                          onClick={() => handleView(partner)}
                          title="View Full Profile"
                        >
                          <FaEye />
                        </button>
                        <button
                          className="btn-square-icon"
                          onClick={() => handleEdit(partner)}
                          title="Edit Partner"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn-square-icon btn-delete-accent"
                          onClick={() => {
                            setSelectedPartner(partner);
                            setDeleteOpen(true);
                          }}
                          title="Delete Partner"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="table-pagination-footer">
        <div className="pagination-container">
          <button
            className="pagination-btn arrow-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <FaChevronLeft />
          </button>

          {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
            <button
              key={page}
              className={`pagination-btn ${currentPage === page ? "active" : ""}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}

          <button
            className="pagination-btn arrow-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      <DeleteModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
      />

      <EditPartnerModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        partner={selectedPartner}
        onUpdated={() => fetchPartners(currentPage, debouncedSearch)}
      />

      <ViewPartnerModal
        isOpen={viewOpen}
        onClose={() => setViewOpen(false)}
        partner={selectedPartner}
      />

      {rateModalOpen && selectedPartner && (
        <div className="status-modal-overlay">
          <div className="status-modal">
            <h3>Update Consultation Rate</h3>
            <p>
              Update rate for <strong>{selectedPartner.fullName || "Partner"}</strong>. Partner will receive an instant push notification.
            </p>

            <div className="status-input-group">
              <label>Minimum Rate (₹/min):</label>
              <input
                type="number"
                min="0"
                placeholder="Enter rate (e.g. 35)"
                value={newMinRate}
                onChange={(e) => setNewMinRate(e.target.value)}
                disabled={rateLoading}
              />
            </div>

            <div className="status-modal-actions">
              <button
                type="button"
                className="status-cancel-btn"
                onClick={() => {
                  setRateModalOpen(false);
                  setSelectedPartner(null);
                  setNewMinRate("");
                }}
                disabled={rateLoading}
              >
                Cancel
              </button>

              <button
                type="button"
                className="status-confirm-btn"
                onClick={handleConfirmRateUpdate}
                disabled={rateLoading}
              >
                {rateLoading ? "Updating..." : "Update Rate"}
              </button>
            </div>
          </div>
        </div>
      )}

      {statusModalOpen && selectedPartner && (
        <div className="status-modal-overlay">
          <div className="status-modal">
            <h3>
              {selectedPartner.isActive
                ? "Deactivate Partner?"
                : "Activate Partner?"}
            </h3>

            <p>
              Are you sure you want to{" "}
              <strong>{selectedPartner.isActive ? "deactivate" : "activate"}</strong>{" "}
              this partner?
            </p>

            <div className="status-input-group">
              <label>Reason:</label>
              <input
                type="text"
                placeholder={selectedPartner.isActive ? "Deactivated by admin" : "Activated by admin"}
                value={statusReason}
                onChange={(e) => setStatusReason(e.target.value)}
                disabled={statusLoading}
              />
            </div>

            <div className="status-input-group">
              <label>Reason Note:</label>
              <textarea
                placeholder={selectedPartner.isActive ? "Partner deactivated by admin" : "Partner activated by admin"}
                value={statusReasonNote}
                onChange={(e) => setStatusReasonNote(e.target.value)}
                disabled={statusLoading}
              />
            </div>

            <div className="status-modal-actions">
              <button
                type="button"
                className="status-cancel-btn"
                onClick={() => {
                  setStatusModalOpen(false);
                  setSelectedPartner(null);
                  setStatusReason("");
                  setStatusReasonNote("");
                }}
                disabled={statusLoading}
              >
                Cancel
              </button>

              <button
                type="button"
                className="status-confirm-btn"
                onClick={confirmStatusChange}
                disabled={statusLoading}
              >
                {statusLoading
                  ? "Updating..."
                  : selectedPartner.isActive
                    ? "Deactivate"
                    : "Activate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}