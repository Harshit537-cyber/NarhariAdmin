import React, { useState, useEffect, useMemo } from "react";
import "./Partner.css";
import {
  getAllPartners,
  deletePartner,
  activatePartner,
  deactivatePartner,
} from "../../api/Controller/partner";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import DeleteModal from "./DeleteModal";
import EditPartnerModal from "./Editpartner";
import { toast } from "react-toastify";

export default function Partner() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [error, setError] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

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
    // apna view logic yaha daalo
  };

  // ==========================================
  // TOGGLE ACTIVATE / DEACTIVATE (single switch)
  // ==========================================
  const handleToggleStatus = async (partner) => {
    const isCurrentlyActive = !!partner.isActive;
    setTogglingId(partner._id);

    // optimistic UI update
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

      // Agar backend bole "already active/deactivated", UI already sahi state me hai — revert mat karo
      const alreadyMsg = (err.message || "").toLowerCase();
      if (alreadyMsg.includes("already")) {
        toast.info(err.message);
        return;
      }

      // Actual failure — revert UI
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

  const recentPartners = useMemo(() => {
    return [...partners]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  }, [partners]);

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

  return (
    <div className="an-partner-container">
      {/* Header */}
      <header className="pt-header animate-fade-in">
        <div className="pt-header-left">
          <h1>Partner Network</h1>
          <p>Manage every partner registered on the sacred network.</p>
        </div>
        <div className="pt-header-right">
          <span className="live-pulse"></span>
          <span className="system-status">System Live</span>
        </div>
      </header>

      {/* Metrics */}
      <div className="pt-metrics-grid">
        <div className="metric-card animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div className="metric-icon chat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div className="metric-data">
            <h3>{stats.totalPartners}</h3>
            <p>Total Partners</p>
          </div>
          <span className="metric-trend up">+{stats.newToday} Today</span>
        </div>

        <div className="metric-card animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="metric-icon users-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <div className="metric-data">
            <h3>{stats.verifiedCount}</h3>
            <p>Verified Partners</p>
          </div>
        </div>

        <div className="metric-card animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <div className="metric-icon puja-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
          <div className="metric-data">
            <h3>{stats.kycPendingCount}</h3>
            <p>KYC Pending</p>
          </div>
          <span className="metric-pulse-dot"></span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="pt-content-grid">
        <div className="db-card main-table-card animate-fade-in-delayed">
          <div className="db-card-header">
            <h2>All Partners Management</h2>
            <span className="badge">{partners.length} Total</span>
          </div>

          <div className="table-responsive">
            {loading ? (
              <p style={{ padding: "20px", color: "var(--gray)" }}>Loading partners...</p>
            ) : error ? (
              <p style={{ padding: "20px", color: "var(--red)" }}>{error}</p>
            ) : (
              <table className="db-table">
                <thead>
                  <tr>
                    <th>Mobile</th>
                    <th>Verified</th>
                    <th>Profile Complete</th>
                    <th>KYC Status</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {partners.map((partner) => (
                    <tr key={partner._id}>
                      <td>{partner.mobile}</td>
                      <td>
                        <span className={`role-badge ${partner.isVerified ? "role-admin" : "role-user"}`}>
                          {partner.isVerified ? "Verified" : "Not Verified"}
                        </span>
                      </td>
                      <td>
                        <span className={`role-badge ${partner.isProfileComplete ? "role-admin" : "role-user"}`}>
                          {partner.isProfileComplete ? "Complete" : "Incomplete"}
                        </span>
                      </td>
                      <td>{partner.kycStatus}</td>

                      {/* SINGLE TOGGLE SWITCH */}
                      <td>
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={!!partner.isActive}
                            disabled={togglingId === partner._id}
                            onChange={() => handleToggleStatus(partner)}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                        <span
                          className={`toggle-status-label ${
                            partner.isActive ? "active" : "inactive"
                          }`}
                        >
                          {partner.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td>
                        <div className="action-btns">
                          <button className="action-btn view-btn" onClick={() => handleView(partner)}>
                            <FaEye />
                          </button>
                          <button className="action-btn edit-btn" onClick={() => handleEdit(partner)}>
                            <FaEdit />
                          </button>
                          <button
                            className="action-btn delete-btn"
                            onClick={() => {
                              setSelectedPartner(partner);
                              setDeleteOpen(true);
                            }}
                          >
                            <FaTrash />
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
    </div>
  );
}