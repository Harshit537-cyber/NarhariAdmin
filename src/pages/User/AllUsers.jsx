import React, { useState, useMemo } from "react";
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
} from "react-icons/fa";

// Rich mock database for local testing
const INITIAL_USERS = [
  {
    _id: "u1",
    fullName: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    mobile: "9876543210",
    city: "Mumbai",
    walletBalance: 1250,
    isActive: true,
    isPremium: true,
    isVerified: true,
    profilePic: "",
    createdAt: new Date().toISOString(), // Today
  },
  {
    _id: "u2",
    fullName: "Isha Patel",
    email: "isha.patel@example.com",
    mobile: "8765432109",
    city: "Ahmedabad",
    walletBalance: 450,
    isActive: true,
    isPremium: false,
    isVerified: true,
    profilePic: "",
    createdAt: "2026-07-20T10:00:00.000Z",
  },
  {
    _id: "u3",
    fullName: "Shruti",
    email: "shruti.@example.com",
    mobile: "7654321098",
    city: "Delhi",
    walletBalance: 0,
    isActive: false,
    isPremium: false,
    isVerified: false,
    profilePic: "",
    createdAt: "2026-07-18T12:30:00.000Z",
  },
  {
    _id: "u4",
    fullName: "Ananya Iyer",
    email: "ananya.iyer@example.com",
    mobile: "9123456789",
    city: "Bangalore",
    walletBalance: 3200,
    isActive: true,
    isPremium: true,
    isVerified: true,
    profilePic: "",
    createdAt: new Date().toISOString(), // Today
  },
  {
    _id: "u5",
    fullName: "Kabir Singh",
    email: "kabir.singh@example.com",
    mobile: "8234567890",
    city: "Chandigarh",
    walletBalance: 150,
    isActive: true,
    isPremium: false,
    isVerified: false,
    profilePic: "",
    createdAt: "2026-07-15T08:15:00.000Z",
  },
  {
    _id: "u6",
    fullName: "Meera Nair",
    email: "meera.nair@example.com",
    mobile: "7234567891",
    city: "Kochi",
    walletBalance: 850,
    isActive: false,
    isPremium: true,
    isVerified: true,
    profilePic: "",
    createdAt: "2026-07-10T14:45:00.000Z",
  },
];

export default function Users() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [loading, setLoading] = useState(false); // Can trigger loading states locally
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modal States
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Form states for local edit modal
  const [editForm, setEditForm] = useState({ fullName: "", mobile: "", city: "", walletBalance: 0 });

  // 1. Dynamic Stats Calculation based on State
  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const totalUsers = users.length;
    const premiumCount = users.filter((u) => u.isPremium).length;
    const unverifiedCount = users.filter((u) => !u.isVerified).length;
    const newToday = users.filter(
      (u) => new Date(u.createdAt).toDateString() === today
    ).length;
    return { totalUsers, premiumCount, unverifiedCount, newToday };
  }, [users]);

  // 2. Local Action Handlers
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
      fullName: user.fullName,
      mobile: user.mobile,
      city: user.city,
      walletBalance: user.walletBalance,
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

  const confirmDelete = () => {
    setUsers((prev) => prev.filter((u) => u._id !== selectedUser._id));
    setDeleteOpen(false);
    setSelectedUser(null);
  };

  // 3. Search and Filtering Logic
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const name = (user.fullName || "").toLowerCase();
      const mobile = (user.mobile || "").toLowerCase();
      const city = (user.city || "").toLowerCase();
      const email = (user.email || "").toLowerCase();
      const query = searchTerm.toLowerCase();

      const matchesSearch =
        name.includes(query) ||
        mobile.includes(query) ||
        city.includes(query) ||
        email.includes(query);

      if (!matchesSearch) return false;

      if (filterType === "active") return user.isActive;
      if (filterType === "premium") return user.isPremium;
      if (filterType === "unverified") return !user.isVerified;

      return true;
    });
  }, [users, searchTerm, filterType]);

  // 4. Pagination
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "U");

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
            Admin console for managing galaxy explorers, wallets, and subscriptions.
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

      {/* Stats Section */}
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
              <FaCrown />
            </div>
            <span className="trend-badge emerald-pill">PREMIUM</span>
          </div>
          <div className="card-middle-data">
            <h2 className="giant-stat-number">{stats.premiumCount}</h2>
            <p className="giant-stat-label">Premium Subscribers</p>
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
            <span className="trend-badge gold-pill">PENDING</span>
          </div>
          <div className="card-middle-data">
            <h2 className="giant-stat-number">{stats.unverifiedCount}</h2>
            <p className="giant-stat-label">Unverified Profiles</p>
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
            placeholder="Search by name, email, mobile, or city..."
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
            Active
          </button>
          <button
            className={`filter-btn ${filterType === "premium" ? "active" : ""}`}
            onClick={() => { setFilterType("premium"); setCurrentPage(1); }}
          >
            Premium
          </button>
          <button
            className={`filter-btn ${filterType === "unverified" ? "active" : ""}`}
            onClick={() => { setFilterType("unverified"); setCurrentPage(1); }}
          >
            Unverified
          </button>
        </div>
      </div>

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
            {currentUsers.map((user) => (
              <div className="khatarnak-card user-card-item" key={user._id}>
                <div className="card-glass-shine"></div>

                <div className="user-card-header">
                  <span className={`bold-role-tag ${user.isActive ? "role-user" : "role-inactive"}`}>
                    {user.isActive ? "ACTIVE" : "SUSPENDED"}
                  </span>

                  <div className="badges-group">
                    {user.isPremium && (
                      <span className="trend-badge emerald-pill">
                        <FaCrown /> Premium
                      </span>
                    )}
                    {user.isVerified && (
                      <span className="trend-badge cyan-pill">
                        <FaCheckCircle /> Verified
                      </span>
                    )}
                  </div>
                </div>

                <div className="user-card-body">
                  <div className="avatar-wrapper">
                    {user.profilePic ? (
                      <img
                        src={user.profilePic}
                        alt={user.fullName}
                        className="user-avatar-img"
                      />
                    ) : (
                      <div className="giant-avatar">
                        {getInitial(user.fullName)}
                      </div>
                    )}
                  </div>

                  <h3 className="user-name">{user.fullName || "Unnamed Explorer"}</h3>
                  <p className="user-email">
                    <FaEnvelope /> {user.email || "No Email"}
                  </p>
                  <p className="user-mobile">
                    <FaPhoneAlt /> {user.mobile || "No Mobile"}
                  </p>

                  <div className="user-meta-row">
                    {user.city && (
                      <span className="meta-item">
                        <FaMapMarkerAlt /> {user.city}
                      </span>
                    )}
                  </div>
                </div>

                <div className="user-card-footer">
                  <div className="rate-info">
                    <span className="rate-amount">
                      <FaWallet style={{ fontSize: "14px", marginRight: "4px" }} />
                      ₹{user.walletBalance}
                    </span>
                    <span className="rate-unit">bal</span>
                  </div>

                  <div className="card-right-controls">
                    <label className="toggle-switch" title="Toggle Active Status">
                      <input
                        type="checkbox"
                        checked={user.isActive}
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
            ))}
          </div>
        )}
      </div>

      {/* Pagination Footer */}
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

      {/* Simple Inline Local Modals */}
      {viewOpen && selectedUser && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-content">
            <div className="modal-header">
              <h2>User Telemetry Profile</h2>
              <button className="close-btn" onClick={() => setViewOpen(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="profile-detail-card">
                <div className="modal-avatar-section">
                  <div className="giant-avatar">{getInitial(selectedUser.fullName)}</div>
                  <h3>{selectedUser.fullName}</h3>
                  <p>{selectedUser.email}</p>
                </div>
                <div className="modal-details-grid">
                  <div className="detail-item"><strong>Mobile:</strong> {selectedUser.mobile}</div>
                  <div className="detail-item"><strong>Location:</strong> {selectedUser.city}</div>
                  <div className="detail-item"><strong>Wallet Balance:</strong> ₹{selectedUser.walletBalance}</div>
                  <div className="detail-item"><strong>Premium Tier:</strong> {selectedUser.isPremium ? "Active" : "Inactive"}</div>
                  <div className="detail-item"><strong>Verification Status:</strong> {selectedUser.isVerified ? "Verified" : "Unverified"}</div>
                  <div className="detail-item"><strong>Account Status:</strong> {selectedUser.isActive ? "Active" : "Banned"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
              <div className="modal-body">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={editForm.fullName}
                    onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                    required
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
                  <label>City</label>
                  <input
                    type="text"
                    value={editForm.city}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
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

      {deleteOpen && selectedUser && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-content confirm-danger">
            <div className="modal-header">
              <h2>Confirm Obliteration</h2>
              <button className="close-btn" onClick={() => setDeleteOpen(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body text-center">
              <p>Are you sure you want to remove <strong>{selectedUser.fullName}</strong> from the database?</p>
              <p className="subtext">This action is irreversible in the current state.</p>
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