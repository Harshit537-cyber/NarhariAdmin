import "./UserAstroChat.css";
import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebase"
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import {
  FaCrown,
  FaBolt,
  FaSearch,
  FaComments,
  FaPaperPlane,
  FaUser,
  FaUserAstronaut,
  FaExclamationTriangle,
  FaStopCircle,
  FaShieldAlt,
  FaMoon,
  FaHistory,
  FaClock,
  FaStar,
  FaCheckDouble,
  FaFileAlt
} from "react-icons/fa";


 export default function AstrologyChatAdmin() {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [adminNote, setAdminNote] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const convSnap = await getDocs(collection(db, "conversations"));
        const sessionsData = [];

        for (const convDoc of convSnap.docs) {
          const data = convDoc.data();
          const docId = convDoc.id;

          // conversation doc ke andar do keys hain jo {name, imageUrl} rakhti hain
          const participantKeys = Object.keys(data).filter(
            (key) => data[key] && typeof data[key] === "object" && data[key].name
          );
          if (participantKeys.length < 2) continue;

          const [partnerKey, userKey] = participantKeys;
          const partner = data[partnerKey];
          const user = data[userKey];

          const msgsSnap = await getDocs(
            query(collection(db, "conversations", docId, "messages"), orderBy("createdAt", "asc"))
          );

          const messages = msgsSnap.docs.map((m) => {
            const md = m.data();
            const isPartner = md.senderId === partnerKey;
            return {
              sender: isPartner ? "pandit" : "user",
              text: md.text || "",
              time: md.createdAt?.toDate
                ? md.createdAt.toDate().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : ""
            };
          });

          sessionsData.push({
            id: docId,
            user: user?.name || "Unknown User",
            userZodiac: "",
            dob: "",
            pandit: partner?.name || "Unknown Astrologer",
            topic: "General Consultation",
            status: "Ended",
            duration: "--",
            unread: 0,
            lastMessage: messages.length ? messages[messages.length - 1].text : "No messages yet",
            flagged: false,
            messages
          });
        }

        setSessions(sessionsData);
        if (sessionsData.length > 0) setSelectedChatId(sessionsData[0].id);
      } catch (err) {
        console.error("Error fetching conversations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const [sessions, setSessions] = useState(initialSessions);

  const activeChat = sessions.find((s) => s.id === selectedChatId) || sessions[0];

  // Action Handlers
  const handleSendMessage = () => {
    if (!adminNote.trim()) return;
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === selectedChatId) {
          return {
            ...s,
            messages: [
              ...s.messages,
              { sender: "admin", text: `[ADMIN NOTE]: ${adminNote}`, time: "Just now" }
            ]
          };
        }
        return s;
      })
    );
    setAdminNote("");
  };

  const handleForceEnd = (id) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: "Ended" } : s
      )
    );
  };

  const handleToggleFlag = (id) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, flagged: !s.flagged, status: !s.flagged ? "Flagged" : "Live" } : s
      )
    );
  };

  // Filtered Sessions
  const filteredSessions = sessions.filter(
    (s) =>
      (filter === "All" ||
        (filter === "Live" && s.status === "Live") ||
        (filter === "Flagged" && (s.flagged || s.status === "Flagged")) ||
        (filter === "Queued" && s.status === "Queued") ||
        (filter === "Ended" && s.status === "Ended")) &&
      `${s.user} ${s.pandit} ${s.id} ${s.topic}`
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  // Top Metrics
  const cards = [
    {
      title: "Live Chats",
      value: sessions.filter((s) => s.status === "Live").length.toString(),
      icon: <FaComments />,
      cls: "cyan",
      pill: "ACTIVE",
    },
    {
      title: "In Queue",
      value: sessions.filter((s) => s.status === "Queued").length.toString(),
      icon: <FaClock />,
      cls: "gold",
      pill: "WAITING",
    },
    {
      title: "Flagged / Risk",
      value: sessions.filter((s) => s.flagged || s.status === "Flagged").length.toString(),
      icon: <FaExclamationTriangle />,
      cls: "red",
      pill: "ATTENTION",
    },
    {
      title: "Completed Today",
      value: "142",
      icon: <FaHistory />,
      cls: "emerald",
      pill: "SUCCESSFUL",
    },
  ];

  return (
    <div className="an-dashboard-container chat-page">
      {/* Ambient background glowing orbs */}
      <div className="ambient-orb orb-1"></div>
      <div className="ambient-orb orb-2"></div>
      <div className="ambient-orb orb-3"></div>

      {/* Page Header */}
      <header className="db-header animate-fade-in">
        <div className="db-header-left">
          <div className="header-title-container">
            <span className="enterprise-badge">
              <FaCrown className="crown-icon" /> COSMIC CHAT SURVEILLANCE
            </span>
            <h1 className="wrapped-header-title">Live Chat Control Center</h1>
          </div>
          <p className="header-subtitle">
            Monitor real-time astrologer-client conversations, enforce guidelines & broadcast admin notes.
          </p>
        </div>

        <div className="db-header-right">
          <div className="system-status-card">
            <div className="pulse-ring"></div>
            <span className="status-text"><FaBolt /> SURVEILLANCE LIVE</span>
          </div>
        </div>
      </header>

      {/* Top Metrics Row */}
      <div className="db-metrics-grid">
        {cards.map((c, i) => (
          <div
            className={`khatarnak-card ${c.cls}-theme animate-slide-up`}
            style={{ animationDelay: `${0.1 * (i + 1)}s` }}
            key={c.title}
          >
            <div className="card-glass-shine"></div>
            <div className="card-top-bar">
              <div className={`big-icon-box ${c.cls}-glow`}>{c.icon}</div>
              <span className={`trend-badge ${c.cls}-pill`}>{c.pill}</span>
            </div>

            <div className="card-middle-data">
              <h2 className="giant-stat-number">{c.value}</h2>
              <p className="giant-stat-label">{c.title}</p>
            </div>

            <div className="card-bottom-accent">
              <div className={`glow-bar ${c.cls}-bar`}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar / Search & Filters */}
      <div className="super-card toolbar-super-card animate-fade-in-delayed">
        <div className="toolbar-content">
          <div className="search-box-cosmic">
            <FaSearch className="search-icon" />
            <input
              placeholder="Search chat by User, Astrologer, Chat ID or Topic..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-tabs-cosmic">
            {["All", "Live", "Queued", "Flagged", "Ended"].map((x) => (
              <button
                key={x}
                onClick={() => setFilter(x)}
                className={`tab-btn ${filter === x ? "active" : ""}`}
              >
                {x}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Dual Pane Chat Layout */}
      <div className="chat-surveillance-wrapper animate-fade-in-delayed">
        {/* LEFT COLUMN: Active Sessions Sidebar */}
        <div className="chat-sessions-sidebar">
          <div className="sidebar-header">
            <h3>Active Conversations ({filteredSessions.length})</h3>
          </div>

          <div className="chat-list-scroll">
            {filteredSessions.map((s) => (
              <div
                key={s.id}
                onClick={() => setSelectedChatId(s.id)}
                className={`chat-item-card ${selectedChatId === s.id ? "active-item" : ""} ${
                  s.flagged ? "flagged-border" : ""
                }`}
              >
                <div className="chat-item-top">
                  <span className="session-id-tag">{s.id}</span>
                  <span className={`status-pill status-${s.status.toLowerCase()}`}>
                    <span className="status-dot"></span> {s.status}
                  </span>
                </div>

                <div className="chat-item-participants">
                  <div className="user-info">
                    <span className="avatar-mini user"><FaUser /></span>
                    <div>
                      <strong>{s.user}</strong>
                      <small>{s.userZodiac}</small>
                    </div>
                  </div>

                  <span className="vs-divider">↔</span>

                  <div className="user-info text-right">
                    <div>
                      <strong>{s.pandit}</strong>
                      <small>Astrologer</small>
                    </div>
                    <span className="avatar-mini pandit"><FaUserAstronaut /></span>
                  </div>
                </div>

                <div className="chat-item-topic">
                  <span className="topic-pill"><FaMoon /> {s.topic}</span>
                  {s.duration !== "00:00" && <span className="duration-pill"><FaClock /> {s.duration}</span>}
                </div>

                <div className="chat-item-preview">
                  <p>{s.lastMessage}</p>
                </div>
              </div>
            ))}

            {filteredSessions.length === 0 && (
              <div className="empty-chat-list">
                <p>No chat sessions matching filter.</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Live Monitor & Inspector */}
        <div className="chat-inspector-pane">
          {activeChat ? (
            <>
              {/* Active Chat Header Controls */}
              <div className="inspector-header">
                <div className="inspector-title-area">
                  <div className="chat-main-badges">
                    <span className="session-id-tag lg">{activeChat.id}</span>
                    <span className={`status-pill status-${activeChat.status.toLowerCase()}`}>
                      <span className="status-dot"></span> {activeChat.status}
                    </span>
                    {activeChat.flagged && (
                      <span className="flag-badge"><FaExclamationTriangle /> FLAGGED BY SYSTEM</span>
                    )}
                  </div>
                  <h2>{activeChat.user} & {activeChat.pandit}</h2>
                </div>

                <div className="inspector-actions">
                  <button
                    className={`btn-action-flag ${activeChat.flagged ? "flagged-active" : ""}`}
                    onClick={() => handleToggleFlag(activeChat.id)}
                    title="Flag or Report Chat"
                  >
                    <FaShieldAlt /> {activeChat.flagged ? "Unflag Chat" : "Flag Session"}
                  </button>

                  {activeChat.status === "Live" && (
                    <button
                      className="btn-action-end"
                      onClick={() => handleForceEnd(activeChat.id)}
                    >
                      <FaStopCircle /> Force End
                    </button>
                  )}
                </div>
              </div>

              {/* User Kundli / Astrology Meta Summary Bar */}
              <div className="kundli-meta-bar">
                <div className="k-meta-item">
                  <small><FaUser /> CLIENT DETAILS</small>
                  <p>{activeChat.user} ({activeChat.userZodiac})</p>
                </div>
                <div className="k-meta-item">
                  <small><FaStar /> BIRTH DETAILS</small>
                  <p>{activeChat.dob}</p>
                </div>
                <div className="k-meta-item">
                  <small><FaFileAlt /> CONSULTATION TOPIC</small>
                  <p className="topic-highlight">{activeChat.topic}</p>
                </div>
              </div>

              {/* Live Chat Message Feed */}
              <div className="chat-messages-container">
                <div className="surveillance-disclaimer">
                  <FaShieldAlt /> Live Administrative Surveillance Mode Active. Messages are logged and end-to-end encrypted.
                </div>

                {activeChat.messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`chat-bubble-wrapper bubble-${msg.sender}`}
                  >
                    {msg.sender === "system" ? (
                      <div className="system-event-message">
                        <span>{msg.text}</span>
                        <small>{msg.time}</small>
                      </div>
                    ) : (
                      <div className="chat-bubble">
                        <div className="bubble-header">
                          <span className="sender-name">
                            {msg.sender === "user" && <><FaUser /> {activeChat.user}</>}
                            {msg.sender === "pandit" && <><FaUserAstronaut /> {activeChat.pandit}</>}
                            {msg.sender === "admin" && <><FaCrown /> ADMIN OVERRIDE</>}
                          </span>
                          <span className="bubble-time">{msg.time}</span>
                        </div>
                        <p className="bubble-text">{msg.text}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Admin Broadcast / Warning Note Input Box */}
              <div className="chat-admin-input-box">
                <div className="input-prefix">
                  <FaCrown className="gold-icon" />
                  <span>Admin Broadcast Note:</span>
                </div>
                <div className="input-field-wrapper">
                  <input
                    type="text"
                    placeholder="Type official alert or warning note into conversation..."
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <button className="btn-send-admin" onClick={handleSendMessage}>
                    <FaPaperPlane /> Inject Note
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="empty-inspector-state">
              <FaComments className="huge-icon" />
              <h3>No Chat Selected</h3>
              <p>Select a live session from the left pane to begin monitoring.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}