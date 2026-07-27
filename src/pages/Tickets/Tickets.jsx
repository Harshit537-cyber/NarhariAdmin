import React, { useState, useEffect, useMemo } from "react";
import "./Tickets.css";
import {
  FaEye,
  FaEdit,
  FaTrashAlt,
  FaSearch,
  FaCheckCircle,
  FaCrown,
  FaBolt,
  FaTicketAlt,
  FaArrowUp,
  FaChevronLeft,
  FaChevronRight,
  FaEnvelope,
  FaUserCircle,
  FaTimes,
  FaCalendarAlt,
  FaClock,
  FaExclamationCircle,
  FaHourglassHalf,
  FaFire,
  FaTags,
  FaCommentDots,
} from "react-icons/fa";

// ⚠️ DUMMY MODE — no backend/controller required.
// Jab aapka real backend/API ready ho jaye, is section ko hata kar
// upar wali line uncomment kar dein:
// import { getAllTickets, deleteTicket, updateTicket } from "../../api/Controller/ticketController";

let DUMMY_TICKETS = [
  {
    _id: "t1",
    ticketId: "TCK-1001",
    subject: "Unable to view my birth chart report",
    description:
      "I purchased the premium Kundli report but the PDF download button is not working on my account dashboard. Tried on both mobile and desktop.",
    category: "Technical",
    priority: "high",
    status: "open",
    assignedAgent: "Rahul Sharma",
    adminReply: "",
    user: { fullName: "Ananya Verma", email: "ananya.verma@example.com" },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "t2",
    ticketId: "TCK-1002",
    subject: "Wallet amount deducted twice for consultation",
    description:
      "I booked a 15-min call with an astrologer and my wallet was charged twice for the same session. Please refund the extra amount.",
    category: "Billing",
    priority: "urgent",
    status: "in-progress",
    assignedAgent: "Priya Nair",
    adminReply: "We are checking with the payments team, refund will be processed in 24 hrs.",
    user: { fullName: "Karan Mehta", email: "karan.mehta@example.com" },
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "t3",
    ticketId: "TCK-1003",
    subject: "Wrong date of birth shown in profile",
    description:
      "My date of birth is showing one day earlier than what I entered during signup, which is affecting my zodiac and chart calculations.",
    category: "Profile",
    priority: "medium",
    status: "open",
    assignedAgent: "",
    adminReply: "",
    user: { fullName: "Simran Kaur", email: "simran.kaur@example.com" },
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    _id: "t4",
    ticketId: "TCK-1004",
    subject: "Astrologer did not join scheduled call",
    description:
      "I had booked a slot at 6 PM but the astrologer never joined. I want this session rescheduled or refunded.",
    category: "Consultation",
    priority: "high",
    status: "resolved",
    assignedAgent: "Rahul Sharma",
    adminReply: "Session has been rescheduled for free and confirmation sent via email.",
    user: { fullName: "Vikram Rao", email: "vikram.rao@example.com" },
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    _id: "t5",
    ticketId: "TCK-1005",
    subject: "How to change my registered mobile number?",
    description:
      "I lost access to my old mobile number and want to update it in my account to receive OTPs properly.",
    category: "Account",
    priority: "low",
    status: "closed",
    assignedAgent: "Priya Nair",
    adminReply: "Mobile number updated successfully after verification.",
    user: { fullName: "Neha Joshi", email: "neha.joshi@example.com" },
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    _id: "t6",
    ticketId: "TCK-1006",
    subject: "App crashes on opening horoscope section",
    description:
      "Every time I tap on 'Daily Horoscope' the app crashes immediately. Using Android, latest app version.",
    category: "Technical",
    priority: "urgent",
    status: "in-progress",
    assignedAgent: "Rahul Sharma",
    adminReply: "Bug identified, fix is being rolled out in next app update.",
    user: { fullName: "Arjun Patel", email: "arjun.patel@example.com" },
    createdAt: new Date(Date.now() - 6 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 3600000).toISOString(),
  },
  {
    _id: "t7",
    ticketId: "TCK-1007",
    subject: "Refund not received for cancelled session",
    description:
      "I cancelled my consultation 2 days ago within the free cancellation window but haven't received my refund yet.",
    category: "Billing",
    priority: "medium",
    status: "open",
    assignedAgent: "",
    adminReply: "",
    user: { fullName: "Pooja Iyer", email: "pooja.iyer@example.com" },
    createdAt: new Date(Date.now() - 12 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 3600000).toISOString(),
  },
];

// Simulated network delay so loading states behave like a real API
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getAllTickets = async () => {
  await delay(500);
  return { success: true, data: DUMMY_TICKETS };
};

const deleteTicket = async (id) => {
  await delay(300);
  DUMMY_TICKETS = DUMMY_TICKETS.filter((t) => t._id !== id);
  return { success: true };
};

const updateTicket = async (id, payload) => {
  await delay(300);
  DUMMY_TICKETS = DUMMY_TICKETS.map((t) =>
    t._id === id ? { ...t, ...payload, updatedAt: new Date().toISOString() } : t
  );
  const updated = DUMMY_TICKETS.find((t) => t._id === id);
  return { success: true, data: updated };
};

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modal States
  const [selectedTicket, setSelectedTicket] = useState(null);
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
    priority: "",
    status: "",
    assignedAgent: "",
    adminReply: "",
  });

  const fetchTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllTickets();
      // Mapped according to response structure: { success: true, data: [...] }
      if (response && response.data) {
        setTickets(response.data);
      } else if (Array.isArray(response)) {
        setTickets(response);
      } else {
        setTickets([]);
      }
    } catch (err) {
      console.error("Error fetching tickets:", err);
      setError(err?.message || "Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // ================= 2. Dynamic Stats Calculation =================
  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const totalTickets = tickets.length;
    const openCount = tickets.filter((t) => t.status === "open").length;
    const resolvedCount = tickets.filter((t) => t.status === "resolved" || t.status === "closed").length;
    const urgentCount = tickets.filter((t) => t.priority === "urgent" || t.priority === "high").length;
    const newToday = tickets.filter((t) => {
      if (!t.createdAt) return false;
      return new Date(t.createdAt).toDateString() === today;
    }).length;

    return { totalTickets, openCount, resolvedCount, urgentCount, newToday };
  }, [tickets]);

  // ================= 3. Handlers =================
  const handleView = (ticket) => {
    setSelectedTicket(ticket);
    setViewOpen(true);
  };

  const handleEditInit = (ticket) => {
    setSelectedTicket(ticket);
    setEditForm({
      subject: ticket.subject || "",
      category: ticket.category || "",
      priority: ticket.priority || "medium",
      status: ticket.status || "open",
      assignedAgent: ticket.assignedAgent || "",
      adminReply: ticket.adminReply || "",
    });
    setEditOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        subject: editForm.subject,
        category: editForm.category,
        priority: editForm.priority,
        status: editForm.status,
        assignedAgent: editForm.assignedAgent,
        adminReply: editForm.adminReply,
      };

      const response = await updateTicket(selectedTicket._id, payload);

      setTickets((prev) =>
        prev.map((ticket) =>
          ticket._id === selectedTicket._id ? response.data : ticket
        )
      );

      setEditOpen(false);
      setSelectedTicket(null);
      showToast("success", "Ticket updated successfully!");
    } catch (err) {
      console.error(err);
      showToast("error", err?.message || "Failed to update ticket");
    }
  };

  const handleDeleteInit = (ticket) => {
    setSelectedTicket(ticket);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteTicket(selectedTicket._id);

      setTickets((prev) => prev.filter((t) => t._id !== selectedTicket._id));

      setDeleteOpen(false);
      setSelectedTicket(null);
      showToast("success", "Ticket deleted successfully!");
    } catch (err) {
      console.error("Delete failed:", err);
      showToast("error", err?.message || "Failed to delete ticket");
    }
  };

  // ================= 4. Search and Filtering Logic =================
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const subject = (ticket.subject || "").toLowerCase();
      const userName = (ticket.user?.fullName || ticket.user?.name || "").toLowerCase();
      const email = (ticket.user?.email || "").toLowerCase();
      const category = (ticket.category || "").toLowerCase();
      const ticketId = (ticket.ticketId || ticket._id || "").toLowerCase();
      const query = searchTerm.toLowerCase();

      const matchesSearch =
        subject.includes(query) ||
        userName.includes(query) ||
        email.includes(query) ||
        category.includes(query) ||
        ticketId.includes(query);

      if (!matchesSearch) return false;

      if (filterType === "open") return ticket.status === "open";
      if (filterType === "progress") return ticket.status === "in-progress";
      if (filterType === "resolved") return ticket.status === "resolved" || ticket.status === "closed";
      if (filterType === "urgent") return ticket.priority === "urgent" || ticket.priority === "high";

      return true;
    });
  }, [tickets, searchTerm, filterType]);

  // ================= 5. Pagination =================
  const totalPages = Math.max(1, Math.ceil(filteredTickets.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirstItem, indexOfLastItem);

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

  const getPriorityIcon = (priority) => {
    if (priority === "urgent") return <FaFire />;
    if (priority === "high") return <FaExclamationCircle />;
    return <FaHourglassHalf />;
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "open":
        return "OPEN";
      case "in-progress":
        return "IN PROGRESS";
      case "resolved":
        return "RESOLVED";
      case "closed":
        return "CLOSED";
      default:
        return (status || "OPEN").toUpperCase();
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "open":
        return "role-open";
      case "in-progress":
        return "role-progress";
      case "resolved":
      case "closed":
        return "role-resolved";
      default:
        return "role-open";
    }
  };

  return (
    <div className="an-ticket-container">
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
              <FaCrown className="crown-icon" /> COSMIC SUPPORT DESK
            </span>
            <h1 className="wrapped-header-title">Ticket Management</h1>
          </div>
          <p className="header-subtitle">
            Admin console for tracking, assigning, and resolving user support tickets.
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
              <FaTicketAlt />
            </div>
            <span className="trend-badge cyan-pill">
              <FaArrowUp /> +{stats.newToday} TODAY
            </span>
          </div>
          <div className="card-middle-data">
            <h2 className="giant-stat-number">{stats.totalTickets}</h2>
            <p className="giant-stat-label">Total Tickets</p>
          </div>
          <div className="card-bottom-accent">
            <div className="glow-bar cyan-bar"></div>
          </div>
        </div>

        <div className="khatarnak-card gold-theme animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="card-glass-shine"></div>
          <div className="card-top-bar">
            <div className="big-icon-box gold-glow">
              <FaHourglassHalf />
            </div>
            <span className="trend-badge gold-pill">OPEN</span>
          </div>
          <div className="card-middle-data">
            <h2 className="giant-stat-number">{stats.openCount}</h2>
            <p className="giant-stat-label">Awaiting Response</p>
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
            <p className="giant-stat-label">Closed / Resolved</p>
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
            <span className="trend-badge purple-pill">PRIORITY</span>
          </div>
          <div className="card-middle-data">
            <h2 className="giant-stat-number">{stats.urgentCount}</h2>
            <p className="giant-stat-label">Urgent / High</p>
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
            placeholder="Search by subject, user, email, category or ticket ID..."
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
            All ({tickets.length})
          </button>
          <button
            className={`filter-btn ${filterType === "open" ? "active" : ""}`}
            onClick={() => { setFilterType("open"); setCurrentPage(1); }}
          >
            Open ({stats.openCount})
          </button>
          <button
            className={`filter-btn ${filterType === "progress" ? "active" : ""}`}
            onClick={() => { setFilterType("progress"); setCurrentPage(1); }}
          >
            In Progress
          </button>
          <button
            className={`filter-btn ${filterType === "resolved" ? "active" : ""}`}
            onClick={() => { setFilterType("resolved"); setCurrentPage(1); }}
          >
            Resolved ({stats.resolvedCount})
          </button>
          <button
            className={`filter-btn ${filterType === "urgent" ? "active" : ""}`}
            onClick={() => { setFilterType("urgent"); setCurrentPage(1); }}
          >
            Urgent ({stats.urgentCount})
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
            <p>Fetching Cosmic Support Tickets...</p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="table-error-box">No tickets match your criteria.</div>
        ) : (
          <div className="ticket-cards-grid">
            {currentTickets.map((ticket) => {
              const userName = ticket.user?.fullName || ticket.user?.name || "Unknown User";

              return (
                <div className="khatarnak-card ticket-card-item" key={ticket._id}>
                  <div className="card-glass-shine"></div>

                  <div className="ticket-card-header">
                    <span className={`bold-role-tag ${getStatusClass(ticket.status)}`}>
                      {getStatusLabel(ticket.status)}
                    </span>

                    <div className="badges-group">
                      <span className={`priority-pill priority-${ticket.priority || "medium"}`}>
                        {getPriorityIcon(ticket.priority)} {(ticket.priority || "medium").toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="ticket-card-body">
                    <p className="ticket-id-tag">#{ticket.ticketId || ticket._id?.slice(-6)}</p>
                    <h3 className="ticket-subject">{ticket.subject || "No Subject"}</h3>
                    <p className="ticket-description">
                      {(ticket.description || "No description provided.").slice(0, 90)}
                      {(ticket.description || "").length > 90 ? "..." : ""}
                    </p>

                    <div className="ticket-meta-row">
                      {ticket.category && (
                        <span className="meta-item">
                          <FaTags /> {ticket.category}
                        </span>
                      )}
                      <span className="meta-item">
                        <FaUserCircle /> {userName}
                      </span>
                    </div>

                    <div className="ticket-meta-row">
                      <span className="meta-item">
                        <FaCalendarAlt /> {formatDate(ticket.createdAt)}
                      </span>
                      <span className="meta-item">
                        <FaClock /> {formatTime(ticket.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="ticket-card-footer">
                    <div className="rate-info">
                      <span className="rate-amount replies-amount">
                        <FaCommentDots style={{ fontSize: "14px", marginRight: "6px" }} />
                        {ticket.assignedAgent || "Unassigned"}
                      </span>
                      <span className="rate-unit">agent</span>
                    </div>

                    <div className="card-right-controls">
                      <div className="action-button-group">
                        <button
                          className="btn-square-icon"
                          onClick={() => handleView(ticket)}
                          title="View Ticket"
                        >
                          <FaEye />
                        </button>
                        <button
                          className="btn-square-icon"
                          onClick={() => handleEditInit(ticket)}
                          title="Edit / Respond"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn-square-icon btn-delete-accent"
                          onClick={() => handleDeleteInit(ticket)}
                          title="Delete Ticket"
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
      {!loading && filteredTickets.length > 0 && (
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

      {/* View Ticket Detail Modal */}
      {viewOpen && selectedTicket && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-content">
            <div className="modal-header">
              <h2>Ticket Details</h2>
              <button className="close-btn" onClick={() => setViewOpen(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="profile-detail-card">
                <div className="modal-avatar-section" style={{ textAlign: "center", marginBottom: "16px" }}>
                  <div className="giant-avatar ticket-avatar" style={{ margin: "0 auto" }}>
                    <FaTicketAlt />
                  </div>
                  <h3 style={{ marginTop: "10px" }}>{selectedTicket.subject || "No Subject"}</h3>
                  <p>
                    <FaEnvelope /> {selectedTicket.user?.email || "No Email Mapped"}
                  </p>
                </div>

                <div className="ticket-description-box">
                  {selectedTicket.description || "No description provided."}
                </div>

                <div className="modal-details-grid">
                  <div className="detail-item"><strong>Ticket ID:</strong> {selectedTicket.ticketId || selectedTicket._id}</div>
                  <div className="detail-item"><strong>Raised By:</strong> {selectedTicket.user?.fullName || selectedTicket.user?.name || "N/A"}</div>
                  <div className="detail-item"><strong>Category:</strong> {selectedTicket.category || "N/A"}</div>
                  <div className="detail-item"><strong>Priority:</strong> {(selectedTicket.priority || "medium").toUpperCase()}</div>
                  <div className="detail-item"><strong>Status:</strong> {getStatusLabel(selectedTicket.status)}</div>
                  <div className="detail-item"><strong>Assigned Agent:</strong> {selectedTicket.assignedAgent || "Unassigned"}</div>
                  <div className="detail-item"><strong>Created At:</strong> {formatDate(selectedTicket.createdAt)}</div>
                  <div className="detail-item"><strong>Updated At:</strong> {formatDate(selectedTicket.updatedAt)}</div>
                </div>

                {selectedTicket.adminReply && (
                  <div className="admin-reply-box">
                    <strong>Admin Reply:</strong>
                    <p>{selectedTicket.adminReply}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editOpen && selectedTicket && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-content">
            <div className="modal-header">
              <h2>Manage Ticket</h2>
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
                  <label>Assigned Agent</label>
                  <input
                    type="text"
                    value={editForm.assignedAgent}
                    onChange={(e) => setEditForm({ ...editForm, assignedAgent: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Priority</label>
                  <select
                    value={editForm.priority}
                    onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div className="form-group" style={{ gridColumn: "span 2" }}>
                  <label>Admin Reply</label>
                  <textarea
                    rows={4}
                    value={editForm.adminReply}
                    onChange={(e) => setEditForm({ ...editForm, adminReply: e.target.value })}
                    placeholder="Write a response to the user..."
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
      {deleteOpen && selectedTicket && (
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
                Are you sure you want to remove ticket{" "}
                <strong>"{selectedTicket.subject || "this ticket"}"</strong> from the database?
              </p>
              <p className="subtext">This action is permanent.</p>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setDeleteOpen(false)}>
                Cancel
              </button>
              <button className="btn-danger-confirm" onClick={confirmDelete}>
                Delete Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}