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
  FaEdit,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

export default function BannerManagement() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [bannerId, setBannerId] = useState("");
  const [bannerTitle, setBannerTitle] = useState("");

  // Image Upload States
  const [bannerImageFile, setBannerImageFile] = useState(null);       // For upload (File object)
  const [bannerImagePreview, setBannerImagePreview] = useState("");   // UI Preview URL
  const [existingImageUrl, setExistingImageUrl] = useState("");       // Backend Image URL

  const [bannerLink, setBannerLink] = useState("");
  const [bannerCategory, setBannerCategory] = useState("home");
  const [bannerStatus, setBannerStatus] = useState("active");

  // --- PAGINATION STATES ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Load Banners from API
  const loadBanners = async () => {
    try {
      setLoading(true);
      const res = await getAllBanners();

      const rawData = res.banners || res.data || res || [];
      const data = rawData.map((item) => ({
        _id: item._id,
        title: item.title,
        imageUrl: item.image,
        redirectUrl: item.redirectUrl || "-",
        category: item.type || "home",
        status: item.isActive ? "active" : "inactive",
        impressions: item.impressions || 0,
      }));

      setBanners(data);
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
    setIsEditing(false);
    setBannerId("");
    setBannerTitle("");
    setBannerImageFile(null);
    setBannerImagePreview("");
    setExistingImageUrl("");
    setBannerLink("");
    setBannerCategory("home");
    setBannerStatus("active");
    setShowFormModal(true);
  };

  const handleOpenEditModal = (banner) => {
    setIsEditing(true);
    setBannerId(banner._id);
    setBannerTitle(banner.title);
    setBannerImageFile(null);
    setBannerImagePreview(banner.imageUrl);
    setExistingImageUrl(banner.imageUrl);
    setBannerLink(banner.redirectUrl === "-" ? "" : banner.redirectUrl);
    setBannerCategory(banner.category);
    setBannerStatus(banner.status);
    setShowFormModal(true);
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
    if (!bannerTitle || (!bannerImageFile && !isEditing) || !bannerLink) {
      toast.warn("Please fill all required fields!");
      return;
    }

    const formData = new FormData();
    formData.append("title", bannerTitle);
    formData.append("type", bannerCategory);
    formData.append("isActive", bannerStatus === "active" ? "true" : "false");
    formData.append("redirectUrl", bannerLink);

    if (bannerImageFile) {
      formData.append("image", bannerImageFile);
    }

    try {
      if (isEditing) {
        const res = await updateBanner(bannerId, formData);
        const apiBanner = res?.banner || res?.data || res;

        const updatedData = {
          _id: bannerId,
          title: apiBanner.title || bannerTitle,
          imageUrl: apiBanner.image || existingImageUrl,
          redirectUrl: apiBanner.redirectUrl || bannerLink,
          category: apiBanner.type || bannerCategory,
          status: apiBanner.isActive !== undefined
            ? (apiBanner.isActive ? "active" : "inactive")
            : bannerStatus,
          impressions: apiBanner.impressions || 0,
        };

        setBanners((prev) =>
          prev.map((b) => (b._id === bannerId ? { ...b, ...updatedData } : b))
        );

        toast.success("Banner updated successfully!");
      } else {
        const res = await addBanner(formData);
        const apiBanner = res?.banner || res?.data || res;

        const newData = {
          _id: apiBanner._id,
          title: apiBanner.title,
          imageUrl: apiBanner.image,
          redirectUrl: apiBanner.redirectUrl || "-",
          category: apiBanner.type || "home",
          status: apiBanner.isActive ? "active" : "inactive",
          impressions: apiBanner.impressions || 0,
        };

        setBanners((prev) => [...prev, newData]);

        toast.success("New banner added successfully!");
      }
      setShowFormModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save banner details");
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
      <div className="banner-card">
        {/* Header Section */}
        <div className="banner-card-header">
          <h2 className="banner-card-title">
            <span className="title-bar" />
            Banner Management
          </h2>
          <div className="banner-header-actions">
            <span className="banner-count-badge">{banners.length} Banners</span>
            <button className="btn-add-banner" onClick={handleOpenAddModal}>
              <FaPlus /> Add Banner
            </button>
          </div>
        </div>

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
                    <td>
                      <span className="cell-category">{banner.category}</span>
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

      {/* Add & Edit Banner Modal */}
      {showFormModal && (
        <div className="modal-overlay" onClick={() => setShowFormModal(false)}>
          <div className="modal-box form-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="form-modal-header">
  <span className="form-modal-icon">{isEditing ? <FaEdit /> : <FaPlus />}</span>
  <h3 className="form-modal-title">{isEditing ? "Edit Banner" : "Add New Banner"}</h3>
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
                    required={!isEditing}
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
                  <label>Redirect URL</label>
                  <input
                    type="text"
                    placeholder="e.g. /shop or /consultation"
                    value={bannerLink}
                    onChange={(e) => setBannerLink(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Category</label>
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
                  {isEditing ? "Update Banner" : "Add Banner"}
                </button>
              </div>
            </form>
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