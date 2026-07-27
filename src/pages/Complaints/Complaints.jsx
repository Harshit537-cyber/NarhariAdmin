import React, { useState, useEffect, useMemo } from "react";
import "./Complaints.css";
import {
  FaEye,
  FaEdit,
  FaTrashAlt,
  FaSearch,
  FaCheckCircle,
  FaCrown,
  FaBolt,
  FaExclamationTriangle,
  FaArrowUp,
  FaChevronLeft,
  FaChevronRight,
  FaEnvelope,
  FaUserCircle,
  FaTimes,
  FaCalendarAlt,
  FaClock,
  FaFire,
  FaTags,
  FaBan,
  FaUserShield,
  FaGavel,
} from "react-icons/fa";

// ⚠️ DUMMY MODE — no backend/controller required right now.
// Jab real backend/API ready ho jaye, is dummy block ko hata kar neeche wali
// line uncomment kar dein aur apne project structure ke hisab se path set karein:
// import { getAllComplaints, deleteComplaint, updateComplaint } from "../../api/Controller/complaintController";

let DUMMY_COMPLAINTS = [
  {
    _id: "c1",
    complaintId: "CMP-2001",
    subject: "Astrologer was rude during the call",
    description:
      "The astrologer I consulted was dismissive and cut the call short without answering my questions properly. I want this reported and my session refunded.",
    category: "Astrologer Behavior",
    against: "Astro. Rakesh Joshi",
    severity: "high",
    status: "pending",
    resolutionNote: "",
    user: { fullName: "Meera Kapoor", email: "meera.kapoor@example.com" },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "c2",
    complaintId: "CMP-2002",
    subject: "Money deducted but consultation never started",
    description:
      "I was charged ₹499 for a live session but the call never connected. Support has not responded to my earlier messages either.",
    category: "Payment Issue",
    against: "Platform / Billing",
    severity: "critical",
    status: "under-review",
    resolutionNote: "Escalated to finance team for verification of the transaction logs.",
    user: { fullName: "Rohit Bansal", email: "rohit.bansal@example.com" },
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "c3",
    complaintId: "CMP-2003",
    subject: "Inaccurate and generic predictions given repeatedly",
    description:
      "The predictions given felt copy-pasted and were not specific to my birth chart at all. Feels like a waste of a paid consultation.",
    category: "Service Quality",
    against: "Astro. Sunita Devi",
    severity: "medium",
    status: "pending",
    resolutionNote: "",
    user: { fullName: "Divya Menon", email: "divya.menon@example.com" },
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    _id: "c4",
    complaintId: "CMP-2004",
    subject: "Inappropriate personal questions asked during chat",
    description:
      "The astrologer asked unrelated personal questions that made me uncomfortable during a text consultation. Please review the chat transcript.",
    category: "Astrologer Behavior",
    against: "Astro. Manoj Tiwari",
    severity: "critical",
    status: "under-review",
    resolutionNote: "Chat transcript pulled for review by trust & safety team.",
    user: { fullName: "Sneha Reddy", email: "sneha.reddy@example.com" },
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    _id: "c5",
    complaintId: "CMP-2005",
    subject: "Refund request rejected without valid reason",
    description:
      "I requested a refund within the eligible window but it was rejected. Support only replied with a generic template message.",
    category: "Refund",
    against: "Support Team",
    severity: "medium",
    status: "resolved",
    resolutionNote: "Refund approved after manual review; ₹350 credited to wallet.",
    user: { fullName: "Aditya Kulkarni", email: "aditya.kulkarni@example.com" },
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    _id: "c6",
    complaintId: "CMP-2006",
    subject: "Astrologer shared personal contact number",
    description:
      "During the call the astrologer asked me to contact them directly outside the app for future sessions, which goes against platform policy.",
    category: "Policy Violation",
    against: "Astro. Rakesh Joshi",
    severity: "high",
    status: "pending",
    resolutionNote: "",
    user: { fullName: "Ishaan Malhotra", email: "ishaan.malhotra@example.com" },
    createdAt: new Date(Date.now() - 6 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 3600000).toISOString(),
  },
  {
    _id: "c7",
    complaintId: "CMP-2007",
    subject: "Complaint against previous complaint handling",
    description:
      "I feel my earlier complaint was closed too quickly without properly investigating my concern. Requesting it be reopened.",
    category: "Support Process",
    against: "Support Team",
    severity: "low",
    status: "rejected",
    resolutionNote: "Original resolution stands after secondary review; case closed.",
    user: { fullName: "Kavita Shah", email: "kavita.shah@example.com" },
    createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getAllComplaints = async () => {
  await delay(500);
  return { success: true, data: DUMMY_COMPLAINTS };
};

const deleteComplaint = async (id) => {
  await delay(300);
  DUMMY_COMPLAINTS = DUMMY_COMPLAINTS.filter((c) => c._id !== id);
  return { success: true };
};

const updateComplaint = async (id, payload) => {
  await delay(300);
  DUMMY_COMPLAINTS = DUMMY_COMPLAINTS.map((c) =>
    c._id === id ? { ...c, ...payload, updatedAt: new Date().toISOString() } : c
  );
  const updated = DUMMY_COMPLAINTS.find((c) => c._id === id);
  return { success: true, data: updated };
};

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modal States
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  // Form states for edit modal mapped with backend attributes
  const [editForm, setEditForm] = useState({
    subject: "",
    category: "",
    against: "",
    severity: "",
    status: "",
    resolutionNote: "",
  });

  const fetchComplaints = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllComplaints();
      // Mapped according to response structure: { success: true, data: [...] }
      if (response && response.data) {
        setComplaints(response.data);
      } else if (Array.isArray(response)) {
        setComplaints(response);
      } else {
        setComplaints([]);
      }
    } catch (err) {
      console.error("Error fetching complaints:", err);
      setError(err?.message || "Failed to fetch complaints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // ================= 2. Dynamic Stats Calculation =================
  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const totalComplaints = complaints.length;
    const pendingCount = complaints.filter((c) => c.status === "pending").length;
    const reviewCount = complaints.filter((c) => c.status === "under-review").length;
    const resolvedCount = complaints.filter((c) => c.status === "resolved").length;
    const criticalCount = complaints.filter((c) => c.severity === "critical" || c.severity === "high").length;
    const newToday = complaints.filter((c) => {
      if (!c.createdAt) return false;
      return new Date(c.createdAt).toDateString() === today;
    }).length;

    return { totalComplaints, pendingCount, reviewCount, resolvedCount, criticalCount, newToday };
  }, [complaints]);

  // ================= 3. Handlers =================
  const handleView = (complaint) => {
    setSelectedComplaint(complaint);
    setViewOpen(true);
  };

  const handleEditInit = (complaint) => {
    setSelectedComplaint(complaint);
    setEditForm({
      subject: complaint.subject || "",
      category: complaint.category || "",
      against: complaint.against || "",
      severity: complaint.severity || "medium",
      status: complaint.status || "pending",
      resolutionNote: complaint.resolutionNote || "",
    });
    setEditOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        subject: editForm.subject,
        category: editForm.category,
        against: editForm.against,
        severity: editForm.severity,
        status: editForm.status,
        resolutionNote: editForm.resolutionNote,
      };

      const response = await updateComplaint(selectedComplaint._id, payload);

      setComplaints((prev) =>
        prev.map((complaint) =>
          complaint._id === selectedComplaint._id ? response.data : complaint
        )
      );

      setEditOpen(false);
      setSelectedComplaint(null);
      showToast("success", "Complaint updated successfully!");
    } catch (err) {
      console.error(err);
      showToast("error", err?.message || "Failed to update complaint");
    }
  };

  const handleDeleteInit = (complaint) => {
    setSelectedComplaint(complaint);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteComplaint(selectedComplaint._id);

      setComplaints((prev) => prev.filter((c) => c._id !== selectedComplaint._id));

      setDeleteOpen(false);
      setSelectedComplaint(null);
      showToast("success", "Complaint deleted successfully!");
    } catch (err) {
      console.error("Delete failed:", err);
      showToast("error", err?.message || "Failed to delete complaint");
    }
  };

  // ================= 4. Search and Filtering Logic =================
  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const subject = (complaint.subject || "").toLowerCase();
      const userName = (complaint.user?.fullName || complaint.user?.name || "").toLowerCase();
      const email = (complaint.user?.email || "").toLowerCase();
      const category = (complaint.category || "").toLowerCase();
      const against = (complaint.against || "").toLowerCase();
      const complaintId = (complaint.complaintId || complaint._id || "").toLowerCase();
      const query = searchTerm.toLowerCase();

      const matchesSearch =
        subject.includes(query) ||
        userName.includes(query) ||
        email.includes(query) ||
        category.includes(query) ||
        against.includes(query) ||
        complaintId.includes(query);

      if (!matchesSearch) return false;

      if (filterType === "pending") return complaint.status === "pending";
      if (filterType === "review") return complaint.status === "under-review";
      if (filterType === "resolved") return complaint.status === "resolved";
      if (filterType === "rejected") return complaint.status === "rejected";
      if (filterType === "critical") return complaint.severity === "critical" || complaint.severity === "high";

      return true;
    });
  }, [complaints, searchTerm, filterType]);

  // ================= 5. Pagination =================
  const totalPages = Math.max(1, Math.ceil(filteredComplaints.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentComplaints = filteredComplaints.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Helpers
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  const getSeverityIcon = (severity) => {
    if (severity === "critical") return <FaFire />;
    if (severity === "high") return <FaExclamationTriangle />;
    return <FaGavel />;
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "PENDING";
      case "under-review":
        return "UNDER REVIEW";
      case "resolved":
        return "RESOLVED";
      case "rejected":
        return "REJECTED";
      default:
        return (status || "PENDING").toUpperCase();
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "role-pending";
      case "under-review":
        return "role-review";
      case "resolved":
        return "role-resolved";
      case "rejected":
        return "role-rejected";
      default:
        return "role-pending";
    }
  };

  return (
    <div className="an-complaint-container">
      {toast && (
        <div className={`cosmic-toast ${toast.type === "success" ? "toast-success" : "toast-error"}`}>
          {toast.type === "success" ? <FaCheckCircle /> : <FaTimes />}
          <span>{toast.message}</span>
        </div>
      )}
      {/* Background Orbs */}
      <div className="ambient-orb orb-1"></div>
      <div className="ambient-orb orb-2"></div>
      <div className="ambient-orb orb-3"></div>

      <header className="db-header animate-fade-in">
        <div className="db-header-left">
          <div className="header-title-container">
            <span className="enterprise-badge">
              <FaCrown className="crown-icon" /> COSMIC GRIEVANCE CELL
            </span>
            <h1 className="wrapped-header-title">Complaint Management</h1>
          </div>
          <p className="header-subtitle">
            Admin console for reviewing, investigating, and resolving user complaints.
          </p>
        </div>

        <div className="db-header-right">
          <div className="system-status-card">
            <div className="pulse-ring"></div>
            <span className="status-text">
              <FaBolt /> CORE ONLINE
            </span>
          </div>
        </div>
      </header>

      {/* Metrics Grid */}
      <div className="db-metrics-grid">
        <div className="khatarnak-card cyan-theme animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div className="card-glass-shine"></div>
          <div className="card-top-bar">
            <div className="big-icon-box cyan-glow">
              <FaExclamationTriangle />
            </div>
            <span className="trend-badge cyan-pill">
              <FaArrowUp /> +{stats.newToday} TODAY
            </span>
          </div>
          <div className="card-middle-data">
            <h2 className="giant-stat-number">{stats.totalComplaints}</h2>
            <p className="giant-stat-label">Total Complaints</p>
          </div>
          <div className="card-bottom-accent">
            <div className="glow-bar cyan-bar"></div>
          </div>
        </div>

        <div className="khatarnak-card gold-theme animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="card-glass-shine"></div>
          <div className="card-top-bar">
            <div className="big-icon-box gold-glow">
              <FaBan />
            </div>
            <span className="trend-badge gold-pill">PENDING</span>
          </div>
          <div className="card-middle-data">
            <h2 className="giant-stat-number">{stats.pendingCount}</h2>
            <p className="giant-stat-label">Awaiting Action</p>
          </div>
          <div className="card-bottom-accent">
            <div className="glow-bar gold-bar"></div>
          </div>
        </div>

        <div className="khatarnak-card emerald-theme animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <div className="card-glass-shine"></div>
          <div className="card-top-bar">
            <div className="big-icon-box emerald-glow">
              <FaCheckCircle />
            </div>
            <span className="trend-badge emerald-pill">RESOLVED</span>
          </div>
          <div className="card-middle-data">
            <h2 className="giant-stat-number">{stats.resolvedCount}</h2>
            <p className="giant-stat-label">Closed Cases</p>
          </div>
          <div className="card-bottom-accent">
            <div className="glow-bar emerald-bar"></div>
          </div>
        </div>

        <div className="khatarnak-card purple-theme animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <div className="card-glass-shine"></div>
          <div className="card-top-bar">
            <div className="big-icon-box purple-glow">
              <FaFire />
            </div>
            <span className="trend-badge purple-pill">SEVERITY</span>
          </div>
          <div className="card-middle-data">
            <h2 className="giant-stat-number">{stats.criticalCount}</h2>
            <p className="giant-stat-label">Critical / High</p>
          </div>
          <div className="card-bottom-accent">
            <div className="glow-bar purple-bar"></div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="pt-controls-bar animate-fade-in">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by subject, user, email, category or against..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="filter-tabs">
          <button
            className={`filter-btn ${filterType === "all" ? "active" : ""}`}
            onClick={() => { setFilterType("all"); setCurrentPage(1); }}
          >
            All ({complaints.length})
          </button>
          <button
            className={`filter-btn ${filterType === "pending" ? "active" : ""}`}
            onClick={() => { setFilterType("pending"); setCurrentPage(1); }}
          >
            Pending ({stats.pendingCount})
          </button>
          <button
            className={`filter-btn ${filterType === "review" ? "active" : ""}`}
            onClick={() => { setFilterType("review"); setCurrentPage(1); }}
          >
            Under Review ({stats.reviewCount})
          </button>
          <button
            className={`filter-btn ${filterType === "resolved" ? "active" : ""}`}
            onClick={() => { setFilterType("resolved"); setCurrentPage(1); }}
          >
            Resolved ({stats.resolvedCount})
          </button>
          <button
            className={`filter-btn ${filterType === "rejected" ? "active" : ""}`}
            onClick={() => { setFilterType("rejected"); setCurrentPage(1); }}
          >
            Rejected
          </button>
          <button
            className={`filter-btn ${filterType === "critical" ? "active" : ""}`}
            onClick={() => { setFilterType("critical"); setCurrentPage(1); }}
          >
            Critical ({stats.criticalCount})
          </button>
        </div>
      </div>

      {/* Error Message Display */}
      {error && (
        <div className="table-error-box" style={{ marginBottom: "20px" }}>
          Error: {error}
        </div>
      )}

      {/* Main Grid content */}
      <div className="pt-content-grid animate-fade-in-delayed">
        {loading ? (
          <div className="khatarnak-loader">
            <div className="glowing-spinner"></div>
            <p>Fetching Cosmic Complaint Records...</p>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="table-error-box">No complaints match your criteria.</div>
        ) : (
          <div className="complaint-cards-grid">
            {currentComplaints.map((complaint) => {
              const userName = complaint.user?.fullName || complaint.user?.name || "Unknown User";

              return (
                <div className="khatarnak-card complaint-card-item" key={complaint._id}>
                  <div className="card-glass-shine"></div>

                  <div className="complaint-card-header">
                    <span className={`bold-role-tag ${getStatusClass(complaint.status)}`}>
                      {getStatusLabel(complaint.status)}
                    </span>

                    <div className="badges-group">
                      <span className={`severity-pill severity-${complaint.severity || "medium"}`}>
                        {getSeverityIcon(complaint.severity)} {(complaint.severity || "medium").toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="complaint-card-body">
                    <p className="complaint-id-tag">#{complaint.complaintId || complaint._id?.slice(-6)}</p>
                    <h3 className="complaint-subject">{complaint.subject || "No Subject"}</h3>
                    <p className="complaint-description">
                      {(complaint.description || "No description provided.").slice(0, 90)}
                      {(complaint.description || "").length > 90 ? "..." : ""}
                    </p>

                    <div className="complaint-meta-row">
                      {complaint.category && (
                        <span className="meta-item">
                          <FaTags /> {complaint.category}
                        </span>
                      )}
                      <span className="meta-item">
                        <FaUserCircle /> {userName}
                      </span>
                    </div>

                    <div className="complaint-meta-row">
                      <span className="meta-item">
                        <FaUserShield /> {complaint.against || "N/A"}
                      </span>
                    </div>

                    <div className="complaint-meta-row">
                      <span className="meta-item">
                        <FaCalendarAlt /> {formatDate(complaint.createdAt)}
                      </span>
                      <span className="meta-item">
                        <FaClock /> {formatTime(complaint.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="complaint-card-footer">
                    <div className="card-right-controls full-width">
                      <div className="action-button-group">
                        <button
                          className="btn-square-icon"
                          onClick={() => handleView(complaint)}
                          title="View Complaint"
                        >
                          <FaEye />
                        </button>
                        <button
                          className="btn-square-icon"
                          onClick={() => handleEditInit(complaint)}
                          title="Investigate / Resolve"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn-square-icon btn-delete-accent"
                          onClick={() => handleDeleteInit(complaint)}
                          title="Delete Complaint"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      {!loading && filteredComplaints.length > 0 && (
        <div className="table-pagination-footer">
          <div className="pagination-container">
            <button
              className="pagination-btn arrow-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <FaChevronLeft />
            </button>

            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
              <button
                key={page}
                className={`pagination-btn ${currentPage === page ? "active" : ""}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}

            <button
              className="pagination-btn arrow-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      )}

      {/* View Complaint Detail Modal */}
      {viewOpen && selectedComplaint && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-content">
            <div className="modal-header">
              <h2>Complaint Details</h2>
              <button className="close-btn" onClick={() => setViewOpen(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="profile-detail-card">
                <div className="modal-avatar-section" style={{ textAlign: "center", marginBottom: "16px" }}>
                  <div className="giant-avatar complaint-avatar" style={{ margin: "0 auto" }}>
                    <FaExclamationTriangle />
                  </div>
                  <h3 style={{ marginTop: "10px" }}>{selectedComplaint.subject || "No Subject"}</h3>
                  <p>
                    <FaEnvelope /> {selectedComplaint.user?.email || "No Email Mapped"}
                  </p>
                </div>

                <div className="complaint-description-box">
                  {selectedComplaint.description || "No description provided."}
                </div>

                <div className="modal-details-grid">
                  <div className="detail-item"><strong>Complaint ID:</strong> {selectedComplaint.complaintId || selectedComplaint._id}</div>
                  <div className="detail-item"><strong>Filed By:</strong> {selectedComplaint.user?.fullName || selectedComplaint.user?.name || "N/A"}</div>
                  <div className="detail-item"><strong>Category:</strong> {selectedComplaint.category || "N/A"}</div>
                  <div className="detail-item"><strong>Against:</strong> {selectedComplaint.against || "N/A"}</div>
                  <div className="detail-item"><strong>Severity:</strong> {(selectedComplaint.severity || "medium").toUpperCase()}</div>
                  <div className="detail-item"><strong>Status:</strong> {getStatusLabel(selectedComplaint.status)}</div>
                  <div className="detail-item"><strong>Filed On:</strong> {formatDate(selectedComplaint.createdAt)}</div>
                  <div className="detail-item"><strong>Last Updated:</strong> {formatDate(selectedComplaint.updatedAt)}</div>
                </div>

                {selectedComplaint.resolutionNote && (
                  <div className="resolution-note-box">
                    <strong>Resolution Note:</strong>
                    <p>{selectedComplaint.resolutionNote}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editOpen && selectedComplaint && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-content">
            <div className="modal-header">
              <h2>Investigate Complaint</h2>
              <button className="close-btn" onClick={() => setEditOpen(false)}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSaveEdit}>
              <div
                className="modal-body"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "16px",
                }}
              >
                <div className="form-group" style={{ gridColumn: "span 2" }}>
                  <label>Subject</label>
                  <input
                    type="text"
                    value={editForm.subject}
                    onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <input
                    type="text"
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Against (Astrologer / Team)</label>
                  <input
                    type="text"
                    value={editForm.against}
                    onChange={(e) => setEditForm({ ...editForm, against: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Severity</label>
                  <select
                    value={editForm.severity}
                    onChange={(e) => setEditForm({ ...editForm, severity: e.target.value })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  >
                    <option value="pending">Pending</option>
                    <option value="under-review">Under Review</option>
                    <option value="resolved">Resolved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div className="form-group" style={{ gridColumn: "span 2" }}>
                  <label>Resolution Note</label>
                  <textarea
                    rows={4}
                    value={editForm.resolutionNote}
                    onChange={(e) => setEditForm({ ...editForm, resolutionNote: e.target.value })}
                    placeholder="Write investigation findings or resolution details..."
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setEditOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteOpen && selectedComplaint && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-content confirm-danger">
            <div className="modal-header">
              <h2>Confirm Deletion</h2>
              <button className="close-btn" onClick={() => setDeleteOpen(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body text-center">
              <p>
                Are you sure you want to remove complaint{" "}
                <strong>"{selectedComplaint.subject || "this complaint"}"</strong> from the database?
              </p>
              <p className="subtext">This action is permanent.</p>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setDeleteOpen(false)}>
                Cancel
              </button>
              <button className="btn-danger-confirm" onClick={confirmDelete}>
                Delete Complaint
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}