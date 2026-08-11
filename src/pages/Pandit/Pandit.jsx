import React, { useState, useEffect, useMemo } from "react";
import "./Pandit.css";
import {
  FaEye,
  FaEdit,
  FaTrashAlt,
  FaSearch,
  FaCheckCircle,
  FaStar,
  FaMapMarkerAlt,
  FaBriefcase,
  FaPhoneAlt,
  FaClock,
  FaCrown,
  FaBolt,
  FaUsers,
  FaArrowUp,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
} from "react-icons/fa";

/* ---------------------------------------------------
   DUMMY DATA (replace this with your API response later)
--------------------------------------------------- */
const DUMMY_PANDITS = [
  {
    _id: "1",
    fullName: "Pandit Ravi Shankar Sharma",
    mobile: "9876543210",
    city: "Varanasi",
    experience: 18,
    specialties: ["Vedic Astrology", "Vastu", "Kundli Matching"],
    minRate: 35,
    averageRating: "4.8",
    isActive: true,
    isVerified: true,
    isOnline: true,
    profilePic: "",
    kycStatus: "approved",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "2",
    fullName: "Pandit Mahesh Trivedi",
    mobile: "9812345678",
    city: "Haridwar",
    experience: 12,
    specialties: ["Numerology", "Palmistry"],
    minRate: 25,
    averageRating: "4.5",
    isActive: false,
    isVerified: true,
    isOnline: false,
    profilePic: "",
    kycStatus: "pending",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    _id: "3",
    fullName: "Pandit Suresh Chandra Joshi",
    mobile: "9900112233",
    city: "Ujjain",
    experience: 25,
    specialties: ["Vedic Astrology", "Horoscope", "Gemology"],
    minRate: 45,
    averageRating: "4.9",
    isActive: true,
    isVerified: true,
    isOnline: true,
    profilePic: "",
    kycStatus: "approved",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "4",
    fullName: "Pandit Deepak Upadhyay",
    mobile: "9765432190",
    city: "Ayodhya",
    experience: 8,
    specialties: ["Tarot Reading"],
    minRate: 20,
    averageRating: "4.2",
    isActive: true,
    isVerified: false,
    isOnline: false,
    profilePic: "",
    kycStatus: "pending",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    _id: "5",
    fullName: "Pandit Ashok Kumar Pandey",
    mobile: "9911223344",
    city: "Rishikesh",
    experience: 30,
    specialties: ["Vedic Astrology", "Vastu", "Pooja Vidhi"],
    minRate: 50,
    averageRating: "5.0",
    isActive: true,
    isVerified: true,
    isOnline: true,
    profilePic: "",
    kycStatus: "approved",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "6",
    fullName: "Pandit Vinod Shastri",
    mobile: "9822334455",
    city: "Nashik",
    experience: 15,
    specialties: ["Kundli Matching", "Numerology"],
    minRate: 30,
    averageRating: "4.6",
    isActive: false,
    isVerified: true,
    isOnline: false,
    profilePic: "",
    kycStatus: "approved",
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    _id: "7",
    fullName: "Pandit Ramesh Dubey",
    mobile: "9888776655",
    city: "Prayagraj",
    experience: 10,
    specialties: ["Vastu", "Face Reading"],
    minRate: 22,
    averageRating: "4.1",
    isActive: true,
    isVerified: false,
    isOnline: true,
    profilePic: "",
    kycStatus: "pending",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "8",
    fullName: "Pandit Girish Bhatt",
    mobile: "9765123489",
    city: "Mathura",
    experience: 20,
    specialties: ["Vedic Astrology", "Gemology", "Pooja Vidhi"],
    minRate: 40,
    averageRating: "4.7",
    isActive: true,
    isVerified: true,
    isOnline: false,
    profilePic: "",
    kycStatus: "approved",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    _id: "9",
    fullName: "Pandit Naresh Tiwari",
    mobile: "9654321870",
    city: "Vrindavan",
    experience: 6,
    specialties: ["Tarot Reading", "Numerology"],
    minRate: 18,
    averageRating: "3.9",
    isActive: false,
    isVerified: false,
    isOnline: false,
    profilePic: "",
    kycStatus: "pending",
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
  },
];

/* ---------------------------------------------------
   DELETE MODAL
--------------------------------------------------- */
function DeleteModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;
  return (
    <div className="pandit-modal-overlay" onClick={onClose}>
      <div className="pandit-modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="pandit-modal-close" onClick={onClose}>
          <FaTimes />
        </button>
        <h3 className="pandit-modal-title">Delete Pandit</h3>
        <p className="pandit-modal-text">
          Are you sure you want to delete this pandit? This action cannot be
          undone.
        </p>
        <div className="pandit-modal-actions">
          <button className="pandit-btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="pandit-btn-danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------
   VIEW MODAL
--------------------------------------------------- */
function ViewPanditModal({ isOpen, onClose, pandit }) {
  if (!isOpen || !pandit) return null;
  return (
    <div className="pandit-modal-overlay" onClick={onClose}>
      <div className="pandit-modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="pandit-modal-close" onClick={onClose}>
          <FaTimes />
        </button>
        <h3 className="pandit-modal-title">{pandit.fullName}</h3>
        <div className="pandit-modal-grid">
          <div>
            <span className="pandit-modal-label">Mobile</span>
            <p>{pandit.mobile}</p>
          </div>
          <div>
            <span className="pandit-modal-label">City</span>
            <p>{pandit.city}</p>
          </div>
          <div>
            <span className="pandit-modal-label">Experience</span>
            <p>{pandit.experience} Yrs</p>
          </div>
          <div>
            <span className="pandit-modal-label">Rate</span>
            <p>₹{pandit.minRate}/min</p>
          </div>
          <div>
            <span className="pandit-modal-label">Rating</span>
            <p>{pandit.averageRating}</p>
          </div>
          <div>
            <span className="pandit-modal-label">KYC Status</span>
            <p>{pandit.kycStatus}</p>
          </div>
        </div>
        <div className="pandit-modal-label" style={{ marginTop: 14 }}>
          Specialties
        </div>
        <div className="specialties-row" style={{ marginTop: 8 }}>
          {(pandit.specialties || []).map((s, i) => (
            <span key={i} className="spec-tag">
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------
   EDIT MODAL
--------------------------------------------------- */
function EditPanditModal({ isOpen, onClose, pandit, onUpdated }) {
  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    city: "",
    experience: 0,
    minRate: 0,
  });

  useEffect(() => {
    if (pandit) {
      setForm({
        fullName: pandit.fullName || "",
        mobile: pandit.mobile || "",
        city: pandit.city || "",
        experience: pandit.experience || 0,
        minRate: pandit.minRate || 0,
      });
    }
  }, [pandit]);

  if (!isOpen || !pandit) return null;

  const handleSave = () => {
    onUpdated({ ...pandit, ...form });
    onClose();
  };

  return (
    <div className="pandit-modal-overlay" onClick={onClose}>
      <div className="pandit-modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="pandit-modal-close" onClick={onClose}>
          <FaTimes />
        </button>
        <h3 className="pandit-modal-title">Edit Pandit</h3>

        <div className="pandit-form-group">
          <label>Full Name</label>
          <input
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />
        </div>
        <div className="pandit-form-group">
          <label>Mobile</label>
          <input
            value={form.mobile}
            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
          />
        </div>
        <div className="pandit-form-group">
          <label>City</label>
          <input
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
        </div>
        <div className="pandit-form-row">
          <div className="pandit-form-group">
            <label>Experience (Yrs)</label>
            <input
              type="number"
              value={form.experience}
              onChange={(e) =>
                setForm({ ...form, experience: Number(e.target.value) })
              }
            />
          </div>
          <div className="pandit-form-group">
            <label>Rate (₹/min)</label>
            <input
              type="number"
              value={form.minRate}
              onChange={(e) =>
                setForm({ ...form, minRate: Number(e.target.value) })
              }
            />
          </div>
        </div>

        <div className="pandit-modal-actions">
          <button className="pandit-btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="pandit-btn-primary" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------
   SIMPLE TOAST (replaces react-toastify so the file has
   zero external service/API dependency)
--------------------------------------------------- */
function useSimpleToast() {
  const [toastMsg, setToastMsg] = useState(null);

  const show = (message, type = "success") => {
    setToastMsg({ message, type });
    setTimeout(() => setToastMsg(null), 2500);
  };

  const ToastUI = toastMsg ? (
    <div className={`pandit-toast pandit-toast-${toastMsg.type}`}>
      {toastMsg.message}
    </div>
  ) : null;

  return { show, ToastUI };
}

function AddPanditModal({ isOpen, onClose, onAdd }) {
  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    city: "",
    experience: 0,
    minRate: 0,
  });

  if (!isOpen) return null;

  const handleSave = () => {
    onAdd({
      _id: Date.now().toString(),
      ...form,
      isActive: true,
      isVerified: false,
      isOnline: false,
      kycStatus: "pending",
      averageRating: "0.0",
      specialties: [],
      createdAt: new Date().toISOString(),
    });

    onClose();
  };

  return (
    <div className="pandit-modal-overlay" onClick={onClose}>
      <div
        className="pandit-modal-box"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="pandit-modal-close" onClick={onClose}>
          <FaTimes />
        </button>

        <h3 className="pandit-modal-title">
          Add New Pandit
        </h3>

        <div className="pandit-form-group">
          <label>Full Name</label>
          <input
            value={form.fullName}
            onChange={(e)=>
              setForm({...form,fullName:e.target.value})
            }
          />
        </div>


        <div className="pandit-form-group">
          <label>Mobile</label>
          <input
            value={form.mobile}
            onChange={(e)=>
              setForm({...form,mobile:e.target.value})
            }
          />
        </div>


        <div className="pandit-form-group">
          <label>City</label>
          <input
            value={form.city}
            onChange={(e)=>
              setForm({...form,city:e.target.value})
            }
          />
        </div>


        <div className="pandit-form-row">

          <div className="pandit-form-group">
            <label>Experience</label>
            <input
              type="number"
              value={form.experience}
              onChange={(e)=>
                setForm({
                  ...form,
                  experience:Number(e.target.value)
                })
              }
            />
          </div>


          <div className="pandit-form-group">
            <label>Rate ₹/min</label>
            <input
              type="number"
              value={form.minRate}
              onChange={(e)=>
                setForm({
                  ...form,
                  minRate:Number(e.target.value)
                })
              }
            />
          </div>

        </div>


        <div className="pandit-modal-actions">

          <button
            className="pandit-btn-secondary"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="pandit-btn-primary"
            onClick={handleSave}
          >
            Add Pandit
          </button>

        </div>

      </div>
    </div>
  );
}
export default function Pandit() {
  const [pandits, setPandits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedPandit, setSelectedPandit] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const { show: showToast, ToastUI } = useSimpleToast();

  // simulate initial fetch with dummy data
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      try {
        setPandits(DUMMY_PANDITS);
      } catch (err) {
        setError("Failed to load pandits");
      } finally {
        setLoading(false);
      }
    }, 500);
  }, []);

  const handleEdit = (pandit) => {
    setSelectedPandit(pandit);
    setEditOpen(true);
  };

  const handleView = (pandit) => {
    setSelectedPandit(pandit);
    setViewOpen(true);
  };

  const handleUpdated = (updatedPandit) => {
    setPandits((prev) =>
      prev.map((p) => (p._id === updatedPandit._id ? updatedPandit : p))
    );
    showToast("Pandit updated successfully");
  };
const handleAddPandit = (newPandit) => {
  setPandits((prev)=>[newPandit,...prev]);
  showToast("Pandit added successfully");
};
  const handleToggleStatus = (pandit) => {
    const isCurrentlyActive = !!pandit.isActive;
    setTogglingId(pandit._id);

    setPandits((prev) =>
      prev.map((p) =>
        p._id === pandit._id ? { ...p, isActive: !isCurrentlyActive } : p
      )
    );

    // simulate network delay
    setTimeout(() => {
      showToast(
        isCurrentlyActive
          ? "Pandit deactivated successfully"
          : "Pandit activated successfully"
      );
      setTogglingId(null);
    }, 400);
  };

  const confirmDelete = () => {
    setPandits((prev) =>
      prev.filter((pandit) => pandit._id !== selectedPandit._id)
    );
    showToast("Pandit deleted successfully");
    setDeleteOpen(false);
    setSelectedPandit(null);
  };

  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const totalPandits = pandits.length;
    const verifiedCount = pandits.filter((p) => p.isVerified).length;
    const kycPendingCount = pandits.filter(
      (p) => (p.kycStatus || "").toLowerCase() === "pending"
    ).length;
    const newToday = pandits.filter(
      (p) => new Date(p.createdAt).toDateString() === today
    ).length;
    return { totalPandits, verifiedCount, kycPendingCount, newToday };
  }, [pandits]);

  const filteredPandits = useMemo(() => {
    return pandits.filter((pandit) => {
      const name = (pandit.fullName || "").toLowerCase();
      const mobile = (pandit.mobile || "").toLowerCase();
      const city = (pandit.city || "").toLowerCase();
      const query = searchTerm.toLowerCase();

      const matchesSearch =
        name.includes(query) || mobile.includes(query) || city.includes(query);

      if (!matchesSearch) return false;

      if (filterType === "active") return pandit.isActive;
      if (filterType === "verified") return pandit.isVerified;
      if (filterType === "kycPending")
        return (pandit.kycStatus || "").toLowerCase() === "pending";

      return true;
    });
  }, [pandits, searchTerm, filterType]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPandits.length / itemsPerPage)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentPandits = filteredPandits.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "P");

  return (
    <div className="an-pandit-container">
      <div className="ambient-orb orb-1"></div>
      <div className="ambient-orb orb-2"></div>
      <div className="ambient-orb orb-3"></div>

      {ToastUI}

      <header className="db-header animate-fade-in">
        <div className="db-header-left">
          <div className="header-title-container">
            <span className="enterprise-badge">
              <FaCrown className="crown-icon" /> COSMIC PANDIT NETWORK
            </span>
            <h1 className="wrapped-header-title">Pandit Management</h1>
          </div>
          <p className="header-subtitle">
            Real-time telemetry, profiles, and status controls for celestial guides.
          </p>
        </div>

        <div className="db-header-right">
<button
 className="add-ritual-btn"
 onClick={()=>setAddOpen(true)}
>
 + Add Pandit
</button>            <div className="pulse-ring"></div>
            <span className="status-text"><FaBolt /> SYSTEM LIVE</span>
        
        </div>
      </header>

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
            <h2 className="giant-stat-number">{stats.totalPandits.toLocaleString()}</h2>
            <p className="giant-stat-label">Total Active Pandits</p>
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
            <span className="trend-badge emerald-pill">
              <FaCheckCircle /> VERIFIED
            </span>
          </div>

          <div className="card-middle-data">
            <h2 className="giant-stat-number">{stats.verifiedCount.toLocaleString()}</h2>
            <p className="giant-stat-label">Verified Profiles</p>
          </div>

          <div className="card-bottom-accent">
            <div className="glow-bar emerald-bar"></div>
          </div>
        </div>

        <div className="khatarnak-card gold-theme animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <div className="card-glass-shine"></div>
          <div className="card-top-bar">
            <div className="big-icon-box gold-glow">
              <FaClock />
            </div>
            <span className="trend-badge gold-pill">
              <FaBolt /> ACTION NEEDED
            </span>
          </div>

          <div className="card-middle-data">
            <h2 className="giant-stat-number">{stats.kycPendingCount.toLocaleString()}</h2>
            <p className="giant-stat-label">KYC Verification Pending</p>
          </div>

          <div className="card-bottom-accent">
            <div className="glow-bar gold-bar"></div>
          </div>
        </div>
      </div>

      <div className="pt-controls-bar animate-fade-in">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, mobile, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-tabs">
          <button
            className={`filter-btn ${filterType === "all" ? "active" : ""}`}
            onClick={() => setFilterType("all")}
          >
            All ({pandits.length})
          </button>
          <button
            className={`filter-btn ${filterType === "active" ? "active" : ""}`}
            onClick={() => setFilterType("active")}
          >
            Active
          </button>
          <button
            className={`filter-btn ${filterType === "verified" ? "active" : ""}`}
            onClick={() => setFilterType("verified")}
          >
            Verified
          </button>
          <button
            className={`filter-btn ${filterType === "kycPending" ? "active" : ""}`}
            onClick={() => setFilterType("kycPending")}
          >
            KYC Pending
          </button>
        </div>
      </div>

      <div className="pt-content-grid animate-fade-in-delayed">
        {loading ? (
          <div className="khatarnak-loader">
            <div className="glowing-spinner"></div>
            <p>Fetching Cosmic Pandits Database...</p>
          </div>
        ) : error ? (
          <div className="table-error-box">{error}</div>
        ) : filteredPandits.length === 0 ? (
          <div className="table-error-box">No pandits found matching your search criteria.</div>
        ) : (
          <div className="pandit-cards-grid">
            {currentPandits.map((pandit) => (
              <div className="khatarnak-card pandit-card-item" key={pandit._id}>
                <div className="card-glass-shine"></div>

                <div className="pandit-card-header">
                  <span className={`bold-role-tag ${pandit.isActive ? "role-user" : "role-admin"}`}>
                    {pandit.isActive ? "ACTIVE" : "INACTIVE"}
                  </span>

                  <div className="badges-group">
                    {pandit.isVerified && (
                      <span className="trend-badge cyan-pill">
                        <FaCheckCircle /> Verified
                      </span>
                    )}
                    <span className="trend-badge gold-pill">
                      <FaStar /> {pandit.averageRating || "0.0"}
                    </span>
                  </div>
                </div>

                <div className="pandit-card-body">
                  <div className="avatar-wrapper">
                    {pandit.profilePic ? (
                      <img
                        src={pandit.profilePic}
                        alt={pandit.fullName || "Pandit"}
                        className="pandit-avatar-img"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className="giant-avatar"
                      style={{
                        display: pandit.profilePic ? "none" : "flex",
                      }}
                    >
                      {getInitial(pandit.fullName)}
                    </div>
                    <span
                      className={`online-status-dot ${pandit.isOnline ? "online" : "offline"}`}
                      title={pandit.isOnline ? "Online" : "Offline"}
                    ></span>
                  </div>

                  <h3 className="pandit-name">
                    {pandit.fullName || "Name Not Set"}
                  </h3>

                  <p className="pandit-mobile">
                    <FaPhoneAlt /> {pandit.mobile || "No Mobile"}
                  </p>

                  <div className="pandit-meta-row">
                    {pandit.city && (
                      <span className="meta-item">
                        <FaMapMarkerAlt /> {pandit.city}
                      </span>
                    )}
                    <span className="meta-item">
                      <FaBriefcase /> {pandit.experience || 0} Yrs Exp
                    </span>
                  </div>

                  <div className="specialties-row">
                    {pandit.specialties && pandit.specialties.length > 0 ? (
                      pandit.specialties.slice(0, 3).map((spec, i) => (
                        <span key={i} className="spec-tag">
                          {spec}
                        </span>
                      ))
                    ) : (
                      <span className="spec-tag empty">General Astrology</span>
                    )}
                  </div>
                </div>

                <div className="pandit-card-footer">
                  <div className="rate-info">
                    <span className="rate-amount">₹{pandit.minRate || 25}</span>
                    <span className="rate-unit">/min</span>
                  </div>

                  <div className="card-right-controls">
                    <label className="toggle-switch" title="Toggle Active Status">
                      <input
                        type="checkbox"
                        checked={!!pandit.isActive}
                        disabled={togglingId === pandit._id}
                        onChange={() => handleToggleStatus(pandit)}
                      />
                      <span className="toggle-slider"></span>
                    </label>

                    <div className="action-button-group">
                      <button
                        className="btn-square-icon"
                        onClick={() => handleView(pandit)}
                        title="View Full Profile"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="btn-square-icon"
                        onClick={() => handleEdit(pandit)}
                        title="Edit Pandit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn-square-icon btn-delete-accent"
                        onClick={() => {
                          setSelectedPandit(pandit);
                          setDeleteOpen(true);
                        }}
                        title="Delete Pandit"
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
      <div className="table-pagination-footer">
        <div className="pagination-container">

          <button
            className="pagination-btn arrow-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <FaChevronLeft />
          </button>


          {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(
            (page) => (
              <button
                key={page}
                className={`pagination-btn ${
                  currentPage === page ? "active" : ""
                }`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            )
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
      <DeleteModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
      />

      <EditPanditModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        pandit={selectedPandit}
        onUpdated={handleUpdated}
      />

      <ViewPanditModal
        isOpen={viewOpen}
        onClose={() => setViewOpen(false)}
        pandit={selectedPandit}
      />
      <AddPanditModal
 isOpen={addOpen}
 onClose={()=>setAddOpen(false)}
 onAdd={handleAddPandit}
/>
    </div>
  );
}