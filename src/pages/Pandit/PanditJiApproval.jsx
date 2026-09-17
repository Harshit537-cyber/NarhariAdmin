import React, { useEffect, useMemo, useState } from "react";
import "./Pandit.css";
import { getAllPandits ,updatePanditApproval,} from "../../api/Controller/pandit";

import {
    FaSearch,
    FaCheckCircle,
    FaClock,
    FaUsers,
    FaArrowUp,
    FaChevronLeft,
    FaChevronRight,
    FaLanguage,
    FaMapMarkerAlt,
    FaBriefcase,
    FaPhoneAlt,
    FaStar,
    FaExclamationTriangle,
    FaBolt,
    FaCrown,
} from "react-icons/fa";

/* ---------------------------------------------------
   SIMPLE TOAST
--------------------------------------------------- */

function useSimpleToast() {
    const [toastMsg, setToastMsg] = useState(null);

    const show = (message, type = "success") => {
        setToastMsg({ message, type });

        setTimeout(() => {
            setToastMsg(null);
        }, 2500);
    };

    const ToastUI = toastMsg ? (
        <div className={`pandit-toast pandit-toast-${toastMsg.type}`}>
            {toastMsg.message}
        </div>
    ) : null;

    return { show, ToastUI };
}

/* ---------------------------------------------------
   MAIN COMPONENT
--------------------------------------------------- */

export default function PanditJiApproval() {
    const [pandits, setPandits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all");

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const itemsPerPage = 8;

   const { show, ToastUI } = useSimpleToast();

    useEffect(() => {
        const fetchPandits = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await getAllPandits(
                    currentPage,
                    itemsPerPage
                );

                console.log("Pandits API Response:", response);

                setPandits(response?.data || []);
                setTotalPages(response?.totalPages || 1);
            } catch (error) {
                console.error("Get Pandits Error:", error);

                setError(
                    error?.message || "Failed to load pandits"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchPandits();
    }, [currentPage]);
const handleApproval = async (id, status) => {
    try {
     const response = await updatePanditApproval(id, {
    status: status,
});

        console.log("Approval Update Response:", response);

        show(
            status === "Approved"
                ? "Pandit approved successfully!"
                : "Pandit rejected successfully!",
            "success"
        );

        // UI mein status immediately update
        setPandits((prevPandits) =>
            prevPandits.map((pandit) =>
                pandit._id === id
                    ? {
                          ...pandit,
                          profileApprovalStatus: status,
                      }
                    : pandit
            )
        );
    } catch (error) {
        console.error("Approval Update Error:", error);

        show(
            error?.message || "Failed to update pandit approval",
            "error"
        );
    }
};
    /* ---------------------------------------------------
       STATS
    --------------------------------------------------- */

    const stats = useMemo(() => {
        const today = new Date().toDateString();

        const totalPandits = pandits.length;

        const verifiedCount = pandits.filter(
            (p) => p.isVerified
        ).length;

        const pendingApprovalCount = pandits.filter(
            (p) =>
                (p.profileApprovalStatus || "Pending") === "Pending"
        ).length;

        const incompleteCount = pandits.filter(
            (p) => !p.isProfileComplete
        ).length;

        const newToday = pandits.filter(
            (p) =>
                p.createdAt &&
                new Date(p.createdAt).toDateString() === today
        ).length;

        return {
            totalPandits,
            verifiedCount,
            pendingApprovalCount,
            incompleteCount,
            newToday,
        };
    }, [pandits]);

    /* ---------------------------------------------------
       SEARCH + FILTER
    --------------------------------------------------- */

    const filteredPandits = useMemo(() => {
        return pandits.filter((pandit) => {
            const name = (pandit.fullName || "").toLowerCase();
            const mobile = (pandit.mobile || "").toLowerCase();
            const city = (pandit.city || "").toLowerCase();

            const query = searchTerm.toLowerCase();

            const matchesSearch =
                name.includes(query) ||
                mobile.includes(query) ||
                city.includes(query);

            if (!matchesSearch) return false;

            if (filterType === "verified") {
                return pandit.isVerified;
            }

            if (filterType === "pending") {
                return (
                    (pandit.profileApprovalStatus || "Pending") ===
                    "Pending"
                );
            }

            if (filterType === "approved") {
                return (
                    pandit.profileApprovalStatus === "Approved"
                );
            }

            if (filterType === "rejected") {
                return (
                    pandit.profileApprovalStatus === "Rejected"
                );
            }

            if (filterType === "incomplete") {
                return !pandit.isProfileComplete;
            }

            return true;
        });
    }, [pandits, searchTerm, filterType]);

  const currentPandits = filteredPandits;

    const handlePageChange = (pageNumber) => {
        if (
            pageNumber >= 1 &&
            pageNumber <= totalPages
        ) {
            setCurrentPage(pageNumber);
        }
    };

    /* ---------------------------------------------------
       HELPERS
    --------------------------------------------------- */

    const getInitial = (name) => {
        return name
            ? name.charAt(0).toUpperCase()
            : "P";
    };

    const approvalBadgeStyle = (status) => {
        if (status === "Approved") {
            return {
                background: "rgba(16,185,129,0.15)",
                color: "#10b981",
            };
        }

        if (status === "Rejected") {
            return {
                background: "rgba(239,68,68,0.15)",
                color: "#ef4444",
            };
        }

        return {
            background: "rgba(234,179,8,0.15)",
            color: "#eab308",
        };
    };

    /* ---------------------------------------------------
       UI
    --------------------------------------------------- */

    return (
        <div className="an-pandit-container">

            <div className="ambient-orb orb-1"></div>
            <div className="ambient-orb orb-2"></div>
            <div className="ambient-orb orb-3"></div>

            {ToastUI}

            {/* HEADER */}

            <header className="db-header animate-fade-in">

                <div className="db-header-left">

                    <div className="header-title-container">

                        <span className="enterprise-badge">
                            <FaCrown className="crown-icon" />
                            COSMIC PANDIT NETWORK
                        </span>

                        <h1 className="wrapped-header-title">
                            Pandit Ji Approval
                        </h1>

                    </div>

                    <p className="header-subtitle">
                        Review and monitor registered pandit
                        profiles and their approval status.
                    </p>

                </div>

                <div className="db-header-right">

                    <div className="pulse-ring"></div>

                    <span className="status-text">
                        <FaBolt /> SYSTEM LIVE
                    </span>

                </div>

            </header>

            {/* STATS */}

            <div className="db-metrics-grid">

                {/* TOTAL */}

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

                        <p className="giant-stat-label">
                            Total Registered Pandits
                        </p>

                    </div>

                    <div className="card-bottom-accent">
                        <div className="glow-bar cyan-bar"></div>
                    </div>

                </div>

                {/* VERIFIED */}

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

                        <p className="giant-stat-label">
                            Verified Profiles
                        </p>

                    </div>

                    <div className="card-bottom-accent">
                        <div className="glow-bar emerald-bar"></div>
                    </div>

                </div>

                {/* PENDING */}

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

                        <p className="giant-stat-label">
                            Approval Pending
                        </p>

                    </div>

                    <div className="card-bottom-accent">
                        <div className="glow-bar gold-bar"></div>
                    </div>

                </div>

                {/* INCOMPLETE */}

                <div
                    className="khatarnak-card cyan-theme animate-slide-up"
                    style={{ animationDelay: "0.4s" }}
                >

                    <div className="card-glass-shine"></div>

                    <div className="card-top-bar">

                        <div className="big-icon-box cyan-glow">
                            <FaExclamationTriangle />
                        </div>

                        <span className="trend-badge cyan-pill">
                            INCOMPLETE
                        </span>

                    </div>

                    <div className="card-middle-data">

                        <h2 className="giant-stat-number">
                            {stats.incompleteCount.toLocaleString()}
                        </h2>

                        <p className="giant-stat-label">
                            Profiles Incomplete
                        </p>

                    </div>

                    <div className="card-bottom-accent">
                        <div className="glow-bar cyan-bar"></div>
                    </div>

                </div>

            </div>

            {/* SEARCH + FILTER */}

            <div className="pt-controls-bar animate-fade-in">

                <div className="search-box">

                    <FaSearch className="search-icon" />

                    <input
                        type="text"
                        placeholder="Search by name, mobile, or city..."
                        value={searchTerm}
                        onChange={(e) =>
                            setSearchTerm(e.target.value)
                        }
                    />

                </div>

                <div className="filter-tabs">

                    <button
                        className={`filter-btn ${filterType === "all" ? "active" : ""
                            }`}
                        onClick={() => setFilterType("all")}
                    >
                        All ({pandits.length})
                    </button>

                    <button
                        className={`filter-btn ${filterType === "pending" ? "active" : ""
                            }`}
                        onClick={() => setFilterType("pending")}
                    >
                        Approval Pending
                    </button>

                    <button
                        className={`filter-btn ${filterType === "approved" ? "active" : ""
                            }`}
                        onClick={() => setFilterType("approved")}
                    >
                        Approved
                    </button>

                    <button
                        className={`filter-btn ${filterType === "rejected" ? "active" : ""
                            }`}
                        onClick={() => setFilterType("rejected")}
                    >
                        Rejected
                    </button>

                    <button
                        className={`filter-btn ${filterType === "verified" ? "active" : ""
                            }`}
                        onClick={() => setFilterType("verified")}
                    >
                        Verified
                    </button>

                    <button
                        className={`filter-btn ${filterType === "incomplete" ? "active" : ""
                            }`}
                        onClick={() =>
                            setFilterType("incomplete")
                        }
                    >
                        Incomplete Profile
                    </button>

                </div>

            </div>

            {/* CONTENT */}

            <div className="pt-content-grid animate-fade-in-delayed">

                {loading ? (

                    <div className="khatarnak-loader">

                        <div className="glowing-spinner"></div>

                        <p>
                            Fetching Pandits Database...
                        </p>

                    </div>

                ) : error ? (

                    <div className="table-error-box">
                        {error}
                    </div>

                ) : currentPandits.length === 0 ? (

                    <div className="table-error-box">
                        No pandits found matching your search criteria.
                    </div>

                ) : (

                    <div className="pandit-cards-grid">

                        {currentPandits.map((pandit) => {

                            const approvalStatus =
                                pandit.profileApprovalStatus ||
                                "Pending";

                            return (

                                <div
                                    className="khatarnak-card pandit-card-item"
                                    key={pandit._id}
                                >

                                    <div className="card-glass-shine"></div>

                                    {/* CARD HEADER */}

                                    <div className="pandit-card-header">

                                        <span
                                            className="bold-role-tag"
                                            style={approvalBadgeStyle(
                                                approvalStatus
                                            )}
                                        >
                                            {approvalStatus.toUpperCase()}
                                        </span>

                                        <div className="badges-group">

                                            {pandit.isVerified && (
                                                <span className="trend-badge cyan-pill">
                                                    <FaCheckCircle />
                                                    Verified
                                                </span>
                                            )}

                                            <span className="trend-badge gold-pill">
                                                <FaStar />
                                                {pandit.averageRating ?? 0}
                                                {" "}
                                                ({pandit.totalReviews ?? 0})
                                            </span>

                                        </div>

                                    </div>

                                    {/* CARD BODY */}

                                    <div className="pandit-card-body">

                                        <div className="avatar-wrapper">

                                            {pandit.profilePic ? (

                                                <img
                                                    src={pandit.profilePic}
                                                    alt={
                                                        pandit.fullName ||
                                                        "Pandit"
                                                    }
                                                    className="pandit-avatar-img"
                                                    onError={(e) => {
                                                        e.target.style.display =
                                                            "none";

                                                        if (
                                                            e.target.nextSibling
                                                        ) {
                                                            e.target.nextSibling.style.display =
                                                                "flex";
                                                        }
                                                    }}
                                                />

                                            ) : null}

                                            <div
                                                className="giant-avatar"
                                                style={{
                                                    display: pandit.profilePic
                                                        ? "none"
                                                        : "flex",
                                                }}
                                            >
                                                {getInitial(
                                                    pandit.fullName
                                                )}
                                            </div>

                                            <span
                                                className={`online-status-dot ${pandit.isOnline
                                                    ? "online"
                                                    : "offline"
                                                    }`}
                                                title={
                                                    pandit.isOnline
                                                        ? "Online"
                                                        : "Offline"
                                                }
                                            ></span>

                                        </div>

                                        <h3 className="pandit-name">
                                            {pandit.fullName ||
                                                "Profile Incomplete"}
                                        </h3>

                                        <p className="pandit-mobile">
                                            <FaPhoneAlt />
                                            {pandit.mobile ||
                                                "No Mobile"}
                                        </p>

                                        <div className="pandit-meta-row">

                                            {pandit.city && (
                                                <span className="meta-item">
                                                    <FaMapMarkerAlt />
                                                    {pandit.city}
                                                </span>
                                            )}

                                            <span className="meta-item">
                                                <FaBriefcase />
                                                {pandit.experience ?? 0}
                                                {" "}Yrs Exp
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

                                            {pandit.expertise &&
                                                pandit.expertise.length > 0 ? (

                                                pandit.expertise
                                                    .slice(0, 3)
                                                    .map((spec, i) => (

                                                        <span
                                                            key={i}
                                                            className="spec-tag"
                                                        >
                                                            {spec}
                                                        </span>

                                                    ))

                                            ) : (

                                                <span className="spec-tag empty">
                                                    No expertise added
                                                </span>

                                            )}

                                        </div>

                                        {/* LANGUAGES */}

                                        {pandit.languages &&
                                            pandit.languages.length > 0 && (

                                                <div className="specialties-row">

                                                    {pandit.languages
                                                        .slice(0, 3)
                                                        .map((language, i) => (

                                                            <span
                                                                key={i}
                                                                className="spec-tag"
                                                            >
                                                                <FaLanguage
                                                                    style={{
                                                                        marginRight: 4,
                                                                    }}
                                                                />
                                                                {language}
                                                            </span>

                                                        ))}

                                                </div>

                                            )}

                                    </div>

                                    {/* CARD FOOTER */}

                                    <div className="pandit-card-footer">

                                        <div className="rate-info">

                                            <span className="rate-amount">
                                                ₹
                                                {pandit.minPoojaFee ?? 0}
                                            </span>

                                            <span className="rate-unit">
                                                /pooja
                                            </span>

                                        </div>

                                        <div className="card-right-controls">
                                            <div className="card-right-controls">
                                                <button
                                                    className="approve-btn"
                                                    onClick={() => handleApproval(pandit._id, "Approved")}
                                                >
                                                    Approve
                                                </button>

                                                <button
                                                    className="reject-btn"
                                                    onClick={() => handleApproval(pandit._id, "Rejected")}
                                                >
                                                    Reject
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

            {/* PAGINATION */}

            <div className="table-pagination-footer">

                <div className="pagination-container">

                    <button
                        className="pagination-btn arrow-btn"
                        onClick={() =>
                            handlePageChange(
                                currentPage - 1
                            )
                        }
                        disabled={currentPage === 1}
                    >
                        <FaChevronLeft />
                    </button>

                    {Array.from(
                        { length: totalPages },
                        (_, idx) => idx + 1
                    ).map((page) => (

                        <button
                            key={page}
                            className={`pagination-btn ${currentPage === page
                                ? "active"
                                : ""
                                }`}
                            onClick={() =>
                                handlePageChange(page)
                            }
                        >
                            {page}
                        </button>

                    ))}

                    <button
                        className="pagination-btn arrow-btn"
                        onClick={() =>
                            handlePageChange(
                                currentPage + 1
                            )
                        }
                        disabled={
                            currentPage === totalPages
                        }
                    >
                        <FaChevronRight />
                    </button>

                </div>

            </div>

        </div>
    );
}