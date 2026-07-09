import React from "react";
import "./Wallet.css";

export default function Wallet() {
  return (
    <div className="wallet-page">

      <div className="balance-card">
        <p>Current Balance</p>
        <h1>₹ 4,250.00</h1>
        <span>5 successful consultations</span>
      </div>

      <div className="topup">
        <h3>Top-up Wallet</h3>

        <div className="amounts">
          <button>+ ₹100</button>
          <button>+ ₹500</button>
          <button>+ ₹1000</button>
        </div>

        <input
          type="number"
          placeholder="Enter custom amount"
        />

        <button className="wallet-btn">
          Add to Wallet
        </button>
      </div>

      <div className="payment">
        <div className="title">
          <h3>Saved Method</h3>
          <span>Add New</span>
        </div>

        <div className="payment-card">
          <div>
            <h4>HDFC Bank •••• 8291</h4>
            <p>Default UPI Method</p>
          </div>
        </div>

        <div className="payment-card">
          <div>
            <h4>Visa Platinum •••• 1104</h4>
            <p>Expires 09/27</p>
          </div>
        </div>
      </div>

      <div className="activity">

        <h3>Recent Activity</h3>

        <div className="activity-item">
          <div>
            <h4>Acharya Sharma</h4>
            <p>Consultation • 24 Oct</p>
          </div>

          <strong>- ₹800</strong>
        </div>

        <div className="activity-item">
          <div>
            <h4>Wallet Recharge</h4>
            <p>UPI Payment</p>
          </div>

          <strong className="green">+ ₹2000</strong>
        </div>

        <div className="activity-item">
          <div>
            <h4>Gemstone Purchase</h4>
            <p>18 Oct</p>
          </div>

          <strong>- ₹1200</strong>
        </div>

      </div>

      <div className="secure">
        🔒 Secure 256-bit Encrypted Payments
      </div>

    </div>
  );
}