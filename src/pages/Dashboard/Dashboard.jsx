import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { getAllUsers, getDashboardStats, getRecentUsers ,deleteUser} from "../../api/Controller/authController"; // apna actual path daal dena
import { toast } from "react-toastify";
import UserViewModal from "../../components/UserModule/UserViewModal";
export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [selectedUser, setSelectedUser] = useState(null);
const [showViewModal, setShowViewModal] = useState(false);
const [viewUser, setViewUser] = useState(null);
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
      // response.data me users array
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
      setRecentUsers(res.data);
    } catch (err) {
      console.error("Failed to load recent users:", err);
    }
  };
// Delete button click -> popup open karega
const confirmDelete = (user) => {
  setSelectedUser(user);
  setShowDeleteModal(true);
};
const handleViewClick = (user) => {
  setViewUser(user);
  setShowViewModal(true);
};

const closeViewModal = () => {
  setShowViewModal(false);
  setViewUser(null);
};
const handleDeleteConfirmed = async () => {
  try {
    const res = await deleteUser(selectedUser._id);

    toast.success(res.message);

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
// Popup close/cancel
const cancelDelete = () => {
  setShowDeleteModal(false);
  setSelectedUser(null);
};

  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "?");

  return (
    <div className="an-dashboard-container">
      {/* Welcome Header */}
      <header className="db-header animate-fade-in">
        <div className="db-header-left">
          <h1>Cosmic Admin Hub</h1>
          <p>Real-time overview of your sacred network & celestial guides.</p>
        </div>
        <div className="db-header-right">
          <span className="live-pulse"></span>
          <span className="system-status">System Live</span>
        </div>
      </header>

      {/* Grid Status Metrics */}
      <div className="db-metrics-grid">
        <div className="metric-card animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div className="metric-icon users-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className="metric-data">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
          <span className="metric-trend up">+{stats.newUsersToday} Today</span>
        </div>

        <div className="metric-card animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="metric-icon pandit-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <div className="metric-data">
            <h3>{stats.totalAdmins}</h3>
            <p>Total Admins</p>
          </div>
        </div>

        <div className="metric-card animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <div className="metric-icon chat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div className="metric-data">
            <h3>{stats.totalPartners}</h3>
            <p>Total Partners</p>
          </div>
          <span className="metric-trend up">+{stats.newPartnersToday} Today</span>
        </div>

        <div className="metric-card animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <div className="metric-icon puja-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div className="metric-data">
            <h3>{stats.newUsersToday + stats.newPartnersToday}</h3>
            <p>New Signups Today</p>
          </div>
          <span className="metric-pulse-dot"></span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="db-content-grid">
        {/* Left Side: All Users Management */}
        <div className="db-card main-table-card animate-fade-in-delayed">
          <div className="db-card-header">
            <h2>All Users Management</h2>
            <span className="badge">{users.length} Total</span>
          </div>

          <div className="table-responsive">
            {loading ? (
              <p style={{ padding: "20px", color: "var(--gray)" }}>Loading users...</p>
            ) : error ? (
              <p style={{ padding: "20px", color: "var(--red)" }}>{error}</p>
            ) : (
              <table className="db-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div className="user-info">
                          <div className="user-avatar">{getInitial(user.name)}</div>
                          <div>
                            <div className="user-name">{user.name}</div>
                          </div>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge role-${user.role}`}>
                          {user.role}
                        </span>
                      </td>
              <td>
  <div className="action-buttons">
    <button className="btn-chat" onClick={() => handleViewClick(user)}>View</button>    <button className="btn-block" onClick={() => confirmDelete(user)}>Delete</button>
  </div>
</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right Side: Recent Users */}
        <div className="db-card sidebar-feed animate-fade-in-delayed">
          <div className="db-card-header">
            <h2>Recent Users</h2>
            <span className="badge">{recentUsers.length} Users</span>
          </div>
          <div className="table-responsive">
            <table className="db-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Joined</th>
                </tr>
              </thead>

              <tbody>
                {recentUsers.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>

                    <td>
                      <span className={`role-badge role-${user.role}`}>
                        {user.role}
                      </span>
                    </td>

                    <td>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showDeleteModal && (
  <div className="modal-overlay">
    <div className="modal-box">
      <h3>Delete User?</h3>
      <p>
        Are you sure you want to delete <strong>{selectedUser?.name}</strong>?
        This action cannot be undone.
      </p>
      <div className="modal-actions">
        <button className="btn-block" onClick={handleDeleteConfirmed}>
          Yes, Delete
        </button>
        <button className="btn-chat" onClick={cancelDelete}>
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

{showViewModal && (
  <UserViewModal user={viewUser} onClose={closeViewModal} />
)}
    </div>
  );
}