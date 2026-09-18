import React, { useState, useEffect, useMemo } from "react";
import "./Pandit.css";
import { getAllPandits, deletePandit, updatePandit } from "../../api/Controller/pandit";
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
  FaLanguage,
  FaWallet,
  FaExclamationTriangle,
} from "react-icons/fa";



const API_URL = "/api/admin/pandits"; // apna real endpoint yahan daal dena

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
   VIEW MODAL — sab real fields dikhane ke liye
--------------------------------------------------- */
function ViewPanditModal({ isOpen, onClose, pandit }) {
  if (!isOpen || !pandit) return null;

  const dob = pandit.dateOfBirth
    ? new Date(pandit.dateOfBirth).toLocaleDateString()
    : "—";
  const joined = pandit.createdAt
    ? new Date(pandit.createdAt).toLocaleDateString()
    : "—";

  return (
    <div className="pandit-modal-overlay" onClick={onClose}>
      <div className="pandit-modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="pandit-modal-close" onClick={onClose}>
          <FaTimes />
        </button>
        <h3 className="pandit-modal-title">
          {pandit.fullName || "Profile Incomplete"}
        </h3>

        <div className="pandit-modal-grid">
          <div>
            <span className="pandit-modal-label">Mobile</span>
            <p>{pandit.mobile || "—"}</p>
          </div>
          <div>
            <span className="pandit-modal-label">City</span>
            <p>{pandit.city || "—"}</p>
          </div>
          <div>
            <span className="pandit-modal-label">Gender</span>
            <p>{pandit.gender || "—"}</p>
          </div>
          <div>
            <span className="pandit-modal-label">Date of Birth</span>
            <p>{dob}</p>
          </div>
          <div>
            <span className="pandit-modal-label">Experience</span>
            <p>{pandit.experience ?? 0} Yrs</p>
          </div>
          <div>
            <span className="pandit-modal-label">Vedic Education</span>
            <p>{pandit.vedicEducation || "—"}</p>
          </div>
          <div>
            <span className="pandit-modal-label">Primary Category</span>
            <p>{pandit.primaryCategory || "—"}</p>
          </div>
          <div>
            <span className="pandit-modal-label">Pooja Service Mode</span>
            <p>{pandit.poojaServiceMode || "—"}</p>
          </div>
          <div>
            <span className="pandit-modal-label">Min Pooja Fee</span>
            <p>₹{pandit.minPoojaFee ?? 0}</p>
          </div>
          <div>
            <span className="pandit-modal-label">Expected Monthly Earning</span>
            <p>₹{(pandit.expectedMonthlyEarnings ?? 0).toLocaleString()}</p>
          </div>
          <div>
            <span className="pandit-modal-label">Wallet Balance</span>
            <p>₹{pandit.walletBalance ?? 0}</p>
          </div>
          <div>
            <span className="pandit-modal-label">Rating</span>
            <p>
              {pandit.averageRating ?? 0} ({pandit.totalReviews ?? 0} reviews)
            </p>
          </div>
          <div>
            <span className="pandit-modal-label">Approval Status</span>
            <p>{pandit.profileApprovalStatus || "Pending"}</p>
          </div>
          <div>
            <span className="pandit-modal-label">Can Arrange Samagri</span>
            <p>{pandit.canArrangeSamagri ? "Yes" : "No"}</p>
          </div>
          <div>
            <span className="pandit-modal-label">Joined On</span>
            <p>{joined}</p>
          </div>
        </div>

        {pandit.bio && (
          <>
            <div className="pandit-modal-label" style={{ marginTop: 14 }}>
              Bio
            </div>
            <p style={{ marginTop: 6 }}>{pandit.bio}</p>
          </>
        )}

        <div className="pandit-modal-label" style={{ marginTop: 14 }}>
          Expertise
        </div>
        <div className="specialties-row" style={{ marginTop: 8 }}>
          {pandit.expertise && pandit.expertise.length > 0 ? (
            pandit.expertise.map((s, i) => (
              <span key={i} className="spec-tag">
                {s}
              </span>
            ))
          ) : (
            <span className="spec-tag empty">Not added yet</span>
          )}
        </div>

        <div className="pandit-modal-label" style={{ marginTop: 14 }}>
          Languages
        </div>
        <div className="specialties-row" style={{ marginTop: 8 }}>
          {pandit.languages && pandit.languages.length > 0 ? (
            pandit.languages.map((l, i) => (
              <span key={i} className="spec-tag">
                <FaLanguage style={{ marginRight: 4 }} />
                {l}
              </span>
            ))
          ) : (
            <span className="spec-tag empty">Not added yet</span>
          )}
        </div>

        {pandit.certificatePhotos && pandit.certificatePhotos.length > 0 && (
          <>
            <div className="pandit-modal-label" style={{ marginTop: 14 }}>
              Certificates
            </div>
            <div className="specialties-row" style={{ marginTop: 8 }}>
              {pandit.certificatePhotos.map((url, i) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="spec-tag"
                >
                  Certificate {i + 1}
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------
   EDIT MODAL
--------------------------------------------------- */
function EditPanditModal({ isOpen, onClose, pandit, onUpdated, showToast }) {
  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    dateOfBirth: "",
    gender: "",
    city: "",
    poojaServiceMode: "Online Pooja",
    primaryCategory: "",
    experience: 0,
    vedicEducation: "",
    canArrangeSamagri: false,
    expectedMonthlyEarnings: 0,
    minPoojaFee: 0,
    bio: "",
    isVerified: false,
    isProfileComplete: false,
    profileApprovalStatus: "Pending",
    isOnline: false,

    expertise: [],
    languages: [],


  

    // Single profile image
    profilePic: "",
    profilePicFile: null,
  });

  useEffect(() => {
    if (pandit) {
      setForm({
        fullName: pandit.fullName || "",
        mobile: pandit.mobile || "",
        dateOfBirth: pandit.dateOfBirth || "",
        gender: pandit.gender || "",
        city: pandit.city || "",
        poojaServiceMode: pandit.poojaServiceMode || "Online Pooja",
        primaryCategory: pandit.primaryCategory || "",
        experience: pandit.experience || 0,
        vedicEducation: pandit.vedicEducation || "",
        canArrangeSamagri: pandit.canArrangeSamagri || false,
        expectedMonthlyEarnings: pandit.expectedMonthlyEarnings || 0,
        minPoojaFee: pandit.minPoojaFee || 0,
        bio: pandit.bio || "",
        isVerified: pandit.isVerified || false,
        isProfileComplete: pandit.isProfileComplete || false,
        profileApprovalStatus: pandit.profileApprovalStatus || "Pending",
        isOnline: pandit.isOnline || false,
        expertise: pandit.expertise || [],
        languages: pandit.languages || [],
       
        profilePic: pandit.profilePic || "",
        profilePicFile: null,
      });
    }
  }, [pandit]);

  if (!isOpen || !pandit) return null;
const handleSave = async () => {
  if (!pandit?._id) {
    showToast("Pandit ID is missing", "error");
    return;
  }

  try {
    const formData = new FormData();

    // Add normal form fields
    Object.keys(form).forEach((key) => {
      // Profile picture fields ko normal data me append nahi karna
      if (key === "profilePic" || key === "profilePicFile") {
        return;
      }

      const value = form[key];

      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else if (typeof value === "boolean") {
        formData.append(key, value ? "true" : "false");
      } else if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    // Profile picture upload
    if (form.profilePicFile) {
      formData.append("profilePic", form.profilePicFile);
    }

    // Update Pandit
    const response = await updatePandit(pandit._id, formData);

    if (response?.success) {
      showToast(
        response?.message || "Pandit updated successfully",
        "success"
      );

      onUpdated(response);
      onClose();
    } else {
      showToast(
        response?.message || "Failed to update pandit",
        "error"
      );
    }
  } catch (error) {
    console.error("Update Pandit Error:", error);

    showToast(
      error?.response?.data?.message ||
        error?.message ||
        "Something went wrong while updating pandit",
      "error"
    );
  }
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
          <label>Profile Picture</label>

          {form.profilePic && (
            <img
              src={form.profilePic}
              alt="Profile"
              style={{
                width: "80px",
                height: "80px",
                objectFit: "cover",
                borderRadius: "50%",
                marginBottom: "10px",
              }}
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setForm({
                  ...form,
                  profilePicFile: file,
                  profilePic: URL.createObjectURL(file), // 👈 preview ke liye
                });
              }
            }}
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
            <label>Min Pooja Fee (₹)</label>
            <input
              type="number"
              value={form.minPoojaFee}
              onChange={(e) =>
                setForm({ ...form, minPoojaFee: Number(e.target.value) })
              }
            />
          </div>
        </div>
        <div className="pandit-form-row">


        </div>
        <div className="pandit-form-row">


        </div>
        <div className="pandit-form-group">
          <label>Date of Birth</label>
          <input
            type="date"
            value={form.dateOfBirth}
            onChange={(e) =>
              setForm({ ...form, dateOfBirth: e.target.value })
            }
          />
        </div>

        <div className="pandit-form-group">
          <label>Expected Monthly Earnings</label>
          <input
            type="number"
            value={form.expectedMonthlyEarnings}
            onChange={(e) =>
              setForm({
                ...form,
                expectedMonthlyEarnings: Number(e.target.value),
              })
            }
          />
        </div>

        <div className="pandit-form-group">
          <label>Can Arrange Samagri</label>
          <select
            value={form.canArrangeSamagri}
            onChange={(e) =>
              setForm({
                ...form,
                canArrangeSamagri: e.target.value === "true",
              })
            }
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        <div className="pandit-form-group">
          <label>Profile Approval Status</label>
          <select
            value={form.profileApprovalStatus}
            onChange={(e) =>
              setForm({
                ...form,
                profileApprovalStatus: e.target.value,
              })
            }
          >
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <div className="pandit-form-group">
          <label>Gender</label>
          <select
            value={form.gender}
            onChange={(e) =>
              setForm({
                ...form,
                gender: e.target.value,
              })
            }
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="pandit-form-group">
          <label>Pooja Service Mode</label>

          <select
            value={form.poojaServiceMode}
            onChange={(e) =>
              setForm({
                ...form,
                poojaServiceMode: e.target.value,
              })
            }
          >
            <option value="Online Pooja">Online Pooja</option>
            <option value="Offline / Home Visit">Offline / Home Visit</option>
            <option value="Both">Both</option>
          </select>
        </div>

        <div className="pandit-form-group">
          <label>Primary Category</label>
          <input
            type="text"
            value={form.primaryCategory}
            onChange={(e) =>
              setForm({
                ...form,
                primaryCategory: e.target.value,
              })
            }
          />
        </div>

        <div className="pandit-form-group">
          <label>Vedic Education</label>
          <input
            type="text"
            value={form.vedicEducation}
            onChange={(e) =>
              setForm({
                ...form,
                vedicEducation: e.target.value,
              })
            }
          />
        </div>

        <div className="pandit-form-group">
          <label>Bio</label>
          <textarea
            value={form.bio}
            onChange={(e) =>
              setForm({
                ...form,
                bio: e.target.value,
              })
            }
          />
        </div>

        <div className="pandit-form-group">
          <label>Is Verified</label>
          <select
            value={form.isVerified}
            onChange={(e) =>
              setForm({
                ...form,
                isVerified: e.target.value === "true",
              })
            }
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        <div className="pandit-form-group">
          <label>Online Status</label>
          <select
            value={form.isOnline}
            onChange={(e) =>
              setForm({
                ...form,
                isOnline: e.target.value === "true",
              })
            }
          >
            <option value="true">Online</option>
            <option value="false">Offline</option>
          </select>
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
   SIMPLE TOAST
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

/* ---------------------------------------------------
   ADD MODAL
--------------------------------------------------- */
function AddPanditModal({ isOpen, onClose, onAdd }) {
  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    city: "",
    experience: 0,
    minPoojaFee: 0,
    primaryCategory: "",
    poojaServiceMode: "Both",
  });

  if (!isOpen) return null;

  const handleSave = () => {
    onAdd({
      _id: Date.now().toString(),
      ...form,
      role: "pandit",
      isVerified: false,
      isProfileComplete: false,
      profileApprovalStatus: "Pending",
      isOnline: false,
      averageRating: 0,
      totalReviews: 0,
      walletBalance: 0,
      expertise: [],
      languages: [],
      certificatePhotos: [],
      canArrangeSamagri: false,
      createdAt: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <div className="pandit-modal-overlay" onClick={onClose}>
      <div className="pandit-modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="pandit-modal-close" onClick={onClose}>
          <FaTimes />
        </button>
        <h3 className="pandit-modal-title">Add New Pandit</h3>

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
            <label>Experience</label>
            <input
              type="number"
              value={form.experience}
              onChange={(e) =>
                setForm({ ...form, experience: Number(e.target.value) })
              }
            />
          </div>
          <div className="pandit-form-group">
            <label>Min Pooja Fee (₹)</label>
            <input
              type="number"
              value={form.minPoojaFee}
              onChange={(e) =>
                setForm({ ...form, minPoojaFee: Number(e.target.value) })
              }
            />
          </div>
        </div>
        <div className="pandit-form-group">
          <label>Primary Category</label>
          <input
            value={form.primaryCategory}
            onChange={(e) =>
              setForm({ ...form, primaryCategory: e.target.value })
            }
          />
        </div>

        <div className="pandit-modal-actions">
          <button className="pandit-btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="pandit-btn-primary" onClick={handleSave}>
            Add Pandit
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------
   MAIN COMPONENT
--------------------------------------------------- */
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
  const [totalPages, setTotalPages] = useState(1);

  const itemsPerPage = 8;

  const { show: showToast, ToastUI } = useSimpleToast();
  useEffect(() => {
    const fetchPandits = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getAllPandits(currentPage, itemsPerPage);

        setPandits(data?.data || []);
        setTotalPages(data?.totalPages || 1);

      } catch (error) {
        setError(error.message || "Failed to load pandits");
      } finally {
        setLoading(false);
      }
    };

    fetchPandits();

  }, [currentPage]);
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
    setPandits((prev) => [newPandit, ...prev]);
    showToast("Pandit added successfully");
  };

  // isVerified ko toggle karta hai (API me "isActive" naam ka field nahi hai)
  const handleToggleVerified = (pandit) => {
    setTogglingId(pandit._id);

    setPandits((prev) =>
      prev.map((p) =>
        p._id === pandit._id ? { ...p, isVerified: !p.isVerified } : p
      )
    );

    setTimeout(() => {
      showToast(
        pandit.isVerified
          ? "Pandit unverified"
          : "Pandit verified successfully"
      );
      setTogglingId(null);
    }, 400);
  };

  const handleApprove = (pandit) => {
    setPandits((prev) =>
      prev.map((p) =>
        p._id === pandit._id ? { ...p, profileApprovalStatus: "Approved" } : p
      )
    );
    showToast("Pandit approved");
  };

  const handleReject = (pandit) => {
    setPandits((prev) =>
      prev.map((p) =>
        p._id === pandit._id ? { ...p, profileApprovalStatus: "Rejected" } : p
      )
    );
    showToast("Pandit rejected", "error");
  };
  const confirmDelete = async () => {
    console.log("selectedPandit:", selectedPandit);

    try {
      await deletePandit(selectedPandit._id);

      setPandits((prev) =>
        prev.filter((pandit) => pandit._id !== selectedPandit._id)
      );

      showToast("Pandit deleted successfully");

    } catch (error) {
      console.log("Delete error:", error);
      showToast("Failed to delete pandit", "error");
    } finally {
      setDeleteOpen(false);
      setSelectedPandit(null);
    }
  };

  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const totalPandits = pandits.length;
    const verifiedCount = pandits.filter((p) => p.isVerified).length;
    const pendingApprovalCount = pandits.filter(
      (p) => (p.profileApprovalStatus || "Pending") === "Pending"
    ).length;
    const incompleteCount = pandits.filter((p) => !p.isProfileComplete).length;
    const newToday = pandits.filter(
      (p) => p.createdAt && new Date(p.createdAt).toDateString() === today
    ).length;
    return {
      totalPandits,
      verifiedCount,
      pendingApprovalCount,
      incompleteCount,
      newToday,
    };
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

      if (filterType === "verified") return pandit.isVerified;
      if (filterType === "pending")
        return (pandit.profileApprovalStatus || "Pending") === "Pending";
      if (filterType === "incomplete") return !pandit.isProfileComplete;

      return true;
    });
  }, [pandits, searchTerm, filterType]);



  const currentPandits = filteredPandits;

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "P");

  const approvalBadgeStyle = (status) => {
    if (status === "Approved")
      return { background: "rgba(16,185,129,0.15)", color: "#10b981" };
    if (status === "Rejected")
      return { background: "rgba(239,68,68,0.15)", color: "#ef4444" };
    return { background: "rgba(234,179,8,0.15)", color: "#eab308" }; // Pending
  };

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
            Real-time profiles, approvals, and verification controls for
            registered pandits.
          </p>
        </div>

        <div className="db-header-right">

          <div className="pulse-ring"></div>
          <span className="status-text">
            <FaBolt /> SYSTEM LIVE
          </span>
        </div>
      </header>

      <div className="db-metrics-grid">
        <div
          className="khatarnak-card cyan-theme animate-slide-up"
          style={{ animationDelay: "0.1s" }}
        >
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
            <h2 className="giant-stat-number">
              {stats.totalPandits.toLocaleString()}
            </h2>
            <p className="giant-stat-label">Total Registered Pandits</p>
          </div>
          <div className="card-bottom-accent">
            <div className="glow-bar cyan-bar"></div>
          </div>
        </div>

        <div
          className="khatarnak-card emerald-theme animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
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
            <h2 className="giant-stat-number">
              {stats.verifiedCount.toLocaleString()}
            </h2>
            <p className="giant-stat-label">Verified Profiles</p>
          </div>
          <div className="card-bottom-accent">
            <div className="glow-bar emerald-bar"></div>
          </div>
        </div>

        <div
          className="khatarnak-card gold-theme animate-slide-up"
          style={{ animationDelay: "0.3s" }}
        >
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
            <h2 className="giant-stat-number">
              {stats.pendingApprovalCount.toLocaleString()}
            </h2>
            <p className="giant-stat-label">Approval Pending</p>
          </div>
          <div className="card-bottom-accent">
            <div className="glow-bar gold-bar"></div>
          </div>
        </div>

        <div
          className="khatarnak-card cyan-theme animate-slide-up"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="card-glass-shine"></div>
          <div className="card-top-bar">
            <div className="big-icon-box cyan-glow">
              <FaExclamationTriangle />
            </div>
            <span className="trend-badge cyan-pill">INCOMPLETE</span>
          </div>
          <div className="card-middle-data">
            <h2 className="giant-stat-number">
              {stats.incompleteCount.toLocaleString()}
            </h2>
            <p className="giant-stat-label">Profiles Incomplete</p>
          </div>
          <div className="card-bottom-accent">
            <div className="glow-bar cyan-bar"></div>
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
            className={`filter-btn ${filterType === "verified" ? "active" : ""
              }`}
            onClick={() => setFilterType("verified")}
          >
            Verified
          </button>
          <button
            className={`filter-btn ${filterType === "pending" ? "active" : ""
              }`}
            onClick={() => setFilterType("pending")}
          >
            Approval Pending
          </button>
          <button
            className={`filter-btn ${filterType === "incomplete" ? "active" : ""
              }`}
            onClick={() => setFilterType("incomplete")}
          >
            Incomplete Profile
          </button>
        </div>
      </div>

      <div className="pt-content-grid animate-fade-in-delayed">
        {loading ? (
          <div className="khatarnak-loader">
            <div className="glowing-spinner"></div>
            <p>Fetching Pandits Database...</p>
          </div>
        ) : error ? (
          <div className="table-error-box">{error}</div>
        ) : filteredPandits.length === 0 ? (
          <div className="table-error-box">
            No pandits found matching your search criteria.
          </div>
        ) : (
          <div className="pandit-cards-grid">
            {currentPandits.map((pandit) => {
              const approvalStatus = pandit.profileApprovalStatus || "Pending";
              return (
                <div
                  className="khatarnak-card pandit-card-item"
                  key={pandit._id}
                >
                  <div className="card-glass-shine"></div>

                  <div className="pandit-card-header">
                    <span
                      className="bold-role-tag"
                      style={approvalBadgeStyle(approvalStatus)}
                    >
                      {approvalStatus.toUpperCase()}
                    </span>

                    <div className="badges-group">
                      {pandit.isVerified && (
                        <span className="trend-badge cyan-pill">
                          <FaCheckCircle /> Verified
                        </span>
                      )}
                      <span className="trend-badge gold-pill">
                        <FaStar /> {pandit.averageRating ?? 0} (
                        {pandit.totalReviews ?? 0})
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
                        style={{ display: pandit.profilePic ? "none" : "flex" }}
                      >
                        {getInitial(pandit.fullName)}
                      </div>
                      <span
                        className={`online-status-dot ${pandit.isOnline ? "online" : "offline"
                          }`}
                        title={pandit.isOnline ? "Online" : "Offline"}
                      ></span>
                    </div>

                    <h3 className="pandit-name">
                      {pandit.fullName || "Profile Incomplete"}
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
                        <FaBriefcase /> {pandit.experience ?? 0} Yrs Exp
                      </span>
                    </div>

                    {pandit.primaryCategory && (
                      <div className="pandit-meta-row">
                        <span className="meta-item">
                          {pandit.primaryCategory}
                        </span>
                        {pandit.poojaServiceMode && (
                          <span className="meta-item">
                            {pandit.poojaServiceMode}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="specialties-row">
                      {pandit.expertise && pandit.expertise.length > 0 ? (
                        pandit.expertise.slice(0, 3).map((spec, i) => (
                          <span key={i} className="spec-tag">
                            {spec}
                          </span>
                        ))
                      ) : (
                        <span className="spec-tag empty">
                          No expertise added
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pandit-card-footer">
                    <div className="rate-info">
                      <span className="rate-amount">
                        ₹{pandit.minPoojaFee ?? 0}
                      </span>
                      <span className="rate-unit">/pooja</span>
                    </div>

                    <div className="card-right-controls">


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
              );
            })}
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
                className={`pagination-btn ${currentPage === page ? "active" : ""
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
        showToast={showToast}
      />

      <ViewPanditModal
        isOpen={viewOpen}
        onClose={() => setViewOpen(false)}
        pandit={selectedPandit}
      />

      <AddPanditModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={handleAddPandit}
      />
    </div>
  );
}