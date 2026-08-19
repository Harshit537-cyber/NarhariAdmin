import React, { useState, useEffect } from "react";
import "./Rituals.css";
import { getAllRituals, addRitual, updateRitual } from "../../api/Controller/rituals";
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
  FaTimesCircle, FaEye,
} from "react-icons/fa";



export default function Rituals() {
  const [rituals, setRituals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
 const [showViewModal, setShowViewModal] = useState(false);
const [viewData, setViewData] = useState(null);
  const [formData, setFormData] = useState(null);
  const [addFormData, setAddFormData] = useState({
    title: "",
    slug: "",

    price: "",
    originalPrice: "",
    discount: "",
    duration: "",
    format: "online",
    about: "",
    category: "",
    benefits: [{ title: "", description: "" }],
    whatsincluded: [""],
    formConfig: { askSankalp: false, askBirthDetails: false },
    image: null,
    isFeatured: false,
    isActive: true,
  });
  // const [deleteId, setDeleteId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchRituals();
  }, []);


  const fetchRituals = async () => {
    setLoading(true);
    try {
      const res = await getAllRituals();
      setRituals((res.data || []).reverse());
    } catch (err) {
      toast.error(err.message || "Failed to load rituals");
    } finally {
      setLoading(false);
    }
  };
  const [fieldErrors, setFieldErrors] = useState({});

  const handleNumericInput = (value, fieldName, setStateFn, currentState) => {
    if (value === "") {
      setStateFn({ ...currentState, [fieldName]: value });
      setFieldErrors((prev) => ({ ...prev, [fieldName]: "" }));
      return;
    }
    if (!/^\d*\.?\d*$/.test(value)) {
      setFieldErrors((prev) => ({
        ...prev,
        [fieldName]: "Only numbers are allowed",
      }));
      return; // invalid char ko state mein set hi nahi karenge
    }
    setFieldErrors((prev) => ({ ...prev, [fieldName]: "" }));
    setStateFn({ ...currentState, [fieldName]: value });
  };
  const handleAddRitual = async () => {
    if (!addFormData.title) {
      toast.error("Ritual title is required");
      return;
    }

    try {
      const payload = new FormData();
      payload.append("title", addFormData.title);
      payload.append("slug", addFormData.slug);
      payload.append("price", addFormData.price);
      payload.append("originalPrice", addFormData.originalPrice);
      payload.append("discount", addFormData.discount);
      payload.append("duration", addFormData.duration);
      payload.append("format", addFormData.format);
      payload.append("about", addFormData.about);
      payload.append("category", addFormData.category);
      payload.append("benefits", JSON.stringify(addFormData.benefits));
      payload.append("whatsincluded", JSON.stringify(addFormData.whatsincluded));
      payload.append("formConfig", JSON.stringify(addFormData.formConfig));
      payload.append("isFeatured", addFormData.isFeatured);
      payload.append("isActive", addFormData.isActive);
      if (addFormData.image) {
        payload.append("image", addFormData.image);
      }

      const res = await addRitual(payload);

      setRituals((prev) => [res.data || res.ritual, ...prev]);
      toast.success("Ritual added successfully!");
      setShowAddModal(false);
      setAddFormData({
        title: "",

        price: "",
        originalPrice: "",
        discount: "",
        duration: "",
        format: "online",
        about: "",
        category: "",
        benefits: [{ title: "", description: "" }],
        whatsincluded: [""],
        formConfig: { askSankalp: false, askBirthDetails: false },
        image: null,
        isFeatured: false,
        isActive: true,
      });
    } catch (err) {
      toast.error(err.message || "Failed to add ritual");
    }
  };
  const handleSaveSpecs = async () => {
    if (!formData) return;

    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("slug", formData.slug);
      payload.append("about", formData.about);
      payload.append("price", formData.price);
      payload.append("originalPrice", formData.originalPrice);
      payload.append("discount", formData.discount);
      payload.append("format", formData.format);
      payload.append("category", formData.category);
      payload.append("duration", formData.duration);

      // Only append the image if the user picked a new file.
      // If formData.image is still a string (the existing image URL),
      // the user didn't change it, so we don't send it and the
      // backend should keep the current image.
      if (formData.image instanceof File) {
        payload.append("image", formData.image);
      }

      const res = await updateRitual(formData._id, payload);

      setRituals((prev) =>
        prev.map((item) =>
          item._id === formData._id ? (res.data || res.ritual) : item
        )
      );

      toast.success("Ritual updated successfully!");
      setShowEditModal(false);
    } catch (err) {
      toast.error(err.message || "Failed to update ritual");
    }
  };

  // ---- DELETE RITUAL (dummy) ----
  // const handleDeleteClick = (id) => {
  //   setDeleteId(id);
  //   setShowDeleteModal(true);
  // };

  // const confirmDeleteRitual = () => {
  //   if (!deleteId) return;
  //   setRituals((prev) => prev.filter((item) => item._id !== deleteId));
  //   toast.success("Ritual deleted successfully!");
  //   setShowDeleteModal(false);
  //   setDeleteId(null);
  // };

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
const openViewModal = (item) => {
  setViewData(item);
  setShowViewModal(true);
};
  const openEditModal = (item) => {
    setFormData({
      _id: item._id,
      title: item.title || "",
      slug: item.slug || "",
      tagline: item.tagline || "",
      about: item.about || "",
      price: item.price ?? "",
      originalPrice: item.originalPrice ?? "",
      discount: item.discount ?? "",
      duration: item.duration || "",
      format: item.format || "online",
      category: item.category || "",
      benefits: item.benefits?.length
        ? item.benefits
        : [{ title: "", description: "" }],
      whatsincluded: item.whatsIncluded?.length ? item.whatsIncluded : [""],
      formConfig: item.formConfig || {
        askSankalp: false,
        askBirthDetails: false,
        askPrasadAddress: false,
      },
      isActive: item.isLive !== undefined ? item.isLive : true,
      isFeatured: !!item.isFeatured,
      // Existing image URL (string). Gets replaced with a File object
      // if the user picks a new image in the edit modal.
      image: item.image || "",
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
                <th>TITLE</th>
                <th>CATEGORY</th>
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
                          src={item.image || "https://via.placeholder.com/100x100.png?text=Ritual"}
                          alt={item.title}
                        />
                      </div>
                    </td>

                    <td>
                      <span className="main-name">{item.title}</span>
                    </td>

                    <td>
                      <span className="desc-cell">
                        {item.category || "—"}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`status-pill ${item.isLive ? "active" : "inactive"
                          }`}
                      >
                        {item.isLive ? (
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

                    <td style={{ textAlign: "right", gap:"5px" }}>

                      <button
                        className="btn-pro btn-pro-view"
                        onClick={() => openViewModal(item)}>
                       View
                      </button>
                      <button
                        className="btn-pro btn-pro-edit"
                        onClick={() => openEditModal(item)}
                      >
                       Edit
                      </button>
                      {/* <button
                        className="btn-pro btn-pro-delete"
                        onClick={() => handleDeleteClick(item._id)}
                      >
                        <FaTrash /> Delete
                      </button> */}
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
                  className={`pagination-btn number-btn ${currentPage === page ? "active" : ""
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
              <div className="modal-header-top">
                <h3>Add New Ritual</h3>
                <button className="modal-close-btn" onClick={() => setShowAddModal(false)}>
                  <FaTimes />
                </button>
              </div>
            </div>
            <div className="edit-form-body">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={addFormData.title}
                  onChange={(e) =>
                    setAddFormData({ ...addFormData, title: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Slug</label>
                <input
                  type="text"
                  value={addFormData.slug}
                  onChange={(e) =>
                    setAddFormData({ ...addFormData, slug: e.target.value })
                  }
                />
              </div>


              <div className="form-group">
                <label>About</label>
                <textarea
                  value={addFormData.about}
                  onChange={(e) =>
                    setAddFormData({ ...addFormData, about: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Price (₹)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={addFormData.price}
                  onChange={(e) =>
                    handleNumericInput(e.target.value, "price", setAddFormData, addFormData)
                  }
                  className={fieldErrors.price ? "input-error" : ""}
                />
                {fieldErrors.price && <span className="error-text">{fieldErrors.price}</span>}
              </div>

              <div className="form-group">
                <label>Original Price (₹)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={addFormData.originalPrice}
                  onChange={(e) =>
                    handleNumericInput(e.target.value, "originalPrice", setAddFormData, addFormData)
                  }
                  className={fieldErrors.originalPrice ? "input-error" : ""}
                />
                {fieldErrors.originalPrice && <span className="error-text">{fieldErrors.originalPrice}</span>}
              </div>

              <div className="form-group">
                <label>Discount (%)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={addFormData.discount}
                  onChange={(e) =>
                    handleNumericInput(e.target.value, "discount", setAddFormData, addFormData)
                  }
                  className={fieldErrors.discount ? "input-error" : ""}
                />
                {fieldErrors.discount && <span className="error-text">{fieldErrors.discount}</span>}
              </div>

              <div className="form-group">
                <label>Duration</label>
                <input
                  type="text"
                  placeholder="e.g. 30 mins"
                  value={addFormData.duration}
                  onChange={(e) =>
                    setAddFormData({ ...addFormData, duration: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Format</label>
                <select
                  value={addFormData.format}
                  onChange={(e) =>
                    setAddFormData({ ...addFormData, format: e.target.value })
                  }
                >
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                </select>
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  value={addFormData.category}
                  onChange={(e) =>
                    setAddFormData({ ...addFormData, category: e.target.value })
                  }
                >
                  <option value="">Select Category</option>
                  <option value="Wealth">Wealth</option>
                  <option value="Health">Health</option>
                  <option value="Relationship">Relationship</option>
                  <option value="Career">Career</option>
                  <option value="Protection">Protection</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              {/* ---- Benefits Dynamic Array ---- */}
              <div className="form-group">
                <label>Benefits</label>
                {addFormData.benefits.map((b, idx) => (
                  <div
                    key={idx}
                    style={{ display: "flex", gap: "8px", marginBottom: "8px" }}
                  >
                    <input
                      type="text"
                      placeholder="Title"
                      value={b.title}
                      onChange={(e) => {
                        const updated = [...addFormData.benefits];
                        updated[idx].title = e.target.value;
                        setAddFormData({ ...addFormData, benefits: updated });
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Description"
                      value={b.description}
                      onChange={(e) => {
                        const updated = [...addFormData.benefits];
                        updated[idx].description = e.target.value;
                        setAddFormData({ ...addFormData, benefits: updated });
                      }}
                    />
                    <button
                      type="button"
                      className="btn-pro btn-pro-delete"
                      onClick={() => {
                        const updated = addFormData.benefits.filter(
                          (_, i) => i !== idx
                        );
                        setAddFormData({ ...addFormData, benefits: updated });
                      }}
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn-pro btn-pro-edit"
                  onClick={() =>
                    setAddFormData({
                      ...addFormData,
                      benefits: [
                        ...addFormData.benefits,
                        { title: "", description: "" },
                      ],
                    })
                  }
                >
                  <FaPlus /> Add Benefit
                </button>
              </div>

              {/* ---- Whats Included Dynamic Array ---- */}
              <div className="form-group">
                <label>What's Included</label>
                {addFormData.whatsincluded.map((item, idx) => (
                  <div
                    key={idx}
                    style={{ display: "flex", gap: "8px", marginBottom: "8px" }}
                  >
                    <input
                      type="text"
                      placeholder="Item"
                      value={item}
                      onChange={(e) => {
                        const updated = [...addFormData.whatsincluded];
                        updated[idx] = e.target.value;
                        setAddFormData({ ...addFormData, whatsincluded: updated });
                      }}
                    />
                    <button
                      type="button"
                      className="btn-pro btn-pro-delete"
                      onClick={() => {
                        const updated = addFormData.whatsincluded.filter(
                          (_, i) => i !== idx
                        );
                        setAddFormData({ ...addFormData, whatsincluded: updated });
                      }}
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn-pro btn-pro-edit"
                  onClick={() =>
                    setAddFormData({
                      ...addFormData,
                      whatsincluded: [...addFormData.whatsincluded, ""],
                    })
                  }
                >
                  <FaPlus /> Add Item
                </button>
              </div>

              {/* ---- Form Config ---- */}
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={addFormData.formConfig.askSankalp}
                    onChange={(e) =>
                      setAddFormData({
                        ...addFormData,
                        formConfig: {
                          ...addFormData.formConfig,
                          askSankalp: e.target.checked,
                        },
                      })
                    }
                  />{" "}
                  Ask Sankalp
                </label>
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={addFormData.formConfig.askBirthDetails}
                    onChange={(e) =>
                      setAddFormData({
                        ...addFormData,
                        formConfig: {
                          ...addFormData.formConfig,
                          askBirthDetails: e.target.checked,
                        },
                      })
                    }
                  />{" "}
                  Ask Birth Details
                </label>
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

              <div className="form-group">
                <label>Ritual Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setAddFormData({
                      ...addFormData,
                      image: e.target.files[0],
                    })
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
              <div className="modal-header-top">
                <h3>Edit Ritual Specifications</h3>
                <button className="modal-close-btn" onClick={() => setShowEditModal(false)}>
                  <FaTimes />
                </button>
              </div>
            </div>

            <div className="edit-form-body">


              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) =>
                    setFormData({ ...formData, tagline: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>About</label>
                <textarea
                  value={formData.about}
                  onChange={(e) =>
                    setFormData({ ...formData, about: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Price (₹)</label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Discount (%)</label>
                <input
                  type="text"
                  value={formData.discount}
                  onChange={(e) =>
                    setFormData({ ...formData, discount: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Format</label>
                <select
                  value={formData.format}
                  onChange={(e) =>
                    setFormData({ ...formData, format: e.target.value })
                  }
                >
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                </select>
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  <option value="">Select Category</option>
                  <option value="Wealth">Wealth</option>
                  <option value="Health">Health</option>
                  <option value="Relationship">Relationship</option>
                  <option value="Career">Career</option>
                  <option value="Protection">Protection</option>
                  <option value="Others">Others</option>
                </select>
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
                <label>Sale Price (₹)</label>
                <input
                  type="text"
                  value={formData.originalPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, originalPrice: e.target.value })
                  }
                />
              </div>

              {/* ---- Ritual Image (upload new / preview current) ---- */}
              <div className="form-group">
                <label>Ritual Image</label>

                {formData.image && typeof formData.image === "string" && (
                  <div className="category-img-container" style={{ marginBottom: "8px" }}>
                    <img
                      className="category-img"
                      src={formData.image}
                      alt={formData.title || "Ritual"}
                    />
                  </div>
                )}

                {formData.image instanceof File && (
                  <div className="category-img-container" style={{ marginBottom: "8px" }}>
                    <img
                      className="category-img"
                      src={URL.createObjectURL(formData.image)}
                      alt="New ritual preview"
                    />
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      image: e.target.files[0],
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
              <button className="btn-modal-pro save" onClick={handleSaveSpecs}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      {/* View Ritual Modal */}
      {showViewModal && viewData && (
        <div
          className="ultra-modal-backdrop"
          onClick={() => setShowViewModal(false)}
        >
          <div
            className="ultra-modal-box edit-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ultra-modal-header">
              <div className="modal-header-top">
                <h3>Ritual Details</h3>

                <button
                  className="modal-close-btn"
                  onClick={() => setShowViewModal(false)}
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            <div className="edit-form-body">

              {/* Image */}
              {viewData.image && (
                <div
                  className="category-img-container"
                  style={{ marginBottom: "20px" }}
                >
                  <img
                    className="category-img"
                    src={viewData.image}
                    alt={viewData.title || "Ritual"}
                  />
                </div>
              )}

              {/* Title */}
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={viewData.title || "—"}
                  readOnly
                />
              </div>

              {/* Slug */}
              <div className="form-group">
                <label>Slug</label>
                <input
                  type="text"
                  value={viewData.slug || "—"}
                  readOnly
                />
              </div>

              {/* Tagline */}
              <div className="form-group">
                <label>Tagline</label>
                <input
                  type="text"
                  value={viewData.tagline || "—"}
                  readOnly
                />
              </div>

              {/* About */}
              <div className="form-group">
                <label>About</label>
                <textarea
                  value={viewData.about || "—"}
                  readOnly
                />
              </div>

              {/* Price */}
              <div className="form-group">
                <label>Price (₹)</label>
                <input
                  type="text"
                  value={viewData.price ?? "—"}
                  readOnly
                />
              </div>

              {/* Original Price */}
              <div className="form-group">
                <label>Original Price (₹)</label>
                <input
                  type="text"
                  value={viewData.originalPrice ?? "—"}
                  readOnly
                />
              </div>

              {/* Discount */}
              <div className="form-group">
                <label>Discount (%)</label>
                <input
                  type="text"
                  value={viewData.discount || "—"}
                  readOnly
                />
              </div>

              {/* Duration */}
              <div className="form-group">
                <label>Duration</label>
                <input
                  type="text"
                  value={viewData.duration || "—"}
                  readOnly
                />
              </div>

              {/* Format */}
              <div className="form-group">
                <label>Format</label>
                <input
                  type="text"
                  value={viewData.format || "—"}
                  readOnly
                />
              </div>

              {/* Category */}
              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  value={viewData.category || "—"}
                  readOnly
                />
              </div>

              {/* Status */}
              <div className="form-group">
                <label>Status</label>
                <input
                  type="text"
                  value={viewData.isLive ? "Active" : "Inactive"}
                  readOnly
                />
              </div>

              {/* Benefits */}
              <div className="form-group">
                <label>Benefits</label>

                {viewData.benefits?.length ? (
                  viewData.benefits.map((benefit, index) => (
                    <div
                      key={benefit._id || index}
                      style={{
                        marginBottom: "10px",
                        padding: "12px",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                      }}
                    >
                      <strong>{benefit.title || "—"}</strong>

                      <p style={{ margin: "5px 0 0" }}>
                        {benefit.description || "—"}
                      </p>
                    </div>
                  ))
                ) : (
                  <p>—</p>
                )}
              </div>

              {/* What's Included */}
              <div className="form-group">
                <label>What's Included</label>

                {viewData.whatsIncluded?.length ? (
                  viewData.whatsIncluded.map((item, index) => (
                    <input
                      key={index}
                      type="text"
                      value={item}
                      readOnly
                      style={{ marginBottom: "8px" }}
                    />
                  ))
                ) : (
                  <p>—</p>
                )}
              </div>

              {/* Form Config */}
              <div className="form-group">
                <label>Form Configuration</label>

                <div
                  style={{
                    padding: "15px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                  }}
                >
                  <p>
                    Ask Sankalp:{" "}
                    <strong>
                      {viewData.formConfig?.askSankalp ? "Yes" : "No"}
                    </strong>
                  </p>

                  <p>
                    Ask Birth Details:{" "}
                    <strong>
                      {viewData.formConfig?.askBirthDetails ? "Yes" : "No"}
                    </strong>
                  </p>

                  <p>
                    Ask Prasad Address:{" "}
                    <strong>
                      {viewData.formConfig?.askPrasadAddress ? "Yes" : "No"}
                    </strong>
                  </p>
                </div>
              </div>

              {/* Created / Updated */}
              <div className="form-group">
                <label>Created At</label>
                <input
                  type="text"
                  value={
                    viewData.createdAt
                      ? new Date(viewData.createdAt).toLocaleString()
                      : "—"
                  }
                  readOnly
                />
              </div>

              <div className="form-group">
                <label>Updated At</label>
                <input
                  type="text"
                  value={
                    viewData.updatedAt
                      ? new Date(viewData.updatedAt).toLocaleString()
                      : "—"
                  }
                  readOnly
                />
              </div>
            </div>

            <div className="modal-actions-row">
              <button
                className="btn-modal-pro cancel"
                onClick={() => setShowViewModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* {showDeleteModal && (
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
      )} */}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}