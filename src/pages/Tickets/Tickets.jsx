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
  FaPaperclip,
  FaPhoneAlt,
} from "react-icons/fa";
import { getAllTickets, updateTicket } from "../../api/Controller/ticket";

let DUMMY_TICKETS = [
  {
    _id: "6a71ac6ec1b9e59c484ea61f",
    raisedBy: {
      _id: "6a6b1845ed0084ecb7ba17e3",
      name: "Ab ",
      email: null,
      mobile: "+916395809794",
      fullName: "Ab ",
      profilePic: "https://res.cloudinary.com/dvumlrxml/image/upload/v1785746594/user_profiles/ql1hlpxwn4swgqhwwgdq.jpg",
    },
    raisedByModel: "User",
    subject: "Payment Issue",
    description: "My money was deducted but call was not connected.",
    category: "Payment Issue",
    priority: "High",
    status: "Pending",
    attachments: [
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500",
    ],
    adminResponse: null,
    resolvedAt: null,
    createdAt: "2026-08-04T09:10:06.794Z",
    updatedAt: "2026-08-04T09:10:06.794Z",
  },
  {
    _id: "6a71ac6ec1b9e59c484ea620",
    raisedBy: {
      _id: "6a6b1845ed0084ecb7ba17e4",
      name: "Pooja Sharma",
      email: "pooja@example.com",
      mobile: "+919876543210",
      fullName: "Pooja Sharma",
      profilePic: null,
    },
    raisedByModel: "User",
    subject: "Kundli Download Failed",
    description: "Unable to download my kundli pdf report.",
    category: "Technical Issue",
    priority: "Medium",
    status: "Resolved",
    attachments: [],
    adminResponse: "Issue resolved. PDF download re-enabled.",
    resolvedAt: "2026-08-04T11:00:00.000Z",
    createdAt: "2026-08-03T10:15:00.000Z",
    updatedAt: "2026-08-04T11:00:00.000Z",
  },
  {
    _id: "6a71ac6ec1b9e59c484ea621",
    raisedBy: {
      _id: "6a6b1845ed0084ecb7ba17e5",
      name: "Rohan Verma",
      email: "rohan@example.com",
      mobile: "+919123456789",
      fullName: "Rohan Verma",
      profilePic: null,
    },
    raisedByModel: "User",
    subject: "Astrologer Not Available",
    description: "Booked slot at 4 PM but astrologer was offline.",
    category: "Consultation Issue",
    priority: "High",
    status: "In Progress",
    attachments: [],
    adminResponse: "Checking with astrologer team.",
    resolvedAt: null,
    createdAt: "2026-08-04T08:00:00.000Z",
    updatedAt: "2026-08-04T08:30:00.000Z",
  },
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));



const deleteTicket = async (id) => {
  await delay(300);
  DUMMY_TICKETS = DUMMY_TICKETS.filter((t) => t._id !== id);
  return { success: true };
};



export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const [editForm, setEditForm] = useState({
    status: "",
    adminResponse: "",
  });

  const fetchTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllTickets();
      if (response && response.tickets) {
        setTickets(response.tickets);
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

  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const totalTickets = tickets.length;
    const openCount = tickets.filter(
      (t) => (t.status || "").toLowerCase() === "pending" || (t.status || "").toLowerCase() === "open"
    ).length;
    const resolvedCount = tickets.filter(
      (t) => (t.status || "").toLowerCase() === "resolved" || (t.status || "").toLowerCase() === "closed"
    ).length;
    const urgentCount = tickets.filter(
      (t) => (t.priority || "").toLowerCase() === "urgent" || (t.priority || "").toLowerCase() === "high"
    ).length;
    const newToday = tickets.filter((t) => {
      if (!t.createdAt) return false;
      return new Date(t.createdAt).toDateString() === today;
    }).length;

    return { totalTickets, openCount, resolvedCount, urgentCount, newToday };
  }, [tickets]);

  const handleView = (ticket) => {
    setSelectedTicket(ticket);
    setViewOpen(true);
  };

  const handleEditInit = (ticket) => {
    setSelectedTicket(ticket);
    setEditForm({

      status: ticket.status || "Pending",
      adminResponse: ticket.adminResponse || ticket.adminReply || "",
    });
    setEditOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      const payload = {

        status: editForm.status,
        adminResponse: editForm.adminResponse,
      };

      const response = await updateTicket(selectedTicket._id, payload);

      if (response.success) {
        setTickets((prev) =>
          prev.map((t) =>
            t._id === selectedTicket._id ? response.ticket : t
          )
        );

        setEditOpen(false);
        setSelectedTicket(null);
        showToast("success", response.message);
      }
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

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const subject = (ticket.subject || "").toLowerCase();
      const userObj = ticket.raisedBy || ticket.user || {};
      const userName = (ticket.raisedBy?.fullName || ticket.raisedBy?.name || "").toLowerCase();
      const email = (ticket.raisedBy?.email || ticket.raisedBy?.mobile || "").toLowerCase();
      const mobile = (userObj.mobile || "").toLowerCase();
      const category = (ticket.category || "").toLowerCase();
      const ticketId = (ticket._id || "").toLowerCase();
      const status = (ticket.status || "").toLowerCase();
      const priority = (ticket.priority || "").toLowerCase();
      const query = searchTerm.toLowerCase();

      const matchesSearch =
        subject.includes(query) ||
        userName.includes(query) ||
        email.includes(query) ||
        mobile.includes(query) ||
        category.includes(query) ||
        ticketId.includes(query);

      if (!matchesSearch) return false;

      if (filterType === "pending") return status === "pending" || status === "open";
      if (filterType === "progress") return status === "in progress" || status === "in-progress";
      if (filterType === "resolved") return status === "resolved" || status === "closed";
      if (filterType === "urgent") return priority === "urgent" || priority === "high";

      return true;
    });
  }, [tickets, searchTerm, filterType]);

  const totalPages = Math.max(1, Math.ceil(filteredTickets.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

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

  const getPriorityIcon = (priority = "") => {
    const p = priority.toLowerCase();
    if (p === "urgent") return <FaFire />;
    if (p === "high") return <FaExclamationCircle />;
    return <FaHourglassHalf />;
  };

  const getPriorityClass = (priority = "") => {
    const p = priority.toLowerCase();
    if (p === "urgent") return "priority-urgent";
    if (p === "high") return "priority-high";
    if (p === "medium") return "priority-medium";
    return "priority-low";
  };

  const getStatusClass = (status = "") => {
    const s = status.toLowerCase();
    if (s === "pending" || s === "open") return "role-open";
    if (s === "in progress" || s === "in-progress") return "role-progress";
    if (s === "resolved" || s === "closed") return "role-resolved";
    return "role-open";
  };

  return (
    <div className="an-ticket-container">
      {toast && (
        <div className={`cosmic-toast ${toast.type === "success" ? "toast-success" : "toast-error"}`}>
          {toast.type === "success" ? <FaCheckCircle /> : <FaTimes />}
          <span>{toast.message}</span>
        </div>
      )}

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
            <span className="trend-badge gold-pill">PENDING</span>
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

      <div className="pt-controls-bar animate-fade-in">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by subject, user, phone, email, category or ticket ID..."
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
            className={`filter-btn ${filterType === "pending" ? "active" : ""}`}
            onClick={() => { setFilterType("pending"); setCurrentPage(1); }}
          >
            Pending ({stats.openCount})
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

      {error && (
        <div className="table-error-box" style={{ marginBottom: "20px" }}>
          Error: {error}
        </div>
      )}

      <div className="pt-content-grid animate-fade-in-delayed">
        {loading ? (
          <div className="khatarnak-loader">
            <div className="glowing-spinner"></div>
            <p>Fetching Cosmic Support Tickets...</p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="table-error-box">No tickets match your criteria.</div>
        ) : (
          <div className="custom-table-container">
            <div className="table-responsive">
              <table className="cosmic-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Ticket ID & Subject</th>
                    <th>Raised By</th>
                    <th>Category</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Created Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTickets.map((ticket, index) => {
                    const userObj = ticket.raisedBy || ticket.user || {};
                    const userName = ticket.raisedBy?.fullName || ticket.raisedBy?.name || "Unknown User";
                    const userContact = ticket.raisedBy?.mobile || ticket.raisedBy?.email || "N/A";
                    const profilePic = ticket.raisedBy?.profilePic || null;
                    const hasAttachments = Array.isArray(ticket.attachments) && ticket.attachments.length > 0;

                    return (
                      <tr key={ticket._id}>   
                        <td>{indexOfFirstItem + index + 1}</td>
                        <td>

                          <div className="cell-ticket-info">
                            <span className="ticket-id-badge">#{ticket._id?.slice(-6).toUpperCase()}</span>
                            <div className="ticket-subject-title">
                              {ticket.subject || "No Subject"}
                              {hasAttachments && (
                                <span className="attachment-indicator" title="Has Attachments">
                                  <FaPaperclip />
                                </span>
                              )}
                            </div>
                            <p className="ticket-sub-desc">
                              {(ticket.description || "").slice(0, 50)}
                              {(ticket.description || "").length > 50 ? "..." : ""}
                            </p>
                          </div>
                        </td>

                        <td>
                          <div className="cell-user-info">
                            {userObj.profilePic ? (
                              <img src={userObj.profilePic} alt={userName} className="table-user-avatar" />
                            ) : (
                              <div className="table-avatar-placeholder">
                                <FaUserCircle />
                              </div>
                            )}
                            <div className="user-text-details">
                              <span className="user-name">{userName}</span>
                              <span className="user-contact">{userContact}</span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className="table-category-tag">
                            <FaTags style={{ marginRight: "4px" }} />
                            {ticket.category || "General"}
                          </span>
                        </td>

                        <td>
                          <span className={`priority-pill ${getPriorityClass(ticket.priority)}`}>
                            {getPriorityIcon(ticket.priority)} {(ticket.priority || "Medium").toUpperCase()}
                          </span>
                        </td>

                        <td>
                          <span className={`bold-role-tag ${getStatusClass(ticket.status)}`}>
                            {(ticket.status || "Pending").toUpperCase()}
                          </span>
                        </td>

                        <td>
                          <div className="cell-date-info">
                            <span><FaCalendarAlt /> {formatDate(ticket.createdAt)}</span>
                            <small><FaClock /> {formatTime(ticket.createdAt)}</small>
                          </div>
                        </td>

                        <td>
                          <div className="action-button-group">
                            <button
                              className="btn-square-icon"
                              onClick={() => handleView(ticket)}
                              title="View Details"
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
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

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
                  {(selectedTicket.raisedBy?.profilePic || selectedTicket.user?.profilePic) ? (
                    <img
                      src={selectedTicket.raisedBy?.profilePic || selectedTicket.user?.profilePic}
                      alt="User Profile"
                      className="giant-avatar-img"
                    />
                  ) : (
                    <div className="giant-avatar ticket-avatar" style={{ margin: "0 auto" }}>
                      <FaTicketAlt />
                    </div>
                  )}
                  <h3 style={{ marginTop: "10px" }}>{selectedTicket.subject || "No Subject"}</h3>
                  <p>
                    <FaUserCircle /> {selectedTicket.raisedBy?.fullName || selectedTicket.raisedBy?.name || selectedTicket.user?.fullName || "User"}
                  </p>
                  {selectedTicket.raisedBy?.mobile && (
                    <p><FaPhoneAlt /> {selectedTicket.raisedBy.mobile}</p>
                  )}
                  {selectedTicket.raisedBy?.email && (

                    <p>
                      <FaEnvelope /> {selectedTicket.raisedBy?.email || selectedTicket.raisedBy?.mobile || "N/A"}
                    </p>
                  )}
                </div>

                <div className="ticket-description-box">
                  <strong>Description:</strong>
                  <p style={{ margin: "6px 0 0 0" }}>{selectedTicket.description || "No description provided."}</p>
                </div>

                <div className="modal-details-grid">
                  <div className="detail-item"><strong>Ticket ID:</strong> {selectedTicket._id}</div>
                  <div className="detail-item"><strong>Category:</strong> {selectedTicket.category || "N/A"}</div>
                  <div className="detail-item"><strong>Priority:</strong> {(selectedTicket.priority || "Medium").toUpperCase()}</div>
                  <div className="detail-item"><strong>Status:</strong> {(selectedTicket.status || "Pending").toUpperCase()}</div>
                  <div className="detail-item"><strong>Created At:</strong> {formatDate(selectedTicket.createdAt)} {formatTime(selectedTicket.createdAt)}</div>
                  <div className="detail-item"><strong>Updated At:</strong> {formatDate(selectedTicket.updatedAt)} {formatTime(selectedTicket.updatedAt)}</div>
                  <div className="detail-item"><strong>Raised By:</strong> {selectedTicket.raisedBy?.fullName || selectedTicket.raisedBy?.name || "N/A"}</div>
                </div>

                {Array.isArray(selectedTicket.attachments) && selectedTicket.attachments.length > 0 && (
                  <div className="attachments-section">
                    <strong>Attachments:</strong>
                    <div className="attachment-list">
                      {selectedTicket.attachments.map((fileUrl, i) => (
                        <a key={i} href={fileUrl} target="_blank" rel="noopener noreferrer" className="attachment-item">
                          <FaPaperclip /> Attachment #{i + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {(selectedTicket.adminResponse || selectedTicket.adminReply) && (
                  <div className="admin-reply-box">
                    <strong>Admin Response:</strong>
                    <p>{selectedTicket.adminResponse || selectedTicket.adminReply}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

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
                  <label>Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div className="form-group" style={{ gridColumn: "span 2" }}>
                  <label>Admin Response</label>
                  <textarea
                    rows={4}
                    value={editForm.adminResponse}
                    onChange={(e) => setEditForm({ ...editForm, adminResponse: e.target.value })}
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