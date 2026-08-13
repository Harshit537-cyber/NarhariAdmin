import React, { useEffect, useMemo, useState } from "react";
import "./RestrictionKeyword.css";

import {
  FaCrown,
  FaPlus,
  FaEdit,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaCheckCircle,
  FaTimesCircle,
  FaSearch,
  FaBan,
} from "react-icons/fa";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ======================================================
// API IMPORTS
// Connect these functions with your actual API
// ======================================================

import {
  getAllRestrictionKeywords,
  createRestrictionKeyword,
  updateRestrictionKeyword,
  deleteRestrictionKeyword,
  //   toggleRestrictionKeywordStatus,
} from "../../api/Controller/restrictionKeyword.js";

// ======================================================
// CONSTANTS
// ======================================================

const ITEMS_PER_PAGE = 7;

const EMPTY_FORM = {
  keyword: "",
  action: "",
  isActive: true,
};

// ======================================================
// COMPONENT
// ======================================================

export default function RestrictionKeywords() {
  const [keywords, setKeywords] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [editingKeyword, setEditingKeyword] = useState(null);
  const [selectedKeyword, setSelectedKeyword] = useState(null);

  const [formData, setFormData] = useState(EMPTY_FORM);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);

  // ======================================================
  // FETCH ALL KEYWORDS
  // ======================================================

  const fetchKeywords = async () => {
    try {
      setLoading(true);

      const res = await getAllRestrictionKeywords();

      if (res?.data?.success) {
        setKeywords(res.data.data || []);
      } else {
        setKeywords([]);
        toast.error(
          res?.data?.message || "Failed to load restriction keywords",
        );
      }
    } catch (error) {
      console.error("Get restriction keywords error:", error);

      setKeywords([]);

      toast.error(
        error?.response?.data?.message || "Failed to load restriction keywords",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeywords();
  }, []);

  // ======================================================
  // SEARCH + FILTER
  // ======================================================

  const filteredKeywords = useMemo(() => {
    let result = [...keywords];

    if (search.trim()) {
      const searchValue = search.toLowerCase().trim();

      result = result.filter((item) => {
        return (
          item.keyword?.toLowerCase().includes(searchValue) ||
          item.description?.toLowerCase().includes(searchValue)
        );
      });
    }

    if (statusFilter !== "all") {
      result = result.filter((item) => {
        if (statusFilter === "active") {
          return item.isActive === true;
        }

        if (statusFilter === "inactive") {
          return item.isActive === false;
        }

        return true;
      });
    }

    return result;
  }, [keywords, search, statusFilter]);

  // ======================================================
  // PAGINATION
  // ======================================================

  const totalPages = Math.max(
    1,
    Math.ceil(filteredKeywords.length / ITEMS_PER_PAGE),
  );

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;

  const currentKeywords = filteredKeywords.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // ======================================================
  // SUMMARY
  // ======================================================

  const totalKeywords = keywords.length;

  const activeKeywords = keywords.filter(
    (item) => item.isActive === true,
  ).length;

  const inactiveKeywords = keywords.filter(
    (item) => item.isActive === false,
  ).length;

  // ======================================================
  // OPEN ADD MODAL
  // ======================================================

  const openAddModal = () => {
    setEditingKeyword(null);
    setFormData(EMPTY_FORM);
    setShowModal(true);
  };

  // ======================================================
  // OPEN EDIT MODAL
  // ======================================================

  const openEditModal = (item) => {
    setEditingKeyword(item);

    setFormData({
      keyword: item.keyword || "",
      action: item.action || "",
      isActive: item.isActive ?? true,
    });

    setShowModal(true);
  };

  // ======================================================
  // CLOSE MODAL
  // ======================================================

  const closeModal = () => {
    if (submitLoading) return;

    setShowModal(false);
    setEditingKeyword(null);
    setFormData(EMPTY_FORM);
  };

  // ======================================================
  // FORM CHANGE
  // ======================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ======================================================
  // ADD / UPDATE
  // ======================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const keyword = formData.keyword.trim();
    const action = formData.action.trim();

    // =========================
    // CREATE VALIDATION
    // =========================
    if (!editingKeyword && !keyword) {
      toast.error("Please enter restriction keyword");
      return;
    }

    if (!action) {
      toast.error("Please enter action");
      return;
    }

    try {
      setSubmitLoading(true);

      let res;

      // =========================
      // UPDATE
      // =========================
      if (editingKeyword) {
        const payload = {
          action,
          isActive: formData.isActive,
        };

        res = await updateRestrictionKeyword(editingKeyword._id, payload);
      }

      // =========================
      // CREATE
      // =========================
      else {
        const payload = {
          keyword,
          action,
        };

        res = await createRestrictionKeyword(payload);
      }

      if (res?.data?.success) {
        toast.success(
          res.data.message ||
            (editingKeyword
              ? "Restriction keyword updated successfully"
              : "Restriction keyword created successfully"),
        );

        closeModal();
        await fetchKeywords();
      } else {
        toast.error(res?.data?.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Restriction keyword submit error:", error);

      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitLoading(false);
    }
  };
  // ======================================================
  // DELETE
  // ======================================================

  const openDeleteModal = (item) => {
    setSelectedKeyword(item);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    if (deleteLoading) return;

    setSelectedKeyword(null);
    setShowDeleteModal(false);
  };

  const handleDelete = async () => {
    if (!selectedKeyword?._id) return;

    try {
      setDeleteLoading(true);

      const res = await deleteRestrictionKeyword(selectedKeyword._id);

      if (res?.data?.success) {
        toast.success(
          res.data.message || "Restriction keyword deleted successfully",
        );

        closeDeleteModal();

        await fetchKeywords();
      } else {
        toast.error(
          res?.data?.message || "Failed to delete restriction keyword",
        );
      }
    } catch (error) {
      console.error("Delete restriction keyword error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to delete restriction keyword",
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // ======================================================
  // FORMAT DATE
  // ======================================================

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <div className="an-dashboard-container restriction-page">
      {/* Ambient Orbs */}

      <div className="ambient-orb orb-1"></div>
      <div className="ambient-orb orb-2"></div>
      <div className="ambient-orb orb-3"></div>

      {/* ==================================================
          HEADER
      ================================================== */}

      <header className="db-header animate-fade-in">
        <div className="db-header-left">
          <div className="header-title-container">
            <span className="enterprise-badge">
              <FaCrown className="crown-icon" />
              CONTENT SAFETY
            </span>

            <h1 className="wrapped-header-title">Restriction Keywords</h1>
          </div>

          <p className="header-subtitle">
            Manage restricted keywords and control prohibited content across the
            platform.
          </p>
        </div>

        <div className="db-header-right">
          <button className="btn-add-cosmic" onClick={openAddModal}>
            <FaPlus />
            Add Restriction Keyword
          </button>
        </div>
      </header>

      {/* ==================================================
          SUMMARY
      ================================================== */}

      <div className="commission-summary-row animate-fade-in-delayed">
        <div className="summary-pill-card">
          <span className="summary-label">Total Keywords</span>

          <span className="summary-value">{totalKeywords}</span>
        </div>

        <div className="summary-pill-card">
          <span className="summary-label">Active Keywords</span>

          <span className="summary-value paid">{activeKeywords}</span>
        </div>

        <div className="summary-pill-card">
          <span className="summary-label">Inactive Keywords</span>

          <span className="summary-value pending">{inactiveKeywords}</span>
        </div>
      </div>

      {/* ==================================================
          MAIN CARD
      ================================================== */}

      <div className="super-card main-table-card animate-fade-in-delayed">
        <div className="super-card-header">
          <div className="header-accent-title">
            <div className="title-vertical-bar gold"></div>

            <h2>Restriction Keyword Management</h2>
          </div>

          <span className="giant-badge gold">
            {filteredKeywords.length} Records
          </span>
        </div>

        {/* ==================================================
            SEARCH / FILTER
        ================================================== */}

        <div className="restriction-filter-row">
          <div className="restriction-search-box">
            <FaSearch />

            <input
              type="text"
              placeholder="Search keyword or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <button
                className="clear-search-btn"
                onClick={() => setSearch("")}
              >
                <FaTimes />
              </button>
            )}
          </div>

          <div className="restriction-filter-box">
            <label>Status</label>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>

              <option value="active">Active</option>

              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* ==================================================
            TABLE
        ================================================== */}

        <div className="table-responsive">
          <table className="khatarnak-table">
            <thead>
              <tr>
                <th>KEYWORD</th>

                <th>ACTION</th>

                <th>STATUS</th>

                <th>CREATED DATE</th>

                <th>LAST UPDATED</th>

                <th style={{ textAlign: "right" }}>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                      padding: "60px",
                    }}
                  >
                    <div className="gold-loader"></div>
                  </td>
                </tr>
              ) : currentKeywords.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-keyword-cell">
                    <div className="empty-keyword-state">
                      <div className="empty-keyword-icon">
                        <FaBan />
                      </div>

                      <h3>No Restriction Keywords Found</h3>

                      <p>
                        Try changing your search/filter or add a new restriction
                        keyword.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentKeywords.map((item) => {
                  const isActive = item.isActive === true;
                  return (
                    <tr key={item._id}>
                      {/* KEYWORD */}

                      <td>
                        <div className="keyword-table-info">
                          <div className="keyword-icon-box">
                            <FaBan />
                          </div>

                          <div>
                            <span className="main-name">
                              {item.keyword || "—"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Action */}

                      <td>
                        <span
                          className="desc-cell restriction-description"
                          title={item.action || ""}
                        >
                          {item.action || "No Action"}
                        </span>
                      </td>

                      {/* STATUS */}

                      <td>
                        <button
                          className={`status-pill ${
                            isActive ? "active" : "inactive"
                          } restriction-status-btn`}
                          title="Click to change status"
                        >
                          {isActive ? (
                            <>
                              <FaCheckCircle />
                              Active
                            </>
                          ) : (
                            <>
                              <FaTimesCircle />
                              Inactive
                            </>
                          )}
                        </button>
                      </td>

                      {/* CREATED */}

                      <td>
                        <span className="desc-cell">
                          {formatDate(item.createdAt)}
                        </span>
                      </td>

                      {/* UPDATED */}

                      <td>
                        <span className="desc-cell">
                          {formatDate(item.updatedAt)}
                        </span>
                      </td>

                      {/* ACTION */}

                      <td>
                        <div className="restriction-action-buttons">
                          <button
                            className="btn-pro btn-pro-edit"
                            onClick={() => openEditModal(item)}
                            title="Edit Keyword"
                          >
                            <FaEdit />
                          </button>

                          <button
                            className="btn-pro btn-pro-delete"
                            onClick={() => openDeleteModal(item)}
                            title="Delete Keyword"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ==================================================
            PAGINATION
        ================================================== */}

        <div className="table-pagination-footer">
          <div className="pagination-container">
            <button
              className="pagination-btn arrow-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <FaChevronLeft />
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
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
              ),
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

      {/* ==================================================
          ADD / EDIT MODAL
      ================================================== */}

      {showModal && (
        <div className="ultra-modal-backdrop" onClick={closeModal}>
          <div
            className="ultra-modal-box edit-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ultra-modal-header">
              <div className="modal-header-top">
                <div>
                  <h3>
                    {editingKeyword
                      ? "Edit Restriction Keyword"
                      : "Add Restriction Keyword"}
                  </h3>

                  <p className="modal-subtitle">
                    {editingKeyword
                      ? "Update restriction keyword details"
                      : "Add a keyword that should be restricted"}
                  </p>
                </div>

                <button className="modal-close-btn" onClick={closeModal}>
                  <FaTimes />
                </button>
              </div>

              <div className="modal-title-underline"></div>
            </div>

            <form onSubmit={handleSubmit} className="edit-form-body">
              {/* KEYWORD */}

              <div className="form-group">
                <label>Keyword</label>

                <input
                  type="text"
                  name="keyword"
                  placeholder="Enter restriction keyword"
                  value={formData.keyword}
                  onChange={handleChange}
                  maxLength={100}
                  disabled={!!editingKeyword}
                />
              </div>

              {/* ACTION */}

              <div className="form-group">
                <label>Action</label>

                <select
                  name="action"
                  value={formData.action}
                  onChange={handleChange}
                >
                  <option value="">Select Action</option>
                  <option value="mask">Mask</option>
                  <option value="block">Block</option>
                </select>
              </div>

              {/* STATUS — only shown when editing an existing keyword */}

              {editingKeyword && (
                <div className="form-group">
                  <label>Status</label>

                  <select
                    name="isActive"
                    value={formData.isActive ? "true" : "false"}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        isActive: e.target.value === "true",
                      }))
                    }
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              )}

              {/* BUTTONS */}

              <div className="modal-actions-row">
                <button
                  type="button"
                  className="btn-modal-pro cancel"
                  onClick={closeModal}
                  disabled={submitLoading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn-modal-pro save"
                  disabled={submitLoading}
                >
                  {submitLoading
                    ? "Saving..."
                    : editingKeyword
                      ? "Save Changes"
                      : "Add Keyword"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================
          DELETE CONFIRMATION MODAL
      ================================================== */}

      {showDeleteModal && selectedKeyword && (
        <div className="ultra-modal-backdrop" onClick={closeDeleteModal}>
          <div
            className="ultra-modal-box delete-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="delete-warning-icon">
              <FaTrash />
            </div>

            <h3>Delete Restriction Keyword?</h3>

            <p>
              Are you sure you want to delete{" "}
              <strong>"{selectedKeyword.keyword}"</strong>? This action cannot
              be undone.
            </p>

            <div className="modal-actions-row">
              <button
                className="btn-modal-pro cancel"
                onClick={closeDeleteModal}
                disabled={deleteLoading}
              >
                Cancel
              </button>

              <button
                className="btn-modal-pro delete-confirm-btn"
                onClick={handleDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting..." : "Delete Keyword"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={1000} />
    </div>
  );
}
