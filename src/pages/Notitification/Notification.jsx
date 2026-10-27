import { useState, useEffect } from "react";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getNotificationHistory,
  sendNotification,
  deleteNotification as deleteNotificationApi,
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
  FaTimes,
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
  const [targetModel, setTargetModel] = useState("");
  const [targetIds, setTargetIds] = useState([]);
  const [targetList, setTargetList] = useState([]);
  const [targetLoading, setTargetLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const requestNotifications = async () => {
    const res = await getNotificationHistory(1, 10);
    return res.data || [];
  };

  useEffect(() => {
    let cancelled = false;

    requestNotifications()
      .then((data) => {
        if (!cancelled) setNotifications(data);
      })
      .catch((error) => {
        console.error("Notification History Error:", error);
        if (!cancelled) setNotifications([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      setNotifications(await requestNotifications());
    } catch (error) {
      console.error("Notification History Error:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTargetList = async (model) => {
    setTargetLoading(true);
    try {
      let response;
      if (model === "User") {
        response = await getAllUsers();
      } else if (model === "Partner") {
        response = await getAllPartners();
      } else if (model === "Pandit") {
        response = await getAllPandits(1, 50);
      } else {
        setTargetList([]);
        return;
      }

      const list = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.data?.data)
            ? response.data.data
            : Array.isArray(response?.pandits)
              ? response.pandits
              : [];
      setTargetList(list);
    } catch (error) {
      console.error("Notification target list error:", error);
      setTargetList([]);
      toast.error(error?.message || "Failed to load recipients.");
    } finally {
      setTargetLoading(false);
    }
  };
  const deleteNotification = async (id) => {
    try {
      await deleteNotificationApi(id);

      toast.success("Notification deleted successfully!");

      setNotifications(notifications.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Delete Notification Error:", error);
      toast.error("Failed to delete notification!");
    }
  };

  const totalSuccess = notifications.reduce(
    (sum, n) => sum + (n.successCount || 0),
    0,
  );
  const totalFailure = notifications.reduce(
    (sum, n) => sum + (n.failureCount || 0),
    0,
  );

  const closeSendModal = (force = false) => {
    if (submitLoading && !force) return;
    setShowModal(false);
    setTitle("");
    setBody("");
    setImageUrl("");
    setTargetType("all");
    setTargetModel("");
    setTargetIds([]);
    setTargetList([]);
  };

  const handleSendNotification = async () => {
    if (!title.trim() || !body.trim()) {
      toast.error("Title and message are required.");
      return;
    }

    if (targetType === "specific" && (!targetModel || targetIds.length === 0)) {
      toast.error("Select a recipient type and at least one recipient.");
      return;
    }

    const payload = {
      title: title.trim(),
      body: body.trim(),
      targetType,
      ...(targetType === "specific" ? { targetModel, targetIds } : {}),
      ...(imageUrl.trim() ? { imageUrl: imageUrl.trim() } : {}),
    };

    try {
      setSubmitLoading(true);
      await sendNotification(payload);
      toast.success("Notification sent successfully!");
      closeSendModal(true);
      setLoading(true);
      await fetchNotifications();
    } catch (error) {
      console.error("Send Notification Error:", error);
      toast.error(error?.message || "Failed to send notification.");
    } finally {
      setSubmitLoading(false);
    }
  };
  return (
    <div className="an-dashboard-container notification-page">
      <ToastContainer autoClose={3000} />
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
          <button className="btn-add-cosmic" onClick={() => setShowModal(true)}>
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
          <span className="giant-badge gold">
            {notifications.length} Records
          </span>
        </div>

        <div className="table-responsive">
          <table className="khatarnak-table">
            <thead>
              <tr>
                <th>SNo.</th>
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
                  <td
                    colSpan="7"
                    style={{ textAlign: "center", padding: "60px" }}
                  >
                    <div className="gold-loader"></div>
                  </td>
                </tr>
              ) : notifications.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    style={{ textAlign: "center", padding: "40px" }}
                  >
                    No notifications found.
                  </td>
                </tr>
              ) : (
                notifications.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>
                      <span className="main-name">
                        {item.imageUrl && (
                          <FaImage
                            style={{ marginRight: 6, color: "#b38c1b" }}
                          />
                        )}
                        {item.title}
                      </span>
                      <br />
                      <span className="desc-cell">{item.body}</span>
                    </td>

                    <td>
                      <span className="type-badge">
                        {item.targetType}
                        {item.targetUserIds?.length > 0 &&
                          ` (${item.targetUserIds.length})`}
                      </span>
                    </td>

                    <td>
                      <span
                        className="status-pill active"
                        style={{ marginRight: 6 }}
                      >
                        <FaCheckCircle /> {item.successCount}
                      </span>
                      <span className="status-pill inactive">
                        <FaTimesCircle /> {item.failureCount}
                      </span>
                    </td>

                    <td>
                      <span className="desc-cell">
                        {typeof item.sentBy === "object" && item.sentBy !== null
                          ? item.sentBy.name || item.sentBy.mobile || "System"
                          : item.sentBy || "System"}
                      </span>
                    </td>

                    <td>
                      <span className="desc-cell">
                        <FaCalendarAlt /> {formatDate(item.createdAt)}
                      </span>
                    </td>

                    <td
                      style={{
                        textAlign: "right",
                        padding: "12px 16px",
                        verticalAlign: "middle",
                      }}
                    >
                      <button
                        onClick={() => {
                          setDeleteId(item._id);
                          setShowDeleteModal(true);
                        }}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                          padding: "10px 16px",
                          minWidth: "100px",
                          height: "42px",
                          margin: "0",
                          border: "none",
                          borderRadius: "8px",
                          backgroundColor: "#fee2e2",
                          color: "#dc2626",
                          fontSize: "14px",
                          fontWeight: "600",
                          lineHeight: "1",
                          cursor: "pointer",
                          boxSizing: "border-box",
                        }}
                      >
                        <FaTrash size={16} />
                        Delete
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
        <div
          className="notification-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeSendModal();
          }}
        >
          <form
            className="notification-modal"
            onSubmit={(event) => {
              event.preventDefault();
              handleSendNotification();
            }}
          >
            <div className="notification-modal-header">
              <div>
                <span className="notification-modal-eyebrow">COSMIC ALERTS</span>
                <h2>Send Notification</h2>
              </div>
              <button
                type="button"
                className="notification-modal-close"
                onClick={closeSendModal}
                aria-label="Close notification form"
                disabled={submitLoading}
              >
                <FaTimes />
              </button>
            </div>

            <div className="notification-form-fields">
              <div className="notification-field">
                <label htmlFor="notification-title">Title</label>
                <input
                  id="notification-title"
                  type="text"
                  placeholder="Enter notification title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  maxLength={120}
                  required
                />
              </div>

              <div className="notification-field">
                <label htmlFor="notification-body">Message</label>
                <textarea
                  id="notification-body"
                  placeholder="Write your message"
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                  required
                />
              </div>

              <div className="notification-field">
                <label htmlFor="notification-target">Audience</label>
                <select
                  id="notification-target"
                  value={targetType}
                  onChange={(event) => {
                    setTargetType(event.target.value);
                    setTargetModel("");
                    setTargetIds([]);
                    setTargetList([]);
                  }}
                >
                  <option value="all">All recipients</option>
                  <option value="specific">Specific recipients</option>
                </select>
              </div>

              {targetType === "specific" && (
                <>
                  <div className="notification-field">
                    <label htmlFor="notification-model">Recipient type</label>
                    <select
                      id="notification-model"
                      value={targetModel}
                      onChange={(event) => {
                        const model = event.target.value;
                        setTargetModel(model);
                        setTargetIds([]);
                        setTargetList([]);
                        if (model) fetchTargetList(model);
                      }}
                      required
                    >
                      <option value="">Select recipient type</option>
                      <option value="User">User</option>
                      <option value="Partner">Partner</option>
                      <option value="Pandit">Pandit</option>
                    </select>
                  </div>

                  {targetModel && (
                    <div className="notification-field">
                      <label htmlFor="notification-recipients">Recipients</label>
                      <Select
                        inputId="notification-recipients"
                        className="notification-recipient-select"
                        classNamePrefix="notification-select"
                        isMulti
                        isLoading={targetLoading}
                        isDisabled={targetLoading}
                        options={targetList.map((item) => ({
                          value: item._id,
                          label:
                            item.fullName ||
                            item.name ||
                            item.mobile ||
                            item.email ||
                            item._id,
                        }))}
                        value={targetList
                          .filter((item) => targetIds.includes(item._id))
                          .map((item) => ({
                            value: item._id,
                            label:
                              item.fullName ||
                              item.name ||
                              item.mobile ||
                              item.email ||
                              item._id,
                          }))}
                        onChange={(selectedOptions) =>
                          setTargetIds(
                            (selectedOptions || []).map((option) => option.value),
                          )
                        }
                        placeholder="Search and select recipients..."
                        noOptionsMessage={() =>
                          targetLoading ? "Loading recipients..." : "No recipients found"
                        }
                      />
                    </div>
                  )}
                </>
              )}

              <div className="notification-field">
                <label htmlFor="notification-image-url">Image URL (optional)</label>
                <input
                  id="notification-image-url"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(event) => setImageUrl(event.target.value)}
                />
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="notification-cancel-button"
                onClick={closeSendModal}
                disabled={submitLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="notification-send-button"
                disabled={submitLoading || targetLoading}
              >
                <FaPaperPlane />
                {submitLoading ? "Sending..." : "Send"}
              </button>
            </div>
          </form>
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
