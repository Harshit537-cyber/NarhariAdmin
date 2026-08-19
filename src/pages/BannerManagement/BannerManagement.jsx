import React, { useState, useEffect } from "react";
import {
  getAllBanners,
  addBanner,
  updateBanner,
  deleteBanner,
  toggleBannerStatus,
} from "../../api/Controller/bannerController";
import "./BannerManagement.css";
import { toast } from "react-toastify";
import {
  FaPlus,
  FaTrashAlt,
  FaImage,
  FaLink,
  FaCheckCircle,
  FaTimesCircle,
  FaEdit,FaEye,
  FaChevronLeft,
  FaChevronRight, FaCrown,
} from "react-icons/fa";

export default function BannerManagement() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
const [showViewModal, setShowViewModal] = useState(false);

const[viewBanner, setViewbanner]=useState(null);
  const [bannerId, setBannerId] = useState("");
  const [bannerSlug, setBannerSlug] = useState("");
  const [bannerTitle, setBannerTitle] = useState("");

  // Image Upload States
  const [bannerImageFile, setBannerImageFile] = useState(null);
  const [bannerImagePreview, setBannerImagePreview] = useState("");
  const [existingImageUrl, setExistingImageUrl] = useState("");

  const [bannerCategory, setBannerCategory] = useState("home");
  const [bannerStatus, setBannerStatus] = useState("active");
  const [showEditModal, setShowEditModal] = useState(false);
  // --- PAGINATION STATES ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [bannerType, setBannerType] = useState("");
  const [bannerFor, setBannerFor] = useState("");
  const [redirectType, setRedirectType] = useState("");
  const [redirectId, setRedirectId] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");

  const [priority, setPriority] = useState(1);



  // Load Banners from API
  const loadBanners = async () => {
    try {
      setLoading(true);
      const res = await getAllBanners();

      const rawData = res.banners || res.data || res || [];
      const data = rawData.map((item) => ({
        _id: item._id,
        title: item.title,
        slug: item.slug,
        imageUrl: item.image,
        type: item.type,
        bannerFor: item.bannerFor,
        redirectType: item.redirectType,
        redirectId: item.redirectId,
        redirectUrl: item.redirectUrl,
        priority: item.priority,
        status: item.isActive ? "active" : "inactive",
      }));

      setBanners(data.reverse());
    } catch (err) {
      console.error(err);
      toast.error("Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const handleOpenAddModal = () => {

    setBannerId("");
    setBannerTitle("");
    setBannerSlug("");
    setBannerImageFile(null);
    setBannerImagePreview("");
    setExistingImageUrl("");
    setBannerFor("");
    setBannerCategory("home");
    setBannerStatus("active");
    setShowFormModal(true);
  };

  const handleOpenEditModal = (banner) => {


    setBannerId(banner._id);
    setBannerTitle(banner.title);
    setBannerSlug(banner.slug);
    setBannerType(banner.type);
    setBannerFor(banner.bannerFor);

    setRedirectType(banner.redirectType);
    setRedirectId(banner.redirectId);
    setRedirectUrl(banner.redirectUrl);

    setPriority(banner.priority);

    setBannerStatus(banner.status);

    setBannerImageFile(null);
    setBannerImagePreview(banner.imageUrl);
    setExistingImageUrl(banner.imageUrl);

    setShowEditModal(true);
  };

  const handleViewBanner=(banner)=>{
    setViewbanner(banner);
    setShowViewModal(true);
  };
  const confirmDelete = (banner) => {
    setSelectedBanner(banner);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await deleteBanner(selectedBanner._id);

      const updatedBanners = banners.filter((b) => b._id !== selectedBanner._id);
      setBanners(updatedBanners);

      const totalPagesAfterDelete = Math.ceil(updatedBanners.length / itemsPerPage);
      if (currentPage > totalPagesAfterDelete && totalPagesAfterDelete > 0) {
        setCurrentPage(totalPagesAfterDelete);
      }

      setShowDeleteModal(false);
      setSelectedBanner(null);
      toast.success("Banner removed successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete banner");
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleBannerStatus(id);

      setBanners((prev) =>
        prev.map((banner) => {
          if (banner._id === id) {
            const nextStatus = banner.status === "active" ? "inactive" : "active";
            toast.info(`Banner status updated to ${nextStatus}`);
            return { ...banner, status: nextStatus };
          }
          return banner;
        })
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  // Create or Update Banner Details (Multipart Form-Data)
  const handleSaveBanner = async (e) => {
    e.preventDefault();
    if (!bannerTitle || !bannerImageFile || !bannerFor) {
      toast.warn("Please fill all required fields!");
      return;
    }

    const formData = new FormData();
    formData.append("title", bannerTitle);
    formData.append("slug", bannerSlug);
    formData.append("type", bannerCategory);
    formData.append("isActive", bannerStatus === "active" ? "true" : "false");
    formData.append("bannerFor", bannerFor);

    if (bannerImageFile) {
      formData.append("image", bannerImageFile);
    }

    try {
      await addBanner(formData);

      toast.success("Banner added successfully!");
      setShowFormModal(false);
      loadBanners();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save banner");
    }
  };
  const handleUpdateBanner = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("title", bannerTitle);
      formData.append("slug", bannerSlug);
      formData.append("type", bannerType);
      formData.append("bannerFor", bannerFor);
      formData.append("redirectType", redirectType);
      // formData.append("redirectId", redirectId);
      // formData.append("redirectUrl", redirectUrl);
      formData.append("isActive", bannerStatus === "active");
      formData.append("priority", priority);

      if (bannerImageFile) {
        formData.append("image", bannerImageFile);
      }

      await updateBanner(bannerId, formData);

      loadBanners();
      toast.success("Banner updated successfully!");
      setShowEditModal(false);

    } catch (err) {
      console.error(err);
      toast.error("Failed to update banner");
    }
  };
  // --- PAGINATION MATHEMATICS ---
  const indexOfLastBanner = currentPage * itemsPerPage;
  const indexOfFirstBanner = indexOfLastBanner - itemsPerPage;
  const currentBanners = banners.slice(indexOfFirstBanner, indexOfLastBanner);
  const totalPages = Math.ceil(banners.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="banner-page">
      {/* <div className="banner-card"> */}
      <div className="product-header">
        <div className="product-header-left">
          <span className="header-tag">
            <FaCrown /> COSMIC INVENTORY HUB
          </span>

          <h1>Banner Management</h1>

          <p>
            Manage banner images, redirects and promotional campaigns.
          </p>
        </div>

        <button
          className="add-product-btn"
          onClick={handleOpenAddModal}
        >
          <FaPlus /> Add Banner
        </button>
      </div>
      <div className="banner-card">
        {/* Table Container */}
        <div className="table-responsive">
          {loading ? (
            <div className="table-loading">
              <div className="spinner" />
              <p>Loading banners...</p>
            </div>
          ) : banners.length === 0 ? (
            <div className="table-empty">No banners added yet. Click "Add Banner" to begin.</div>
          ) : (
            <table className="banner-table">
              <thead>
                <tr>
                  <th>IMAGE</th>
                  <th>TITLE</th>
                  <th>REDIRECT LINK</th>
                  <th>Banner For</th>
                  <th>CATEGORY</th>
                  <th>STATUS</th>
                  <th>IMPRESSIONS</th>
                  <th className="col-action">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {currentBanners.map((banner) => (
                  <tr key={banner._id}>
                    <td>
                      <img
                        src={banner.imageUrl}
                        alt={banner.title}
                        className="banner-thumb"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=200";
                        }}
                      />
                    </td>
                    <td>
                      <span className="cell-title">{banner.title}</span>
                    </td>
                    <td>
                      <span className="cell-link">
                        <FaLink className="link-icon" />
                        {banner.redirectUrl}
                      </span>
                    </td>

                    <td>{banner.bannerFor}</td>
                    <td>
                      <span className="cell-category">{banner.type}</span>
                    </td>
                    <td>
                      <button
                        className={`status-pill ${banner.status}`}
                        onClick={() => handleToggleStatus(banner._id)}
                        title="Click to toggle status"
                      >
                        {banner.status === "active" ? "ACTIVE" : "INACTIVE"}
                      </button>
                    </td>
                    <td>
                      <span className="cell-impressions">
                        {(banner.impressions || 0).toLocaleString()}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-action btn-edit"
                          onClick={() => handleOpenEditModal(banner)}
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          className="btn-action btn-delete"
                          onClick={() => confirmDelete(banner)}
                        >
                          <FaTrashAlt /> Delete
                        </button>
                       <button
  className="btn-action btn-view"
  onClick={() => handleViewBanner(banner)}
  title="View Banner"
>
  <FaEye />
</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* --- PAGINATION UI CONTROLS --- */}
        {!loading && banners.length > itemsPerPage && (
          <div className="custom-pagination">
            <button
              className="pagination-btn"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <FaChevronLeft /> Prev
            </button>

            <div className="pagination-numbers">
              {Array.from({ length: totalPages }, (_, index) => {
                const pageNum = index + 1;
                return (
                  <button
                    key={pageNum}
                    className={`page-num-btn ${currentPage === pageNum ? "active-page" : ""}`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              className="pagination-btn"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next <FaChevronRight />
            </button>
          </div>
        )}
      </div>


      {showFormModal && (
        <div className="modal-overlay" onClick={() => setShowFormModal(false)}>
          <div className="modal-box form-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="form-modal-header">
              <span className="form-modal-icon"> <FaPlus /></span>
              <h3 className="form-modal-title">Add New Banner</h3>
            </div>

            <form onSubmit={handleSaveBanner} className="banner-form">
              <div className="input-group">
                <label>Banner Title</label>
                <input
                  type="text"
                  placeholder="e.g. Summer Sale Offer"
                  value={bannerTitle}
                  onChange={(e) => setBannerTitle(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label>Slug</label>
                <input
                  type="text"
                  placeholder="e.g. summer-sale-offer"
                  value={bannerSlug}
                  onChange={(e) => setBannerSlug(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label>Banner Image</label>
                <div className="file-upload-wrapper">
                  <input
                    type="file"
                    accept="image/*"
                    id="banner-file-input"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setBannerImageFile(file);
                        setBannerImagePreview(URL.createObjectURL(file));
                      }
                    }}
                    required
                    style={{ display: "none" }}
                  />
                  <label htmlFor="banner-file-input" className="file-upload-label">
                    <FaImage />
                    <span>{bannerImageFile ? bannerImageFile.name : "Select Image File..."}</span>
                  </label>
                </div>

                {bannerImagePreview && (
                  <div className="image-preview-box">
                    <img
                      src={bannerImagePreview}
                      alt="Preview"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=200";
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="grid-2-col">
                <div className="input-group">
                  <label>Banner For</label>
                  <select
                    value={bannerFor}
                    onChange={(e) => setBannerFor(e.target.value)}
                    required
                  >
                    <option value="">Select...</option>
                    <option value="user">User</option>
                    <option value="partner">Partner</option>
                  </select>
                </div>

                <div className="input-group">
                  <label>TYPE</label>
                  <select
                    value={bannerCategory}
                    onChange={(e) => setBannerCategory(e.target.value)}
                  >
                    <option value="home">Home</option>
                    <option value="offer">Offer</option>
                    <option value="category">Category</option>
                    <option value="popup">Popup</option>
                  </select>
                </div>
              </div>

              <div className="input-group">
                <label>Status</label>
                <div className="status-radio-group">
                  <button
                    type="button"
                    className={`radio-btn ${bannerStatus === "active" ? "active" : ""}`}
                    onClick={() => setBannerStatus("active")}
                  >
                    <FaCheckCircle /> Active
                  </button>
                  <button
                    type="button"
                    className={`radio-btn ${bannerStatus === "inactive" ? "inactive" : ""}`}
                    onClick={() => setBannerStatus("inactive")}
                  >
                    <FaTimesCircle /> Inactive
                  </button>
                </div>
              </div>

              <div className="modal-actions-row">
                <button
                  type="button"
                  className="btn-modal-pro cancel"
                  onClick={() => setShowFormModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-modal-pro save">
                  Add Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showEditModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowEditModal(false)}
        >
          <div
            className="modal-box form-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="form-modal-header">
              <span className="form-modal-icon">
                <FaEdit />
              </span>
              <h3 className="form-modal-title">Edit Banner</h3>
            </div>

            <form onSubmit={handleUpdateBanner} className="banner-form">

              {/* Title */}
              <div className="input-group">
                <label>Banner Title</label>
                <input
                  type="text"
                  placeholder="Enter banner title"
                  value={bannerTitle}
                  onChange={(e) => setBannerTitle(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label>Slug</label>
                <input
                  type="text"
                  placeholder="Enter slug"
                  value={bannerSlug}
                  onChange={(e) => setBannerSlug(e.target.value)}
                  required
                />
              </div>
              {/* Banner Type */}
              <div className="input-group">
                <label>Banner Type</label>
                <select
                  value={bannerType}
                  onChange={(e) => setBannerType(e.target.value)}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="home">Home</option>
                  <option value="offer">Offer</option>
                  <option value="category">Category</option>
                  <option value="popup">Popup</option>
                </select>
              </div>

              {/* Banner For */}
              <div className="input-group">
                <label>Banner For</label>
                <select
                  value={bannerFor}
                  onChange={(e) => setBannerFor(e.target.value)}
                  required
                >
                  <option value="">Select Banner For</option>
                  <option value="user">User</option>
                  <option value="partner">Partner</option>
                </select>
              </div>

              {/* Redirect Type */}
              <div className="input-group">
                <label>Redirect Type</label>
                <select
                  value={redirectType}
                  onChange={(e) => setRedirectType(e.target.value)}
                  required
                >
                  <option value="">Select Redirect Type</option>
                  <option value="product">Product</option>
                  <option value="category">Category</option>
                  <option value="url">URL</option>
                </select>
              </div>

              {/* <div className="input-group">
          <label>Redirect ID</label>
          <input
            type="text"
            placeholder="Enter Redirect ID"
            value={redirectId}
            onChange={(e) => setRedirectId(e.target.value)}
          />
        </div> */}

              {/* <div className="input-group">
          <label>Redirect URL</label>
          <input
            type="text"
            placeholder="Enter Redirect URL"
            value={redirectUrl}
            onChange={(e) => setRedirectUrl(e.target.value)}
          />
        </div> */}

              {/* Priority */}
              <div className="input-group">
                <label>Priority</label>
                <input
                  type="number"
                  min="1"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                />
              </div>

              {/* Image Upload */}
              <div className="input-group">
                <label>Banner Image</label>

                <div className="file-upload-wrapper">
                  <input
                    type="file"
                    accept="image/*"
                    id="edit-banner-image"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setBannerImageFile(file);
                        setBannerImagePreview(URL.createObjectURL(file));
                      }
                    }}
                  />

                  <label
                    htmlFor="edit-banner-image"
                    className="file-upload-label"
                  >
                    <FaImage />
                    <span>
                      {bannerImageFile
                        ? bannerImageFile.name
                        : "Choose Banner Image"}
                    </span>
                  </label>
                </div>

                {(bannerImagePreview || existingImageUrl) && (
                  <div className="image-preview-box">
                    <img
                      src={bannerImagePreview || existingImageUrl}
                      alt="Banner Preview"
                    />
                  </div>
                )}
              </div>

              {/* Status */}
              <div className="input-group">
                <label>Status</label>

                <div className="status-radio-group">
                  <button
                    type="button"
                    className={`radio-btn ${bannerStatus === "active" ? "active" : ""
                      }`}
                    onClick={() => setBannerStatus("active")}
                  >
                    <FaCheckCircle />
                    Active
                  </button>

                  <button
                    type="button"
                    className={`radio-btn ${bannerStatus === "inactive" ? "inactive" : ""
                      }`}
                    onClick={() => setBannerStatus("inactive")}
                  >
                    <FaTimesCircle />
                    Inactive
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="modal-actions-row">
                <button
                  type="button"
                  className="btn-modal-pro cancel"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn-modal-pro save"
                >
                  Update Banner
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* View Banner Modal */}
{showViewModal && viewBanner && (
  <div
    className="modal-overlay"
    onClick={() => setShowViewModal(false)}
  >
    <div
      className="modal-box view-banner-modal"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="form-modal-header">
        <span className="form-modal-icon">
          <FaEye />
        </span>

        <h3 className="form-modal-title">
          Banner Details
        </h3>
      </div>

      <div className="view-banner-content">

        {/* Banner Image */}
        <div className="view-banner-image">
        <img
  src={viewBanner.imageUrl || viewBanner.image}
  alt={viewBanner.title}
  onError={(e) => {
    e.target.style.display = "none";
  }}
/>
        </div>

        {/* Banner Information */}
        <div className="banner-info-grid">

          <div className="banner-info-item">
            <span>Title</span>
            <strong>{viewBanner.title || "N/A"}</strong>
          </div>

          <div className="banner-info-item">
            <span>Slug</span>
            <strong>{viewBanner.slug || "N/A"}</strong>
          </div>

          <div className="banner-info-item">
            <span>Type</span>
            <strong>{viewBanner.type || "N/A"}</strong>
          </div>

          <div className="banner-info-item">
            <span>Banner For</span>
            <strong>{viewBanner.bannerFor || "N/A"}</strong>
          </div>

          <div className="banner-info-item">
            <span>Redirect Type</span>
            <strong>{viewBanner.redirectType || "N/A"}</strong>
          </div>

          <div className="banner-info-item">
            <span>Redirect ID</span>
            <strong>{viewBanner.redirectId || "N/A"}</strong>
          </div>

          <div className="banner-info-item">
            <span>Redirect URL</span>
            <strong>{viewBanner.redirectUrl || "N/A"}</strong>
          </div>

          <div className="banner-info-item">
            <span>Status</span>

            <strong
              className={
                viewBanner.isActive || viewBanner.status === "active"
                  ? "view-status-active"
                  : "view-status-inactive"
              }
            >
              {viewBanner.isActive || viewBanner.status === "active"
                ? "ACTIVE"
                : "INACTIVE"}
            </strong>
          </div>

          <div className="banner-info-item">
            <span>Created At</span>
            <strong>
              {viewBanner.createdAt
                ? new Date(viewBanner.createdAt).toLocaleString()
                : "N/A"}
            </strong>
          </div>

          <div className="banner-info-item">
            <span>Updated At</span>
            <strong>
              {viewBanner.updatedAt
                ? new Date(viewBanner.updatedAt).toLocaleString()
                : "N/A"}
            </strong>
          </div>

         

        </div>
      </div>

      <div className="modal-actions-row">
        <button
          type="button"
          className="btn-modal-pro cancel"
          onClick={() => {
            setShowViewModal(false);
            setViewBanner(null);
          }}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}
      {/* Delete Banner Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-box confirm-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="danger-icon">
              <FaTrashAlt />
            </div>
            <h3 className="modal-title">Delete Banner?</h3>
            <p className="confirm-text">
              Are you sure you want to delete <strong>{selectedBanner?.title}</strong>? This action cannot be undone.
            </p>
            <div className="modal-actions-row">
              <button className="btn-modal-pro cancel" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="btn-modal-pro delete" onClick={handleDeleteConfirmed}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}