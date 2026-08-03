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
  FaFileAlt,
  FaSpinner
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

  const hasAutoSelected = useRef(false);

  // Live-listen to the conversations collection so new/updated chats show up
  // without a manual refresh.
  useEffect(() => {
    const q = query(collection(db, "conversations"), orderBy("lastMessageAt", "desc"));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const sessionsData = snap.docs
          .map((convDoc) => {
            const data = convDoc.data();
            const docId = convDoc.id;
            const info = data.participantsInfo || {};
            const infoKeys = Object.keys(info);

            if (infoKeys.length < 2) return null; // malformed/incomplete doc, skip it

            let partnerKey = infoKeys.find((k) => isPartnerId(k, info[k]));
            let userKey = infoKeys.find((k) => k !== partnerKey);
            if (!partnerKey) {
              // fallback: couldn't confidently tell them apart, just pick an order
              [partnerKey, userKey] = infoKeys;
            }

            const partner = info[partnerKey] || {};
            const user = info[userKey] || {};
            const lastMessage = data.lastMessage || {};
            const lastMessageAt = data.lastMessageAt || lastMessage.lastMessageAt || null;

            return {
              id: docId,
              userId: userKey,
              partnerId: partnerKey,
              user: user.name || "Unknown User",
              userImage: user.imageUrl || "",
              userZodiac: "", // not present in this schema
              dob: "", // not present in this schema
              pandit: partner.name || "Unknown Astrologer",
              panditImage: partner.imageUrl || "",
              topic: "General Consultation", // not present in this schema
              adminOverrideStatus: data.adminOverrideStatus || null,
              status: deriveStatus(lastMessageAt, data.adminOverrideStatus),
              lastMessageAt,
              unreadCount: data.unreadCount || {},
              flagged: data.adminOverrideStatus === "Flagged",
              lastMessage: lastMessage.text || "No messages yet",
              lastMessageSenderId: lastMessage.senderId || null
            };
          })
          .filter(Boolean);

        setSessions(sessionsData);
        setLoading(false);

        if (!hasAutoSelected.current && sessionsData.length > 0) {
          hasAutoSelected.current = true;
          setSelectedChatId(sessionsData[0].id);
        }
      },
      (err) => {
        console.error("Error listening to conversations:", err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  // Live-listen to messages for whichever chat is selected.
  useEffect(() => {
    if (!selectedChatId) {
      setMessages([]);
      return;
    }

    setMessagesLoading(true);
    const msgsQuery = query(
      collection(db, "conversations", selectedChatId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(
      msgsQuery,
      (snap) => {
        const active = sessions.find((s) => s.id === selectedChatId);
        const msgs = snap.docs.map((m) => {
          const md = m.data();
          let sender = "user";
          if (active) {
            if (md.senderId === active.partnerId) sender = "pandit";
            else if (md.senderId === active.userId) sender = "user";
            else sender = "admin"; // e.g. injected admin notes written to this same subcollection
          }
          return {
            id: m.id,
            sender,
            text: md.text || "",
            time: formatTime(md.createdAt)
          };
        });
        setMessages(msgs);
        setMessagesLoading(false);
      },
      (err) => {
        console.error("Error listening to messages:", err);
        setMessagesLoading(false);
      }
    );

    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChatId]);

  const activeChat = sessions.find((s) => s.id === selectedChatId) || null;

  // Action Handlers — these now persist to Firestore instead of only touching
  // local state, so they survive refresh and sync across admin sessions.

  const handleSendMessage = async () => {
    if (!adminNote.trim() || !selectedChatId) return;
    try {
      // NOTE: adjust this to however your app actually models an injected admin
      // message. If admin notes shouldn't appear in the user/astrologer's chat
      // thread, write them to a separate "adminNotes" subcollection instead of
      // the shared "messages" subcollection.
      const { addDoc, serverTimestamp } = await import("firebase/firestore");
      await addDoc(collection(db, "conversations", selectedChatId, "messages"), {
        senderId: "admin",
        text: `[ADMIN NOTE]: ${adminNote}`,
        createdAt: serverTimestamp()
      });
      setAdminNote("");
    } catch (err) {
      console.error("Error sending admin note:", err);
    }
  };

  const handleForceEnd = async (id) => {
    try {
      await updateDoc(doc(db, "conversations", id), {
        adminOverrideStatus: "Ended"
      });
    } catch (err) {
      console.error("Error force-ending chat:", err);
    }
  };

  const handleToggleFlag = async (id) => {
    const chat = sessions.find((s) => s.id === id);
    if (!chat) return;
    try {
      await updateDoc(doc(db, "conversations", id), {
        adminOverrideStatus: chat.flagged ? null : "Flagged"
      });
    } catch (err) {
      console.error("Error toggling flag:", err);
    }
  };

  // Filtered Sessions
  const filteredSessions = sessions.filter(
    (s) =>
      (filter === "All" ||
        (filter === "Live" && s.status === "Live") ||
        (filter === "Flagged" && s.flagged) ||
        (filter === "Ended" && s.status === "Ended")) &&
      `${s.user} ${s.pandit} ${s.id} ${s.topic}`.toLowerCase().includes(search.toLowerCase())
  );

  // Top Metrics
  const cards = [
    {
      title: "Live Chats",
      value: sessions.filter((s) => s.status === "Live").length.toString(),
      icon: <FaComments />,
      cls: "cyan",
      pill: "ACTIVE"
    },
    {
      title: "Flagged / Risk",
      value: sessions.filter((s) => s.flagged).length.toString(),
      icon: <FaExclamationTriangle />,
      cls: "red",
      pill: "ATTENTION"
    },
    {
      title: "Ended",
      value: sessions.filter((s) => s.status === "Ended").length.toString(),
      icon: <FaHistory />,
      cls: "emerald",
      pill: "CLOSED"
    }
  ];

  return (
    <div className="an-dashboard-container chat-page">
      <div className="ambient-orb orb-1"></div>
      <div className="ambient-orb orb-2"></div>
      <div className="ambient-orb orb-3"></div>

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
            <span className="status-text">
              <FaBolt /> SURVEILLANCE LIVE
            </span>
          </div>
        </div>
      </header>

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

      <div className="super-card toolbar-super-card animate-fade-in-delayed">
        <div className="toolbar-content">
          <div className="search-box-cosmic">
            <FaSearch className="search-icon" />
            <input
              placeholder="Search chat by User, Astrologer, or Chat ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-tabs-cosmic">
            {["All", "Live", "Flagged", "Ended"].map((x) => (
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

      <div className="chat-surveillance-wrapper animate-fade-in-delayed">
        <div className="chat-sessions-sidebar">
          <div className="sidebar-header">
            <h3>Active Conversations ({filteredSessions.length})</h3>
          </div>

          {loading ? (
            <div className="empty-chat-list">
              <FaSpinner className="spin-icon" style={{ animation: "spin 1s linear infinite" }} />
              <p>Loading conversations...</p>
            </div>
          ) : (
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
                      <span className="avatar-mini user">
                        <FaUser />
                      </span>
                      <div>
                        <strong>{s.user}</strong>
                      </div>
                    </div>

                    <span className="vs-divider">↔</span>

                    <div className="user-info text-right">
                      <div>
                        <strong>{s.pandit}</strong>
                        <small>Astrologer</small>
                      </div>
                      <span className="avatar-mini pandit">
                        <FaUserAstronaut />
                      </span>
                    </div>
                  </div>

                  <div className="chat-item-topic">
                    <span className="topic-pill">
                      <FaMoon /> {s.topic}
                    </span>
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
          )}
        </div>

        <div className="chat-inspector-pane">
          {loading ? (
            <div className="empty-inspector-state">
              <FaSpinner className="huge-icon" style={{ animation: "spin 1s linear infinite" }} />
              <h3>Loading Sessions</h3>
              <p>Fetching live conversations from the database...</p>
            </div>
          ) : activeChat ? (
            <>
              <div className="inspector-header">
                <div className="inspector-title-area">
                  <div className="chat-main-badges">
                    <span className="session-id-tag lg">{activeChat.id}</span>
                    <span className={`status-pill status-${activeChat.status.toLowerCase()}`}>
                      <span className="status-dot"></span> {activeChat.status}
                    </span>
                    {activeChat.flagged && (
                      <span className="flag-badge">
                        <FaExclamationTriangle /> FLAGGED BY ADMIN
                      </span>
                    )}
                  </div>
                  <h2>
                    {activeChat.user} & {activeChat.pandit}
                  </h2>
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
                    <button className="btn-action-end" onClick={() => handleForceEnd(activeChat.id)}>
                      <FaStopCircle /> Force End
                    </button>
                  )}
                </div>
              </div>

              <div className="kundli-meta-bar">
                <div className="k-meta-item">
                  <small>
                    <FaUser /> CLIENT
                  </small>
                  <p>{activeChat.user}</p>
                </div>
                <div className="k-meta-item">
                  <small>
                    <FaStar /> ASTROLOGER
                  </small>
                  <p>{activeChat.pandit}</p>
                </div>
                <div className="k-meta-item">
                  <small>
                    <FaFileAlt /> CONSULTATION TOPIC
                  </small>
                  <p className="topic-highlight">{activeChat.topic}</p>
                </div>
              </div>

              <div className="chat-messages-container">
                <div className="surveillance-disclaimer">
                  <FaShieldAlt /> Live Administrative Surveillance Mode Active. Messages are logged.
                </div>

                {messagesLoading ? (
                  <div className="empty-chat-list">
                    <FaSpinner className="spin-icon" style={{ animation: "spin 1s linear infinite" }} />
                    <p>Loading messages...</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className={`chat-bubble-wrapper bubble-${msg.sender}`}>
                      <div className="chat-bubble">
                        <div className="bubble-header">
                          <span className="sender-name">
                            {msg.sender === "user" && (
                              <>
                                <FaUser /> {activeChat.user}
                              </>
                            )}
                            {msg.sender === "pandit" && (
                              <>
                                <FaUserAstronaut /> {activeChat.pandit}
                              </>
                            )}
                            {msg.sender === "admin" && (
                              <>
                                <FaCrown /> ADMIN OVERRIDE
                              </>
                            )}
                          </span>
                          <span className="bubble-time">{msg.time}</span>
                        </div>
                        <p className="bubble-text">{msg.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

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
              <p>Select a session from the left pane to begin monitoring.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}