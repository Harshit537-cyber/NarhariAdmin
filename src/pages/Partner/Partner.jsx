import React, { useState, useEffect, useMemo } from "react";
import "./Partner.css";
import {
  getAllPartners,
  deletePartner,
  activatePartner,
  deactivatePartner,
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
  const [togglingId, setTogglingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 8;

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const res = await getAllPartners();
      setPartners(res.data || []);
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

  const handleToggleStatus = async (partner) => {
    const isCurrentlyActive = !!partner.isActive;
    setTogglingId(partner._id);

    setPartners((prev) =>
      prev.map((p) =>
        p._id === partner._id ? { ...p, isActive: !isCurrentlyActive } : p
      )
    );

    try {
      if (isCurrentlyActive) {
        await deactivatePartner(
          partner._id,
          "Deactivated by admin",
          "Deactivated by admin"
        );
        toast.success("Partner deactivated successfully");
      } else {
        await activatePartner(partner._id);
        toast.success("Partner activated successfully");
      }
    } catch (err) {
      console.error("Toggle status error:", err);

      const alreadyMsg = (err.message || "").toLowerCase();
      if (alreadyMsg.includes("already")) {
        toast.info(err.message);
        return;
      }

      setPartners((prev) =>
        prev.map((p) =>
          p._id === partner._id ? { ...p, isActive: isCurrentlyActive } : p
        )
      );
      toast.error(err.message || "Status update failed");
    } finally {
      setTogglingId(null);
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
    const totalPartners = partners.length;
    const verifiedCount = partners.filter((p) => p.isVerified).length;
    const kycPendingCount = partners.filter(
      (p) => (p.kycStatus || "").toLowerCase() === "pending"
    ).length;
    const newToday = partners.filter(
      (p) => new Date(p.createdAt).toDateString() === today
    ).length;
    return { totalPartners, verifiedCount, kycPendingCount, newToday };
  }, [partners]);

  const filteredPartners = useMemo(() => {
    return partners.filter((partner) => {
      const name = (partner.fullName || "").toLowerCase();
      const mobile = (partner.mobile || "").toLowerCase();
      const city = (partner.city || "").toLowerCase();
      const query = searchTerm.toLowerCase();

      const matchesSearch =
        name.includes(query) || mobile.includes(query) || city.includes(query);

      if (!matchesSearch) return false;

      if (filterType === "active") return partner.isActive;
      if (filterType === "verified") return partner.isVerified;
      if (filterType === "kycPending")
        return (partner.kycStatus || "").toLowerCase() === "pending";

      return true;
    });
  }, [partners, searchTerm, filterType]);
const totalPages = Math.max(
  1,
  Math.ceil(filteredPartners.length / itemsPerPage)
);

const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;

const currentPartners = filteredPartners.slice(
  indexOfFirstItem,
  indexOfLastItem
);

const handlePageChange = (pageNumber) => {
  if (pageNumber >= 1 && pageNumber <= totalPages) {
    setCurrentPage(pageNumber);
  }
};
  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "P");

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
            <h2 className="giant-stat-number">{stats.totalPartners.toLocaleString()}</h2>
            <p className="giant-stat-label">Total Active Partners</p>
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
            All ({partners.length})
          </button>
          <button
            className={`filter-btn ${filterType === "active" ? "active" : ""}`}
            onClick={() => setFilterType("active")}
          >
            Active
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
            {currentPartners.map((partner) => (
              <div className="khatarnak-card partner-card-item" key={partner._id}>
                <div className="card-glass-shine"></div>
                
                <div className="partner-card-header">
                  <span className={`bold-role-tag ${partner.isActive ? "role-user" : "role-admin"}`}>
                    {partner.isActive ? "ACTIVE" : "INACTIVE"}
                  </span>

                  <div className="badges-group">
                    {partner.isVerified && (
                      <span className="trend-badge cyan-pill">
                        <FaCheckCircle /> Verified
                      </span>
                    )}
                    <span className="trend-badge gold-pill">
                      <FaStar /> {partner.averageRating || "0.0"}
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
                          e.target.nextSibling.style.display = "flex";
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
                      className={`online-status-dot ${partner.isOnline ? "online" : "offline"}`}
                      title={partner.isOnline ? "Online" : "Offline"}
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
                      <span className="meta-item">
                        <FaMapMarkerAlt /> {partner.city}
                      </span>
                    )}
                    <span className="meta-item">
                      <FaBriefcase /> {partner.experience || 0} Yrs Exp
                    </span>
                  </div>

                  <div className="specialties-row">
                    {partner.specialties && partner.specialties.length > 0 ? (
                      partner.specialties.slice(0, 3).map((spec, i) => (
                        <span key={i} className="spec-tag">
                          {spec}
                        </span>
                      ))
                    ) : (
                      <span className="spec-tag empty">General Astrology</span>
                    )}
                  </div>
                </div>

                <div className="partner-card-footer">
                  <div className="rate-info">
                    <span className="rate-amount">₹{partner.minRate || 25}</span>
                    <span className="rate-unit">/min</span>
                  </div>

                  <div className="card-right-controls">
                    <label className="toggle-switch" title="Toggle Active Status">
                      <input
                        type="checkbox"
                        checked={!!partner.isActive}
                        disabled={togglingId === partner._id}
                        onChange={() => handleToggleStatus(partner)}
                      />
                      <span className="toggle-slider"></span>
                    </label>

                    <div className="action-button-group">
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
            ))}
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


          {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(
            (page) => (
              <button
                key={page}
                className={`pagination-btn ${
                  currentPage === page ? "active" : ""
                }`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            )
          )}


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
        onUpdated={fetchPartners}
      />

      <ViewPartnerModal
        isOpen={viewOpen}
        onClose={() => setViewOpen(false)}
        partner={selectedPartner}
      />
    </div>
  );
}