import React, { useState, useEffect } from "react";
import { getAllGifts, addGift, editGift, deleteGift } from "../../api/Controller/gifts";
import "./Gifts.css";
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
  FaCheckCircle,
  FaTimesCircle,
  FaGift,
   FaEye,
} from "react-icons/fa";


export default function Gifts() {
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showViewModal, setShowViewModal] = useState(false);
  const [viewData, setViewData] = useState(null);
  // Add modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [addData, setAddData] = useState({
    giftName: "",
    price: "",
    isActive: true,
    icon: null,
    iconPreview: "",
  });

  // Edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState(null);

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.max(1, Math.ceil(gifts.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentGifts = gifts.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

 const handleAddGift = async () => {
  if (!addData.giftName || !addData.price || !addData.icon) {
    toast.error("Gift name, price and icon are required");
    return;
  }

  const formData = new FormData();

  formData.append("giftName", addData.giftName);
  formData.append("price", addData.price);
  formData.append("icon", addData.icon);

  try {
    const response = await addGift(formData);

    toast.success(response?.message || "Gift added successfully!");

    setShowAddModal(false);

    setAddData({
      giftName: "",
      price: "",
      isActive: true,
      icon: null,
      iconPreview: "",
    });

 

    // API se latest gifts reload
    const updatedResponse = await getAllGifts(currentPage, itemsPerPage);
    setGifts(updatedResponse?.gifts || []);
  } catch (error) {
    toast.error(error?.message || "Failed to add gift");
  }
};

  // ---- OPEN EDIT MODAL ----
  const openEditModal = (item) => {
    setFormData({
      _id: item._id,
      giftName: item.giftName || "",
      price: item.price ?? "",
      isActive: item.isActive !== undefined ? item.isActive : true,
      iconUrl: item.iconUrl || "",
   icon: null,
iconPreview: "",
    });
    setShowEditModal(true);
  };
 const openViewModal = (item) => {
    setViewData(item);
    setShowViewModal(true);
  };
const handleSaveGift = async () => {
  if (!formData) return;

  if (!formData.giftName || !formData.price) {
    toast.error("Gift name and price are required");
    return;
  }

  const data = new FormData();

  data.append("giftName", formData.giftName);
  data.append("price", formData.price);
  data.append("isActive", formData.isActive);

  if (formData.icon) {
    data.append("icon", formData.icon);
  }

  try {
    const response = await editGift(formData._id, data);

    toast.success(response?.message || "Gift updated successfully!");

    setShowEditModal(false);

    const updatedResponse = await getAllGifts(currentPage, itemsPerPage);
    setGifts(updatedResponse?.gifts || []);
  } catch (error) {
    toast.error(error?.message || "Failed to update gift");
  }
};

  // ---- DELETE ----
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };
const confirmDeleteGift = async () => {
  if (!deleteId) return;

  try {
    const response = await deleteGift(deleteId);

    toast.success("Gift deleted successfully");

    setShowDeleteModal(false);
    setDeleteId(null);

    const updatedResponse = await getAllGifts(currentPage, itemsPerPage);
    setGifts(updatedResponse?.gifts || []);
  } catch (error) {
    toast.error(error?.message || "Failed to delete gift");
  }
};


useEffect(() => {
  const fetchGifts = async () => {
    try {
      setLoading(true);

      const response = await getAllGifts(currentPage, itemsPerPage);

      setGifts(response?.gifts || []);
    } catch (error) {
      console.error("Failed to fetch gifts:", error);
      toast.error(error?.message || "Failed to fetch gifts");
    } finally {
      setLoading(false);
    }
  };

  fetchGifts();
}, [currentPage]);
  return (
    <div className="an-dashboard-container gift-page">
      {/* Background Ambient Orbs */}
      <div className="ambient-orb orb-1"></div>
      <div className="ambient-orb orb-2"></div>
      <div className="ambient-orb orb-3"></div>

      <ToastContainer position="top-right" autoClose={2500} />

      {/* Header Section */}
      <header className="db-header animate-fade-in">
        <div className="db-header-left">
          <div className="header-title-container">
            <span className="enterprise-badge">
              <FaCrown className="crown-icon" /> COSMIC GIFT HUB
            </span>
            <h1 className="wrapped-header-title">Gift Manager</h1>
          </div>
          <p className="header-subtitle">
            Manage virtual gifts, pricing, and availability status.
          </p>
        </div>

        <div className="db-header-right">
          <button className="btn-add-cosmic" onClick={() => setShowAddModal(true)}>
            <FaPlus /> Add Gift
          </button>
        </div>
      </header>

      {/* Main Content: Gift Management Card */}
      <div className="super-card main-table-card animate-fade-in-delayed">
        <div className="super-card-header">
          <div className="header-accent-title">
            <div className="title-vertical-bar gold"></div>
            <h2>Gift Management</h2>
          </div>
          <span className="giant-badge gold">{gifts.length} Gifts</span>
        </div>

        <div className="table-responsive">
          <table className="khatarnak-table">
            <thead>
              <tr>
                <th>ICON</th>
                <th>GIFT NAME</th>
                <th>PRICE</th>
                <th>STATUS</th>
                <th style={{ textAlign: "right" }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "60px" }}>
                    <div className="gold-loader"></div>
                  </td>
                </tr>
              ) : gifts.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "40px" }}>
                    No gifts found.
                  </td>
                </tr>
              ) : (
                currentGifts.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <div className="category-img-container">
                        <img className="category-img" src={item.iconUrl} alt={item.giftName} />
                      </div>
                    </td>

                    <td>
                      <span className="main-name">
                        <FaGift style={{ marginRight: 6, color: "var(--neon-gold)" }} />
                        {item.giftName}
                      </span>
                    </td>

                    <td>
                      <span className="desc-cell">₹{item.price}</span>
                    </td>

                    <td>
                      <span className={`status-pill ${item.isActive ? "active" : "inactive"}`}>
                        {item.isActive ? (
                          <>
                            <FaCheckCircle /> Active
                          </>
                        ) : (
                          <>
                            <FaTimesCircle /> Inactive
                          </>
                        )}
                      </span>
                    </td>

                    <td style={{ textAlign: "right" }}>

                        <button className="btn-pro btn-pro-view" onClick={() => openViewModal(item)}>
                        <FaEye /> View
                      </button>
                      <button className="btn-pro btn-pro-edit" onClick={() => openEditModal(item)}>
                        <FaEdit /> Edit
                      </button>
                      <button
                        className="btn-pro btn-pro-delete"
                        onClick={() => handleDeleteClick(item._id)}
                      >
                        <FaTrash /> Delete
                      </button>
                    </td>
                  </tr>
                ))
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
                className={`pagination-btn number-btn ${currentPage === page ? "active" : ""}`}
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

      {/* Add Gift Modal */}
      {showAddModal && (
        <div className="ultra-modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="ultra-modal-box edit-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="ultra-modal-header">
              <div className="modal-title">
                <h3>Add New Gift</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setShowAddModal(false)}>
                <FaTimes />
              </button>
            </div>

            <div className="edit-form-body">
              <div className="form-group">
                <label>Gift Name</label>
                <input
                  type="text"
                  value={addData.giftName}
                  onChange={(e) => setAddData({ ...addData, giftName: e.target.value })}
                  placeholder="e.g. crown"
                />
              </div>

              <div className="form-group">
                <label>Price (₹)</label>
                <input
                  type="number"
                  value={addData.price}
                  onChange={(e) => setAddData({ ...addData, price: e.target.value })}
                  placeholder="e.g. 40"
                />
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={addData.isActive}
                    onChange={(e) => setAddData({ ...addData, isActive: e.target.checked })}
                  />{" "}
                  Active
                </label>
              </div>

              <div className="form-group">
                <label>Gift Icon</label>
                {addData.iconPreview && (
                  <img
                    src={addData.iconPreview}
                    alt="Preview"
                    style={{
                      width: "90px",
                      height: "90px",
                      objectFit: "cover",
                      borderRadius: "12px",
                      marginBottom: "10px",
                    }}
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setAddData({
                        ...addData,
                        icon: file,
                        iconPreview: URL.createObjectURL(file),
                      });
                    }
                  }}
                />
              </div>
            </div>

            <div className="modal-actions-row">
              <button className="btn-modal-pro cancel" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button className="btn-modal-pro save" onClick={handleAddGift}>
                Add Gift
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Gift Modal */}
      {showEditModal && formData && (
        <div className="ultra-modal-backdrop" onClick={() => setShowEditModal(false)}>
          <div className="ultra-modal-box edit-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="ultra-modal-header">
              <div className="modal-title">
                <h3>Edit Gift</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setShowEditModal(false)}>
                <FaTimes />
              </button>
            </div>

            <div className="edit-form-body">
              <div className="form-group">
                <label>Gift Name</label>
                <input
                  type="text"
                  value={formData.giftName}
                  onChange={(e) => setFormData({ ...formData, giftName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Price (₹)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />{" "}
                  Active
                </label>
              </div>

              <div className="form-group">
                <label>Gift Icon</label>

                {(formData.iconPreview || formData.iconUrl) && (
                  <img
                    src={formData.iconPreview || formData.iconUrl}
                    alt="Gift"
                    style={{
                      width: "90px",
                      height: "90px",
                      objectFit: "cover",
                      borderRadius: "12px",
                      marginBottom: "10px",
                    }}
                  />
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                    setFormData({
  ...formData,
  icon: file,
  iconPreview: URL.createObjectURL(file),
});
                    }
                  }}
                />
              </div>
            </div>

            <div className="modal-actions-row">
              <button className="btn-modal-pro cancel" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
              <button className="btn-modal-pro save" onClick={handleSaveGift}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Delete Confirm Modal */}
      {showDeleteModal && (
        <div className="ultra-modal-backdrop" onClick={() => setShowDeleteModal(false)}>
          <div className="ultra-modal-box delete-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="ultra-modal-header">
              <div className="modal-title">
                <h3>Delete Gift</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setShowDeleteModal(false)}>
                <FaTimes />
              </button>
            </div>

            <p className="delete-confirm-text">
              Are you sure you want to delete this gift? 
            </p>

            <div className="modal-actions-row">
              <button className="btn-modal-pro cancel" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="btn-modal-pro delete-confirm" onClick={confirmDeleteGift}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {/* View Gift Modal */}
      {showViewModal && viewData && (
        <div className="ultra-modal-backdrop" onClick={() => setShowViewModal(false)}>
          <div className="ultra-modal-box edit-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="ultra-modal-header">
              <div className="modal-title">
                <h3>View Gift</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setShowViewModal(false)}>
                <FaTimes />
              </button>
            </div>
<div className="edit-form-body">
              <div style={{ textAlign: "center", marginBottom: "16px" }}>
                <img
                  src={viewData.iconUrl}
                  alt={viewData.giftName}
                  style={{ width: "90px", height: "90px", objectFit: "cover", borderRadius: "12px" }}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px 24px",
                  background: "#fff",
                  borderRadius: "12px",
                  padding: "16px",
                }}
              >
              

                <div className="form-group">
                  <label>Gift Name</label>
                  <p>{viewData.giftName}</p>
                </div>

                <div className="form-group">
                  <label>Price</label>
                  <p>₹{viewData.price}</p>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <p>{viewData.isActive ? "Active" : "Inactive"}</p>
                </div>

                <div className="form-group">
                  <label>Created At</label>
                  <p>{viewData.createdAt ? new Date(viewData.createdAt).toLocaleDateString() : "N/A"}</p>
                </div>

                <div className="form-group">
                  <label>Updated At</label>
                  <p>{viewData.updatedAt ? new Date(viewData.updatedAt).toLocaleDateString() : "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="modal-actions-row">
              <button className="btn-modal-pro cancel" onClick={() => setShowViewModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}