import React, { useState } from "react";
import "./Orders.css";

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
      orders.map((o) => (o.id === id ? { ...o, status: newStatus } : o)),
    );
  };

  const filteredOrders = orders.filter(
    (o) => activeFilter === "All" || o.status === activeFilter,
  );

  return (
    <div className="orders-page animate-fade-in">
      {/* Admin header aligned left */}
      <header className="orders-header">
        <h2>Order Dispatch & Logistics Manager</h2>
        <p>
          Monitor platform shipments, verify user invoices, and calculate Pandit
          referral shares.
        </p>
      </header>

      {/* Admin Quick Metrics Summary */}
      <div className="logistics-metrics-grid">
        <div className="metric-card">
          <p>Total Dispatched</p>
          <h2 className="text-red">1,420 Orders</h2>
          <span>All-time direct & referred sales</span>
        </div>
        <div className="metric-card">
          <p>Awaiting Dispatch</p>
          <h2 className="text-gold">18 Orders</h2>
          <span>Pending processing</span>
        </div>
        <div className="metric-card">
          <p>In-Transit (Shipping)</p>
          <h2>42 Shipments</h2>
          <span>Dispatched via Delhivery / BlueDart</span>
        </div>
        <div className="metric-card">
          <p>Delivered Today</p>
          <h2 className="text-green">14 Deliveries</h2>
          <span>Verified by customer feedback</span>
        </div>
      </div>

      {/* Live Status Filter Tabs */}
      <div className="logistics-tabs-container">
        {["All", "Shipping", "Delivered"].map((status) => (
          <button
            key={status}
            className={`logistics-tab-btn ${activeFilter === status ? "active" : ""}`}
            onClick={() => setActiveFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Filtered Orders List */}
      <div className="orders-container">
        {filteredOrders.map((order) => (
          <div
            className={`order-card ${order.status.toLowerCase()}`}
            key={order.id}
          >
            {/* Top section with ID, Customer metadata, and Status */}
            <div className="order-top">
              <div className="order-title-meta">
                <h3>Order #{order.id}</h3>
                <p className="customer-name">
                  Customer: <strong>{order.customer}</strong>
                </p>
              </div>
              <span className={`status-badge ${order.status.toLowerCase()}`}>
                {order.status}
              </span>
            </div>

            {/* Core Product Info and Referral Connection */}
            <div className="order-body">
              <img src={order.img} alt={order.productName} />

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
                className="btn-view-invoice"
                onClick={() => setSelectedInvoice(order)}
              >
                View Invoice Details
              </button>

              {order.status === "Shipping" ? (
                <button
                  className="btn-update-dispatch"
                  onClick={() => handleUpdateStatus(order.id, "Delivered")}
                >
                  Mark as Delivered
                </button>
              ) : (
                <span className="logistics-success">
                  ✓ Shipment Handled Successfully
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      {selectedInvoice && (
  <div className="invoice-modal-overlay" onClick={() => setSelectedInvoice(null)}>
    <div className="invoice-modal" onClick={(e) => e.stopPropagation()}>
      <div className="invoice-modal-header">
        <h3>Invoice — Order #{selectedInvoice.id}</h3>
        <button
          className="invoice-modal-close"
          onClick={() => setSelectedInvoice(null)}
        >
          ✕
        </button>
      </div>

      <div className="invoice-modal-body">
        <img
          src={selectedInvoice.img}
          alt={selectedInvoice.productName}
          className="invoice-modal-img"
        />
        <div className="invoice-modal-details">
          <p><strong>Customer:</strong> {selectedInvoice.customer}</p>
          <p><strong>Referral Pandit:</strong> {selectedInvoice.refPandit}</p>
          <p><strong>Product:</strong> {selectedInvoice.productName}</p>
          <p><strong>Quantity:</strong> {selectedInvoice.qty}</p>
          <p><strong>Order Date:</strong> {selectedInvoice.date}</p>
          <p><strong>Status:</strong>{" "}
            <span className={`status-badge ${selectedInvoice.status.toLowerCase()}`}>
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
          className="btn-update-dispatch"
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
