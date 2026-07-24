import React, { useState } from "react";
import "./Orders.css";
import {
  FaCrown,
  FaBolt,
  FaBoxOpen,
  FaClock,
  FaTruck,
  FaCheckCircle,
  FaFileInvoice,
  FaTimes,
} from "react-icons/fa";

export default function Orders() {
  // Live orders state with customer and referral details
  const [orders, setOrders] = useState([
    {
      id: "AST1025",
      customer: "Aman Sharma",
      refPandit: "Acharya Rahul",
      productName: "Healing Crystal",
      qty: 1,
      date: "24 Oct 2024",
      price: "799",
      img: "https://images.unsplash.com/photo-1616628182509-6c0b5d0f4a55?w=500",
      status: "Delivered",
    },
    {
      id: "AST1026",
      customer: "Priya Patel",
      refPandit: "Pandit Sharma",
      productName: "Rudraksha Mala",
      qty: 2,
      date: "20 Oct 2024",
      price: "599",
      img: "https://images.unsplash.com/photo-1605106702734-205df224ecce?w=500",
      status: "Shipping",
    },
  ]);

  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const handleUpdateStatus = (id, newStatus) => {
    setOrders(
      orders.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
  };

  const filteredOrders = orders.filter(
    (o) => activeFilter === "All" || o.status === activeFilter
  );

  return (
    <div className="an-orders-container">
      {/* Background Ambient Orbs */}
      <div className="ambient-orb orb-1"></div>
      <div className="ambient-orb orb-2"></div>
      <div className="ambient-orb orb-3"></div>

      {/* Header Section */}
      <header className="db-header animate-fade-in">
        <div className="db-header-left">
          <div className="header-title-container">
            <span className="enterprise-badge">
              <FaCrown className="crown-icon" /> COSMIC LOGISTICS HUB
            </span>
            <h1 className="wrapped-header-title">Order Dispatch Manager</h1>
          </div>
          <p className="header-subtitle">
            Monitor platform shipments, verify user invoices & calculate Pandit
            referral shares.
          </p>
        </div>

        <div className="db-header-right">
          <div className="system-status-card">
            <div className="pulse-ring"></div>
            <span className="status-text">
              <FaBolt /> LIVE TRACKING
            </span>
          </div>
        </div>
      </header>

      {/* Metric Cards Grid */}
      <div className="db-metrics-grid">
        <div
          className="khatarnak-card cyan-theme animate-slide-up"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="card-glass-shine"></div>
          <div className="card-top-bar">
            <div className="big-icon-box cyan-glow">
              <FaBoxOpen />
            </div>
            <span className="trend-badge cyan-pill">ALL-TIME</span>
          </div>
          <div className="card-middle-data">
            <h2 className="giant-stat-number">1,420</h2>
            <p className="giant-stat-label">Total Dispatched Orders</p>
          </div>
          <div className="card-bottom-accent">
            <div className="glow-bar cyan-bar"></div>
          </div>
        </div>

        <div
          className="khatarnak-card gold-theme animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="card-glass-shine"></div>
          <div className="card-top-bar">
            <div className="big-icon-box gold-glow">
              <FaClock />
            </div>
            <span className="trend-badge gold-pill">PENDING</span>
          </div>
          <div className="card-middle-data">
            <h2 className="giant-stat-number">18</h2>
            <p className="giant-stat-label">Awaiting Dispatch</p>
          </div>
          <div className="card-bottom-accent">
            <div className="glow-bar gold-bar"></div>
          </div>
        </div>

        <div
          className="khatarnak-card purple-theme animate-slide-up"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="card-glass-shine"></div>
          <div className="card-top-bar">
            <div className="big-icon-box purple-glow">
              <FaTruck />
            </div>
            <span className="trend-badge purple-pill">IN-TRANSIT</span>
          </div>
          <div className="card-middle-data">
            <h2 className="giant-stat-number">42</h2>
            <p className="giant-stat-label">Shipping via Courier</p>
          </div>
          <div className="card-bottom-accent">
            <div className="glow-bar purple-bar"></div>
          </div>
        </div>

        <div
          className="khatarnak-card emerald-theme animate-slide-up"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="card-glass-shine"></div>
          <div className="card-top-bar">
            <div className="big-icon-box emerald-glow">
              <FaCheckCircle />
            </div>
            <span className="trend-badge emerald-pill">TODAY</span>
          </div>
          <div className="card-middle-data">
            <h2 className="giant-stat-number">14</h2>
            <p className="giant-stat-label">Delivered Today</p>
          </div>
          <div className="card-bottom-accent">
            <div className="glow-bar emerald-bar"></div>
          </div>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="logistics-tabs-container animate-fade-in-delayed">
        {["All", "Shipping", "Delivered"].map((status) => (
          <button
            key={status}
            className={`logistics-tab-btn ${
              activeFilter === status ? "active" : ""
            }`}
            onClick={() => setActiveFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="orders-list-grid">
        {filteredOrders.map((order, idx) => (
          <div
            className={`order-glass-card ${order.status.toLowerCase()} animate-slide-up`}
            style={{ animationDelay: `${0.1 + idx * 0.08}s` }}
            key={order.id}
          >
            <div className="card-glass-shine"></div>

            {/* Top section with ID, Customer metadata, and Status */}
            <div className="order-top">
              <div className="order-title-meta">
                <h3>Order #{order.id}</h3>
                <p className="customer-name">
                  Customer: <strong>{order.customer}</strong>
                </p>
              </div>
              <span className={`status-badge ${order.status.toLowerCase()}`}>
                {order.status === "Delivered" ? (
                  <FaCheckCircle />
                ) : (
                  <FaTruck />
                )}
                {order.status}
              </span>
            </div>

            {/* Core Product Info and Referral Connection */}
            <div className="order-body">
              <div className="order-img-wrap">
                <img src={order.img} alt={order.productName} />
              </div>

              <div className="order-info">
                <div className="info-row-header">
                  <h4>{order.productName}</h4>
                  <span className="referral-tag">
                    Referral: {order.refPandit}
                  </span>
                </div>
                <p className="qty-date">
                  Qty: <strong>{order.qty}</strong> • Order Date: {order.date}
                </p>
                <strong className="order-price">₹{order.price}</strong>
              </div>
            </div>

            {/* Admin Action Row */}
            <div className="order-actions">
              <button
                className="btn-pro btn-pro-view"
                onClick={() => setSelectedInvoice(order)}
              >
                <FaFileInvoice /> View Invoice
              </button>

              {order.status === "Shipping" ? (
                <button
                  className="btn-pro btn-pro-dispatch"
                  onClick={() => handleUpdateStatus(order.id, "Delivered")}
                >
                  <FaCheckCircle /> Mark as Delivered
                </button>
              ) : (
                <span className="logistics-success">
                  <FaCheckCircle /> Shipment Handled Successfully
                </span>
              )}
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="no-orders-box">
            <FaBoxOpen className="no-orders-icon" />
            <p>No orders found for this filter.</p>
          </div>
        )}
      </div>

      {/* Invoice Modal */}
      {selectedInvoice && (
        <div
          className="ultra-modal-backdrop"
          onClick={() => setSelectedInvoice(null)}
        >
          <div
            className="ultra-modal-box invoice-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="invoice-modal-header">
              <h3>Invoice — Order #{selectedInvoice.id}</h3>
              <button
                className="invoice-modal-close"
                onClick={() => setSelectedInvoice(null)}
              >
                <FaTimes />
              </button>
            </div>

            <div className="invoice-modal-body">
              <img
                src={selectedInvoice.img}
                alt={selectedInvoice.productName}
                className="invoice-modal-img"
              />
              <div className="invoice-modal-details">
                <p>
                  <strong>Customer:</strong> {selectedInvoice.customer}
                </p>
                <p>
                  <strong>Referral Pandit:</strong> {selectedInvoice.refPandit}
                </p>
                <p>
                  <strong>Product:</strong> {selectedInvoice.productName}
                </p>
                <p>
                  <strong>Quantity:</strong> {selectedInvoice.qty}
                </p>
                <p>
                  <strong>Order Date:</strong> {selectedInvoice.date}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`status-badge ${selectedInvoice.status.toLowerCase()}`}
                  >
                    {selectedInvoice.status}
                  </span>
                </p>
                <p className="invoice-modal-price">
                  <strong>Total: ₹{selectedInvoice.price}</strong>
                </p>
              </div>
            </div>

            <div className="invoice-modal-footer">
              <button
                className="btn-modal-pro cancel"
                onClick={() => setSelectedInvoice(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}