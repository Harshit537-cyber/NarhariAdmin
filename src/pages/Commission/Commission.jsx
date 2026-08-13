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
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
} from "react-icons/fa";

/* ---------------------------------------------------
   DUMMY DATA (replace with real API calls when ready)
--------------------------------------------------- */
const DUMMY_COMMISSIONS = [
  {
    _id: "c1",
    astrologerName: "Pandit Ravi Shankar",
    astrologerImage: "",
    orderId: "ORD-10231",
    ritualTitle: "Navgraha Shanti Puja",
    orderAmount: 4999,
    commissionPercent: 20,
    commissionAmount: 999.8,
    status: "paid",
    payoutDate: "2026-08-01",
  },
  {
    _id: "c2",
    astrologerName: "Acharya Meera Joshi",
    astrologerImage: "",
    orderId: "ORD-10254",
    ritualTitle: "Rudra Abhishek",
    orderAmount: 2999,
    commissionPercent: 15,
    commissionAmount: 449.85,
    status: "pending",
    payoutDate: "2026-08-10",
  },
  {
    _id: "c3",
    astrologerName: "Pandit Suresh Tiwari",
    astrologerImage: "",
    orderId: "ORD-10267",
    ritualTitle: "Career Success Havan",
    orderAmount: 3499,
    commissionPercent: 18,
    commissionAmount: 629.82,
    status: "pending",
    payoutDate: "2026-08-12",
  },
  {
    _id: "c4",
    astrologerName: "Acharya Deepak Nair",
    astrologerImage: "",
    orderId: "ORD-10289",
    ritualTitle: "Kaal Sarp Dosh Puja",
    orderAmount: 5999,
    commissionPercent: 20,
    commissionAmount: 1199.8,
    status: "paid",
    payoutDate: "2026-07-28",
  },
  {
    _id: "c5",
    astrologerName: "Pandit Ravi Shankar",
    astrologerImage: "",
    orderId: "ORD-10301",
    ritualTitle: "Griha Pravesh Puja",
    orderAmount: 6499,
    commissionPercent: 20,
    commissionAmount: 1299.8,
    status: "hold",
    payoutDate: "2026-08-15",
  },
  {
    _id: "c6",
    astrologerName: "Acharya Meera Joshi",
    astrologerImage: "",
    orderId: "ORD-10318",
    ritualTitle: "Manglik Dosh Nivaran",
    orderAmount: 3999,
    commissionPercent: 15,
    commissionAmount: 599.85,
    status: "paid",
    payoutDate: "2026-08-05",
  },
];

/* Dummy async helpers - simulate network latency.
   Swap these out for real API calls (e.g. ../../api/Controller/commissions) later. */
const getAllCommissionsDummy = () =>
  new Promise((resolve) => {
    setTimeout(() => resolve({ data: DUMMY_COMMISSIONS }), 600);
  });

const addCommissionDummy = (payload) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          _id: "c" + Math.random().toString(36).slice(2, 8),
          ...payload,
        },
      });
    }, 600);
  });

const STATUS_META = {
  paid: { label: "Paid", icon: <FaCheckCircle />, cls: "active" },
  pending: { label: "Pending", icon: <FaHourglassHalf />, cls: "pending" },
  hold: { label: "On Hold", icon: <FaTimesCircle />, cls: "inactive" },
};

export default function Commission() {
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [formData, setFormData] = useState(null);
  const [addFormData, setAddFormData] = useState({
    astrologerName: "",
    orderId: "",
    ritualTitle: "",
    orderAmount: "",
    commissionPercent: "",
    status: "pending",
    payoutDate: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchCommissions();
  }, []);

  const fetchCommissions = async () => {
    setLoading(true);
    try {
      const res = await getAllCommissionsDummy();
      setCommissions(res.data || []);
    } catch (err) {
      toast.error(err.message || "Failed to load commissions");
    } finally {
      setLoading(false);
    }
  };

  const calcCommissionAmount = (orderAmount, percent) => {
    const amt = parseFloat(orderAmount) || 0;
    const pct = parseFloat(percent) || 0;
    return +((amt * pct) / 100).toFixed(2);
  };

  const handleAddCommission = async () => {
    if (!addFormData.astrologerName || !addFormData.orderId) {
      toast.error("Astrologer name and Order ID are required");
      return;
    }

    try {
      const commissionAmount = calcCommissionAmount(
        addFormData.orderAmount,
        addFormData.commissionPercent
      );

      const payload = {
        astrologerName: addFormData.astrologerName,
        orderId: addFormData.orderId,
        ritualTitle: addFormData.ritualTitle,
        orderAmount: parseFloat(addFormData.orderAmount) || 0,
        commissionPercent: parseFloat(addFormData.commissionPercent) || 0,
        commissionAmount,
        status: addFormData.status,
        payoutDate: addFormData.payoutDate,
      };

      const res = await addCommissionDummy(payload);

      setCommissions((prev) => [res.data, ...prev]);
      toast.success("Commission added successfully!");
      setShowAddModal(false);
      setAddFormData({
        astrologerName: "",
        orderId: "",
        ritualTitle: "",
        orderAmount: "",
        commissionPercent: "",
        status: "pending",
        payoutDate: "",
      });
    } catch (err) {
      toast.error(err.message || "Failed to add commission");
    }
  };

  // ---- UPDATE COMMISSION (dummy) ----
  const handleSaveCommission = () => {
    if (!formData) return;

    const commissionAmount = calcCommissionAmount(
      formData.orderAmount,
      formData.commissionPercent
    );

    setCommissions((prev) =>
      prev.map((item) =>
        item._id === formData._id
          ? {
              ...item,
              astrologerName: formData.astrologerName,
              orderId: formData.orderId,
              ritualTitle: formData.ritualTitle,
              orderAmount: parseFloat(formData.orderAmount) || 0,
              commissionPercent: parseFloat(formData.commissionPercent) || 0,
              commissionAmount,
              status: formData.status,
              payoutDate: formData.payoutDate,
            }
          : item
      )
    );

    toast.success("Commission updated successfully!");
    setShowEditModal(false);
  };

  // ---- Pagination ----
  const totalPages = Math.max(1, Math.ceil(commissions.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCommissions = commissions.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const openEditModal = (item) => {
    setFormData({
      _id: item._id,
      astrologerName: item.astrologerName || "",
      orderId: item.orderId || "",
      ritualTitle: item.ritualTitle || "",
      orderAmount: item.orderAmount ?? "",
      commissionPercent: item.commissionPercent ?? "",
      status: item.status || "pending",
      payoutDate: item.payoutDate || "",
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
            Track astrologer commissions, payout status, and earnings across every order.
          </p>
        </div>

        <div className="db-header-right">
          <button className="btn-add-cosmic" onClick={() => setShowAddModal(true)}>
            <FaPlus /> Add Commission
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
          <span className="summary-value pending">₹{totalPending.toFixed(2)}</span>
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
                <th>ASTROLOGER</th>
                <th>ORDER / RITUAL</th>
                <th>ORDER AMT</th>
                <th>COMMISSION</th>
                <th>STATUS</th>
                <th style={{ textAlign: "right" }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "60px" }}>
                    <div className="gold-loader"></div>
                  </td>
                </tr>
              ) : commissions.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "40px" }}>
                    No commission records found.
                  </td>
                </tr>
              ) : (
                currentCommissions.map((item) => {
                  const meta = STATUS_META[item.status] || STATUS_META.pending;
                  return (
                    <tr key={item._id}>
                      <td>
                        <span className="main-name">{item.astrologerName}</span>
                      </td>

                      <td>
                        <span className="main-name">{item.orderId}</span>
                        <br />
                        <span className="desc-cell">{item.ritualTitle || "—"}</span>
                      </td>

                      <td>
                        <span className="desc-cell">₹{item.orderAmount}</span>
                      </td>

                      <td>
                        <span className="main-name">
                          ₹{item.commissionAmount}{" "}
                          <span className="desc-cell">
                            ({item.commissionPercent}%)
                          </span>
                        </span>
                      </td>

                      <td>
                        <span className={`status-pill ${meta.cls}`}>
                          {meta.icon} {meta.label}
                        </span>
                      </td>

                      <td style={{ textAlign: "right" }}>
                        <button
                          className="btn-pro btn-pro-edit"
                          onClick={() => openEditModal(item)}
                        >
                          <FaEdit /> Edit
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

            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
              <button
                key={page}
                className={`pagination-btn number-btn ${
                  currentPage === page ? "active" : ""
                }`}
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
      </div>

      {/* Add Commission Modal */}
      {showAddModal && (
        <div className="ultra-modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div
            className="ultra-modal-box edit-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ultra-modal-header">
              <div className="modal-header-top">
                <h3>Add New Commission</h3>
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
              <div className="form-group">
                <label>Astrologer Name</label>
                <input
                  type="text"
                  value={addFormData.astrologerName}
                  onChange={(e) =>
                    setAddFormData({ ...addFormData, astrologerName: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Order ID</label>
                <input
                  type="text"
                  value={addFormData.orderId}
                  onChange={(e) =>
                    setAddFormData({ ...addFormData, orderId: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Ritual / Service</label>
                <input
                  type="text"
                  value={addFormData.ritualTitle}
                  onChange={(e) =>
                    setAddFormData({ ...addFormData, ritualTitle: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Order Amount (₹)</label>
                <input
                  type="text"
                  value={addFormData.orderAmount}
                  onChange={(e) =>
                    setAddFormData({ ...addFormData, orderAmount: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Commission (%)</label>
                <input
                  type="text"
                  value={addFormData.commissionPercent}
                  onChange={(e) =>
                    setAddFormData({
                      ...addFormData,
                      commissionPercent: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Computed Commission Amount</label>
                <input
                  type="text"
                  disabled
                  value={`₹${calcCommissionAmount(
                    addFormData.orderAmount,
                    addFormData.commissionPercent
                  )}`}
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={addFormData.status}
                  onChange={(e) =>
                    setAddFormData({ ...addFormData, status: e.target.value })
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="hold">On Hold</option>
                </select>
              </div>

              <div className="form-group">
                <label>Payout Date</label>
                <input
                  type="date"
                  value={addFormData.payoutDate}
                  onChange={(e) =>
                    setAddFormData({ ...addFormData, payoutDate: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="modal-actions-row">
              <button
                className="btn-modal-pro cancel"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button className="btn-modal-pro save" onClick={handleAddCommission}>
                Add Commission
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Commission Modal */}
      {showEditModal && formData && (
        <div className="ultra-modal-backdrop" onClick={() => setShowEditModal(false)}>
          <div
            className="ultra-modal-box edit-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ultra-modal-header">
              <div className="modal-header-top">
                <h3>Edit Commission</h3>
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
              <div className="form-group">
                <label>Astrologer Name</label>
                <input
                  type="text"
                  value={formData.astrologerName}
                  onChange={(e) =>
                    setFormData({ ...formData, astrologerName: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Order ID</label>
                <input
                  type="text"
                  value={formData.orderId}
                  onChange={(e) =>
                    setFormData({ ...formData, orderId: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Ritual / Service</label>
                <input
                  type="text"
                  value={formData.ritualTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, ritualTitle: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Order Amount (₹)</label>
                <input
                  type="text"
                  value={formData.orderAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, orderAmount: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Commission (%)</label>
                <input
                  type="text"
                  value={formData.commissionPercent}
                  onChange={(e) =>
                    setFormData({ ...formData, commissionPercent: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Computed Commission Amount</label>
                <input
                  type="text"
                  disabled
                  value={`₹${calcCommissionAmount(
                    formData.orderAmount,
                    formData.commissionPercent
                  )}`}
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="hold">On Hold</option>
                </select>
              </div>

              <div className="form-group">
                <label>Payout Date</label>
                <input
                  type="date"
                  value={formData.payoutDate}
                  onChange={(e) =>
                    setFormData({ ...formData, payoutDate: e.target.value })
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
              <button className="btn-modal-pro save" onClick={handleSaveCommission}>
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