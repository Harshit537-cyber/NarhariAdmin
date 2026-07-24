import React, { useState, useEffect } from "react";
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
} from "react-icons/fa";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewUser, setViewUser] = useState(null);
  const [modalTitle, setModalTitle] = useState("");
  
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
        {/* All Users Management */}
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
                  {users.map((user) => (
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

          <div className="table-responsive sidebar-scroll">
            <table className="khatarnak-table compact">
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>ROLE</th>
                  <th>MOBILE</th>
                  <th style={{ textAlign: "right" }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((user) => (
                  <tr key={user._id}>
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