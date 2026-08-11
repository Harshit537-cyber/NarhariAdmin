import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./Dashboard.css";
import {
  getAllUsers,
  getDashboardStats,
  getRecentUsers,
  deleteUser,
} from "../../api/Controller/authController";
import { toast } from "react-toastify";
import UserViewModal from "../../components/UserModule/UserViewModal";
import {
  FaEye,
  FaUsers,
  FaUserShield,
  FaHandshake,
  FaUserPlus,
  FaTrashAlt,
  FaArrowUp,
  FaCrown,
  FaBolt,
  FaCheckCircle,
  FaUserCheck,
  FaUserTimes,
  FaClock,
} from "react-icons/fa";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewUser, setViewUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 5;
  const [modalTitle, setModalTitle] = useState("");
  const [pendingApprovals, setPendingApprovals] = useState([
  { _id: "1", name: "Rahul Sharma", email: "rahul.sharma@gmail.com", role: "partner" },
  { _id: "2", name: "Priya Verma", email: "priya.verma@gmail.com", role: "user" },
  { _id: "3", name: "Amit Singh", email: "amit.singh@gmail.com", role: "partner" },
  { _id: "4", name: "Neha Gupta", email: "neha.gupta@gmail.com", role: "admin" },
]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPartners: 0,
    totalAdmins: 0,
    newUsersToday: 0,
    newPartnersToday: 0,
  });

  const [recentUsers, setRecentUsers] = useState([]);

useEffect(() => {
  fetchUsers();
  fetchStats();
  fetchRecentUsers();
}, []);

  const fetchStats = async () => {
    try {
      const res = await getDashboardStats();
      setStats(res.data || {});
    } catch (err) {
      console.error("Failed to load stats:", err.message || err);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsers();
      setUsers(res.data || []);
    } catch (err) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentUsers = async () => {
    try {
      const res = await getRecentUsers();
      setRecentUsers(res.data || []);
    } catch (err) {
      console.error("Failed to load recent users:", err);
    }
  };


const handleApprove = (userId) => {
  toast.success("Profile approved successfully");
  setPendingApprovals((prev) => prev.filter((u) => u._id !== userId));
};

const handleReject = (userId) => {
  toast.error("Profile rejected");
  setPendingApprovals((prev) => prev.filter((u) => u._id !== userId));
};
  const confirmDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setViewUser(null);
  };

  const handleUserView = (user) => {
    setViewUser(user);
    setModalTitle("User Details");
    setShowViewModal(true);
  };

  const handleRecentUserView = (user) => {
    setViewUser(user);
    setModalTitle("Recent User Details");
    setShowViewModal(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      const res = await deleteUser(selectedUser._id);
      toast.success(res.message || "User deleted successfully");

      setUsers((prevUsers) =>
        prevUsers.filter((u) => u._id !== selectedUser._id)
      );

      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error(err.message || "Something went wrong");
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "?");
const totalPages = Math.max(1, Math.ceil(users.length / itemsPerPage));

const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;

const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);

const handlePageChange = (pageNumber) => {
  if (pageNumber >= 1 && pageNumber <= totalPages) {
    setCurrentPage(pageNumber);
  }
};
  return (
    <div className="an-dashboard-container">
      {/* Background Ambient Orbs */}
      <div className="ambient-orb orb-1"></div>
      <div className="ambient-orb orb-2"></div>
      <div className="ambient-orb orb-3"></div>

      {/* Header Section with Wrapped Title & Background Container */}
      <header className="db-header animate-fade-in">
        <div className="db-header-left">
          <div className="header-title-container">
            <span className="enterprise-badge">
              <FaCrown className="crown-icon" /> COSMIC ENTERPRISE HUB
            </span>
            <h1 className="wrapped-header-title">Cosmic Admin Hub</h1>
          </div>
          <p className="header-subtitle">
            Real-time management, celestial telemetry & active guides network.
          </p>
        </div>

        <div className="db-header-right">
          <div className="system-status-card">
            <div className="pulse-ring"></div>
            <span className="status-text"><FaBolt /> SYSTEM LIVE</span>
          </div>
        </div>
      </header>

      {/* Extreme Metric Cards Grid */}
      <div className="db-metrics-grid">
        {/* Card 1: Total Users */}
        <div className="khatarnak-card cyan-theme animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div className="card-glass-shine"></div>
          <div className="card-top-bar">
            <div className="big-icon-box cyan-glow">
              <FaUsers />
            </div>
            <span className="trend-badge cyan-pill">
              <FaArrowUp /> +{stats.newUsersToday || 0} TODAY
            </span>
          </div>

          <div className="card-middle-data">
            <h2 className="giant-stat-number">{(stats.totalUsers || 0).toLocaleString()}</h2>
            <p className="giant-stat-label">Total Registered Users</p>
          </div>

          <div className="card-bottom-accent">
            <div className="glow-bar cyan-bar"></div>
          </div>
        </div>

        {/* Card 2: Total Admins */}
        <div className="khatarnak-card purple-theme animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="card-glass-shine"></div>
          <div className="card-top-bar">
            <div className="big-icon-box purple-glow">
              <FaUserShield />
            </div>
            <span className="trend-badge purple-pill">
              <FaCheckCircle /> VERIFIED
            </span>
          </div>

          <div className="card-middle-data">
            <h2 className="giant-stat-number">{(stats.totalAdmins || 0).toLocaleString()}</h2>
            <p className="giant-stat-label">Total Admin Authorities</p>
          </div>

          <div className="card-bottom-accent">
            <div className="glow-bar purple-bar"></div>
          </div>
        </div>

        {/* Card 3: Total Partners */}
        <div className="khatarnak-card emerald-theme animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <div className="card-glass-shine"></div>
          <div className="card-top-bar">
            <div className="big-icon-box emerald-glow">
              <FaHandshake />
            </div>
            <span className="trend-badge emerald-pill">
              <FaArrowUp /> +{stats.newPartnersToday || 0} TODAY
            </span>
          </div>

          <div className="card-middle-data">
            <h2 className="giant-stat-number">{(stats.totalPartners || 0).toLocaleString()}</h2>
            <p className="giant-stat-label">Active Network Partners</p>
          </div>

          <div className="card-bottom-accent">
            <div className="glow-bar emerald-bar"></div>
          </div>
        </div>

        {/* Card 4: New Signups Today */}
        <div className="khatarnak-card gold-theme animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <div className="card-glass-shine"></div>
          <div className="card-top-bar">
            <div className="big-icon-box gold-glow">
              <FaUserPlus />
            </div>
            <span className="trend-badge gold-pill">
              <FaBolt /> LIVE SIGNUPS
            </span>
          </div>

          <div className="card-middle-data">
            <h2 className="giant-stat-number">
              {((stats.newUsersToday || 0) + (stats.newPartnersToday || 0)).toLocaleString()}
            </h2>
            <p className="giant-stat-label">New Registrations Today</p>
          </div>

          <div className="card-bottom-accent">
            <div className="glow-bar gold-bar"></div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="db-content-grid">
        <div className="super-card main-table-card animate-fade-in-delayed">
          <div className="super-card-header">
            <div className="header-accent-title">
              <div className="title-vertical-bar"></div>
              <h2>All Users Management</h2>
            </div>
            <span className="giant-badge">{users.length} Users Total</span>
          </div>

          <div className="table-responsive">
            {loading ? (
              <div className="khatarnak-loader">
                <div className="glowing-spinner"></div>
                <p>Syncing Cosmic Network Database...</p>
              </div>
            ) : error ? (
              <div className="table-error-box">{error}</div>
            ) : (
              <table className="khatarnak-table">
                <thead>
                  <tr>
                    <th>USER PROFILE</th>
                    <th>EMAIL ADDRESS</th>
                    <th>SYSTEM ROLE</th>
                    <th style={{ textAlign: "right" }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div className="large-user-profile">
                          <div className="giant-avatar">{getInitial(user.name)}</div>
                          <div className="profile-names">
                            <span className="main-name">{user.name || "N/A"}</span>
                          </div>
                        </div>
                      </td>
                      <td className="bold-email">{user.email || "—"}</td>
                      <td>
                        <span className={`bold-role-tag role-${user.role}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <div className="action-button-group">
                          <button
                            className="btn-pro btn-pro-view"
                            onClick={() => handleUserView(user)}
                          >
                            <FaEye /> View
                          </button>
                          <button
                            className="btn-pro btn-pro-delete"
                            onClick={() => confirmDelete(user)}
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
        </div>

        {/* Recent Users Sidebar Feed */}
        <div className="super-card sidebar-feed animate-fade-in-delayed">
          <div className="super-card-header">
            <div className="header-accent-title">
              <div className="title-vertical-bar gold"></div>
              <h2>Recent Signups</h2>
            </div>
            <span className="giant-badge gold">{recentUsers.length} Users</span>
          </div>

<div className="table-responsive sidebar-scroll recent-signups-scroll">            <table className="khatarnak-table compact">
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>ROLE</th>
                  <th>MOBILE</th>
                  <th style={{ textAlign: "right" }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
{recentUsers.slice(0, 10).map((user) => (                  <tr key={user._id}>
                    <td>
                      <span className="recent-user-bold">{user.name || "—"}</span>
                    </td>
                    <td>
                      <span className={`bold-role-tag role-${user.role}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="subtle-mobile">{user.mobile || "—"}</td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        className="btn-square-icon"
                        onClick={() => handleRecentUserView(user)}
                      >
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
 <div className="super-card approval-card animate-fade-in-delayed">
        <div className="super-card-header">
          <div className="header-accent-title">
            <div className="title-vertical-bar purple"></div>
            <h2>Recent Profile Approvals</h2>
          </div>
          <span className="giant-badge purple">
            {pendingApprovals.length} Pending
          </span>
        </div>

        <div className="table-responsive">
          
          {pendingApprovals.length === 0 ? (
            <div className="no-approvals-box">
              <FaCheckCircle className="no-approval-icon" />
              <p>All caught up! No pending approvals.</p>
            </div>
          ) : (
            <table className="khatarnak-table">
              <thead>
                <tr>
                  <th>USER PROFILE</th>
                  <th>EMAIL ADDRESS</th>
                  <th>REQUESTED ROLE</th>
                  <th>STATUS</th>
                  <th style={{ textAlign: "right" }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {pendingApprovals.map((user, idx) => (
                  <tr
                    key={user._id}
                    className="approval-row animate-slide-up"
                    style={{ animationDelay: `${idx * 0.08}s` }}
                  >
                    <td>
                      <div className="large-user-profile">
                        <div className="giant-avatar purple-avatar">
                          {getInitial(user.name)}
                        </div>
                        <div className="profile-names">
                          <span className="main-name">{user.name || "N/A"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="bold-email">{user.email || "—"}</td>
                    <td>
                      <span className={`bold-role-tag role-${user.role}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className="pending-status-pill">
                        <FaClock /> Pending
                      </span>
                    </td>
                    <td>
                      <div className="action-button-group">
                        <button
                          className="btn-pro btn-pro-approve"
                          onClick={() => handleApprove(user._id)}
                        >
                          <FaUserCheck /> Approve
                        </button>
                        <button
                          className="btn-pro btn-pro-reject"
                          onClick={() => handleReject(user._id)}
                        >
                          <FaUserTimes /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
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
      </div>
      {/* Khatarnak Delete Modal */}
      {showDeleteModal && (
        <div className="ultra-modal-backdrop">
          <div className="ultra-modal-box">
            <div className="danger-glow-icon">
              <FaTrashAlt />
            </div>
            <h3>Delete User Account?</h3>
            <p>
              Are you sure you want to permanently delete <strong>{selectedUser?.name}</strong>? This action cannot be undone.
            </p>
            <div className="modal-actions-row">
              <button className="btn-modal-pro cancel" onClick={cancelDelete}>
                Cancel
              </button>
              <button className="btn-modal-pro delete" onClick={handleDeleteConfirmed}>
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && (
        <UserViewModal
          user={viewUser}
          onClose={closeViewModal}
          title={modalTitle}
        />
      )}
    </div>
  );
}