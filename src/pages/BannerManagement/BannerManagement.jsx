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
  FaCrown,
  FaBolt,
  FaPlus,
  FaTrashAlt,
  FaImage,
  FaLink,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowUp,
  FaEdit,
  FaChevronLeft,
  FaChevronRight,
  FaInfoCircle,
} from "react-icons/fa";

export default function BannerManagement() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [previewBanner, setPreviewBanner] = useState(null);

  // --- POPUP MODAL STATES ---
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedInfoBanner, setSelectedInfoBanner] = useState(null);

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

      if (data.length > 0) {
        setPreviewBanner(data[0]);
      }
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

  const handleOpenInfoModal = (banner) => {
    setSelectedInfoBanner(banner);
    setShowInfoModal(true);
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

      if (previewBanner?._id === selectedBanner._id) {
        setPreviewBanner(null);
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

    // यदि नया इमेज फाइल सिलेक्ट किया गया है तभी फॉर्म में जोड़ें
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
        
        if (previewBanner?._id === bannerId) {
          setPreviewBanner(updatedData);
        }
        
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
        if (!previewBanner) setPreviewBanner(newData);
        
        toast.success("New banner deployed successfully!");
      }
      setShowFormModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save banner details");
    }
  };

  const activeBannersCount = banners.filter((b) => b.status === "active").length;
  const totalImpressions = banners.reduce((acc, curr) => acc + (curr.impressions || 0), 0);

  // --- PAGINATION MATHEMATICS ---
  const indexOfLastBanner = currentPage * itemsPerPage;
  const indexOfFirstBanner = indexOfLastBanner - itemsPerPage;
  const currentBanners = banners.slice(indexOfFirstBanner, indexOfLastBanner);
  const totalPages = Math.ceil(banners.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="an-banner-container">
      {/* Background Ambient Orbs */}
      <div className="ambient-orb orb-1"></div>
      <div className="ambient-orb orb-2"></div>
      <div className="ambient-orb orb-3"></div>

      {/* Header Section */}
      <header className="db-header animate-fade-in">
        <div className="db-header-left">
          <div className="header-title-container">
            <span className="enterprise-badge">
              <FaCrown className="crown-icon" /> CELESTIAL PROMOTIONS
            </span>
            <h1 className="wrapped-header-title">Banner Control Room</h1>
          </div>
          <p className="header-subtitle">
            Create, deploy, and monitor graphical banner portals across consumer devices.
          </p>
        </div>

        <div className="db-header-right">
          <button className="btn-add-banner" onClick={handleOpenAddModal}>
            <FaPlus /> DEPLOY NEW BANNER
          </button>
        </div>
      </header>

      {/* Metrics Grid */}
      <div className="db-metrics-grid">
        <div className="khatarnak-card emerald-theme animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div className="card-glass-shine"></div>
          <div className="card-top-bar">
            <div className="big-icon-box emerald-glow">
              <FaCheckCircle />
            </div>
            <span className="trend-badge emerald-pill">
              <FaArrowUp /> LIVE PORTALS
            </span>
          </div>
          <div className="card-middle-data">
            <h2 className="giant-stat-number">{activeBannersCount} / {banners.length}</h2>
            <p className="giant-stat-label">Active vs Total Banners</p>
          </div>
          <div className="card-bottom-accent">
            <div className="glow-bar emerald-bar"></div>
          </div>
        </div>

        <div className="khatarnak-card cyan-theme animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="card-glass-shine"></div>
          <div className="card-top-bar">
            <div className="big-icon-box cyan-glow">
              <FaEye />
            </div>
            <span className="trend-badge cyan-pill">
              <FaBolt /> REALTIME
            </span>
          </div>
          <div className="card-middle-data">
            <h2 className="giant-stat-number">{totalImpressions.toLocaleString()}</h2>
            <p className="giant-stat-label">Aggregated Impressions</p>
          </div>
          <div className="card-bottom-accent">
            <div className="glow-bar cyan-bar"></div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="db-content-grid">
        {/* Banners Table */}
        <div className="super-card main-table-card animate-fade-in-delayed">
          <div className="super-card-header">
            <div className="header-accent-title">
              <div className="title-vertical-bar"></div>
              <h2>Active Astral Portals</h2>
            </div>
            <span className="giant-badge">{banners.length} Portals Ready</span>
          </div>

          {/* Table Container */}
          <div className="table-responsive">
            {loading ? (
              <div className="khatarnak-loader">
                <div className="glowing-spinner"></div>
                <p>Syncing Stellar Graphics Engine...</p>
              </div>
            ) : banners.length === 0 ? (
              <div className="table-error-box">No banners deployed. Click "DEPLOY NEW BANNER" to begin.</div>
            ) : (
              <table className="khatarnak-table">
                <thead>
                  <tr>
                    <th style={{ width: "80px" }}>INDEX</th>
                    <th>PREVIEW & TITLE</th>
                    <th>TARGET LINK</th>
                    <th>STATUS</th>
                    <th>IMPRESSIONS</th>
                    <th style={{ textAlign: "right" }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {currentBanners.map((banner, index) => {
                    const sequentialIndex = indexOfFirstBanner + index + 1;
                    return (
                      <tr
                        key={banner._id}
                        className={previewBanner?._id === banner._id ? "row-selected" : ""}
                        onClick={() => {
                          setPreviewBanner(banner);
                          handleOpenInfoModal(banner);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <td className="table-index-number">
                          {sequentialIndex}
                        </td>
                        <td>
                          <div className="banner-profile-wrapper">
                            <img
                              src={banner.imageUrl}
                              alt={banner.title}
                              className="banner-mini-preview"
                              onError={(e) => {
                                e.target.src = "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=200";
                              }}
                            />
                            <div className="profile-names">
                              <span className="main-name">{banner.title}</span>
                              <span className="sub-role" style={{ textTransform: "capitalize" }}>
                                {banner.category}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="bold-email">
                          <FaLink style={{ marginRight: "6px", opacity: 0.7 }} />
                          {banner.redirectUrl}
                        </td>
                        <td>
                          <button
                            className={`status-pill ${banner.status}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleStatus(banner._id);
                            }}
                            title="Click to toggle status"
                          >
                            {banner.status === "active" ? "ACTIVE" : "INACTIVE"}
                          </button>
                        </td>
                        <td className="bold-impressions">
                          {(banner.impressions || 0).toLocaleString()}
                        </td>
                        <td>
                          {/* Event propagation रोक दी गई है ताकि Edit/Delete बटन दबाने पर Details Modal न खुले */}
                          <div className="action-button-group" onClick={(e) => e.stopPropagation()}>
                            <button
                              className="btn-pro btn-pro-view"
                              onClick={() => handleOpenEditModal(banner)}
                            >
                              <FaEdit /> Edit
                            </button>
                            <button
                              className="btn-pro btn-pro-delete"
                              onClick={() => confirmDelete(banner)}
                            >
                              <FaTrashAlt /> Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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

        {/* Sidebar Banner Detail / Live Preview Feed */}
        <div className="super-card sidebar-feed animate-fade-in-delayed">
          <div className="super-card-header">
            <div className="header-accent-title">
              <div className="title-vertical-bar gold"></div>
              <h2>Astral Preview</h2>
            </div>
            <span className="giant-badge gold">Live View</span>
          </div>

          <div className="sidebar-preview-container">
            {previewBanner ? (
              <div className="cosmic-preview-box">
                <div className="preview-image-wrapper">
                  <img
                    src={previewBanner.imageUrl}
                    alt={previewBanner.title}
                    className="preview-image"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=600";
                    }}
                  />
                  <span className={`preview-category-tag cat-${(previewBanner.category || "").toLowerCase()}`} style={{ textTransform: "capitalize" }}>
                    {previewBanner.category}
                  </span>
                </div>
                <div className="preview-details">
                  <h3>{previewBanner.title}</h3>
                  <div className="preview-info-row">
                    <span className="info-label">Redirect Target:</span>
                    <span className="info-val">{previewBanner.redirectUrl}</span>
                  </div>
                  <div className="preview-info-row">
                    <span className="info-label">Active Status:</span>
                    <span className={`status-text status-${previewBanner.status}`}>
                      {(previewBanner.status || "").toUpperCase()}
                    </span>
                  </div>
                  <div className="preview-info-row">
                    <span className="info-label">Impact Metric:</span>
                    <span className="info-val highlighting-text">{previewBanner.impressions || 0} Views</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-preview-selected">
                <FaImage className="watermark-icon" />
                <p>Select a banner row from the terminal list to activate cosmic hologram preview.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- INFO POPUP MODAL --- */}
      {showInfoModal && selectedInfoBanner && (
        <div className="ultra-modal-backdrop" onClick={() => setShowInfoModal(false)}>
          <div className="ultra-modal-box info-portal-modal" onClick={(e) => e.stopPropagation()}>
            <div className="form-glow-icon info-theme-icon">
              <FaInfoCircle />
            </div>
            <h3>Astral Portal Specifications</h3>
            <p className="modal-description-sub">Detailed telemetry of the selected consumer-facing graphic portal.</p>
            
            <div className="portal-info-layout">
              {/* Image Preview Block */}
              <div className="portal-info-media">
                <img
                  src={selectedInfoBanner.imageUrl}
                  alt={selectedInfoBanner.title}
                  className="portal-large-preview"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=600";
                  }}
                />
                <span className={`portal-sector-badge cat-${(selectedInfoBanner.category || "").toLowerCase()}`} style={{ textTransform: "capitalize" }}>
                  {selectedInfoBanner.category}
                </span>
              </div>

              {/* Specifications Details Grid */}
              <div className="portal-specifications-grid">
                <div className="spec-item">
                  <span className="spec-label">PORTAL ID</span>
                  <span className="spec-value code-value">{selectedInfoBanner._id}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">DISPLAY TITLE</span>
                  <span className="spec-value highlight-title">{selectedInfoBanner.title}</span>
                </div>
                <div className="spec-item-split">
                  <div className="spec-item">
                    <span className="spec-label">SYSTEM SECTOR</span>
                    <span className="spec-value" style={{ textTransform: "capitalize" }}>{selectedInfoBanner.category}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">LIVE STATUS</span>
                    <span className={`status-pill inline-status ${selectedInfoBanner.status}`}>
                      {selectedInfoBanner.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="spec-item">
                  <span className="spec-label">REDIRECT TARGET PATH</span>
                  <span className="spec-value redirect-path">
                    <FaLink /> {selectedInfoBanner.redirectUrl}
                  </span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">METRIC IMPACT (REALTIME IMPRESSIONS)</span>
                  <span className="spec-value impressions-count">
                    <FaEye /> {selectedInfoBanner.impressions?.toLocaleString() || 0} Telemetry Views
                  </span>
                </div>
              </div>
            </div>

            <div className="modal-actions-row border-top-glow">
              <button
                type="button"
                className="btn-modal-pro cancel full-width"
                onClick={() => setShowInfoModal(false)}
              >
                Close Terminal Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add & Edit Banner Modal */}
      {showFormModal && (
        <div className="ultra-modal-backdrop">
          <div className="ultra-modal-box large-form-modal">
            <div className="form-glow-icon">
              <FaImage />
            </div>
            <h3>{isEditing ? "Modify Portal Coordinates" : "Launch Celestial Banner"}</h3>
            
            <form onSubmit={handleSaveBanner} className="cosmic-form">
              <div className="input-group">
                <label>Banner Display Title</label>
                <input
                  type="text"
                  placeholder="e.g. Astro-Match Love Insights Offer"
                  value={bannerTitle}
                  onChange={(e) => setBannerTitle(e.target.value)}
                  required
                />
              </div>

              {/* Custom File Input for Multipart API */}
              <div className="input-group">
                <label>Banner Image (Upload File)</label>
                <div className="custom-file-upload">
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
                    required={!isEditing} // Edit मोड में फाइल जरूरी नहीं है
                    style={{ display: "none" }}
                  />
                  <label htmlFor="banner-file-input" className="file-upload-label" style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "12px",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px dashed rgba(255, 255, 255, 0.2)",
                    borderRadius: "8px",
                    cursor: "pointer"
                  }}>
                    <FaImage />
                    <span>{bannerImageFile ? bannerImageFile.name : "Select Image File..."}</span>
                  </label>
                </div>

                {/* Local preview element */}
                {bannerImagePreview && (
                  <div className="preview-container" style={{ marginTop: "12px" }}>
                    <p style={{ fontSize: "12px", opacity: 0.6, marginBottom: "4px" }}>Selected Preview:</p>
                    <img
                      src={bannerImagePreview}
                      alt="Local Preview"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "120px",
                        borderRadius: "6px",
                        objectFit: "cover",
                        border: "1px solid rgba(255, 255, 255, 0.1)"
                      }}
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=200";
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="grid-2-col">
                <div className="input-group">
                  <label>Redirect Target URL Path</label>
                  <input
                    type="text"
                    placeholder="e.g. /shop or /consultation"
                    value={bannerLink}
                    onChange={(e) => setBannerLink(e.target.value)}
                    required
                  />
                </div>
                
                {/* Display Target Category */}
                <div className="input-group">
                  <label>Display Target Category</label>
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
                <label>Initial Telemetry Status</label>
                <div className="status-radio-group">
                  <button
                    type="button"
                    className={`radio-btn ${bannerStatus === "active" ? "active" : ""}`}
                    onClick={() => setBannerStatus("active")}
                  >
                    <FaCheckCircle /> Active Online
                  </button>
                  <button
                    type="button"
                    className={`radio-btn ${bannerStatus === "inactive" ? "inactive" : ""}`}
                    onClick={() => setBannerStatus("inactive")}
                  >
                    <FaTimesCircle /> Parked / Offline
                  </button>
                </div>
              </div>

              <div className="modal-actions-row">
                <button
                  type="button"
                  className="btn-modal-pro cancel"
                  onClick={() => setShowFormModal(false)}
                >
                  Close Terminal
                </button>
                <button type="submit" className="btn-modal-pro deploy">
                  {isEditing ? "Update Banner" : "Deploy Banner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Banner Modal */}
      {showDeleteModal && (
        <div className="ultra-modal-backdrop">
          <div className="ultra-modal-box">
            <div className="danger-glow-icon">
              <FaTrashAlt />
            </div>
            <h3>Dissolve Portal Connection?</h3>
            <p>
              Are you sure you want to permanently dissolve <strong>{selectedBanner?.title}</strong>? This action will sweep it out of the digital dimension.
            </p>
            <div className="modal-actions-row">
              <button className="btn-modal-pro cancel" onClick={() => setShowDeleteModal(false)}>
                Abort Execution
              </button>
              <button className="btn-modal-pro delete" onClick={handleDeleteConfirmed}>
                Confirm Removal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}