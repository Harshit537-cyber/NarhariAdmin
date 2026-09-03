import React, { useEffect, useState } from "react";
import {
  Crown,
  Plus,
  CheckCircle2,
  Pencil,
  Trash2,
  X,
  AlertTriangle,
  Play,
} from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./VideoBlog.css";

import {
  getAdminVideos,
  createVideo,
  updateVideo,
  deleteVideo,
} from "../../api/Controller/videoblog";

const VideoBlog = () => {
  const [videos, setVideos] = useState([]);

  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [viewVideo, setViewVideo] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const limit = 10;

  // ================= INITIAL FORM =================

  const initialForm = {
    title: "",
    description: "",
    videoUrl: "",
    category: "",
    isActive: true,
  };

  const [formData, setFormData] = useState(initialForm);

  // ================= FETCH VIDEOS =================

  const fetchVideos = async () => {
    try {
      setLoading(true);

      const response = await getAdminVideos(page, limit);

      if (response?.success) {
        setVideos(response.data || []);
        setTotalPages(response.totalPages || 1);
      } else {
        setVideos([]);

        toast.dismiss();

        toast.error(
          response?.message || "Failed to fetch video blogs",
          {
            toastId: "fetch-video-error",
            autoClose: 2000,
          }
        );
      }
    } catch (error) {
      console.error("Get Video Blogs Error:", error);

      setVideos([]);

      toast.dismiss();

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong while fetching video blogs",
        {
          toastId: "fetch-video-error",
          autoClose: 2000,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= INITIAL LOAD / PAGE CHANGE =================

  useEffect(() => {
    fetchVideos();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // ================= INPUT CHANGE =================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ================= TRUNCATE WORDS =================

  const truncateWords = (text, maxWords = 7) => {
    if (!text) return "";

    const words = text.trim().split(/\s+/);

    if (words.length <= maxWords) {
      return text;
    }

    return words.slice(0, maxWords).join(" ") + "...";
  };

  // ================= EXTRACT YOUTUBE THUMBNAIL =================

  const getYoutubeThumbnail = (url) => {
    if (!url) return null;

    try {
      const parsedUrl = new URL(url);

      // youtube.com/watch?v=VIDEO_ID
      const videoId = parsedUrl.searchParams.get("v");

      if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      }

      // youtu.be/VIDEO_ID
      if (parsedUrl.hostname.includes("youtu.be")) {
        const id = parsedUrl.pathname
          .replace("/", "")
          .split("/")[0];

        if (id) {
          return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
        }
      }

      return null;
    } catch (error) {
      return null;
    }
  };

  // ================= OPEN ADD =================

  const handleAddVideo = () => {
    setEditId(null);
    setFormData(initialForm);
    setShowModal(true);
  };

  // ================= OPEN EDIT =================

  const handleEdit = (video) => {
    setEditId(video._id);

    setFormData({
      title: video.title || "",
      description: video.description || "",
      videoUrl: video.videoUrl || "",
      category: video.category || "",
      isActive: video.isActive ?? true,
    });

    setShowModal(true);
  };

  // ================= CLOSE MODAL =================

  const closeModal = () => {
    if (submitLoading) return;

    setShowModal(false);
    setEditId(null);
    setFormData(initialForm);
  };

  // ================= SUBMIT CREATE / UPDATE =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitLoading) return;

    try {
      setSubmitLoading(true);

      const payload = {
        title: formData.title,
        description: formData.description,
        videoUrl: formData.videoUrl,
        category: formData.category,
        isActive: formData.isActive,
      };

      let response;

      if (editId) {
        response = await updateVideo(editId, payload);
      } else {
        response = await createVideo(payload);
      }

      console.log("Video API Response:", response);

    
   if (response?.success) {
  toast.success(
    editId
      ? response?.message || "Video blog updated successfully!"
      : response?.message || "Video blog created successfully!",
    {
      autoClose: 2000,
      closeOnClick: true,
      pauseOnHover: false,
      pauseOnFocusLoss: false,
      draggable: false,
    }
  );

  setShowModal(false);
  setEditId(null);
  setFormData(initialForm);

  if (!editId) {
    setPage(1);
  }

  await fetchVideos();
} else {
        toast.dismiss();

        toast.error(
          response?.message ||
            (editId
              ? "Failed to update video blog"
              : "Failed to create video blog"),
          {
            toastId: editId
              ? `update-video-error-${editId}`
              : "create-video-error",
            autoClose: 2000,
          }
        );
      }
    } catch (error) {
      console.error(
        editId ? "Update Video Error:" : "Create Video Error:",
        error
      );

      toast.dismiss();

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          (editId
            ? "Something went wrong while updating the video blog"
            : "Something went wrong while creating the video blog"),
        {
          toastId: editId
            ? `update-video-error-${editId}`
            : "create-video-error",
          autoClose: 2000,
        }
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  // ================= DELETE REQUEST =================

  const requestDelete = (video) => {
    setDeleteTarget({
      id: video._id,
      title: video.title || "this video",
    });
  };

  // ================= CANCEL DELETE =================

  const cancelDelete = () => {
    if (deletingId) return;

    setDeleteTarget(null);
  };

  // ================= CONFIRM DELETE =================

  const confirmDelete = async () => {
    if (!deleteTarget || deletingId) return;

    const id = deleteTarget.id;

    try {
      setDeletingId(id);

      const response = await deleteVideo(id);

      console.log("Delete Video API Response:", response);

      if (response?.success) {
        // Clear any previous/stuck toast
        toast.dismiss();

        // Show only one delete success toast
        toast.success(
          response?.message ||
            "Video blog deleted successfully!",
          {
            toastId: `delete-video-${id}`,
            autoClose: 2000,
            closeOnClick: true,
            pauseOnHover: false,
          }
        );

        setDeleteTarget(null);

        // If last item of current page is deleted,
        // go to previous page
        if (videos.length === 1 && page > 1) {
          setPage((prev) => prev - 1);
        } else {
          // Refresh current page
          await fetchVideos();
        }
      } else {
        toast.dismiss();

        toast.error(
          response?.message ||
            "Failed to delete video blog",
          {
            toastId: `delete-video-error-${id}`,
            autoClose: 2000,
          }
        );
      }
    } catch (error) {
      console.error("Delete Video Error:", error);

      toast.dismiss();

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong while deleting the video blog",
        {
          toastId: `delete-video-error-${id}`,
          autoClose: 2000,
        }
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ================= FORMAT DATE =================

  const formatDate = (date) => {
    if (!date) return "-";

    try {
      return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "-";
    }
  };

  // ================= RENDER =================

  return (
    <div className="blog-page">

  

      <div className="blog-header">
        <div className="blog-header-left">

          <h1 className="blog-title">
            Video Blog Management
          </h1>

          <p className="blog-subtitle">
            Create, manage, and review your latest astrology
            video blogs and spiritual content.
          </p>

        </div>

        <button
          type="button"
          onClick={handleAddVideo}
          className="add-blog-btn"
        >
          <Plus size={20} strokeWidth={2.8} />
          Add Video
        </button>
      </div>

      {/* ================= TABLE CARD ================= */}

      <div className="blog-card">

        <div className="blog-card-header">

          <div className="blog-section-title">
            <span />
            <h2>Video Blog Management</h2>
          </div>

          <div className="blog-count">
            {videos.length} Items
          </div>

        </div>

        {loading ? (
          <div className="blog-empty">

            <div className="blog-loader" />

            <h3>
              Loading Video Blogs...
            </h3>

          </div>
        ) : (
          <>
            {/* ================= TABLE ================= */}

            <div className="blog-table-wrapper">

              <table className="blog-table">

                <thead>
                  <tr>

                    <th className="image-column">
                      THUMBNAIL
                    </th>

                    <th className="name-column">
                      VIDEO NAME
                    </th>

                    <th className="description-column">
                      DESCRIPTION
                    </th>

                    <th className="category-column">
                      CATEGORY
                    </th>

                    <th className="date-column">
                      DATE
                    </th>

                    <th className="status-column">
                      STATUS
                    </th>

                    <th className="action-column">
                      ACTION
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {videos.map((video) => {

                    const thumbnail =
                      video.thumbnailUrl ||
                      getYoutubeThumbnail(
                        video.videoUrl
                      ) ||
                      "https://via.placeholder.com/100";

                    return (
                      <tr key={video._id}>

                        {/* ================= THUMBNAIL ================= */}

                        <td>

                          <div className="blog-image video-thumbnail">

                            <img
                              src={thumbnail}
                              alt={
                                video.title ||
                                "Video thumbnail"
                              }
                              onError={(e) => {
                                e.currentTarget.src =
                                  "https://via.placeholder.com/100";
                              }}
                            />

                            <div className="thumbnail-play">

                              <Play
                                size={13}
                                fill="currentColor"
                              />

                            </div>

                          </div>

                        </td>

                        {/* ================= TITLE ================= */}

                        <td>

                          <span
                            className="blog-name"
                            title={video.title}
                          >
                            {video.title ||
                              "Untitled"}
                          </span>

                        </td>

                        {/* ================= DESCRIPTION ================= */}

                        <td>

                          <p
                            className="blog-description"
                            title={
                              video.description || ""
                            }
                          >
                            {truncateWords(
                              video.description ||
                                "No description available",
                              7
                            )}
                          </p>

                        </td>

                        {/* ================= CATEGORY ================= */}

                        <td>

                          <span className="video-category">
                            {video.category || "-"}
                          </span>

                        </td>

                        {/* ================= DATE ================= */}

                        <td>

                          <span className="video-date">
                            {formatDate(
                              video.createdAt
                            )}
                          </span>

                        </td>

                        {/* ================= STATUS ================= */}

                        <td>

                          <span
                            className={`blog-status ${
                              !video.isActive
                                ? "blog-status-draft"
                                : ""
                            }`}
                          >

                            <CheckCircle2
                              size={10}
                              strokeWidth={3}
                            />

                            {video.isActive
                              ? "ACTIVE"
                              : "INACTIVE"}

                          </span>

                        </td>

                        {/* ================= ACTIONS ================= */}

                        <td>

                          <div className="blog-actions">

                            {/* VIEW */}

                            <button
                              type="button"
                              onClick={() =>
                                setViewVideo(video)
                              }
                              className="view-blog-btn"
                            >
                              View
                            </button>

                            {/* EDIT */}

                            <button
                              type="button"
                              onClick={() =>
                                handleEdit(video)
                              }
                              className="edit-blog-btn"
                            >

                              <Pencil size={10} />

                              Edit

                            </button>

                            {/* DELETE */}

                            <button
                              type="button"
                              onClick={() =>
                                requestDelete(video)
                              }
                              disabled={
                                deletingId ===
                                video._id
                              }
                              className="delete-blog-btn"
                            >

                              <Trash2 size={10} />

                              {deletingId ===
                              video._id
                                ? "Deleting..."
                                : "Delete"}

                            </button>

                          </div>

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>

            {/* ================= EMPTY ================= */}

            {videos.length === 0 && (
              <div className="blog-empty">

                <Crown size={28} />

                <h3>
                  No Video Blogs Found
                </h3>

                <p>
                  Add your first video blog to
                  get started.
                </p>

              </div>
            )}

            {/* ================= PAGINATION ================= */}

            {videos.length > 0 &&
              totalPages > 1 && (
                <div className="blog-pagination">

                  <button
                    type="button"
                    disabled={page === 1}
                    onClick={() =>
                      setPage(
                        (prev) => prev - 1
                      )
                    }
                  >
                    Previous
                  </button>

                  <span>
                    Page {page} of {totalPages}
                  </span>

                  <button
                    type="button"
                    disabled={
                      page === totalPages
                    }
                    onClick={() =>
                      setPage(
                        (prev) => prev + 1
                      )
                    }
                  >
                    Next
                  </button>

                </div>
              )}

          </>
        )}

      </div>

      {/* ========================================================= */}
      {/* ================= ADD / EDIT MODAL ====================== */}
      {/* ========================================================= */}

      {showModal && (
        <div className="blog-modal-overlay">

          <div className="blog-modal">

            {/* ================= MODAL HEADER ================= */}

            <div className="blog-modal-header">

              <div>

                <div className="blog-modal-badge">

                  <Crown size={12} />

                  Cosmic Video Hub

                </div>

                <h2>
                  {editId
                    ? "Update Video Blog"
                    : "Create New Video Blog"}
                </h2>

              </div>

              <button
                type="button"
                onClick={closeModal}
                className="blog-modal-close"
                disabled={submitLoading}
              >
                <X size={19} />
              </button>

            </div>

            {/* ================= FORM ================= */}

            <form
              onSubmit={handleSubmit}
              className="blog-form"
            >

              {/* ================= VIDEO INFORMATION ================= */}

              <div className="blog-form-section">

                <h3>
                  Video Information
                </h3>

                <div className="blog-form-grid">

                  {/* TITLE */}

                  <div className="blog-form-group">

                    <label>
                      Title <span>*</span>
                    </label>

                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter video title"
                      required
                    />

                  </div>

                  {/* CATEGORY */}

                  <div className="blog-form-group">

                    <label>
                      Category <span>*</span>
                    </label>

                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      placeholder="Example: Vedic, Muhurat"
                      required
                    />

                  </div>

                  {/* VIDEO URL */}

                  <div className="blog-form-group full-width">

                    <label>
                      YouTube Video URL{" "}
                      <span>*</span>
                    </label>

                    <input
                      type="url"
                      name="videoUrl"
                      value={formData.videoUrl}
                      onChange={handleChange}
                      placeholder="https://www.youtube.com/watch?v=..."
                      required
                    />

                  </div>

                  {/* DESCRIPTION */}

                  <div className="blog-form-group full-width">

                    <label>
                      Description
                    </label>

                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Enter video description"
                      rows="4"
                    />

                  </div>

                </div>

              </div>

              {/* ================= STATUS ================= */}

              <div className="blog-form-section">

                <h3>
                  Publishing Settings
                </h3>

                <div className="blog-checkbox-row">

                  <label className="blog-checkbox">

                    <input
                      type="checkbox"
                      name="isActive"
                      checked={
                        formData.isActive
                      }
                      onChange={handleChange}
                    />

                    <span>
                      Active Video
                    </span>

                  </label>

                </div>

              </div>

              {/* ================= VIDEO PREVIEW ================= */}

              {formData.videoUrl && (
                <div className="video-url-preview">

                  <div className="video-preview-label">
                    Video Preview
                  </div>

                  <a
                    href={formData.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="video-preview-link"
                  >

                    <Play
                      size={15}
                      fill="currentColor"
                    />

                    Open YouTube Video

                  </a>

                </div>
              )}

              {/* ================= BUTTONS ================= */}

              <div className="blog-form-actions">

                <button
                  type="button"
                  onClick={closeModal}
                  className="blog-cancel-btn"
                  disabled={submitLoading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="blog-submit-btn"
                  disabled={submitLoading}
                >

                  {submitLoading
                    ? editId
                      ? "Updating..."
                      : "Publishing..."
                    : editId
                    ? "Update Video"
                    : "Publish Video"}

                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* ================= VIEW VIDEO MODAL ====================== */}
      {/* ========================================================= */}

      {viewVideo && (
        <div
          className="blog-modal-overlay"
          onClick={() =>
            setViewVideo(null)
          }
        >

          <div
            className="blog-modal video-view-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* ================= HEADER ================= */}

            <div className="blog-modal-header">

              <div>

                <div className="blog-modal-badge">

                  <Crown size={12} />

                  Cosmic Video Hub

                </div>

                <h2>
                  Video Details
                </h2>

              </div>

              <button
                type="button"
                onClick={() =>
                  setViewVideo(null)
                }
                className="blog-modal-close"
              >
                <X size={19} />
              </button>

            </div>

            {/* ================= CONTENT ================= */}

            <div className="video-view-content">

              {/* THUMBNAIL */}

              <div className="video-view-thumbnail">

                <img
                  src={
                    viewVideo.thumbnailUrl ||
                    getYoutubeThumbnail(
                      viewVideo.videoUrl
                    ) ||
                    "https://via.placeholder.com/500x280"
                  }
                  alt={
                    viewVideo.title ||
                    "Video thumbnail"
                  }
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://via.placeholder.com/500x280";
                  }}
                />

                <a
                  href={
                    viewVideo.videoUrl
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="video-large-play"
                >

                  <Play
                    size={22}
                    fill="currentColor"
                  />

                </a>

              </div>

              {/* VIDEO DETAILS */}

              <div className="video-detail-info">

                <h3>
                  {viewVideo.title ||
                    "Untitled"}
                </h3>

                <div className="video-detail-row">

                  <span>
                    Category
                  </span>

                  <strong>
                    {viewVideo.category ||
                      "-"}
                  </strong>

                </div>

                <div className="video-detail-row">

                  <span>
                    Status
                  </span>

                  <strong>
                    {viewVideo.isActive
                      ? "Active"
                      : "Inactive"}
                  </strong>

                </div>

                <div className="video-detail-row">

                  <span>
                    Created
                  </span>

                  <strong>
                    {formatDate(
                      viewVideo.createdAt
                    )}
                  </strong>

                </div>

                <div className="video-description-box">

                  <span>
                    Description
                  </span>

                  <p>
                    {viewVideo.description ||
                      "No description available."}
                  </p>

                </div>

                <a
                  href={
                    viewVideo.videoUrl
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="watch-video-btn"
                >

                  <Play
                    size={15}
                    fill="currentColor"
                  />

                  Watch Video

                </a>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* ================= DELETE CONFIRMATION =================== */}
      {/* ========================================================= */}

      {deleteTarget && (
        <div
          className="blog-modal-overlay"
          onClick={cancelDelete}
          style={{
            zIndex: 1100,
          }}
        >

          <div
            className="blog-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
            style={{
              maxWidth: 420,
              width: "90%",
              padding: "28px 26px",
              textAlign: "center",
            }}
          >

            {/* ================= WARNING ICON ================= */}

            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background:
                  "rgba(239, 68, 68, 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >

              <AlertTriangle
                size={26}
                color="#ef4444"
              />

            </div>

            {/* ================= TITLE ================= */}

            <h2
              style={{
                margin: "0 0 8px",
                fontSize: 18,
              }}
            >
              Delete Video Blog?
            </h2>

            {/* ================= MESSAGE ================= */}

            <p
              style={{
                margin: "0 0 22px",
                fontSize: 14,
                color:
                  "var(--text-muted, #6b7280)",
                lineHeight: 1.5,
              }}
            >
              Are you sure you want to delete{" "}
              <strong>
                &ldquo;
                {deleteTarget.title}
                &rdquo;
              </strong>
              ? This action cannot be undone.
            </p>

            {/* ================= DELETE BUTTONS ================= */}

            <div
              className="blog-form-actions"
              style={{
                justifyContent: "center",
              }}
            >

              <button
                type="button"
                className="blog-cancel-btn"
                onClick={cancelDelete}
                disabled={
                  deletingId ===
                  deleteTarget.id
                }
              >
                Cancel
              </button>

              <button
                type="button"
                className="delete-blog-btn"
                onClick={confirmDelete}
                disabled={
                  deletingId ===
                  deleteTarget.id
                }
                style={{
                  padding: "10px 20px",
                  fontSize: 14,
                }}
              >

                <Trash2 size={14} />

                {deletingId ===
                deleteTarget.id
                  ? "Deleting..."
                  : "Delete"}

              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default VideoBlog;