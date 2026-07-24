import React, { useState } from "react";
import "./Consultation.css";
import {
  FaCrown,
  FaBolt,
  FaSearch,
  FaCalendarCheck,
  FaCheckCircle,
  FaTimesCircle,
  FaComments,
  FaPhoneAlt,
  FaVideo,
  FaClock,
  FaUser,
  FaUserAstronaut
} from "react-icons/fa";

export default function Consultation() {
  const data = [
    {
      id: "CON701",
      user: "Aman Sharma",
      pandit: "Acharya Rahul",
      mode: "Chat",
      time: "5 Min Ago",
      duration: "20 Min",
      status: "Live",
      price: "₹500",
    },
    {
      id: "CON702",
      user: "Priya Patel",
      pandit: "Acharya Sharma",
      mode: "Voice",
      time: "10:30 AM",
      duration: "15 Min",
      status: "Upcoming",
      price: "₹375",
    },
    {
      id: "CON703",
      user: "Rajesh Kumar",
      pandit: "Kamlesh Dev",
      mode: "Video",
      time: "Yesterday",
      duration: "30 Min",
      status: "Completed",
      price: "₹900",
    },
    {
      id: "CON704",
      user: "Sneha",
      pandit: "Dr. Ananya",
      mode: "Chat",
      time: "24 Oct",
      duration: "20 Min",
      status: "Cancelled",
      price: "₹700",
    },
  ];

  const [list, setList] = useState(data);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const updateStatus = (id, status) =>
    setList((p) =>
      p.map((x) => (x.id === id ? { ...x, status } : x))
    );

  const result = list.filter(
    (x) =>
      (filter === "All" || x.status === filter) &&
      `${x.user} ${x.pandit} ${x.id}`
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const cards = [
    {
      title: "Live",
      value: "12",
      icon: <FaBolt />,
      cls: "cyan",
      pill: "LIVE NOW",
    },
    {
      title: "Upcoming",
      value: "45",
      icon: <FaCalendarCheck />,
      cls: "gold",
      pill: "SCHEDULED",
    },
    {
      title: "Completed",
      value: "328",
      icon: <FaCheckCircle />,
      cls: "emerald",
      pill: "FINISHED",
    },
    {
      title: "Cancelled",
      value: "3",
      icon: <FaTimesCircle />,
      cls: "red",
      pill: "REFUNDED",
    },
  ];

  const getModeIcon = (mode) => {
    if (mode === "Voice") return <FaPhoneAlt />;
    if (mode === "Video") return <FaVideo />;
    return <FaComments />;
  };

  return (
    <div className="an-dashboard-container con-page">
      <div className="ambient-orb orb-1"></div>
      <div className="ambient-orb orb-2"></div>
      <div className="ambient-orb orb-3"></div>

      <header className="db-header animate-fade-in">
        <div className="db-header-left">
          <div className="header-title-container">
            <span className="enterprise-badge">
              <FaCrown className="crown-icon" /> COSMIC CONSULTATION HUB
            </span>
            <h1 className="wrapped-header-title">Consultation Control Center</h1>
          </div>
          <p className="header-subtitle">
            Monitor live sessions, bookings, astrologer activities & refunds.
          </p>
        </div>

        <div className="db-header-right">
          <div className="system-status-card">
            <div className="pulse-ring"></div>
            <span className="status-text"><FaBolt /> SYSTEM LIVE</span>
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
              <p className="giant-stat-label">{c.title} Sessions</p>
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
              placeholder="Search by User, Pandit or Session ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-tabs-cosmic">
            {["All", "Live", "Upcoming", "Completed", "Cancelled"].map((x) => (
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

      <div className="con-card-grid animate-fade-in-delayed">
        {result.map((c) => (
          <div className="con-card-super" key={c.id}>
            <div className="con-card-header">
              <span className="session-id-tag">{c.id}</span>
              <span className={`status-pill status-${c.status.toLowerCase()}`}>
                <span className="status-dot"></span> {c.status}
              </span>
            </div>

            <div className="users-connection-box">
              <div className="user-profile-sub">
                <div className="avatar-circle user-avatar">
                  <FaUser />
                </div>
                <div>
                  <small>USER</small>
                  <h4>{c.user}</h4>
                </div>
              </div>

              <div className="mode-badge-center">
                {getModeIcon(c.mode)}
                <span>{c.mode}</span>
              </div>

              <div className="user-profile-sub right">
                <div>
                  <small>ASTROLOGER</small>
                  <h4>{c.pandit}</h4>
                </div>
                <div className="avatar-circle pandit-avatar">
                  <FaUserAstronaut />
                </div>
              </div>
            </div>

            <div className="meta-info-strip">
              <div className="meta-item">
                <small><FaClock /> TIME</small>
                <p>{c.time}</p>
              </div>

              <div className="meta-item">
                <small>DURATION</small>
                <p>{c.duration}</p>
              </div>

              <div className="meta-item">
                <small>AMOUNT</small>
                <p className="price-tag">{c.price}</p>
              </div>
            </div>

            <div className="card-action-footer">
              {c.status === "Live" && (
                <>
                  <button className="btn-pro btn-pro-monitor">
                    Monitor
                  </button>
                  <button
                    className="btn-pro btn-pro-end"
                    onClick={() => updateStatus(c.id, "Cancelled")}
                  >
                    End Session
                  </button>
                </>
              )}

              {c.status === "Upcoming" && (
                <>
                  <button
                    className="btn-pro btn-pro-complete"
                    onClick={() => updateStatus(c.id, "Completed")}
                  >
                    Complete
                  </button>
                  <button
                    className="btn-pro btn-pro-cancel"
                    onClick={() => updateStatus(c.id, "Cancelled")}
                  >
                    Cancel
                  </button>
                </>
              )}

              {c.status === "Completed" && (
                <button disabled className="btn-pro btn-pro-disabled">
                  Archived
                </button>
              )}

              {c.status === "Cancelled" && (
                <span className="refund-complete-badge">
                  ✓ Refund Completed
                </span>
              )}
            </div>
          </div>
        ))}

        {result.length === 0 && (
          <div className="empty-state-card">
            <p>No consultation sessions match your search filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}