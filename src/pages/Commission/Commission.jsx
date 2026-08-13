import React, { useState, useEffect } from "react";
import "./Commission.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaCrown,
  FaPlus,
  FaEdit,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaTrash,
} from "react-icons/fa";

import { getAllPartners } from "../../api/Controller/partner.js";

import {
  getAllComissions,
  setCommission,
  updateCommission,
  deleteCommission,
} from "../../api/Controller/commision.js";

export default function Commission() {
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [formData, setFormData] = useState(null);

  const [addFormData, setAddFormData] = useState({
    partnerId: "",
    commissionPercentage: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [allPartners, setAllPartners] = useState([]);

  const fetchAllPartners = async () => {
    try {
      setLoading(true);
      const res = await getAllPartners();
      setAllPartners(res.data.data || res.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCommissions = async () => {
    try {
      setLoading(true);

      const res = await getAllComissions();

      if (res.data?.success) {
        setCommissions(res.data.data || []);
      } else {
        setCommissions([]);
        toast.error(res.data?.message || "Failed to load commissions");
      }
    } catch (error) {
      console.error("Get all commissions error:", error);

      setCommissions([]);
      toast.error(
        error.response?.data?.message || "Failed to load commissions",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPartners();
    fetchCommissions();
  }, []);

  const handleAddCommission = async () => {
    if (!addFormData.partnerId) {
      toast.error("Please select a partner");
      return;
    }

    if (!addFormData.commissionPercentage) {
      toast.error("Please enter commission percentage");
      return;
    }

    const percentage = Number(addFormData.commissionPercentage);

    if (percentage < 0 || percentage > 100) {
      toast.error("Commission percentage must be between 0 and 100");
      return;
    }

    try {
      const payload = {
        partnerId: addFormData.partnerId,
        commissionPercentage: percentage,
      };

      const res = await setCommission(payload);

      if (res.data?.success) {
        toast.success(res.data?.message || "Commission set successfully!");

        setShowAddModal(false);

        setAddFormData({
          partnerId: "",
          commissionPercentage: "",
        });

        fetchCommissions();
      } else {
        toast.error(res.data?.message || "Failed to set commission");
      }
    } catch (error) {
      console.error("Set commission error:", error);

      toast.error(error.response?.data?.message || "Failed to set commission");
    }
  };

  const handleDelete = async (commissionId) => {
    if (!commissionId) {
      toast.error("Commission ID is missing");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this commission?",
    );

    if (!confirmed) return;

    try {
      const res = await deleteCommission(commissionId);

      if (res.data?.success) {
        toast.success(res.data?.message || "Commission deleted successfully");

        // Remove deleted commission immediately from UI
        setCommissions((prev) =>
          prev.filter((item) => item._id !== commissionId),
        );

        // Optional: refresh from backend
        // await fetchCommissions();
      } else {
        toast.error(res.data?.message || "Failed to delete commission");
      }
    } catch (error) {
      console.error("Delete commission error:", error);

      toast.error(
        error.response?.data?.message || "Failed to delete commission",
      );
    }
  };

  // ---- UPDATE COMMISSION (dummy) ----
  const handleSaveCommission = async () => {
    if (!formData) return;

    const percentage = Number(formData.commissionPercentage);

    if (formData.commissionPercentage === "" || Number.isNaN(percentage)) {
      toast.error("Please enter commission percentage");
      return;
    }

    if (percentage < 0 || percentage > 100) {
      toast.error("Commission percentage must be between 0 and 100");
      return;
    }

    try {
      const payload = {
        commissionPercentage: percentage,
      };

      const res = await updateCommission(formData._id, payload);

      if (res.data?.success) {
        toast.success(res.data?.message || "Commission updated successfully");

        setShowEditModal(false);
        setFormData(null);

        fetchCommissions();
      } else {
        toast.error(res.data?.message || "Failed to update commission");
      }
    } catch (error) {
      console.error("Update commission error:", error);

      toast.error(
        error.response?.data?.message || "Failed to update commission",
      );
    }
  };

  // ---- Pagination ----
  const totalPages = Math.max(1, Math.ceil(commissions.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCommissions = commissions.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const openEditModal = (item) => {
    setFormData({
      _id: item._id,
      partnerId: item.partnerId?._id || item.partnerId || "",
      partnerName: item.partnerId?.fullName || "Unnamed Partner",
      mobile: item.partnerId?.mobile || "",
      commissionPercentage: item.commissionPercentage ?? "",
    });

    setShowEditModal(true);
  };
  // Totals for the summary strip
  const totalPaid = commissions
    .filter((c) => c.status === "paid")
    .reduce((sum, c) => sum + (c.commissionAmount || 0), 0);
  const totalPending = commissions
    .filter((c) => c.status === "pending")
    .reduce((sum, c) => sum + (c.commissionAmount || 0), 0);

  return (
    <div className="an-dashboard-container commission-page">
      {/* Background Ambient Orbs */}
      <div className="ambient-orb orb-1"></div>
      <div className="ambient-orb orb-2"></div>
      <div className="ambient-orb orb-3"></div>

      {/* Header Section */}
      <header className="db-header animate-fade-in">
        <div className="db-header-left">
          <div className="header-title-container">
            <span className="enterprise-badge">
              <FaCrown className="crown-icon" /> COSMIC PAYOUTS HUB
            </span>
            <h1 className="wrapped-header-title">Commission Manager</h1>
          </div>
          <p className="header-subtitle">
            Track astrologer commissions, payout status, and earnings across
            every order.
          </p>
        </div>

        <div className="db-header-right">
          <button
            className="btn-add-cosmic"
            onClick={() => setShowAddModal(true)}
          >
            <FaPlus /> Set Commission
          </button>
        </div>
      </header>

      {/* Summary Strip */}
      <div className="commission-summary-row animate-fade-in-delayed">
        <div className="summary-pill-card">
          <span className="summary-label">Total Records</span>
          <span className="summary-value">{commissions.length}</span>
        </div>
        <div className="summary-pill-card">
          <span className="summary-label">Total Paid</span>
          <span className="summary-value paid">₹{totalPaid.toFixed(2)}</span>
        </div>
        <div className="summary-pill-card">
          <span className="summary-label">Total Pending</span>
          <span className="summary-value pending">
            ₹{totalPending.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Main Content: Commission Management Card */}
      <div className="super-card main-table-card animate-fade-in-delayed">
        <div className="super-card-header">
          <div className="header-accent-title">
            <div className="title-vertical-bar gold"></div>
            <h2>Commission Management</h2>
          </div>
          <span className="giant-badge gold">{commissions.length} Records</span>
        </div>

        <div className="table-responsive">
          <table className="khatarnak-table">
            <thead>
              <tr>
                <th>PARTNER</th>
                <th>MOBILE</th>
                <th>COMMISSION</th>
                <th>CREATED DATE</th>
                <th>LAST UPDATED</th>
                <th style={{ textAlign: "right" }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    style={{ textAlign: "center", padding: "60px" }}
                  >
                    <div className="gold-loader"></div>
                  </td>
                </tr>
              ) : commissions.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    style={{ textAlign: "center", padding: "40px" }}
                  >
                    No commission records found.
                  </td>
                </tr>
              ) : (
                currentCommissions.map((item) => {
                  const partner = item.partnerId || {};

                  return (
                    <tr key={item._id}>
                      {/* Partner */}
                      <td>
                        <div className="partner-table-info">
                          <img
                            src={
                              partner.profilePic ||
                              "https://via.placeholder.com/50"
                            }
                            alt={partner.fullName || "Partner"}
                            className="partner-table-avatar"
                          />

                          <div>
                            <span className="main-name">
                              {partner.fullName || "Unnamed Partner"}
                            </span>

                            <span className="desc-cell">
                              ID: {partner._id || "—"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Mobile */}
                      <td>
                        <span className="desc-cell">
                          {partner.mobile || "—"}
                        </span>
                      </td>

                      {/* Commission */}
                      <td>
                        <div className="commission-value">
                          <span className="commission-percentage">
                            {item.commissionPercentage}%
                          </span>
                          <span className="commission-label">Commission</span>
                        </div>
                      </td>

                      {/* Created Date */}
                      <td>
                        <span className="desc-cell">
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                },
                              )
                            : "—"}
                        </span>
                      </td>

                      {/* Updated Date */}
                      <td>
                        <span className="desc-cell">
                          {item.updatedAt
                            ? new Date(item.updatedAt).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                },
                              )
                            : "—"}
                        </span>
                      </td>

                      {/* Action */}
                      <td
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          gap: "8px",
                        }}
                      >
                        <button
                          className="btn-pro btn-pro-edit"
                          onClick={() => openEditModal(item)}
                          title="Edit Commission"
                        >
                          <FaEdit />
                        </button>

                        <button
                          className="btn-pro btn-pro-delete"
                          onClick={() => handleDelete(item._id)}
                          title="Delete Commission"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom Right Pagination Bar */}
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
                  className={`pagination-btn number-btn ${
                    currentPage === page ? "active" : ""
                  }`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ),
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

      {/* Add Commission Modal */}
      {showAddModal && (
        <div
          className="ultra-modal-backdrop"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="ultra-modal-box edit-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ultra-modal-header">
              <div className="modal-header-top">
                <h3>Set New Commission</h3>
                <button
                  className="modal-close-btn"
                  onClick={() => setShowAddModal(false)}
                >
                  <FaTimes />
                </button>
              </div>
              <div className="modal-title-underline"></div>
            </div>

            <div className="edit-form-body">
              <div className="edit-form-body">
                {/* Partner */}
                <div className="form-group">
                  <label>Partner</label>

                  <select
                    value={addFormData.partnerId}
                    onChange={(e) =>
                      setAddFormData({
                        ...addFormData,
                        partnerId: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Partner</option>

                    {allPartners.map((partner) => (
                      <option key={partner._id} value={partner._id}>
                        {partner.fullName ||
                          partner.mobile ||
                          "Unnamed Partner"}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Commission Percentage */}
                <div className="form-group">
                  <label>Commission Percentage (%)</label>

                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Enter commission percentage"
                    value={addFormData.commissionPercentage}
                    onChange={(e) =>
                      setAddFormData({
                        ...addFormData,
                        commissionPercentage: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="modal-actions-row">
              <button
                className="btn-modal-pro cancel"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn-modal-pro save"
                onClick={handleAddCommission}
              >
                Set Commission
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Commission Modal */}
      {showEditModal && formData && (
        <div
          className="ultra-modal-backdrop"
          onClick={() => setShowEditModal(false)}
        >
          <div
            className="ultra-modal-box edit-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ultra-modal-header">
              <div className="modal-header-top">
                <div>
                  <h3>Edit Commission</h3>
                  <p className="modal-subtitle">
                    Update commission percentage for this partner
                  </p>
                </div>

                <button
                  className="modal-close-btn"
                  onClick={() => setShowEditModal(false)}
                >
                  <FaTimes />
                </button>
              </div>

              <div className="modal-title-underline"></div>
            </div>

            <div className="edit-form-body">
              {/* Partner */}
              <div className="partner-preview-card">
                <div className="partner-preview-avatar">
                  <span>
                    {formData.partnerName?.charAt(0)?.toUpperCase() || "P"}
                  </span>
                </div>

                <div>
                  <span className="partner-preview-name">
                    {formData.partnerName}
                  </span>

                  <span className="partner-preview-mobile">
                    {formData.mobile || "No mobile"}
                  </span>
                </div>
              </div>

              {/* Commission */}
              <div className="form-group">
                <label>Commission Percentage (%)</label>

                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Enter commission percentage"
                  value={formData.commissionPercentage}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      commissionPercentage: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="modal-actions-row">
              <button
                className="btn-modal-pro cancel"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>

              <button
                className="btn-modal-pro save"
                onClick={handleSaveCommission}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
