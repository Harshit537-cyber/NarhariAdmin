import React from "react";

export default function ViewPartnerModal({ isOpen, onClose, partner }) {
  if (!isOpen || !partner) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const kycDocs = [
    { label: "Selfie", data: partner.selfie },
    { label: "National ID", data: partner.nationalId },
    { label: "Astrology Certificate", data: partner.astrologyCertificate },
    { label: "Address Proof", data: partner.addressProof },
  ];

  return (
    <>
      <div className="vp-modal-overlay" onClick={onClose}>
        <div className="vp-modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="vp-modal-close" onClick={onClose}>
            &times;
          </button>

          {/* Profile Header */}
          <div className="vp-profile-header">
            <img
              src={partner.profilePic || "https://via.placeholder.com/90?text=No+Image"}
              alt={partner.fullName || "Partner"}
              className="vp-profile-pic"
            />
            <div>
              <h2 className="vp-modal-title">{partner.fullName || "N/A"}</h2>
              <p className="vp-subtext">{partner.mobile}</p>
            </div>
          </div>

          {/* Bio */}
          {partner.bio && <p className="vp-bio">{partner.bio}</p>}

          {/* Basic Info */}
          <h3 className="vp-section-title">Basic Information</h3>
          <div className="vp-details-grid">
            <div className="vp-detail-row">
              <span className="vp-label">Gender</span>
              <span className="vp-value">{partner.gender || "N/A"}</span>
            </div>
            <div className="vp-detail-row">
              <span className="vp-label">Date of Birth</span>
              <span className="vp-value">{formatDate(partner.dateOfBirth)}</span>
            </div>
            <div className="vp-detail-row">
              <span className="vp-label">City</span>
              <span className="vp-value">{partner.city || "N/A"}</span>
            </div>
            <div className="vp-detail-row">
              <span className="vp-label">Qualification</span>
              <span className="vp-value">{partner.qualification || "N/A"}</span>
            </div>
            <div className="vp-detail-row">
              <span className="vp-label">Experience</span>
              <span className="vp-value">
                {partner.experience != null ? `${partner.experience} yrs` : "N/A"}
              </span>
            </div>
            <div className="vp-detail-row">
              <span className="vp-label">Expected Salary</span>
              <span className="vp-value">
                {partner.expectedSalary != null ? `₹${partner.expectedSalary}` : "N/A"}
              </span>
            </div>
            <div className="vp-detail-row">
              <span className="vp-label">Min Rate</span>
              <span className="vp-value">
                {partner.minRate != null ? `₹${partner.minRate}/min` : "N/A"}
              </span>
            </div>
            <div className="vp-detail-row">
              <span className="vp-label">Rating</span>
              <span className="vp-value">
                {partner.averageRating ?? 0} ({partner.totalReviews ?? 0} reviews)
              </span>
            </div>
          </div>

          {/* Languages & Specialties */}
          {(partner.languages?.length > 0 || partner.specialties?.length > 0) && (
            <>
              <h3 className="vp-section-title">Languages & Specialties</h3>
              {partner.languages?.length > 0 && (
                <div className="vp-tag-row">
                  <span className="vp-label">Languages:</span>
                  {partner.languages.map((lang, i) => (
                    <span className="vp-tag" key={i}>
                      {lang}
                    </span>
                  ))}
                </div>
              )}
              {partner.specialties?.length > 0 && (
                <div className="vp-tag-row">
                  <span className="vp-label">Specialties:</span>
                  {partner.specialties.map((spec, i) => (
                    <span className="vp-tag" key={i}>
                      {spec}
                    </span>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Status Info */}
          <h3 className="vp-section-title">Status</h3>
          <div className="vp-details-grid">
            <div className="vp-detail-row">
              <span className="vp-label">Verified</span>
              <span
                className={`vp-badge ${
                  partner.isVerified ? "vp-badge-green" : "vp-badge-red"
                }`}
              >
                {partner.isVerified ? "Verified" : "Not Verified"}
              </span>
            </div>
            <div className="vp-detail-row">
              <span className="vp-label">Profile Complete</span>
              <span
                className={`vp-badge ${
                  partner.isProfileComplete ? "vp-badge-green" : "vp-badge-red"
                }`}
              >
                {partner.isProfileComplete ? "Complete" : "Incomplete"}
              </span>
            </div>
            <div className="vp-detail-row">
              <span className="vp-label">Account Status</span>
              <span
                className={`vp-badge ${
                  partner.isActive ? "vp-badge-green" : "vp-badge-red"
                }`}
              >
                {partner.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="vp-detail-row">
              <span className="vp-label">Online</span>
              <span
                className={`vp-badge ${
                  partner.isOnline ? "vp-badge-green" : "vp-badge-red"
                }`}
              >
                {partner.isOnline ? "Online" : "Offline"}
              </span>
            </div>
            <div className="vp-detail-row">
              <span className="vp-label">Busy</span>
              <span className="vp-value">{partner.isBusy ? "Yes" : "No"}</span>
            </div>
            <div className="vp-detail-row">
              <span className="vp-label">KYC Status</span>
              <span className="vp-value">{partner.kycStatus || "N/A"}</span>
            </div>
            <div className="vp-detail-row">
              <span className="vp-label">Profile Approval</span>
              <span className="vp-value">{partner.profileApprovalStatus || "N/A"}</span>
            </div>
            <div className="vp-detail-row">
              <span className="vp-label">Joined On</span>
              <span className="vp-value">{formatDate(partner.createdAt)}</span>
            </div>
          </div>

          {/* Deactivation Info (only if inactive) */}
          {partner.isActive === false && (
            <>
              <h3 className="vp-section-title">Deactivation Details</h3>
              <div className="vp-details-grid">
                <div className="vp-detail-row">
                  <span className="vp-label">Deactivated By</span>
                  <span className="vp-value">{partner.deactivatedBy || "N/A"}</span>
                </div>
                <div className="vp-detail-row">
                  <span className="vp-label">Deactivated At</span>
                  <span className="vp-value">{formatDate(partner.deactivatedAt)}</span>
                </div>
                <div className="vp-detail-row">
                  <span className="vp-label">Reason</span>
                  <span className="vp-value">{partner.deactivationReason || "N/A"}</span>
                </div>
                <div className="vp-detail-row">
                  <span className="vp-label">Duration</span>
                  <span className="vp-value">
                    {partner.deactivationDuration
                      ? `${partner.deactivationDuration} days`
                      : "N/A"}
                  </span>
                </div>
                <div className="vp-detail-row">
                  <span className="vp-label">Reactivate At</span>
                  <span className="vp-value">{formatDate(partner.reactivateAt)}</span>
                </div>
              </div>
            </>
          )}

          {/* KYC Documents */}
          <h3 className="vp-section-title">KYC Documents</h3>
          <div className="vp-details-grid">
            {kycDocs.map((doc, i) => (
              <div className="vp-detail-row" key={i}>
                <span className="vp-label">{doc.label}</span>
                <span
                  className={`vp-badge ${
                    doc.data?.status === "Approved"
                      ? "vp-badge-green"
                      : doc.data?.status === "Rejected"
                      ? "vp-badge-red"
                      : "vp-badge-yellow"
                  }`}
                >
                  {doc.data?.status || "Pending"}
                </span>
              </div>
            ))}
          </div>

          {/* KYC Document Images (only ones with a URL) */}
          {kycDocs.some((d) => d.data?.url) && (
            <div className="vp-photo-grid">
              {kycDocs
                .filter((d) => d.data?.url)
                .map((d, i) => (
                  <a
                    key={i}
                    href={d.data.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src={d.data.url} alt={d.label} className="vp-photo-thumb" />
                  </a>
                ))}
            </div>
          )}

          {/* Gallery Photos */}
          {partner.additionalPhotos?.length > 0 && (
            <>
              <h3 className="vp-section-title">Gallery</h3>
              <div className="vp-photo-grid">
                {partner.additionalPhotos.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                    <img src={url} alt={`gallery-${i}`} className="vp-photo-thumb" />
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        .vp-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .vp-modal-content {
          background: #fff;
          border-radius: 12px;
          padding: 24px 28px;
          width: 100%;
          max-width: 520px;
          max-height: 88vh;
          overflow-y: auto;
          position: relative;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          animation: vp-fade-in 0.2s ease-out;

          /* Firefox: thin, subtle scrollbar */
          scrollbar-width: thin;
          scrollbar-color: #d0d0d0 transparent;
        }

        /* Chrome / Edge / Safari: slim custom scrollbar */
        .vp-modal-content::-webkit-scrollbar {
          width: 5px;
        }

        .vp-modal-content::-webkit-scrollbar-track {
          background: transparent;
        }

        .vp-modal-content::-webkit-scrollbar-thumb {
          background-color: #d0d0d0;
          border-radius: 10px;
        }

        .vp-modal-content::-webkit-scrollbar-thumb:hover {
          background-color: #b0b0b0;
        }

        @keyframes vp-fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .vp-modal-close {
          position: absolute;
          top: 12px;
          right: 16px;
          background: none;
          border: none;
          font-size: 22px;
          line-height: 1;
          cursor: pointer;
          color: #888;
        }

        .vp-modal-close:hover {
          color: #333;
        }

        .vp-profile-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 12px;
        }

        .vp-profile-pic {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #eee;
        }

        .vp-modal-title {
          margin: 0;
          font-size: 19px;
          font-weight: 600;
          color: #222;
        }

        .vp-subtext {
          margin: 4px 0 0 0;
          font-size: 13px;
          color: #888;
        }

        .vp-bio {
          font-size: 13px;
          color: #555;
          background: #f8f8f8;
          padding: 10px 12px;
          border-radius: 8px;
          margin-bottom: 16px;
        }

        .vp-section-title {
          font-size: 14px;
          font-weight: 600;
          color: #333;
          margin: 18px 0 10px 0;
          border-bottom: 1px solid #eee;
          padding-bottom: 6px;
        }

        .vp-details-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .vp-detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .vp-label {
          font-size: 13px;
          color: #777;
          font-weight: 500;
        }

        .vp-value {
          font-size: 13px;
          color: #222;
          font-weight: 600;
          text-align: right;
        }

        .vp-badge {
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
        }

        .vp-badge-green {
          background: #e6f7ec;
          color: #1a9e4c;
        }

        .vp-badge-red {
          background: #fdeaea;
          color: #d33636;
        }

        .vp-badge-yellow {
          background: #fff6e0;
          color: #b8860b;
        }

        .vp-tag-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 6px;
          margin-bottom: 8px;
        }

        .vp-tag {
          background: #f0f0f5;
          color: #444;
          font-size: 12px;
          padding: 3px 10px;
          border-radius: 20px;
        }

        .vp-photo-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 10px;
        }

        .vp-photo-thumb {
          width: 70px;
          height: 70px;
          object-fit: cover;
          border-radius: 8px;
          border: 1px solid #eee;
        }
      `}</style>
    </>
  );
}