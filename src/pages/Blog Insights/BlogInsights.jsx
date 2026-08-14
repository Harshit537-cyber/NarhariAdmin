import React from "react";
import { Crown, Plus, CheckCircle2, Pencil, Trash2 } from "lucide-react";

import "./BlogInsights.css";

const BlogInsights = () => {
  const blogs = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=300",
      name: "Astrology Basics",
      description:
        "Learn the fundamentals of astrology and understand your birth chart.",
      status: "ACTIVE",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=300",
      name: "Gemstone Guide",
      description:
        "A complete guide to choosing the right gemstone according to astrology.",
      status: "ACTIVE",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=300",
      name: "Rashi & Nakshatra",
      description:
        "Understand your Rashi and Nakshatra and their influence on your life.",
      status: "ACTIVE",
    },
    {
      id: 4,
      image:
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=300",
      name: "Vedic Astrology",
      description:
        "Explore important concepts and insights from traditional Vedic astrology.",
      status: "ACTIVE",
    },
  ];

  const handleAddBlog = () => {
    console.log("Add Blog");
  };

  const handleEdit = (blog) => {
    console.log("Edit:", blog);
  };

  const handleDelete = (id) => {
    console.log("Delete:", id);
  };

  return (
    <div className="blog-page">
      {/* Header */}
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

      {/* Main Card */}
      <div className="blog-card">
        {/* Card Header */}
        <div className="blog-card-header">
          <div className="blog-section-title">
            <span />
            <h2>Blog Management</h2>
          </div>

          <div className="blog-count">{blogs.length} Items</div>
        </div>

        {/* Table */}
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
                <tr key={blog.id}>
                  {/* Image */}
                  <td>
                    <div className="blog-image">
                      <img src={blog.image} alt={blog.name} />
                    </div>
                  </td>

                  {/* Name */}
                  <td>
                    <span className="blog-name">{blog.name}</span>
                  </td>

                  {/* Description */}
                  <td>
                    <p className="blog-description" title={blog.description}>
                      {blog.description}
                    </p>
                  </td>

                  {/* Status */}
                  <td>
                    <span className="blog-status">
                      <CheckCircle2 size={10} strokeWidth={3} />
                      {blog.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td>
                    <div className="blog-actions">
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
                        onClick={() => handleDelete(blog.id)}
                        className="delete-blog-btn"
                      >
                        <Trash2 size={10} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {blogs.length === 0 && (
          <div className="blog-empty">
            <Crown size={28} />
            <h3>No Blogs Found</h3>
            <p>Add your first blog to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogInsights;
