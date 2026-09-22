import React, { useState, useMemo, useEffect } from "react";
import { getPendingMinRatePartners, approvePartnerMinRate } from "../../api/Controller/minrate";
import "./MinRateAstrologer.css";
import {
  FaSearch,
  FaEye,
  FaCheckCircle,
  FaClock,
  FaUserTie,
  FaRupeeSign,
  FaTimes,
  FaCrown,
  FaArrowRight,
  FaExclamationTriangle,
  FaMapMarkerAlt,
  FaBriefcase,
  FaStar,
} from "react-icons/fa";

export default function MinRateAstrologer() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };
  const handleRateApproval = async (status) => {
    try {
      const response = await approvePartnerMinRate(
        selectedUser._id,
        status
      );

      showToast(
        "success",
        response.message || `Rate ${status} successfully`
      );

      setAstrologers((prev) =>
        prev.map((astro) =>
          astro._id === selectedUser._id
            ? {
              ...astro,
              minRate:
                status === "Approved"
                  ? astro.requestedMinRate
                  : astro.minRate,
              currentMinRate:
                status === "Approved"
                  ? astro.requestedMinRate
                  : astro.currentMinRate,
              requestedMinRate:
                status === "Approved"
                  ? null
                  : astro.requestedMinRate,
              minRateApprovalStatus: status,
            }
            : astro
        )
      );

      setSelectedUser(null);
    } catch (error) {
      showToast(
        "error",
        error.message || "Something went wrong"
      );
    }
  };
  useEffect(() => {
    const fetchAstrologers = async () => {
      try {
        setLoading(true);

        const response = await getPendingMinRatePartners(1, 10);

        if (response?.success) {
          setAstrologers(response.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch min-rate astrologers:", error);
        showToast("error", error?.message || "Failed to fetch astrologers");
      } finally {
        setLoading(false);
      }
    };

    fetchAstrologers();
  }, []);
  const [astrologers, setAstrologers] = useState([]);
  const [loading, setLoading] = useState(true);

  const filteredAstrologers = useMemo(() => {
    return astrologers.filter((ast) =>
      (ast.fullName || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [astrologers, searchTerm]);

  const pendingCount = astrologers.filter(a => a.minRateApprovalStatus === "Pending").length;

  return (
    <div className="an-user-container">
      {toast && (
        <div className={`cosmic-toast ${toast.type === "success" ? "toast-success" : "toast-error"}`}>
          {toast.type === "success" ? <FaCheckCircle /> : <FaTimes />}
          <span>{toast.message}</span>
        </div>
      )}

      <div className="ambient-orb orb-1"></div>
      <div className="ambient-orb orb-2"></div>

      <header className="db-header animate-fade-in">
        <div className="db-header-left">
          <div className="header-title-container">
            <span className="enterprise-badge">
              <FaCrown className="crown-icon" /> COSMIC PARTNER REALM
            </span>
            <h1 className="wrapped-header-title">Min Rate Management</h1>
          </div>
          <p className="header-subtitle">
            Review and approve minimum rate changes for registered astrologers.
          </p>
        </div>
      </header>

      <div className="db-metrics-grid">
        <div className="khatarnak-card cyan-theme animate-slide-up">
          <div className="card-glass-shine"></div>
          <div className="card-top-bar">
            <div className="big-icon-box cyan-glow"><FaUserTie /></div>
            <span className="trend-badge cyan-pill">PARTNERS</span>
          </div>
          <div className="card-middle-data">
            <h2 className="giant-stat-number">{astrologers.length}</h2>
            <p className="giant-stat-label">Total Astrologers</p>
          </div>
          <div className="card-bottom-accent"><div className="glow-bar cyan-bar"></div></div>
        </div>

        <div className="khatarnak-card gold-theme animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div className="card-glass-shine"></div>
          <div className="card-top-bar">
            <div className="big-icon-box gold-glow"><FaClock /></div>
            <span className="trend-badge gold-pill">WAITING</span>
          </div>
          <div className="card-middle-data">
            <h2 className="giant-stat-number">{pendingCount}</h2>
            <p className="giant-stat-label">Pending Requests</p>
          </div>
          <div className="card-bottom-accent"><div className="glow-bar gold-bar"></div></div>
        </div>
      </div>

      <div className="pt-controls-bar animate-fade-in">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by partner name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="pt-content-grid animate-fade-in-delayed">
        <div className="user-cards-grid">
          {filteredAstrologers.map((astro) => (
            <div className="khatarnak-card user-card-item" key={astro._id}>
              <div className="card-glass-shine"></div>

              <div className="user-card-header">
                <span className={`bold-role-tag ${astro.minRateApprovalStatus === "Pending" ? "role-inactive" : "role-user"}`}>
                  {astro.minRateApprovalStatus}
                </span>
                <div className="badges-group">
                  <span className="trend-badge emerald-pill"><FaStar /> {astro.averageRating}</span>
                </div>
              </div>

              <div className="user-card-body">
                <div className="avatar-wrapper">
                  <img
                    src={astro.profilePic || "/dummyimage.png"}
                    alt={astro.fullName || "Astrologer"}
                    className="user-avatar-img"
                    onError={(e) => {
                      e.currentTarget.src = "/dummyimage.png";
                    }}
                  />
                </div>
                <h3 className="user-name">{astro.fullName}</h3>
                <div className="user-meta-row">
                  <span className="meta-item"><FaMapMarkerAlt /> {astro.city}</span>
                  <span className="meta-item"><FaBriefcase /> {astro.experience} Yrs</span>
                </div>

                <div className="rate-comparison-box">
                  <div className="rate-box-side">
                    <small>MinRate</small>
                    <span className="old-rate">₹{astro.minRate}</span>
                  </div>
                  <div className="rate-arrow-middle"><FaArrowRight /></div>
                  <div className="rate-box-side">
                    <small>Requested MinRate</small>
                    <span className="new-rate">₹{astro.requestedMinRate}</span>
                  </div>
                </div>
              </div>

              <div className="user-card-footer">
                <div className="rate-info">
                  <span className="rate-unit" style={{ textTransform: 'uppercase' }}>{astro.profileApprovalStatus}</span>
                </div>
                <div className="action-button-group">
                  <button className="btn-square-icon" onClick={() => setSelectedUser(astro)}>
                    <FaEye />
                  </button>
                  <button className="btn-square-icon emerald-glow-btn" onClick={() => showToast("success", "Rate Approved!")}>
                    <FaCheckCircle />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedUser && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-content">
            <div className="modal-header">
              <h2>Request Details</h2>
              <button className="close-btn" onClick={() => setSelectedUser(null)}><FaTimes /></button>
            </div>
            <div className="modal-body">
              <div className="profile-detail-card">
                <div className="modal-avatar-section">
                  <img src={selectedUser.profilePic} alt="Astro" style={{ width: "100px", height: "100px", borderRadius: "24px", objectFit: "cover" }} />
                  <h3>{selectedUser.fullName}</h3>
                  <p>{selectedUser.mobile}</p>
                </div>

                <div className="modal-details-grid">
                  <div className="detail-item"><strong>Full Name</strong> {selectedUser.fullName}</div>
                  <div className="detail-item"><strong>Mobile</strong> {selectedUser.mobile}</div>

                  <div className="detail-item"><strong>City</strong> {selectedUser.city}</div>
                  <div className="detail-item"><strong>Gender</strong> {selectedUser.gender}</div>

                  <div className="detail-item"><strong>Date Of Birth</strong> {selectedUser.dateOfBirth}</div>
                  <div className="detail-item"><strong>Experience</strong> {selectedUser.experience} Years</div>

                  <div className="detail-item"><strong>Qualification</strong> {selectedUser.qualification}</div>
                  <div className="detail-item"><strong>Expected Salary</strong> ₹{selectedUser.expectedSalary}</div>

                  <div className="detail-item"><strong>Current Rate</strong> ₹{selectedUser.minRate}</div>
                  <div className="detail-item"><strong>Requested Rate</strong> ₹{selectedUser.requestedMinRate}</div>

                  <div className="detail-item"><strong>KYC Status</strong> {selectedUser.kycStatus}</div>
                  <div className="detail-item"><strong>Profile Status</strong> {selectedUser.profileApprovalStatus}</div>

                  <div className="detail-item"><strong>Min Rate Status</strong> {selectedUser.minRateApprovalStatus}</div>
                  <div className="detail-item"><strong>Rating</strong> {selectedUser.averageRating}</div>

                  <div className="detail-item"><strong>Total Reviews</strong> {selectedUser.totalReviews}</div>
                  <div className="detail-item"><strong>Wallet Balance</strong> ₹{selectedUser.walletBalance}</div>

                  <div className="detail-item"><strong>Verified</strong> {selectedUser.isVerified ? "Yes" : "No"}</div>
                  <div className="detail-item"><strong>Online</strong> {selectedUser.isOnline ? "Yes" : "No"}</div>

                  <div className="detail-item"><strong>Busy</strong> {selectedUser.isBusy ? "Yes" : "No"}</div>
                  <div className="detail-item"><strong>Role</strong> {selectedUser.role}</div>

                  <div className="detail-item"><strong>Created At</strong> {selectedUser.createdAt}</div>
                  <div className="detail-item"><strong>Updated At</strong> {selectedUser.updatedAt}</div>
                </div>

                <div className="modal-details-grid">

                  <div className="detail-item">
                    <strong>Bio</strong>
                    <p>{selectedUser.bio}</p>
                  </div>

                  <div className="detail-item">
                    <strong>Languages</strong>
                    <p>{selectedUser.languages?.join(", ")}</p>
                  </div>

                  <div className="detail-item">
                    <strong>Specialties</strong>
                    <p>{selectedUser.specialties?.join(", ")}</p>
                  </div>

                  <div className="detail-item">
                    <strong>Selfie Status</strong>
                    <p>{selectedUser.selfie?.status}</p>
                  </div>

                  <div className="detail-item">
                    <strong>National ID Status</strong>
                    <p>{selectedUser.nationalId?.status}</p>
                  </div>

                  <div className="detail-item">
                    <strong>Certificate Status</strong>
                    <p>{selectedUser.astrologyCertificate?.status}</p>
                  </div>

                  <div className="detail-item">
                    <strong>Address Proof Status</strong>
                    <p>{selectedUser.addressProof?.status}</p>
                  </div>

                  <div className="detail-item">
                    <strong>National ID</strong>
                    <a
                      href={selectedUser.nationalId?.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View Document
                    </a>
                  </div>

                  <div className="detail-item">
                    <strong>Astrology Certificate</strong>
                    <a
                      href={selectedUser.astrologyCertificate?.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View Certificate
                    </a>
                  </div>

                  <div className="detail-item">
                    <strong>Address Proof</strong>
                    <a
                      href={selectedUser.addressProof?.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View Address Proof
                    </a>
                  </div>

                </div>
                <div className="detail-item">
                  <strong>Gallery Photos</strong>

                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    {selectedUser.additionalPhotos?.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt=""
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                          borderRadius: "10px",
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div className="modal-actions-container">
                  <button
                    className="btn-save"
                    style={{
                      width: "100%",
                      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                    }}
                    onClick={() => handleRateApproval("Approved")}
                  >
                    Approve New Rate
                  </button>
                  <button
                    className="btn-cancel"
                    style={{ width: "100%", color: "#ef4444" }}
                    onClick={() => handleRateApproval("Rejected")}
                  >
                    Reject Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}