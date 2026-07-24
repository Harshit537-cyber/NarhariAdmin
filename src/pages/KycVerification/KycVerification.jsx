import React, { useState, useEffect } from "react";
import "./KycVerification.css";
import { toast } from "react-toastify";
import {
  FaIdCard,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaFileSignature,
  FaCrown,
  FaBolt,
  FaCheckDouble,
  FaClock,
  FaUser,
  FaCertificate,
  FaHome,
  FaSpinner
} from "react-icons/fa";
import {
  getPendingKycPartners,
  updatePartnerDocumentStatus
} from "../../api/Controller/pendingPartnerService";

export default function KycVerification() {
  const [kycRequests, setKycRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [activeTab, setActiveTab] = useState("selfie");
  const [showDocModal, setShowDocModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchPendingKyc();
  }, []);

  const fetchPendingKyc = async () => {
    try {
      setLoading(true);
      const res = await getPendingKycPartners();
      if (res && res.data) {
        setKycRequests(res.data);
      }
    } catch (error) {
      toast.error(error?.message || "Failed to fetch KYC requests");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDoc = (partner) => {
    setSelectedPartner(partner);
    setActiveTab("selfie");
    setShowDocModal(true);
  };

  const closeDocModal = () => {
    setShowDocModal(false);
    setSelectedPartner(null);
  };

  const handleStatusChange = async (partnerId, status) => {
    try {
      setActionLoading(true);

      const payload = {
        partnerId: partnerId,
        document: activeTab, // selfie, nationalId, astrologyCertificate, addressProof
        status: status // "Approved" ya "Rejected"
      };

      await updatePartnerDocumentStatus(partnerId, payload);

      toast.success(`${activeTab} document ${status} successfully!`);

      // Locally selectedPartner status ko update karo taaki turant green dikhe
      setSelectedPartner((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          [activeTab]: {
            ...prev[activeTab],
            status: status
          }
        };
      });

      // Refresh overall partner list
      fetchPendingKyc();
    } catch (error) {
      toast.error(error?.message || "Failed to update document status");
    } finally {
      setActionLoading(false);
    }
  };

  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "?");

  const pendingCount = kycRequests.length;

  const getCurrentDoc = () => {
    if (!selectedPartner) return null;
    switch (activeTab) {
      case "selfie":
        return { title: "Selfie", data: selectedPartner.selfie };
      case "nationalId":
        return { title: "National ID", data: selectedPartner.nationalId };
      case "astrologyCertificate":
        return { title: "Astrology Certificate", data: selectedPartner.astrologyCertificate };
      case "addressProof":
        return { title: "Address Proof", data: selectedPartner.addressProof };
      default:
        return { title: "Selfie", data: selectedPartner.selfie };
    }
  };

  const activeDoc = getCurrentDoc();
  const isCurrentDocApproved = activeDoc?.data?.status === "Approved";

  // Helper function: Tab ke liye Approved class check karne ke liye
  const getTabClass = (docKey) => {
    let classes = "doc-tab-btn";
    if (activeTab === docKey) classes += " active";
    if (selectedPartner?.[docKey]?.status === "Approved") classes += " doc-approved";
    return classes;
  };

  return (
    <div className="an-dashboard-container kyc-container">
      <div className="ambient-orb orb-1"></div>
      <div className="ambient-orb orb-2"></div>
      <div className="ambient-orb orb-3"></div>

      <header className="db-header animate-fade-in">
        <div className="db-header-left">
          <div className="header-title-container">
            <span className="enterprise-badge">
              <FaCrown className="crown-icon" /> COMPLIANCE & SECURITY
            </span>
            <h1 className="wrapped-header-title">KYC Document Verification</h1>
          </div>
          <p className="header-subtitle">
            Review, Approve or Reject partner identity documents securely.
          </p>
        </div>

        <div className="db-header-right">
          <div className="system-status-card">
            <div className="pulse-ring"></div>
            <span className="status-text"><FaBolt /> VERIFICATION LIVE</span>
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
            <span className="trend-badge gold-pill">ACTION REQUIRED</span>
          </div>
          <div className="card-middle-data">
            <h2 className="giant-stat-number">{pendingCount}</h2>
            <p className="giant-stat-label">Pending Verifications</p>
          </div>
          <div className="card-bottom-accent">
            <div className="glow-bar gold-bar"></div>
          </div>
        </div>

        <div className="khatarnak-card emerald-theme animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="card-glass-shine"></div>
          <div className="card-top-bar">
            <div className="big-icon-box emerald-glow">
              <FaCheckDouble />
            </div>
            <span className="trend-badge emerald-pill">VERIFIED</span>
          </div>
          <div className="card-middle-data">
            <h2 className="giant-stat-number">1,245</h2>
            <p className="giant-stat-label">Approved Documents</p>
          </div>
          <div className="card-bottom-accent">
            <div className="glow-bar emerald-bar"></div>
          </div>
        </div>

        <div className="khatarnak-card purple-theme animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <div className="card-glass-shine"></div>
          <div className="card-top-bar">
            <div className="big-icon-box purple-glow">
              <FaTimesCircle />
            </div>
            <span className="trend-badge purple-pill">FAILED</span>
          </div>
          <div className="card-middle-data">
            <h2 className="giant-stat-number">32</h2>
            <p className="giant-stat-label">Rejected Documents</p>
          </div>
          <div className="card-bottom-accent">
            <div className="glow-bar purple-bar"></div>
          </div>
        </div>
      </div>

      <div className="db-content-grid single-column">
        <div className="super-card main-table-card animate-fade-in-delayed">
          <div className="super-card-header">
            <div className="header-accent-title">
              <div className="title-vertical-bar gold"></div>
              <h2>Pending Partner KYC Requests</h2>
            </div>
            <span className="giant-badge gold">{pendingCount} Pending</span>
          </div>

          <div className="table-responsive">
            {loading ? (
              <div className="khatarnak-loader">
                <FaSpinner className="spinner-icon" size={30} />
                <p>Loading KYC requests...</p>
              </div>
            ) : kycRequests.length === 0 ? (
              <div className="khatarnak-loader">
                <FaCheckCircle size={40} color="#10b981" style={{ marginBottom: "15px" }} />
                <p>All caught up! No pending KYC requests.</p>
              </div>
            ) : (
              <table className="khatarnak-table">
                <thead>
                  <tr>
                    <th>PARTNER DETAILS</th>
                    <th>MOBILE</th>
                    <th>CITY</th>
                    <th>SUBMISSION DATE</th>
                    <th>STATUS</th>
                    <th style={{ textAlign: "right" }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {kycRequests.map((partner) => (
                    <tr key={partner._id}>
                      <td>
                        <div className="large-user-profile">
                          {partner.profilePic ? (
                            <img src={partner.profilePic} alt={partner.fullName} className="giant-avatar-img" />
                          ) : (
                            <div className="giant-avatar">{getInitial(partner.fullName)}</div>
                          )}
                          <div className="profile-names">
                            <span className="main-name">{partner.fullName}</span>
                            <br />
                            <span className="bold-email">{partner.experience ? `${partner.experience} Yrs Exp` : "Partner"}</span>
                          </div>
                        </div>
                      </td>
                      <td className="bold-email">{partner.mobile || "N/A"}</td>
                      <td className="bold-email">{partner.city || "N/A"}</td>
                      <td className="bold-email">
                        {partner.createdAt ? new Date(partner.createdAt).toLocaleDateString() : "N/A"}
                      </td>
                      <td>
                        <span className="bold-role-tag role-partner">
                          {partner.kycStatus}
                        </span>
                      </td>
                      <td>
                        <div className="action-button-group">
                          <button
                            className="btn-pro btn-pro-view"
                            onClick={() => handleViewDoc(partner)}
                          >
                            <FaEye /> Review Docs
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {showDocModal && selectedPartner && (
        <div className="ultra-modal-backdrop">
          <div className="ultra-modal-box doc-modal">
            <div className="modal-header-accent">
              <FaFileSignature className="modal-top-icon" />
              <h3>Review Documents</h3>
            </div>

            <div className="doc-info-bar">
              <p><strong>Partner:</strong> {selectedPartner.fullName}</p>
              <p><strong>Mobile:</strong> {selectedPartner.mobile}</p>
              <p><strong>City:</strong> {selectedPartner.city}</p>
            </div>

            <div className="doc-tabs-container">
              <button
                className={getTabClass("selfie")}
                onClick={() => setActiveTab("selfie")}
              >
                <FaUser /> Selfie
                {selectedPartner.selfie?.status === "Approved" && <FaCheckCircle className="approved-icon" />}
              </button>
              <button
                className={getTabClass("nationalId")}
                onClick={() => setActiveTab("nationalId")}
              >
                <FaIdCard /> National ID
                {selectedPartner.nationalId?.status === "Approved" && <FaCheckCircle className="approved-icon" />}
              </button>
              <button
                className={getTabClass("astrologyCertificate")}
                onClick={() => setActiveTab("astrologyCertificate")}
              >
                <FaCertificate /> Certificate
                {selectedPartner.astrologyCertificate?.status === "Approved" && <FaCheckCircle className="approved-icon" />}
              </button>
              <button
                className={getTabClass("addressProof")}
                onClick={() => setActiveTab("addressProof")}
              >
                <FaHome /> Address Proof
                {selectedPartner.addressProof?.status === "Approved" && <FaCheckCircle className="approved-icon" />}
              </button>
            </div>

            <div className="document-image-frame">
              {activeDoc && activeDoc.data && activeDoc.data.url ? (
                <div className="img-container">
                  <img src={activeDoc.data.url} alt={activeDoc.title} />
                  <span className={`doc-status-badge ${activeDoc.data.status?.toLowerCase()}`}>
                    STATUS: {activeDoc.data.status || "Pending"}
                  </span>
                </div>
              ) : (
                <p>No document uploaded</p>
              )}
            </div>

            <div className="modal-actions-row">
              <button className="btn-modal-pro cancel" onClick={closeDocModal} disabled={actionLoading}>
                Cancel / Close
              </button>

              <button
                className="btn-modal-pro reject"
                onClick={() => handleStatusChange(selectedPartner._id, "Rejected")}
                disabled={actionLoading || isCurrentDocApproved}
              >
                {actionLoading ? <FaSpinner className="spinner-icon" /> : <FaTimesCircle />} Reject
              </button>

              <button
                className={`btn-modal-pro approve ${isCurrentDocApproved ? "already-approved" : ""}`}
                onClick={() => handleStatusChange(selectedPartner._id, "Approved")}
                disabled={actionLoading || isCurrentDocApproved}
              >
                {actionLoading ? (
                  <FaSpinner className="spinner-icon" />
                ) : isCurrentDocApproved ? (
                  <>
                    <FaCheckCircle /> Already Approved
                  </>
                ) : (
                  <>
                    <FaCheckCircle /> Approve Document
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}