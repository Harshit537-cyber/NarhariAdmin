import React, { useState, useMemo, useEffect } from "react";
import "../../Partner/Partner.css";
import {
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
import { toast } from "react-toastify";
import { getAllPartnersStatus } from "../../../api/Controller/partner";


export default function PartnerStatus() {

  const [partners, setPartners] = useState([]);

  const [partnerStats, setPartnerStats] = useState({
    totalPartners: 0,
    activePartners: 0,
    inactivePartners: 0,
  });

  const [loading, setLoading] = useState(true);

 
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true);

        const response = await getAllPartnersStatus();

        console.log("Partners API Response:", response);

        setPartners(response?.data || []);

        setPartnerStats({
          totalPartners: response?.totalPartners || 0,
          activePartners: response?.activePartners || 0,
          inactivePartners: response?.inactivePartners || 0,
        });

      } catch (error) {
        console.error("Failed to fetch partners:", error);
        toast.error(error?.message || "Failed to fetch partners");
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

 
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
      if (filterType === "inactive") return !partner.isActive;

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
            <h1 className="wrapped-header-title">Partner Status</h1>
          </div>
          <p className="header-subtitle">
            View and control the active/inactive status of celestial guides.
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
           <FaArrowUp /> TODAY
            </span>
          </div>

          <div className="card-middle-data">
            <h2 className="giant-stat-number">{partnerStats.totalPartners.toLocaleString()}</h2>
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
              <FaCheckCircle /> ACTIVE
            </span>
          </div>

          <div className="card-middle-data">
            <h2 className="giant-stat-number">{partnerStats.activePartners.toLocaleString()}</h2>
            <p className="giant-stat-label">Active Partners</p>
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
              <FaBolt /> INACTIVE
            </span>
          </div>

          <div className="card-middle-data">
            <h2 className="giant-stat-number">{partnerStats.inactivePartners.toLocaleString()}</h2>
            <p className="giant-stat-label">Inactive Partners</p>
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
            className={`filter-btn ${filterType === "inactive" ? "active" : ""}`}
            onClick={() => setFilterType("inactive")}
          >
            Inactive
          </button>
        </div>
      </div>

      <div className="pt-content-grid animate-fade-in-delayed">
        {filteredPartners.length === 0 ? (
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
  <span
    className={`status-badge ${
      partner.status === "Active" ? "status-badge-green" : "status-badge-red"
    }`}
  >
    {partner.status === "Active" ? "Active" : "Inactive"}
  </span>
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
    </div>
  );
}