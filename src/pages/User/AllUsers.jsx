import React, { useState, useEffect, useMemo } from "react";
import "./Users.css";
import {
  FaEye,
  FaEdit,
  FaTrashAlt,
  FaSearch,
  FaCheckCircle,
  FaCrown,
  FaBolt,
  FaUsers,
  FaArrowUp,
  FaChevronLeft,
  FaChevronRight,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaWallet,
  FaUserShield,
  FaTimes,
  FaCalendarAlt,
  FaClock,
  FaVenusMars,
  FaStar,
} from "react-icons/fa";

// ⚠️ API path ko apne project structure ke hisab se change karein
import { getAllUsers, deleteUser  } from "../../api/Controller/authController"; 

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modal States
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Form states for edit modal mapped with backend attributes
  const [editForm, setEditForm] = useState({
    fullName: "",
    name: "",
    email: "",
    mobile: "",
    gender: "",
    zodiac: "",
    placeOfBirth: "",
    walletBalance: 0,
  });

  // ================= 1. FETCH USERS FROM API =================
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllUsers();
      // Mapped according to response structure: { success: true, data: [...] }
      if (response && response.data) {
        setUsers(response.data);
      } else if (Array.isArray(response)) {
        setUsers(response);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ================= 2. Dynamic Stats Calculation =================
  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const totalUsers = users.length;
    const activeCount = users.filter((u) => u.isActive).length;
    const inactiveCount = users.filter((u) => !u.isActive).length;
    const newToday = users.filter((u) => {
      if (!u.createdAt) return false;
      return new Date(u.createdAt).toDateString() === today;
    }).length;

    return { totalUsers, activeCount, inactiveCount, newToday };
  }, [users]);

  // ================= 3. Handlers =================
  const handleToggleStatus = (user) => {
    setUsers((prev) =>
      prev.map((u) =>
        u._id === user._id ? { ...u, isActive: !u.isActive } : u
      )
    );
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setViewOpen(true);
  };

  const handleEditInit = (user) => {
    setSelectedUser(user);
    setEditForm({
      fullName: user.fullName || "",
      name: user.name || "",
      email: user.email || "",
      mobile: user.mobile || "",
      gender: user.gender || "",
      zodiac: user.zodiac || "",
      placeOfBirth: user.placeOfBirth || "",
      walletBalance: user.walletBalance || 0,
    });
    setEditOpen(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setUsers((prev) =>
      prev.map((u) =>
        u._id === selectedUser._id ? { ...u, ...editForm } : u
      )
    );
    setEditOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteInit = (user) => {
    setSelectedUser(user);
    setDeleteOpen(true);
  };

 const confirmDelete = async () => {
  try {
    await deleteUser(selectedUser._id);

    setUsers((prev) => prev.filter((u) => u._id !== selectedUser._id));

    setDeleteOpen(false);
    setSelectedUser(null);
  } catch (err) {
    console.error("Delete failed:", err);
    alert(err?.message || "Failed to delete user");
  }
};

  // ================= 4. Search and Filtering Logic =================
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const displayName = (user.fullName || user.name || "").toLowerCase();
      const mobile = (user.mobile || "").toLowerCase();
      const place = (user.placeOfBirth || "").toLowerCase();
      const email = (user.email || "").toLowerCase();
      const zodiac = (user.zodiac || "").toLowerCase();
      const query = searchTerm.toLowerCase();

      const matchesSearch =
        displayName.includes(query) ||
        mobile.includes(query) ||
        place.includes(query) ||
        email.includes(query) ||
        zodiac.includes(query);

      if (!matchesSearch) return false;

      if (filterType === "active") return user.isActive === true;
      if (filterType === "inactive") return user.isActive === false;

      return true;
    });
  }, [users, searchTerm, filterType]);

  // ================= 5. Pagination =================
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Helpers
  const getInitial = (name, fallbackName) => {
    const val = name || fallbackName;
    return val ? val.trim().charAt(0).toUpperCase() : "U";
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

  return (
    <div className="an-user-container">
      {/* Background Orbs */}
      <div className="ambient-orb orb-1"></div>
      <div className="ambient-orb orb-2"></div>
      <div className="ambient-orb orb-3"></div>

      <header className="db-header animate-fade-in">
        <div className="db-header-left">
          <div className="header-title-container">
            <span className="enterprise-badge">
              <FaCrown className="crown-icon" /> COSMIC USER REALM
            </span>
            <h1 className="wrapped-header-title">User Management</h1>
          </div>
          <p className="header-subtitle">
            Admin console for managing users, astrological profiles, and wallet balances.
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
              <FaUsers />
            </div>
            <span className="trend-badge cyan-pill">
              <FaArrowUp /> +{stats.newToday} TODAY
            </span>
          </div>
          <div className="card-middle-data">
            <h2 className="giant-stat-number">{stats.totalUsers}</h2>
            <p className="giant-stat-label">Total Users</p>
          </div>
          <div className="card-bottom-accent">
            <div className="glow-bar cyan-bar"></div>
          </div>
        </div>

        <div className="khatarnak-card emerald-theme animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="card-glass-shine"></div>
          <div className="card-top-bar">
            <div className="big-icon-box emerald-glow">
              <FaCheckCircle />
            </div>
            <span className="trend-badge emerald-pill">ACTIVE</span>
          </div>
          <div className="card-middle-data">
            <h2 className="giant-stat-number">{stats.activeCount}</h2>
            <p className="giant-stat-label">Active Profiles</p>
          </div>
          <div className="card-bottom-accent">
            <div className="glow-bar emerald-bar"></div>
          </div>
        </div>

        <div className="khatarnak-card gold-theme animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <div className="card-glass-shine"></div>
          <div className="card-top-bar">
            <div className="big-icon-box gold-glow">
              <FaUserShield />
            </div>
            <span className="trend-badge gold-pill">INACTIVE</span>
          </div>
          <div className="card-middle-data">
            <h2 className="giant-stat-number">{stats.inactiveCount}</h2>
            <p className="giant-stat-label">Deactivated / Suspended</p>
          </div>
          <div className="card-bottom-accent">
            <div className="glow-bar gold-bar"></div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="pt-controls-bar animate-fade-in">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, email, mobile, zodiac or place..."
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
            All ({users.length})
          </button>
          <button
            className={`filter-btn ${filterType === "active" ? "active" : ""}`}
            onClick={() => { setFilterType("active"); setCurrentPage(1); }}
          >
            Active ({stats.activeCount})
          </button>
          <button
            className={`filter-btn ${filterType === "inactive" ? "active" : ""}`}
            onClick={() => { setFilterType("inactive"); setCurrentPage(1); }}
          >
            Inactive ({stats.inactiveCount})
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
            <p>Fetching Cosmic Users Database...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="table-error-box">No users match your criteria.</div>
        ) : (
          <div className="user-cards-grid">
            {currentUsers.map((user) => {
              const displayName = user.fullName || user.name || "Unnamed User";

              return (
                <div className="khatarnak-card user-card-item" key={user._id}>
                  <div className="card-glass-shine"></div>

                  <div className="user-card-header">
                    <span className={`bold-role-tag ${user.isActive ? "role-user" : "role-inactive"}`}>
                      {user.isActive ? "ACTIVE" : "SUSPENDED"}
                    </span>

                    <div className="badges-group">
                      {user.zodiac && user.zodiac !== "Auto-calculated" && (
                        <span className="trend-badge emerald-pill">
                          <FaStar /> {user.zodiac}
                        </span>
                      )}
                      {user.gender && (
                        <span className="trend-badge cyan-pill">
                          <FaVenusMars /> {user.gender}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="user-card-body">
                    <div className="avatar-wrapper">
                      {user.profilePic ? (
                        <img
                          src={user.profilePic}
                          alt={displayName}
                          className="user-avatar-img"
                        />
                      ) : (
                        <div className="giant-avatar">
                          {getInitial(user.fullName, user.name)}
                        </div>
                      )}
                    </div>

                    <h3 className="user-name">{displayName}</h3>

                    <p className="user-email">
                      <FaEnvelope /> {user.email || "No Email Provided"}
                    </p>

                    <p className="user-mobile">
                      <FaPhoneAlt /> {user.mobile || "No Mobile"}
                    </p>

                    <div className="user-meta-row" style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
                      {user.placeOfBirth && (
                        <span className="meta-item">
                          <FaMapMarkerAlt /> {user.placeOfBirth}
                        </span>
                      )}
                      {user.dateOfBirth && (
                        <span className="meta-item">
                          <FaCalendarAlt /> {formatDate(user.dateOfBirth)}
                        </span>
                      )}
                      {user.timeOfBirth && (
                        <span className="meta-item">
                          <FaClock /> {user.timeOfBirth}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="user-card-footer">
                    <div className="rate-info">
                      <span className="rate-amount">
                        <FaWallet style={{ fontSize: "14px", marginRight: "4px" }} />
                        ₹{user.walletBalance ?? 0}
                      </span>
                      <span className="rate-unit">bal</span>
                    </div>

                    <div className="card-right-controls">
                      <label className="toggle-switch" title="Toggle Active Status">
                        <input
                          type="checkbox"
                          checked={user.isActive ?? false}
                          onChange={() => handleToggleStatus(user)}
                        />
                        <span className="toggle-slider"></span>
                      </label>

                      <div className="action-button-group">
                        <button
                          className="btn-square-icon"
                          onClick={() => handleView(user)}
                          title="View Info"
                        >
                          <FaEye />
                        </button>
                        <button
                          className="btn-square-icon"
                          onClick={() => handleEditInit(user)}
                          title="Edit Details"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn-square-icon btn-delete-accent"
                          onClick={() => handleDeleteInit(user)}
                          title="Delete User"
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
      {!loading && filteredUsers.length > 0 && (
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

      {/* View User Detail Modal */}
      {viewOpen && selectedUser && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-content">
            <div className="modal-header">
              <h2>User Details</h2>
              <button className="close-btn" onClick={() => setViewOpen(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="profile-detail-card">
                <div className="modal-avatar-section" style={{ textAlign: "center", marginBottom: "16px" }}>
                  {selectedUser.profilePic ? (
                    <img
                      src={selectedUser.profilePic}
                      alt="Profile"
                      style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover" }}
                    />
                  ) : (
                    <div className="giant-avatar" style={{ margin: "0 auto" }}>
                      {getInitial(selectedUser.fullName, selectedUser.name)}
                    </div>
                  )}
                  <h3 style={{ marginTop: "10px" }}>{selectedUser.fullName || selectedUser.name || "N/A"}</h3>
                  <p>{selectedUser.email || "No Email Mapped"}</p>
                </div>

                <div className="modal-details-grid">
                  <div className="detail-item"><strong>User ID:</strong> {selectedUser._id}</div>
                  <div className="detail-item"><strong>Mobile:</strong> {selectedUser.mobile || "N/A"}</div>
                  <div className="detail-item"><strong>Gender:</strong> {selectedUser.gender || "N/A"}</div>
                  <div className="detail-item"><strong>Zodiac Sign:</strong> {selectedUser.zodiac || "N/A"}</div>
                  <div className="detail-item"><strong>Date of Birth:</strong> {formatDate(selectedUser.dateOfBirth)}</div>
                  <div className="detail-item"><strong>Time of Birth:</strong> {selectedUser.timeOfBirth || "N/A"}</div>
                  <div className="detail-item"><strong>Place of Birth:</strong> {selectedUser.placeOfBirth || "N/A"}</div>
                  <div className="detail-item"><strong>Wallet Balance:</strong> ₹{selectedUser.walletBalance ?? 0}</div>
                  <div className="detail-item"><strong>Account Status:</strong> {selectedUser.isActive ? "Active" : "Banned/Suspended"}</div>
                  <div className="detail-item"><strong>Created At:</strong> {formatDate(selectedUser.createdAt)}</div>
                  <div className="detail-item"><strong>Updated At:</strong> {formatDate(selectedUser.updatedAt)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editOpen && selectedUser && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-content">
            <div className="modal-header">
              <h2>Edit Profile Data</h2>
              <button className="close-btn" onClick={() => setEditOpen(false)}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSaveEdit}>
              <div className="modal-body" style={{ display: "grid", gap: "12px" }}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={editForm.fullName}
                    onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Display Name (Name)</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Mobile</label>
                  <input
                    type="text"
                    value={editForm.mobile}
                    onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <input
                    type="text"
                    value={editForm.gender}
                    onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Zodiac</label>
                  <input
                    type="text"
                    value={editForm.zodiac}
                    onChange={(e) => setEditForm({ ...editForm, zodiac: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Place of Birth</label>
                  <input
                    type="text"
                    value={editForm.placeOfBirth}
                    onChange={(e) => setEditForm({ ...editForm, placeOfBirth: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Wallet Balance (₹)</label>
                  <input
                    type="number"
                    value={editForm.walletBalance}
                    onChange={(e) => setEditForm({ ...editForm, walletBalance: Number(e.target.value) })}
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
      {deleteOpen && selectedUser && (
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
                Are you sure you want to remove{" "}
                <strong>{selectedUser.fullName || selectedUser.name || "this user"}</strong> from the database?
              </p>
              <p className="subtext">This action is permanent.</p>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setDeleteOpen(false)}>
                Cancel
              </button>
              <button className="btn-danger-confirm" onClick={confirmDelete}>
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}