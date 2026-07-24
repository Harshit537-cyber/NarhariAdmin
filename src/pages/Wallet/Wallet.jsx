import React, { useState } from "react";
import "./Wallet.css";
import {
  FaCrown,
  FaBolt,
  FaWallet,
  FaChartLine,
  FaHourglassHalf,
  FaUndoAlt,
  FaHandHoldingUsd,
  FaCheckCircle,
  FaFilter,
  FaSlidersH,
  FaLock,
} from "react-icons/fa";

export default function Wallet() {
  const [payoutRequests, setPayoutRequests] = useState([
    { id: "P-101", name: "Acharya Rahul Shastri", amount: "12,500", status: "Pending" },
    { id: "P-102", name: "Pandit Kamlesh Dev", amount: "8,200", status: "Pending" },
    { id: "P-103", name: "Dr. Ananya Ved", amount: "15,000", status: "Processed" },
  ]);

  const [userId, setUserId] = useState("");
  const [adjustAmount, setAdjustAmount] = useState("");
  const [adjustType, setAdjustType] = useState("Credit");
  const [adjustReason, setAdjustReason] = useState("");

  const [transactions, setTransactions] = useState([
    { id: "TXN-9021", entity: "Aman Sharma (User)", type: "Wallet Recharge", amount: "+ 2,000", date: "24 Oct", category: "Recharge", isPositive: true },
    { id: "TXN-9022", entity: "Acharya Rahul Shastri (Pandit)", type: "Consultation Payout", amount: "- 800", date: "24 Oct", category: "Payout", isPositive: false },
    { id: "TXN-9023", entity: "Priya Patel (User)", type: "Refund Processed", amount: "+ 350", date: "23 Oct", category: "Refund", isPositive: true },
    { id: "TXN-9024", entity: "Rajesh Kumar (User)", type: "Gemstone Purchase", amount: "- 1,200", date: "18 Oct", category: "Purchase", isPositive: false },
  ]);

  const [activeFilter, setActiveFilter] = useState("All");

  const handleApprovePayout = (id) => {
    setPayoutRequests(
      payoutRequests.map((req) =>
        req.id === id ? { ...req, status: "Processed" } : req
      )
    );
  };

  const handleManualAdjustment = (e) => {
    e.preventDefault();
    if (!userId || !adjustAmount) return;

    const newTxn = {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      entity: `User ID: ${userId} (${adjustReason || "Manual adjustment"})`,
      type: `Admin Balance ${adjustType}`,
      amount: `${adjustType === "Credit" ? "+" : "-"} ${adjustAmount}`,
      date: "Today",
      category: adjustType === "Credit" ? "Recharge" : "Refund",
      isPositive: adjustType === "Credit",
    };

    setTransactions([newTxn, ...transactions]);
    setUserId("");
    setAdjustAmount("");
    setAdjustReason("");
  };

  const filteredTransactions = transactions.filter(
    (t) => activeFilter === "All" || t.category === activeFilter
  );

  return (
    <div className="an-wallet-container">
      <div className="ambient-orb orb-1"></div>
      <div className="ambient-orb orb-2"></div>
      <div className="ambient-orb orb-3"></div>

      <header className="db-header animate-fade-in">
        <div className="db-header-left">
          <div className="header-title-container">
            <span className="enterprise-badge">
              <FaCrown className="crown-icon" /> COSMIC FINANCE HUB
            </span>
            <h1 className="wrapped-header-title">Wallet Control Hub</h1>
          </div>
          <p className="header-subtitle">
            Manage system-wide transactions, Pandit withdrawals & user
            refunds.
          </p>
        </div>

        <div className="db-header-right">
          <div className="system-status-card">
            <div className="pulse-ring"></div>
            <span className="status-text">
              <FaBolt /> SETTLEMENTS LIVE
            </span>
          </div>
        </div>
      </header>

      <div className="db-metrics-grid">
        <div
          className="khatarnak-card gold-theme animate-slide-up"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="card-glass-shine"></div>
          <div className="card-top-bar">
            <div className="big-icon-box gold-glow">
              <FaWallet />
            </div>
            <span className="trend-badge gold-pill">WALLET POOL</span>
          </div>
          <div className="card-middle-data">
            <h2 className="giant-stat-number">₹14.82L</h2>
            <p className="giant-stat-label">Total User Wallet Pool</p>
          </div>
          <div className="card-bottom-accent">
            <div className="glow-bar gold-bar"></div>
          </div>
        </div>

        <div
          className="khatarnak-card emerald-theme animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="card-glass-shine"></div>
          <div className="card-top-bar">
            <div className="big-icon-box emerald-glow">
              <FaChartLine />
            </div>
            <span className="trend-badge emerald-pill">NET MARGIN</span>
          </div>
          <div className="card-middle-data">
            <h2 className="giant-stat-number">₹3.42L</h2>
            <p className="giant-stat-label">Platform Commission Revenue</p>
          </div>
          <div className="card-bottom-accent">
            <div className="glow-bar emerald-bar"></div>
          </div>
        </div>

        <div
          className="khatarnak-card danger-theme animate-slide-up"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="card-glass-shine"></div>
          <div className="card-top-bar">
            <div className="big-icon-box danger-glow">
              <FaHourglassHalf />
            </div>
            <span className="trend-badge danger-pill">PENDING</span>
          </div>
          <div className="card-middle-data">
            <h2 className="giant-stat-number">₹20,700</h2>
            <p className="giant-stat-label">Pending Pandit Payouts</p>
          </div>
          <div className="card-bottom-accent">
            <div className="glow-bar danger-bar"></div>
          </div>
        </div>

        <div
          className="khatarnak-card cyan-theme animate-slide-up"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="card-glass-shine"></div>
          <div className="card-top-bar">
            <div className="big-icon-box cyan-glow">
              <FaUndoAlt />
            </div>
            <span className="trend-badge cyan-pill">TODAY</span>
          </div>
          <div className="card-middle-data">
            <h2 className="giant-stat-number">₹1,550</h2>
            <p className="giant-stat-label">Processed Refunds Today</p>
          </div>
          <div className="card-bottom-accent">
            <div className="glow-bar cyan-bar"></div>
          </div>
        </div>
      </div>

      <div className="wallet-layout-grid">
        <div className="layout-left-col">
          <div className="super-card animate-fade-in-delayed">
            <div className="super-card-header">
              <div className="header-accent-title">
                <div className="title-vertical-bar"></div>
                <h2>
                  <FaHandHoldingUsd style={{ marginRight: 8 }} />
                  Pandit Withdrawal Requests
                </h2>
              </div>
              <span className="giant-badge danger">Action Needed</span>
            </div>

            <div className="payout-list">
              {payoutRequests.map((req, idx) => (
                <div
                  className="payout-item animate-slide-up"
                  style={{ animationDelay: `${0.1 + idx * 0.08}s` }}
                  key={req.id}
                >
                  <div className="payout-info">
                    <h4>{req.name}</h4>
                    <p>ID: {req.id} • Withdrawal Request</p>
                  </div>
                  <div className="payout-action-area">
                    <strong className="payout-amount">₹ {req.amount}</strong>
                    {req.status === "Pending" ? (
                      <button
                        className="payout-btn-approve"
                        onClick={() => handleApprovePayout(req.id)}
                      >
                        <FaCheckCircle /> Release Funds
                      </button>
                    ) : (
                      <span className="payout-status-processed">
                        <FaCheckCircle /> Processed
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="super-card animate-fade-in-delayed"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="panel-header-row">
              <div className="header-accent-title">
                <div className="title-vertical-bar purple"></div>
                <h2>Recent System Transactions</h2>
              </div>
              <div className="filter-tabs">
                {["All", "Recharge", "Payout", "Refund"].map((filter) => (
                  <button
                    key={filter}
                    className={`filter-tab-btn ${
                      activeFilter === filter ? "active" : ""
                    }`}
                    onClick={() => setActiveFilter(filter)}
                  >
                    <FaFilter style={{ marginRight: 4, fontSize: 10 }} />
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="activity-list">
              {filteredTransactions.map((txn, idx) => (
                <div
                  className="activity-item animate-slide-up"
                  style={{ animationDelay: `${0.1 + idx * 0.06}s` }}
                  key={txn.id}
                >
                  <div className="activity-details">
                    <h4>{txn.entity}</h4>
                    <p>
                      {txn.type} • {txn.date} • {txn.id}
                    </p>
                  </div>
                  <strong
                    className={txn.isPositive ? "amount-green" : "amount-red"}
                  >
                    {txn.amount}
                  </strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="layout-right-col">
          <div
            className="super-card animate-fade-in-delayed"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="super-card-header">
              <div className="header-accent-title">
                <div className="title-vertical-bar gold"></div>
                <h2>
                  <FaSlidersH style={{ marginRight: 8 }} />
                  Manual Wallet Adjuster
                </h2>
              </div>
            </div>
            <p className="form-helper-text">
              Add or subtract balance from any seeker's wallet.
            </p>

            <form onSubmit={handleManualAdjustment} className="adjustment-form">
              <div className="form-group">
                <label>User ID</label>
                <input
                  type="text"
                  placeholder="e.g. USER-9024"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  required
                />
              </div>

              <div className="form-group-row">
                <div className="form-group flex-2">
                  <label>Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={adjustAmount}
                    onChange={(e) => setAdjustAmount(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group flex-1">
                  <label>Action</label>
                  <select
                    value={adjustType}
                    onChange={(e) => setAdjustType(e.target.value)}
                  >
                    <option value="Credit">Credit (+)</option>
                    <option value="Debit">Debit (-)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Reason / Audit Note</label>
                <input
                  type="text"
                  placeholder="e.g. Chat cut-off adjustment"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                />
              </div>

              <button type="submit" className="action-submit-btn">
                <FaSlidersH /> Apply System Adjustment
              </button>
            </form>
          </div>

          <div className="security-panel">
            <FaLock /> Audit Logs Verified & Secure 256-bit Settlement
          </div>
        </div>
      </div>
    </div>
  );
}