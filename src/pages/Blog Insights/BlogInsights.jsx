import React, { useEffect, useState } from "react";
import { Crown, Plus, CheckCircle2, Pencil, Trash2, X, AlertTriangle } from "lucide-react";

import "./BlogInsights.css";

import {
  getAdminArticles,
  createArticle,
  updateArticle,
  deleteArticle,
} from "../../API/Controller/blogs";
import ViewBlogModal from "./ViewBlog";

const BlogInsights = () => {
  const [blogs, setBlogs] = useState([]);

  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const limit = 10;

  const initialForm = {
    title: "",
    subtitle: "",
    summary: "",
    mainContent: "",
    category: "",
    readTime: "",
    slug: "",
    publishedDate: "",
    isPublished: true,
    isFeatured: false,

    authorName: "",
    authorDesignation: "",

    quoteText: "",
    quoteAuthor: "",

    keyTakeaways: [],
    ritual: [],
    tags: [],

    thumbnail: null,
    bannerImage: null,
    authorProfilePic: null,
  };

  const [formData, setFormData] = useState(initialForm);

  const [viewBlogId, setViewBlogId] = useState(null);

  // ================= DELETE POPUP STATE =================
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, title } | null
  const [deletingId, setDeletingId] = useState(null);

  // ================= GET BLOGS =================

  const fetchBlogs = async () => {
    try {
      setLoading(true);

      const response = await getAdminArticles({
        page,
        limit,
      });

      if (response?.data?.success) {
        setBlogs(response.data.data || []);
        setTotalPages(response.data.totalPages || 1);
      } else {
        setBlogs([]);
      }
    } catch (error) {
      console.error("Get Blogs Error:", error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // ================= INPUT CHANGE =================

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        [name]: files?.[0] || null,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ================= ARRAY CHANGE =================

  const handleArrayChange = (name, value) => {
    if (name === "keyTakeaways") {
      setFormData((prev) => ({
        ...prev,
        keyTakeaways: value
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
          .map((item) => ({
            point: item,
          })),
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    }));
  };

  // ================= OPEN ADD =================

  const handleAddBlog = () => {
    setEditId(null);
    setFormData(initialForm);
    setShowModal(true);
  };

  // ================= OPEN EDIT =================

  const handleEdit = (blog) => {
    setEditId(blog._id);

    const normalizeArray = (value) => {
      if (Array.isArray(value)) {
        return value;
      }

      if (typeof value === "string") {
        return value
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
      }

      return [];
    };

    setFormData({
      title: blog.title || "",
      subtitle: blog.subtitle || "",
      summary: blog.summary || "",
      mainContent: blog.mainContent || "",
      category: blog.category || "",
      readTime: blog.readTime || "",
      publishedDate: blog.publishedDate
        ? blog.publishedDate.substring(0, 10)
        : "",

      isPublished: blog.isPublished ?? true,
      isFeatured: blog.isFeatured ?? false,
      slug: blog.slug || "",

      authorName: blog.author?.name || "",
      authorDesignation: blog.author?.designation || "",

      quoteText: blog.quote?.text || "",
      quoteAuthor: blog.quote?.author || "",

      keyTakeaways: Array.isArray(blog.keyTakeaways) ? blog.keyTakeaways : [],

      ritual: normalizeArray(blog.ritual),

      tags: normalizeArray(blog.tags),

      thumbnail: null,
      bannerImage: null,
      authorProfilePic: null,
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

  // ================= CREATE / UPDATE =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitLoading(true);

      const data = new FormData();

      data.append("title", formData.title);
      data.append("subtitle", formData.subtitle);
      data.append("summary", formData.summary);
      data.append("mainContent", formData.mainContent);
      data.append("category", formData.category);
      data.append("readTime", formData.readTime);
      data.append("publishedDate", formData.publishedDate);
      data.append("slug", formData.slug);

      data.append("isPublished", formData.isPublished);
      data.append("isFeatured", formData.isFeatured);

      data.append("authorName", formData.authorName);
      data.append("authorDesignation", formData.authorDesignation);

      data.append("quoteText", formData.quoteText);
      data.append("quoteAuthor", formData.quoteAuthor);

      data.append("keyTakeaways", JSON.stringify(formData.keyTakeaways));

      data.append("ritual", JSON.stringify(formData.ritual));

      data.append("tags", JSON.stringify(formData.tags));

      // Images
      if (formData.thumbnail) {
        data.append("thumbnail", formData.thumbnail);
      }

      if (formData.bannerImage) {
        data.append("bannerImage", formData.bannerImage);
      }

      if (formData.authorProfilePic) {
        data.append("authorProfilePic", formData.authorProfilePic);
      }

      let response;

      if (editId) {
        response = await updateArticle(editId, data);
      } else {
        response = await createArticle(data);
      }

      if (response?.data?.success) {
        closeModal();

        if (!editId) {
          setPage(1);
        }

        await fetchBlogs();
      }
    } catch (error) {
      console.error(
        editId ? "Update Blog Error:" : "Create Blog Error:",
        error,
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  // ================= DELETE (custom popup) =================

  // Opens the confirmation popup instead of window.confirm
  const requestDelete = (blog) => {
    setDeleteTarget({ id: blog._id, title: blog.title || "this blog" });
  };

  const cancelDelete = () => {
    if (deletingId) return; // don't allow closing mid-delete
    setDeleteTarget(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    const id = deleteTarget.id;

    try {
      setDeletingId(id);

      const response = await deleteArticle(id);

      if (response?.data?.success) {
        setDeleteTarget(null);

        if (blogs.length === 1 && page > 1) {
          setPage((prev) => prev - 1);
        } else {
          await fetchBlogs();
        }
      }
    } catch (error) {
      console.error("Delete Blog Error:", error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="blog-page">
      {/* ================= HEADER ================= */}

      <div className="blog-header">
        <div className="blog-header-left">
          <div className="blog-badge">
            <Crown size={11} />
            Cosmic Blog Hub
          </div>

          <h1 className="blog-title">Blog & Insights Management</h1>

          <p className="blog-subtitle">
            Create, manage, and review your latest astrology insights and
            articles.
          </p>
        </div>

        <button type="button" onClick={handleAddBlog} className="add-blog-btn">
          <Plus size={20} strokeWidth={2.8} />
          Add Blog
        </button>
      </div>

      {/* ================= TABLE CARD ================= */}

      <div className="blog-card">
        <div className="blog-card-header">
          <div className="blog-section-title">
            <span />
            <h2>Blog Management</h2>
          </div>

          <div className="blog-count">{blogs.length} Items</div>
        </div>

        {loading ? (
          <div className="blog-empty">
            <div className="blog-loader" />
            <h3>Loading Blogs...</h3>
          </div>
        ) : (
          <>
            <div className="blog-table-wrapper">
              <table className="blog-table">
                <thead>
                  <tr>
                    <th className="image-column">IMAGE</th>
                    <th className="name-column">BLOG NAME</th>
                    <th className="description-column">DESCRIPTION</th>
                    <th className="status-column">STATUS</th>
                    <th className="action-column">ACTION</th>
                  </tr>
                </thead>

                <tbody>
                  {blogs.map((blog) => (
                    <tr key={blog._id}>
                      <td>
                        <div className="blog-image">
                          <img
                            src={
                              blog.thumbnail ||
                              "https://via.placeholder.com/100"
                            }
                            alt={blog.title}
                          />
                        </div>
                      </td>

                      <td>
                        <span className="blog-name" title={blog.title}>
                          {blog.title || "Untitled"}
                        </span>
                      </td>

                      <td>
                        <p
                          className="blog-description"
                          title={blog.summary || blog.subtitle || ""}
                        >
                          {blog.summary ||
                            blog.subtitle ||
                            "No description available"}
                        </p>
                      </td>

                      <td>
                        <span
                          className={`blog-status ${
                            !blog.isPublished ? "blog-status-draft" : ""
                          }`}
                        >
                          <CheckCircle2 size={10} strokeWidth={3} />

                          {blog.isPublished ? "ACTIVE" : "DRAFT"}
                        </span>
                      </td>

                      <td>
                        <div className="blog-actions">
                          <button
                            type="button"
                            onClick={() => setViewBlogId(blog._id)}
                            className="view-blog-btn"
                          >
                            View
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEdit(blog)}
                            className="edit-blog-btn"
                          >
                            <Pencil size={10} />
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => requestDelete(blog)}
                            disabled={deletingId === blog._id}
                            className="delete-blog-btn"
                          >
                            <Trash2 size={10} />
                            {deletingId === blog._id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {blogs.length === 0 && (
              <div className="blog-empty">
                <Crown size={28} />

                <h3>No Blogs Found</h3>

                <p>Add your first blog to get started.</p>
              </div>
            )}

            {blogs.length > 0 && totalPages > 1 && (
              <div className="blog-pagination">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => setPage((prev) => prev - 1)}
                >
                  Previous
                </button>

                <span>
                  Page {page} of {totalPages}
                </span>

                <button
                  type="button"
                  disabled={page === totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ================= ADD / EDIT MODAL ================= */}

      {showModal && (
        <div className="blog-modal-overlay">
          <div className="blog-modal">
            {/* Modal Header */}

            <div className="blog-modal-header">
              <div>
                <div className="blog-modal-badge">
                  <Crown size={12} />
                  Cosmic Blog Hub
                </div>

                <h2>{editId ? "Update Blog" : "Create New Blog"}</h2>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="blog-modal-close"
              >
                <X size={19} />
              </button>
            </div>

            {/* Form */}

            <form onSubmit={handleSubmit} className="blog-form">
              {/* Basic Information */}

              <div className="blog-form-section">
                <h3>Basic Information</h3>

                <div className="blog-form-grid">
                  <div className="blog-form-group">
                    <label>
                      Title <span>*</span>
                    </label>

                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter blog title"
                      required
                    />
                  </div>

                  <div className="blog-form-group">
                    <label>Category</label>

                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      placeholder="Enter category"
                    />
                  </div>

                  <div className="blog-form-group">
                    <label>Subtitle</label>

                    <input
                      type="text"
                      name="subtitle"
                      value={formData.subtitle}
                      onChange={handleChange}
                      placeholder="Enter subtitle"
                    />
                  </div>

                  <div className="blog-form-group">
                    <label>Read Time</label>

                    <input
                      type="text"
                      name="readTime"
                      value={formData.readTime}
                      onChange={handleChange}
                      placeholder="Example: 5 min read"
                    />
                  </div>

                  <div className="blog-form-group">
                    <label>Slug</label>

                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleChange}
                      placeholder="Example: my-blog-post"
                    />
                  </div>

                  <div className="blog-form-group full-width">
                    <label>Description</label>

                    <textarea
                      name="summary"
                      value={formData.summary}
                      onChange={handleChange}
                      placeholder="Enter blog summary"
                      rows="3"
                    />
                  </div>

                  <div className="blog-form-group full-width">
                    <label>Content</label>

                    <textarea
                      name="mainContent"
                      value={formData.mainContent}
                      onChange={handleChange}
                      placeholder="Enter blog content"
                      rows="7"
                    />
                  </div>
                </div>
              </div>

              {/* Author */}

              <div className="blog-form-section">
                <h3>Author Information</h3>

                <div className="blog-form-grid">
                  <div className="blog-form-group">
                    <label>Author Name</label>

                    <input
                      type="text"
                      name="authorName"
                      value={formData.authorName}
                      onChange={handleChange}
                      placeholder="Enter author name"
                    />
                  </div>

                  <div className="blog-form-group">
                    <label>Designation</label>

                    <input
                      type="text"
                      name="authorDesignation"
                      value={formData.authorDesignation}
                      onChange={handleChange}
                      placeholder="Enter designation"
                    />
                  </div>

                  <div className="blog-form-group full-width">
                    <label>Author Profile Picture</label>

                    <input
                      type="file"
                      name="authorProfilePic"
                      accept="image/*"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Images */}

              <div className="blog-form-section">
                <h3>Blog Images</h3>

                <div className="blog-form-grid">
                  <div className="blog-form-group">
                    <label>Thumbnail</label>

                    <input
                      type="file"
                      name="thumbnail"
                      accept="image/*"
                      onChange={handleChange}
                      required={!editId}
                    />
                  </div>

                  <div className="blog-form-group">
                    <label>Banner Image</label>

                    <input
                      type="file"
                      name="bannerImage"
                      accept="image/*"
                      onChange={handleChange}
                      required={!editId}
                    />
                  </div>
                </div>
              </div>

              {/* Quote */}

              <div className="blog-form-section">
                <h3>Quote</h3>

                <div className="blog-form-grid">
                  <div className="blog-form-group">
                    <label>Quote Text</label>

                    <input
                      type="text"
                      name="quoteText"
                      value={formData.quoteText}
                      onChange={handleChange}
                      placeholder="Enter quote"
                    />
                  </div>

                  <div className="blog-form-group">
                    <label>Quote Author</label>

                    <input
                      type="text"
                      name="quoteAuthor"
                      value={formData.quoteAuthor}
                      onChange={handleChange}
                      placeholder="Enter quote author"
                    />
                  </div>
                </div>
              </div>

              {/* Arrays */}

              <div className="blog-form-section">
                <h3>Additional Information</h3>

                <div className="blog-form-grid">
                  <div className="blog-form-group">
                    <label>Tags</label>

                    <input
                      type="text"
                      value={formData.tags.join(", ")}
                      onChange={(e) =>
                        handleArrayChange("tags", e.target.value)
                      }
                      placeholder="astrology, zodiac, planets"
                    />
                  </div>

                  <div className="blog-form-group">
                    <label>Key Takeaways</label>

                    <input
                      type="text"
                      value={formData.keyTakeaways
                        .map((item) => item.point)
                        .join(", ")}
                      onChange={(e) =>
                        handleArrayChange("keyTakeaways", e.target.value)
                      }
                      placeholder="Point 1, Point 2, Point 3"
                    />
                  </div>

                  <div className="blog-form-group full-width">
                    <label>Ritual</label>

                    <input
                      type="text"
                      value={
                        Array.isArray(formData.ritual)
                          ? formData.ritual.join(", ")
                          : ""
                      }
                      onChange={(e) =>
                        handleArrayChange("ritual", e.target.value)
                      }
                      placeholder="Ritual 1, Ritual 2"
                    />
                  </div>
                </div>
              </div>

              {/* Settings */}

              <div className="blog-form-section">
                <h3>Publishing Settings</h3>

                <div className="blog-checkbox-row">
                  <label className="blog-checkbox">
                    <input
                      type="checkbox"
                      name="isPublished"
                      checked={formData.isPublished}
                      onChange={handleChange}
                    />
                    <span>Published</span>
                  </label>

                  <label className="blog-checkbox">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleChange}
                    />
                    <span>Featured Article</span>
                  </label>
                </div>
              </div>

              {/* Buttons */}

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
                      ? "Update Blog"
                      : "Publish Blog"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= CUSTOM DELETE CONFIRMATION POPUP ================= */}

      {deleteTarget && (
        <div
          className="blog-modal-overlay"
          onClick={cancelDelete}
          style={{ zIndex: 1100 }}
        >
          <div
            className="blog-modal"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: 420,
              width: "90%",
              padding: "28px 26px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "rgba(239, 68, 68, 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <AlertTriangle size={26} color="#ef4444" />
            </div>

            <h2 style={{ margin: "0 0 8px", fontSize: 18 }}>Delete Blog?</h2>

            <p
              style={{
                margin: "0 0 22px",
                fontSize: 14,
                color: "var(--text-muted, #6b7280)",
                lineHeight: 1.5,
              }}
            >
              Are you sure you want to delete{" "}
              <strong>&ldquo;{deleteTarget.title}&rdquo;</strong>? This
              action cannot be undone.
            </p>

            <div
              className="blog-form-actions"
              style={{ justifyContent: "center" }}
            >
              <button
                type="button"
                className="blog-cancel-btn"
                onClick={cancelDelete}
                disabled={deletingId === deleteTarget.id}
              >
                Cancel
              </button>

              <button
                type="button"
                className="delete-blog-btn"
                onClick={confirmDelete}
                disabled={deletingId === deleteTarget.id}
                style={{ padding: "10px 20px", fontSize: 14 }}
              >
                <Trash2 size={14} />
                {deletingId === deleteTarget.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {viewBlogId && (
        <ViewBlogModal
          blogId={viewBlogId}
          onClose={() => setViewBlogId(null)}
        />
      )}
    </div>
  );
};

export default BlogInsights