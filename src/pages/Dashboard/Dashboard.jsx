import React from "react";
import "./Dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard">

      <div className="banner">
        <h1>✨ Welcome Back</h1>
        <p>Your cosmic journey begins today.</p>
      </div>

      <div className="cards">

        <div className="card">
          <span>🔮</span>
          <h3>Kundli</h3>
        </div>

        <div className="card">
          <span>❤️</span>
          <h3>Match Making</h3>
        </div>

        <div className="card">
          <span>🌙</span>
          <h3>Horoscope</h3>
        </div>

        <div className="card">
          <span>✨</span>
          <h3>Puja</h3>
        </div>

      </div>

      <div className="section">
        <h2>Live Astrologers</h2>

        <div className="list">

          <div className="item">
            <div className="avatar">A</div>
            <div>
              <h4>Acharya Rahul</h4>
              <p>⭐ 4.9 Rating</p>
            </div>
            <button>Chat</button>
          </div>

          <div className="item">
            <div className="avatar">P</div>
            <div>
              <h4>Pandit Ji</h4>
              <p>⭐ 4.8 Rating</p>
            </div>
            <button>Chat</button>
          </div>

        </div>
      </div>

    </div>
  );
}