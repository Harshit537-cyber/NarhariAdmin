import React, { useEffect, useState } from "react";
import {
  X,
  Crown,
  CalendarDays,
  Clock3,
  Tag,
  User,
  Quote,
  Sparkles,
} from "lucide-react";

import { getArticleById } from "../../api/Controller/blogs";

import "./ViewBlogModal.css";

const ViewBlogModal = ({ blogId, onClose }) => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (blogId) {
      fetchBlog();
    }
  }, [blogId]);

  const fetchBlog = async () => {
    try {
      setLoading(true);

      const response = await getArticleById(blogId);

      if (response?.data?.success) {
        setBlog(response.data.data);
      }
    } catch (error) {
      console.error("Get Blog By ID Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!blogId) return null;

  return (
    <div className="view-blog-overlay">
      <div className="view-blog-modal">

        {/* ================= HEADER ================= */}

        <div className="view-blog-header">
          <div>
            <div className="view-blog-badge">
              <Crown size={12} />
              Cosmic Blog Insights
            </div>

            <h2>Blog Details</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="view-blog-close"
          >
            <X size={19} />
          </button>
        </div>

        {/* ================= LOADING ================= */}

        {loading ? (
          <div className="view-blog-loading">
            <div className="view-blog-spinner" />
            <p>Loading blog details...</p>
          </div>
        ) : !blog ? (
          <div className="view-blog-empty">
            <Crown size={30} />
            <h3>Blog Not Found</h3>
            <p>Unable to load this blog.</p>
          </div>
        ) : (
          <div className="view-blog-content">

            {/* ================= BANNER ================= */}

            {blog.bannerImage && (
              <div className="view-blog-banner">
                <img
                  src={blog.bannerImage}
                  alt={blog.title}
                />
              </div>
            )}

            {/* ================= TITLE ================= */}

            <div className="view-blog-title-section">

              <div className="view-blog-category">
                {blog.category || "Astrology"}
              </div>

              <h1>{blog.title}</h1>

              {blog.subtitle && (
                <p className="view-blog-subtitle">
                  {blog.subtitle}
                </p>
              )}

              {/* Meta */}

              <div className="view-blog-meta">

                {blog.author?.name && (
                  <div>
                    <User size={14} />
                    {blog.author.name}
                  </div>
                )}

                {blog.readTime && (
                  <div>
                    <Clock3 size={14} />
                    {blog.readTime}
                  </div>
                )}

                {blog.publishedDate && (
                  <div>
                    <CalendarDays size={14} />
                    {new Date(
                      blog.publishedDate
                    ).toLocaleDateString()}
                  </div>
                )}

              </div>
            </div>

            {/* ================= SUMMARY ================= */}

            {blog.summary && (
              <div className="view-blog-summary">
                <h3>Overview</h3>

                <p>{blog.summary}</p>
              </div>
            )}

            {/* ================= AUTHOR ================= */}

            {blog.author && (
              <div className="view-blog-author">

                {blog.author.profilePic ? (
                  <img
                    src={blog.author.profilePic}
                    alt={blog.author.name}
                  />
                ) : (
                  <div className="view-blog-author-placeholder">
                    <User size={20} />
                  </div>
                )}

                <div>
                  <span>Written By</span>

                  <h4>
                    {blog.author.name || "Unknown Author"}
                  </h4>

                  {blog.author.designation && (
                    <p>
                      {blog.author.designation}
                    </p>
                  )}
                </div>

              </div>
            )}

            {/* ================= MAIN CONTENT ================= */}

            {blog.mainContent && (
              <div className="view-blog-section">

                <h3>Article Content</h3>

                <div className="view-blog-main-content">
                  {blog.mainContent}
                </div>

              </div>
            )}

            {/* ================= KEY TAKEAWAYS ================= */}

            {Array.isArray(blog.keyTakeaways) &&
              blog.keyTakeaways.length > 0 && (
                <div className="view-blog-section">

                  <div className="view-blog-section-heading">
                    <Sparkles size={16} />
                    <h3>Key Takeaways</h3>
                  </div>

                  <div className="view-blog-takeaways">

                    {blog.keyTakeaways.map(
                      (item, index) => (
                        <div
                          className="view-blog-takeaway"
                          key={index}
                        >
                          <span>
                            {index + 1}
                          </span>

                          <p>
                            {item?.point || ""}
                          </p>
                        </div>
                      )
                    )}

                  </div>
                </div>
              )}

            {/* ================= RITUAL ================= */}

            {Array.isArray(blog.ritual) &&
              blog.ritual.length > 0 && (
                <div className="view-blog-section">

                  <h3>Ritual</h3>

                  <div className="view-blog-ritual">

                    {blog.ritual.map(
                      (item, index) => (
                        <div
                          key={index}
                          className="view-blog-ritual-item"
                        >
                          {typeof item === "object"
                            ? item?.point ||
                              item?.title ||
                              item?.description ||
                              ""
                            : item}
                        </div>
                      )
                    )}

                  </div>
                </div>
              )}

            {/* ================= QUOTE ================= */}

            {blog.quote?.text && (
              <div className="view-blog-quote">

                <Quote size={22} />

                <p>
                  {blog.quote.text}
                </p>

                {blog.quote.author && (
                  <span>
                    — {blog.quote.author}
                  </span>
                )}

              </div>
            )}

            {/* ================= TAGS ================= */}

            {Array.isArray(blog.tags) &&
              blog.tags.length > 0 && (
                <div className="view-blog-section">

                  <div className="view-blog-section-heading">
                    <Tag size={15} />
                    <h3>Tags</h3>
                  </div>

                  <div className="view-blog-tags">

                    {blog.tags.map(
                      (tag, index) => (
                        <span key={index}>
                          {typeof tag === "object"
                            ? tag?.name ||
                              tag?.tag ||
                              ""
                            : tag}
                        </span>
                      )
                    )}

                  </div>
                </div>
              )}

          </div>
        )}

      </div>
    </div>
  );
};

export default ViewBlogModal;