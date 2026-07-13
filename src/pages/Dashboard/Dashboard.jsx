import React, { useState } from "react";
import "./Dashboard.css";

export default function Dashboard() {
  // Pandit List Data State
  const [pandits, setPandits] = useState([
    {
      id: 1,
      name: "Acharya Rahul Shastri",
      specialty: "Kundli, Vastu",
      rating: "4.9",
      status: "Active",
      experience: "12 Yrs",
    },
    {
      id: 2,
      name: "Pandit Kamlesh Dev",
      specialty: "Palmistry, Puja",
      rating: "4.8",
      status: "Pending Approval",
      experience: "8 Yrs",
    },
    {
      id: 3,
      name: "Dr. Ananya Ved",
      specialty: "Numerology, Horoscopes",
      rating: "4.7",
      status: "Active",
      experience: "10 Yrs",
    },
    {
      id: 4,
      name: "Shastri Hari Om",
      specialty: "Vedic Astrology",
      rating: "New",
      status: "Pending Approval",
      experience: "5 Yrs",
    },
  ]);

  // Live Users Data State
  const [users, setUsers] = useState([
    {
      id: 101,
      name: "Aman Sharma",
      activity: "Booked Mahamrityunjay Puja",
      time: "2 mins ago",
    },
    {
      id: 102,
      name: "Priya Patel",
      activity: "In Live Chat with Acharya Rahul",
      time: "5 mins ago",
    },
    {
      id: 103,
      name: "Rajesh Kumar",
      activity: "Generated Kundli PDF",
      time: "15 mins ago",
    },
  ]);

  const handleApprove = (id) => {
    setPandits(
      pandits.map((p) => (p.id === id ? { ...p, status: "Active" } : p)),
    );
  };

  const handleBlock = (id) => {
    setPandits(pandits.filter((p) => p.id !== id));
  };

  return (
    <div className="an-dashboard-container">
      {/* Welcome Header */}
      <header className="db-header animate-fade-in">
        <div className="db-header-left">
          <h1>Cosmic Admin Hub</h1>
          <p>Real-time overview of your sacred network & celestial guides.</p>
        </div>
        <div className="db-header-right">
          <span className="live-pulse"></span>
          <span className="system-status">System Live</span>
        </div>
      </header>

      {/* Grid Status Metrics */}
      <div className="db-metrics-grid">
        <div
          className="metric-card animate-slide-up"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="metric-icon users-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className="metric-data">
            <h3>14,250</h3>
            <p>Total Seekers (Users)</p>
          </div>
          <span className="metric-trend up">+12.5%</span>
        </div>

        <div
          className="metric-card animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="metric-icon pandit-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <div className="metric-data">
            <h3>342</h3>
            <p>Active Pandits</p>
          </div>
          <span className="metric-trend up">+4.8%</span>
        </div>

        <div
          className="metric-card animate-slide-up"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="metric-icon chat-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div className="metric-data">
            <h3>48</h3>
            <p>Ongoing Consultations</p>
          </div>
          <span className="metric-pulse-dot"></span>
        </div>

        <div
          className="metric-card animate-slide-up"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="metric-icon puja-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div className="metric-data">
            <h3>₹1.8L</h3>
            <p>Puja Bookings Today</p>
          </div>
          <span className="metric-trend up">+18.2%</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="db-content-grid">
        {/* Left Side: Pandits Directory */}
        <div className="db-card main-table-card animate-fade-in-delayed">
          <div className="db-card-header">
            <h2>Pandit & Astrologer Management</h2>
            <span className="badge">Action Required</span>
          </div>
          <div className="table-responsive">
            <table className="db-table">
              <thead>
                <tr>
                  <th>Pandit Details</th>
                  <th>Specialty</th>
                  <th>Rating / Exp</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pandits.map((pandit) => (
                  <tr key={pandit.id}>
                    <td>
                      <div className="user-info">
                        <div className="user-avatar">
                          {pandit.name.charAt(0)}
                        </div>
                        <div>
                          <div className="user-name">{pandit.name}</div>
                          <div className="user-subtext">ID: #P-{pandit.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>{pandit.specialty}</td>
                    <td>
                      <div className="rating-tag">
                        ⭐ {pandit.rating}{" "}
                        <span className="exp">({pandit.experience})</span>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${pandit.status.toLowerCase().replace(" ", "-")}`}
                      >
                        {pandit.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        {pandit.status === "Pending Approval" ? (
                          <button
                            className="btn-approve"
                            onClick={() => handleApprove(pandit.id)}
                          >
                            Approve
                          </button>
                        ) : (
                          <button className="btn-chat">Message</button>
                        )}
                        <button
                          className="btn-block"
                          onClick={() => handleBlock(pandit.id)}
                        >
                          Disable
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Live Activity Feed */}
        <div className="db-card sidebar-feed animate-fade-in-delayed">
          <div className="db-card-header">
            <h2>Live Activity Feed</h2>
            <div className="status-indicator">
              <span className="blink-dot"></span>
              Real-time
            </div>
          </div>

          <div className="activity-list">
            {users.map((user) => (
              <div className="activity-item" key={user.id}>
                <div className="activity-marker"></div>
                <div className="activity-content">
                  <p>
                    <strong>{user.name}</strong> {user.activity}
                  </p>
                  <span className="activity-time">{user.time}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="quick-actions-box">
            <h4>Quick Operations</h4>
            <div className="quick-grid">
              <button className="quick-btn-gold">Broadcast Message</button>
              <button className="quick-btn-dark">Configure Puja Catalog</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
