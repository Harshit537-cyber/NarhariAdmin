import React, { useState, useEffect } from "react";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    getNotificationHistory, sendNotification, deleteNotification as deleteNotificationApi
} from "../../api/Controller/notifications";
import { getAllUsers } from "../../api/Controller/authController";
import { getAllPartners } from "../../api/Controller/partner";
import { getAllPandits } from "../../api/Controller/pandit";
import {
    FaCrown,
    FaPaperPlane,
    FaCalendarAlt,

    FaTrash,
    FaCheckCircle,
    FaTimesCircle,
    FaImage,
} from "react-icons/fa";

import "./Notification.css";



const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

const PushNotification = () => {

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [targetType, setTargetType] = useState("all");
    const [image, setImage] = useState(null);
    const [targetModel, setTargetModel] = useState("");
    const [targetIds, setTargetIds] = useState([]);
    const [targetList, setTargetList] = useState([]);
    const [openDropdown, setOpenDropdown] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        setLoading(true);

        try {
            const res = await getNotificationHistory(1, 10);

            setNotifications(res.data || []);

        } catch (error) {
            console.error("Notification History Error:", error);
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchTargetList = async (model) => {
        try {
            if (model === "User") {
                const res = await getAllUsers();
                setTargetList(res.data || []);
            } else if (model === "Partner") {
                const res = await getAllPartners();
                setTargetList(res.data || []);
            } else if (model === "Pandit") {
                const res = await getAllPandits(1, 50);
                setTargetList(res.pandits || []); // yaha "pandits" key use karo, "data" nahi
            } else {
                setTargetList([]);
            }
        } catch (error) {
            console.log(error);
            setTargetList([]);
        }
    };
    const deleteNotification = async (id) => {
        try {
            await deleteNotificationApi(id);

            toast.success("Notification deleted successfully!");

            setNotifications(
                notifications.filter((item) => item._id !== id)
            );
        } catch (error) {
            console.error("Delete Notification Error:", error);
            toast.error("Failed to delete notification!");
        }
    };

    const totalSuccess = notifications.reduce((sum, n) => sum + (n.successCount || 0), 0);
    const totalFailure = notifications.reduce((sum, n) => sum + (n.failureCount || 0), 0);
    const handleSendNotification = async () => {
        const formData = new FormData();

        formData.append("title", title);
        formData.append("body", body);

        if (targetType === "all") {
            formData.append("targetType", "all");
        } else {
            // users, partners, pandits, specific -- sab backend ke liye "specific" hai
            formData.append("targetType", targetType);
            formData.append("targetModel", targetModel);
            formData.append("targetIds", JSON.stringify(targetIds));
        }

        if (imageUrl) formData.append("imageUrl", imageUrl);

        try {
            const res = await sendNotification(formData);

            console.log("Notification Sent:", res);

            toast.success("Notification sent successfully! ");

            setShowModal(false);
            setTitle("");
            setBody("");
            setImageUrl("");
            setTargetType("all");
            setTargetModel("");
            setTargetIds([]);
            setTargetList([]);

            fetchNotifications();
        } catch (error) {
            console.error("Send Notification Error:", error);
            toast.error("Failed to send notification!");
        }
    };
    return (
        <div className="an-dashboard-container notification-page">
            <ToastContainer />
            <div className="ambient-orb orb-1"></div>
            <div className="ambient-orb orb-2"></div>
            <div className="ambient-orb orb-3"></div>

            <header className="db-header animate-fade-in">
                <div className="db-header-left">
                    <div className="header-title-container">
                        <span className="enterprise-badge">
                            <FaCrown className="crown-icon" /> COSMIC ALERTS HUB
                        </span>
                        <h1 className="wrapped-header-title">Notification Manager</h1>
                    </div>
                    <p className="header-subtitle">
                        Track sent notifications, delivery status, and audience reach.
                    </p>
                </div>

                <div className="db-header-right">
                    <button
                        className="btn-add-cosmic"
                        onClick={() => setShowModal(true)}
                    >
                        <FaPaperPlane /> Send Notification
                    </button>
                </div>
            </header>

            <div className="commission-summary-row animate-fade-in-delayed">
                <div className="summary-pill-card">
                    <span className="summary-label">Total Notifications</span>
                    <span className="summary-value">{notifications.length}</span>
                </div>
                <div className="summary-pill-card">
                    <span className="summary-label">Total Success</span>
                    <span className="summary-value paid">{totalSuccess}</span>
                </div>
                <div className="summary-pill-card">
                    <span className="summary-label">Total Failed</span>
                    <span className="summary-value pending" style={{ color: "#ef4444" }}>
                        {totalFailure}
                    </span>
                </div>
            </div>

            <div className="super-card main-table-card animate-fade-in-delayed">
                <div className="super-card-header">
                    <div className="header-accent-title">
                        <div className="title-vertical-bar gold"></div>
                        <h2>Notification Log</h2>
                    </div>
                    <span className="giant-badge gold">{notifications.length} Records</span>
                </div>

                <div className="table-responsive">
                    <table className="khatarnak-table">
                        <thead>
                            <tr>
                                <th>NOTIFICATION</th>
                                <th>TARGET TYPE</th>
                                <th>DELIVERY</th>
                                <th>SENT BY</th>
                                <th>DATE</th>
                                <th style={{ textAlign: "right" }}>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: "center", padding: "60px" }}>
                                        <div className="gold-loader"></div>
                                    </td>
                                </tr>
                            ) : notifications.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: "center", padding: "40px" }}>
                                        No notifications found.
                                    </td>
                                </tr>
                            ) : (
                                notifications.map((item) => (
                                    <tr key={item._id}>
                                        <td>
                                            <span className="main-name">
                                                {item.imageUrl && <FaImage style={{ marginRight: 6, color: "#b38c1b" }} />}
                                                {item.title}
                                            </span>
                                            <br />
                                            <span className="desc-cell">{item.body}</span>
                                        </td>

                                        <td>
                                            <span className="type-badge">
                                                {item.targetType}
                                                {item.targetUserIds?.length > 0 && ` (${item.targetUserIds.length})`}
                                            </span>
                                        </td>

                                        <td>
                                            <span className="status-pill active" style={{ marginRight: 6 }}>
                                                <FaCheckCircle /> {item.successCount}
                                            </span>
                                            <span className="status-pill inactive">
                                                <FaTimesCircle /> {item.failureCount}
                                            </span>
                                        </td>

                                        <td>
                                            <span className="desc-cell">{item.sentBy || "System"}</span>
                                        </td>

                                        <td>
                                            <span className="desc-cell">
                                                <FaCalendarAlt /> {formatDate(item.createdAt)}
                                            </span>
                                        </td>

                                        <td style={{ textAlign: "right" }}>

                                            <button
                                                onClick={() => {
                                                    setDeleteId(item._id);
                                                    setShowDeleteModal(true);
                                                }}
                                                className="btn-pro btn-pro-delete"
                                            >
                                                <FaTrash /> Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>


            {showModal && (
                <div className="notification-modal-overlay">
                    <div className="notification-modal">

                        <h2>Send Notification</h2>
                        <label>Title</label>
                        <input
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <label>Body</label>
                        <textarea
                            placeholder="Body"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                        />

                        <select
                            value={targetType}
                            onChange={(e) => {
                                const val = e.target.value;
                                setTargetType(val);
                                setTargetIds([]);

                                if (val === "users") {
                                    setTargetModel("User");
                                    fetchTargetList("User");
                                } else if (val === "partners") {
                                    setTargetModel("Partner");
                                    fetchTargetList("Partner");
                                } else if (val === "pandits") {
                                    setTargetModel("Pandit");
                                    fetchTargetList("Pandit");
                                } else if (val === "specific") {
                                    setTargetModel("");
                                    setTargetList([]);
                                } else {
                                    setTargetModel("");
                                    setTargetList([]);
                                }
                            }}
                        >
                            <option value="all">All</option>
                            <option value="users">Users</option>
                            <option value="partners">Partners</option>
                            <option value="pandits">Pandits</option>
                            <option value="specific">Specific</option>
                        </select>

                        {targetType === "specific" && (
                            <select
                                value={targetModel}
                                onChange={(e) => {
                                    setTargetModel(e.target.value);
                                    fetchTargetList(e.target.value);
                                }}
                            >
                                <option value="">Select Target Model</option>
                                <option value="User">User</option>
                                <option value="Partner">Partner</option>
                                <option value="Pandit">Pandit</option>
                            </select>
                        )}

                        {(targetType === "users" ||
                            targetType === "partners" ||
                            targetType === "pandits" ||
                            targetType === "specific") && (

                                <div className="custom-dropdown">

                                    <div
                                        className="dropdown-box"
                                        onClick={() => setOpenDropdown(!openDropdown)}
                                    >
                                        {targetIds[0]
                                            ? (
                                                targetList.find(item => item._id === targetIds[0])?.fullName ||
                                                targetList.find(item => item._id === targetIds[0])?.name ||
                                                targetList.find(item => item._id === targetIds[0])?.mobile
                                            )
                                            : `Select ${targetType}`
                                        }
                                    </div>


                                    {openDropdown && (
                                        <div className="dropdown-list">

                                            {targetList.map((item) => (
                                                <div
                                                    key={item._id}
                                                    className="dropdown-item"
                                                    onClick={() => {
                                                        setTargetIds([item._id]);
                                                        setOpenDropdown(false);
                                                    }}
                                                >

                                                    <img
                                                        src={item.profilePic || "/default-user.png"}
                                                        alt=""
                                                    />

                                                    <div>
                                                        <div className="dropdown-name">
                                                            {item.fullName || item.name || item.mobile}
                                                        </div>

                                                        <small>
                                                            {item.mobile}
                                                        </small>
                                                    </div>

                                                </div>
                                            ))}

                                        </div>
                                    )}

                                </div>
                            )}
                        {/* Image field sirf "all" ke liye dikhega */}
                        <label>Image URL</label>
                        {targetType === "all" && (

                            <input
                                type="text"
                                placeholder="Paste Image URL"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                            />
                        )}

                        {/* targetType display field last me */}
                        {targetType !== "all" && (
                            <input
                                className="target-display-input"
                                type="text"
                                value={`Target: ${targetType}`}
                                disabled
                                style={{ background: "#f1f5f9", color: "#526075" }}
                            />
                        )}

                        <div className="modal-actions">
                            <button onClick={() => setShowModal(false)}>
                                Cancel
                            </button>

                            <button onClick={handleSendNotification}>
                                Send
                            </button>
                        </div>

                    </div>
                </div>
            )}
            {showDeleteModal && (
                <div className="delete-modal-overlay">
                    <div className="delete-modal">
                        <div className="delete-icon">
                            <FaTrash />
                        </div>

                        <h2>Delete Notification?</h2>

                        <p>Are you sure you want to delete this notification?</p>

                        <div className="delete-modal-actions">
                            <button
                                className="cancel-delete-btn"
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setDeleteId(null);
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                className="confirm-delete-btn"
                                onClick={() => {
                                    deleteNotification(deleteId);
                                    setShowDeleteModal(false);
                                    setDeleteId(null);
                                }}
                            >
                                <FaTrash /> Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PushNotification;