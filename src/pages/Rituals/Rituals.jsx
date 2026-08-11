import React, { useState, useEffect } from "react";
import "./Rituals.css";
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
} from "react-icons/fa";

// ---- DUMMY DATA (replace with API later) ----
const DUMMY_RITUALS = [
  {
    _id: "r1",
    name: "Morning Surya Namaskar",
    shortDescription: "Sun salutation ritual for positive energy",
    description:
      "A traditional ritual performed at sunrise to invoke positivity, health and prosperity.",
    duration: "15 mins",
    price: 499,
    salePrice: 349,
    isFeatured: true,
    isActive: true,
    images: [`data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="#b38c1b"/><text x="50" y="55" font-size="14" fill="white" text-anchor="middle" font-family="sans-serif">Surya</text></svg>')}`],
  },
  {
    _id: "r2",
    name: "Rudra Abhishek",
    shortDescription: "Sacred Shiva ritual for peace and protection",
    description:
      "A powerful Vedic ritual dedicated to Lord Shiva, performed to remove obstacles and bring calm.",
    duration: "45 mins",
    price: 1499,
    salePrice: 1199,
    isFeatured: true,
    isActive: true,
   images: [`data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="#8b5cf6"/><text x="50" y="55" font-size="14" fill="white" text-anchor="middle" font-family="sans-serif">Rudra</text></svg>')}`],
  },
  {
    _id: "r3",
    name: "Navgrah Shanti Puja",
    shortDescription: "Planetary peace ritual",
    description:
      "Performed to pacify the nine planets and reduce their malefic effects on one's life.",
    duration: "60 mins",
    price: 2499,
    salePrice: 1999,
    isFeatured: false,
    isActive: true,
   images: [`data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="#06b6d4"/><text x="50" y="55" font-size="13" fill="white" text-anchor="middle" font-family="sans-serif">Navgrah</text></svg>')}`],
  },
  {
    _id: "r4",
    name: "Lakshmi Puja",
    shortDescription: "Wealth and prosperity ritual",
    description:
      "A ritual dedicated to Goddess Lakshmi to invite wealth, abundance and good fortune.",
    duration: "30 mins",
    price: 999,
    salePrice: 799,
    isFeatured: false,
    isActive: false,
  images: [`data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="#ef4444"/><text x="50" y="55" font-size="11" fill="white" text-anchor="middle" font-family="sans-serif">KaalSarp</text></svg>')}`],
  },
 
];

export default function Rituals() {
  const [rituals, setRituals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [formData, setFormData] = useState(null);
  const [addFormData, setAddFormData] = useState({
    name: "",
    shortDescription: "",
    description: "",
    duration: "",
    price: "",
    salePrice: "",
    isFeatured: false,
    isActive: true,
  });
  const [deleteId, setDeleteId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchRituals();
  }, []);

  // ---- Simulated fetch (replace with real API call) ----
  const fetchRituals = () => {
    setLoading(true);
    setTimeout(() => {
      setRituals(DUMMY_RITUALS);
      setLoading(false);
    }, 500);
  };

  // ---- ADD RITUAL (dummy) ----
  const handleAddRitual = () => {
    if (!addFormData.name) {
      toast.error("Ritual name is required");
      return;
    }

    const newRitual = {
      _id: "r" + Date.now(),
      name: addFormData.name,
      shortDescription: addFormData.shortDescription,
      description: addFormData.description,
      duration: addFormData.duration,
      price: addFormData.price,
      salePrice: addFormData.salePrice,
      isFeatured: addFormData.isFeatured,
      isActive: addFormData.isActive,
      images: ["https://via.placeholder.com/100x100.png?text=Ritual"],
    };

    setRituals((prev) => [newRitual, ...prev]);
    toast.success("Ritual added successfully!");
    setShowAddModal(false);
    setAddFormData({
      name: "",
      shortDescription: "",
      description: "",
      duration: "",
      price: "",
      salePrice: "",
      isFeatured: false,
      isActive: true,
    });
  };

  // ---- UPDATE RITUAL (dummy) ----
  const handleSaveSpecs = () => {
    if (!formData) return;

    setRituals((prev) =>
      prev.map((item) =>
        item._id === formData._id
          ? {
              ...item,
              name: formData.ritualName,
              shortDescription: formData.shortDescription,
              description: formData.description,
              duration: formData.duration,
              price: formData.ritualPrice,
              salePrice: formData.originalPrice,
              isFeatured: formData.isFeatured,
              isActive: formData.isActive,
            }
          : item
      )
    );

    toast.success("Ritual updated successfully!");
    setShowEditModal(false);
  };

  // ---- DELETE RITUAL (dummy) ----
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDeleteRitual = () => {
    if (!deleteId) return;
    setRituals((prev) => prev.filter((item) => item._id !== deleteId));
    toast.success("Ritual deleted successfully!");
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  // ---- Pagination ----
  const totalPages = Math.max(1, Math.ceil(rituals.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRituals = rituals.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const openEditModal = (item) => {
    setFormData({
      _id: item._id,
      ritualName: item.name || "",
      shortDescription: item.shortDescription || "",
      description: item.description || "",
      duration: item.duration || "",
      ritualPrice: item.price ?? "",
      originalPrice: item.salePrice ?? "",
      isFeatured: !!item.isFeatured,
      isActive: item.isActive !== undefined ? item.isActive : true,
      image: item.images?.[0] || "",
    });
    setShowEditModal(true);
  };

  return (
    <div className="an-dashboard-container ritual-page">
      {/* Background Ambient Orbs */}
      <div className="ambient-orb orb-1"></div>
      <div className="ambient-orb orb-2"></div>
      <div className="ambient-orb orb-3"></div>

      {/* Header Section */}
      <header className="db-header animate-fade-in">
        <div className="db-header-left">
          <div className="header-title-container">
            <span className="enterprise-badge">
              <FaCrown className="crown-icon" /> COSMIC RITUAL HUB
            </span>
            <h1 className="wrapped-header-title">Ritual Manager</h1>
          </div>
          <p className="header-subtitle">
            Manage sacred rituals, pricing, and availability across the platform.
          </p>
        </div>

        <div className="db-header-right">
          <button className="btn-add-cosmic" onClick={() => setShowAddModal(true)}>
            <FaPlus /> Add Ritual
          </button>
        </div>
      </header>

      {/* Main Content: Ritual Management Card */}
      <div className="super-card main-table-card animate-fade-in-delayed">
        <div className="super-card-header">
          <div className="header-accent-title">
            <div className="title-vertical-bar gold"></div>
            <h2>Ritual Management</h2>
          </div>
          <span className="giant-badge gold">{rituals.length} Rituals</span>
        </div>

        <div className="table-responsive">
          <table className="khatarnak-table">
            <thead>
              <tr>
                <th>IMAGE</th>
                <th>RITUAL NAME</th>
                <th>DESCRIPTION</th>
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
              ) : rituals.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "40px" }}>
                    No rituals found.
                  </td>
                </tr>
              ) : (
                currentRituals.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <div className="category-img-container">
                        <img
                          className="category-img"
                          src={item.images?.[0]}
                          alt={item.name}
                        />
                      </div>
                    </td>

                    <td>
                      <span className="main-name">{item.name}</span>
                    </td>

                    <td>
                      <span className="desc-cell">
                        {item.shortDescription || "—"}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`status-pill ${
                          item.isActive ? "active" : "inactive"
                        }`}
                      >
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
                      <button
                        className="btn-pro btn-pro-edit"
                        onClick={() => openEditModal(item)}
                      >
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

      {/* Add Ritual Modal */}
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
              <h3>Add New Ritual</h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowAddModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <div className="edit-form-body">
              <div className="form-group">
                <label>Ritual Name</label>
                <input
                  type="text"
                  value={addFormData.name}
                  onChange={(e) =>
                    setAddFormData({ ...addFormData, name: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Short Description</label>
                <input
                  type="text"
                  value={addFormData.shortDescription}
                  onChange={(e) =>
                    setAddFormData({
                      ...addFormData,
                      shortDescription: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={addFormData.description}
                  onChange={(e) =>
                    setAddFormData({
                      ...addFormData,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Duration</label>
                <input
                  type="text"
                  placeholder="e.g. 30 mins"
                  value={addFormData.duration}
                  onChange={(e) =>
                    setAddFormData({
                      ...addFormData,
                      duration: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Price (₹)</label>
                <input
                  type="text"
                  value={addFormData.price}
                  onChange={(e) =>
                    setAddFormData({ ...addFormData, price: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Sale Price (₹)</label>
                <input
                  type="text"
                  value={addFormData.salePrice}
                  onChange={(e) =>
                    setAddFormData({
                      ...addFormData,
                      salePrice: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={addFormData.isFeatured}
                    onChange={(e) =>
                      setAddFormData({
                        ...addFormData,
                        isFeatured: e.target.checked,
                      })
                    }
                  />{" "}
                  Featured
                </label>
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={addFormData.isActive}
                    onChange={(e) =>
                      setAddFormData({
                        ...addFormData,
                        isActive: e.target.checked,
                      })
                    }
                  />{" "}
                  Active
                </label>
              </div>
            </div>

            <div className="modal-actions-row">
              <button
                className="btn-modal-pro cancel"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button className="btn-modal-pro save" onClick={handleAddRitual}>
                Add Ritual
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Specifications Modal */}
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
              <h3>Edit Ritual Specifications</h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowEditModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <div className="edit-form-body">
              <div className="form-group">
                <label>Ritual Name</label>
                <input
                  type="text"
                  value={formData.ritualName}
                  onChange={(e) =>
                    setFormData({ ...formData, ritualName: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Short Description</label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shortDescription: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Duration</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Price (₹)</label>
                <input
                  type="text"
                  value={formData.ritualPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, ritualPrice: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Sale Price (₹)</label>
                <input
                  type="text"
                  value={formData.originalPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, originalPrice: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isFeatured: e.target.checked,
                      })
                    }
                  />{" "}
                  Featured
                </label>
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                  />{" "}
                  Active
                </label>
              </div>

              <div className="form-group">
                <label>Ritual Image</label>
                {formData.image && (
                  <img
                    src={formData.image}
                    alt="Ritual"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginBottom: "10px",
                    }}
                  />
                )}
                <input type="file" accept="image/*" multiple />
              </div>
            </div>

            <div className="modal-actions-row">
              <button
                className="btn-modal-pro cancel"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button className="btn-modal-pro save" onClick={handleSaveSpecs}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="ultra-modal-backdrop"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="ultra-modal-box delete-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ultra-modal-header">
              <h3>Delete Ritual</h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <p className="delete-confirm-text">
              Are you sure you want to delete this ritual? This action cannot
              be undone.
            </p>

            <div className="modal-actions-row">
              <button
                className="btn-modal-pro cancel"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn-modal-pro delete-confirm"
                onClick={confirmDeleteRitual}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}