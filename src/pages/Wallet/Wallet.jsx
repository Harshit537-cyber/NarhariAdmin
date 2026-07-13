import React, { useState } from "react";
import "./Wallet.css";

export default function Wallet() {
  // 1. Pandit Withdrawal/Payout Requests (Admin Actionable)
  const [payoutRequests, setPayoutRequests] = useState([
    { id: "P-101", name: "Acharya Rahul Shastri", amount: "12,500", status: "Pending" },
    { id: "P-102", name: "Pandit Kamlesh Dev", amount: "8,200", status: "Pending" },
    { id: "P-103", name: "Dr. Ananya Ved", amount: "15,000", status: "Processed" }
  ]);

  // 2. Manual User Wallet Adjuster State
  const [userId, setUserId] = useState("");
  const [adjustAmount, setAdjustAmount] = useState("");
  const [adjustType, setAdjustType] = useState("Credit");
  const [adjustReason, setAdjustReason] = useState("");

  // 3. Transactions Log State
  const [transactions, setTransactions] = useState([
    { id: "TXN-9021", entity: "Aman Sharma (User)", type: "Wallet Recharge", amount: "+ 2,000", date: "24 Oct", category: "Recharge", isPositive: true },
    { id: "TXN-9022", entity: "Acharya Rahul Shastri (Pandit)", type: "Consultation Payout", amount: "- 800", date: "24 Oct", category: "Payout", isPositive: false },
    { id: "TXN-9023", entity: "Priya Patel (User)", type: "Refund Processed", amount: "+ 350", date: "23 Oct", category: "Refund", isPositive: true },
    { id: "TXN-9024", entity: "Rajesh Kumar (User)", type: "Gemstone Purchase", amount: "- 1,200", date: "18 Oct", category: "Purchase", isPositive: false }
  ]);

  const [activeFilter, setActiveFilter] = useState("All");

  const handleApprovePayout = (id) => {
    setPayoutRequests(payoutRequests.map(req => req.id === id ? { ...req, status: "Processed" } : req));
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
      isPositive: adjustType === "Credit"
    };

    setTransactions([newTxn, ...transactions]);
    // Reset fields
    setUserId("");
    setAdjustAmount("");
    setAdjustReason("");
  };

  const filteredTransactions = transactions.filter(t => activeFilter === "All" || t.category === activeFilter);

  return (
    <div className="wallet-page animate-fade-in">
      
      <header className="wallet-header">
        <h2>Financial & Wallet Control Hub</h2>
        <p>Manage system-wide transactions, Pandit withdrawals, and user refunds.</p>
      </header>

      {/* 4 Multi-Metric Cards Overview */}
      <div className="admin-finance-grid">
        <div className="finance-card">
          <p>Total User Wallet Pool</p>
          <h2 className="text-gold">₹ 14,82,250.00</h2>
          <span>Funds deposited by all seekers</span>
        </div>
        <div className="finance-card">
          <p>Platform Commission Net Revenue</p>
          <h2 className="text-green-dark">₹ 3,42,800.00</h2>
          <span>Net platform margins</span>
        </div>
        <div className="finance-card">
          <p>Pending Pandit Payouts</p>
          <h2 className="text-red">₹ 20,700.00</h2>
          <span>Pending verification</span>
        </div>
        <div className="finance-card">
          <p>Processed Refunds Today</p>
          <h2>₹ 1,550.00</h2>
          <span>5 failed chats refunded</span>
        </div>
      </div>

      <div className="wallet-layout-grid">
        
        {/* Left Column */}
        <div className="layout-left-col">
          
          {/* Section: Pandit Payout Approvals */}
          <div className="panel-card">
            <div className="panel-header">
              <h3>Pandit Withdrawal Requests</h3>
              <span className="payout-badge">Action Needed</span>
            </div>
            
            <div className="payout-list">
              {payoutRequests.map((req) => (
                <div className="payout-item" key={req.id}>
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
                        Release Funds
                      </button>
                    ) : (
                      <span className="payout-status-processed">Processed</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: System Transaction Log & Live Filters */}
          <div className="panel-card">
            <div className="panel-header-row">
              <h3>Recent System Transactions</h3>
              <div className="filter-tabs">
                {["All", "Recharge", "Payout", "Refund"].map((filter) => (
                  <button
                    key={filter}
                    className={`filter-tab-btn ${activeFilter === filter ? "active" : ""}`}
                    onClick={() => setActiveFilter(filter)}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="activity-list">
              {filteredTransactions.map((txn) => (
                <div className="activity-item" key={txn.id}>
                  <div className="activity-details">
                    <h4>{txn.entity}</h4>
                    <p>{txn.type} • {txn.date} • {txn.id}</p>
                  </div>
                  <strong className={txn.isPositive ? "amount-green" : "amount-red"}>
                    {txn.amount}
                  </strong>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (Adjustments Form) */}
        <div className="layout-right-col">
          
          {/* Section: Manual User Wallet Adjustment */}
          <div className="panel-card">
            <div className="panel-header">
              <h3>Manual Wallet Adjuster</h3>
            </div>
            <p className="form-helper-text">Add or subtract balance from any seeker's wallet.</p>
            
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
                Apply System Adjustment
              </button>
            </form>
          </div>

          <div className="security-panel">
            🔒 Audit Logs Verified & Secure 256-bit Settlement
          </div>

        </div>

      </div>

    </div>
  );
}