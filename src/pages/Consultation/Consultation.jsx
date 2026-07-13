import React, { useState } from "react";
import "./Consultation.css";

export default function Consultation() {
  // Mock Consultations Data (Live, Upcoming, Completed, Cancelled)
  const [consultations, setConsultations] = useState([
    {
      id: "CON-7011",
      user: "Aman Sharma",
      pandit: "Acharya Rahul Shastri",
      mode: "Chat",
      time: "Started 5m ago",
      duration: "20 Min",
      status: "Live",
      price: "500"
    },
    {
      id: "CON-7012",
      user: "Priya Patel",
      pandit: "Acharya Sharma",
      mode: "Voice Call",
      time: "Today, 10:30 AM",
      duration: "15 Min",
      status: "Upcoming",
      price: "375"
    },
    {
      id: "CON-7013",
      user: "Rajesh Kumar",
      pandit: "Pandit Kamlesh Dev",
      mode: "Video Call",
      time: "Yesterday, 04:15 PM",
      duration: "30 Min",
      status: "Completed",
      price: "900"
    },
    {
      id: "CON-7014",
      user: "Sneha Reddy",
      pandit: "Dr. Ananya Ved",
      mode: "Chat",
      time: "24 Oct, 02:30 PM",
      duration: "20 Min",
      status: "Cancelled",
      price: "700"
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Admin action: Cancel and Refund
  const handleCancelBooking = (id) => {
    setConsultations(
      consultations.map((con) =>
        con.id === id ? { ...con, status: "Cancelled" } : con
      )
    );
  };

  // Admin action: Mark as Completed
  const handleCompleteBooking = (id) => {
    setConsultations(
      consultations.map((con) =>
        con.id === id ? { ...con, status: "Completed" } : con
      )
    );
  };

  // Filter consultations based on search input and active status filter
  const filteredConsultations = consultations.filter((con) => {
    const matchesSearch =
      con.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      con.pandit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      con.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "All" || con.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="consultation-page animate-fade-in">
      
      {/* Page Header */}
      <header className="page-header">
        <h2>Consultation Control Center</h2>
        <p>Monitor live chats, manage upcoming bookings, and handle session disputes.</p>
      </header>

      {/* Admin Consultation Summary Metrics */}
      <div className="metrics-summary-grid">
        <div className="summary-card">
          <p>Live Consultations</p>
          <h2 className="text-green-success">
            <span className="live-glow-dot"></span> 12 Active
          </h2>
          <span>Currently in progress</span>
        </div>
        <div className="summary-card">
          <p>Upcoming Bookings</p>
          <h2 className="text-gold">45 Scheduled</h2>
          <span>For the next 24 hours</span>
        </div>
        <div className="summary-card">
          <p>Completed Sessions</p>
          <h2>328 Today</h2>
          <span>Total successful consultations</span>
        </div>
        <div className="summary-card">
          <p>Session Disputes / Cancelled</p>
          <h2 className="text-red">3 Pending</h2>
          <span>Refunds being reviewed</span>
        </div>
      </div>

      {/* Filters and Search Bar Row */}
      <div className="filter-search-container">
        <div className="search-box">
          <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by ID, Seeker, or Pandit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-tabs">
          {["All", "Live", "Upcoming", "Completed", "Cancelled"].map((status) => (
            <button
              key={status}
              className={`filter-btn ${statusFilter === status ? "active" : ""}`}
              onClick={() => setStatusFilter(status)}
            >
              {status} {status === "Live" && <span className="live-mini-dot"></span>}
            </button>
          ))}
        </div>
      </div>

      {/* Main Consultations List/Grid */}
      <div className="consultations-grid">
        {filteredConsultations.map((con) => (
          <div className={`con-card ${con.status.toLowerCase()}`} key={con.id}>
            
            {/* Card Header Status */}
            <div className="con-card-header">
              <span className="con-id">{con.id}</span>
              <span className={`status-pill ${con.status.toLowerCase()}`}>
                {con.status === "Live" && <span className="blink-dot"></span>}
                {con.status}
              </span>
            </div>

            {/* Seeker vs Pandit Details */}
            <div className="con-card-body">
              <div className="participant-info">
                <div className="role-tag user-tag">Seeker (User)</div>
                <h4>{con.user}</h4>
              </div>
              
              <div className="cosmic-connector">
                <div className="connection-line"></div>
                <div className="mode-badge">{con.mode}</div>
              </div>

              <div className="participant-info alignment-right">
                <div className="role-tag pandit-tag">Astrologer (Pandit)</div>
                <h4>{con.pandit}</h4>
              </div>
            </div>

            {/* Timing, Duration and Price Row */}
            <div className="con-card-meta">
              <div className="meta-item">
                <span>Scheduled Time</span>
                <p>{con.time}</p>
              </div>
              <div className="meta-item">
                <span>Duration</span>
                <p>{con.duration}</p>
              </div>
              <div className="meta-item alignment-right">
                <span>Booking Cost</span>
                <p className="price-text">₹ {con.price}</p>
              </div>
            </div>

            {/* Action Buttons based on status */}
            <div className="con-card-actions">
              {con.status === "Live" && (
                <>
                  <button className="btn-secondary">Monitor Chat</button>
                  <button className="btn-danger" onClick={() => handleCancelBooking(con.id)}>
                    Force End & Refund
                  </button>
                </>
              )}

              {con.status === "Upcoming" && (
                <>
                  <button className="btn-primary" onClick={() => handleCompleteBooking(con.id)}>
                    Mark Completed
                  </button>
                  <button className="btn-secondary" onClick={() => handleCancelBooking(con.id)}>
                    Cancel & Refund
                  </button>
                </>
              )}

              {con.status === "Completed" && (
                <button className="btn-disabled" disabled>
                  Archived / Closed
                </button>
              )}

              {con.status === "Cancelled" && (
                <span className="refund-status-text">✓ Full Refund Disbursed</span>
              )}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}