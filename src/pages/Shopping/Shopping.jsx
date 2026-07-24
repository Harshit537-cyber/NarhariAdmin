import React, { useState } from "react";
import "./Shopping.css";
import {
  FaCrown,
  FaBolt,
  FaUser,
  FaShoppingCart,
  FaTrashAlt,
  FaMinus,
  FaPlus,
  FaTicketAlt,
  FaLock,
  FaFileInvoiceDollar,
} from "react-icons/fa";

export default function Shopping() {
  const [cartItems, setCartItems] = useState([
    {
      id: "ITEM-01",
      name: "Healing Crystal",
      desc: "Natural Energy Stone",
      price: 799,
      qty: 1,
      recommendedBy: "Acharya Rahul",
      img: "https://images.unsplash.com/photo-1616628182509-6c0b5d0f4a55?w=500",
    },
    {
      id: "ITEM-02",
      name: "Rudraksha Mala",
      desc: "5 Mukhi Original",
      price: 599,
      qty: 2,
      recommendedBy: "Pandit Sharma",
      img: "https://images.unsplash.com/photo-1605106702734-205df224ecce?w=500",
    },
  ]);

  const [customerName, setCustomerName] = useState("Aman Sharma");
  const [customerId, setCustomerId] = useState("USR-8821");
  const [discountCode, setDiscountCode] = useState("ASTRO10");

  const handleQtyChange = (id, amount) => {
    setCartItems(
      cartItems.map((item) => {
        if (item.id === id) {
          const newQty = item.qty + amount;
          return { ...item, qty: newQty < 1 ? 1 : newQty };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  const deliveryFee = subtotal > 0 ? 100 : 0;
  const discountAmount = discountCode === "ASTRO10" && subtotal > 0 ? 150 : 0;
  const total = subtotal + deliveryFee - discountAmount;

  return (
    <div className="an-shopping-container">
      <div className="ambient-orb orb-1"></div>
      <div className="ambient-orb orb-2"></div>
      <div className="ambient-orb orb-3"></div>

      <header className="db-header animate-fade-in">
        <div className="db-header-left">
          <div className="header-title-container">
            <span className="enterprise-badge">
              <FaCrown className="crown-icon" /> COSMIC POS DESK
            </span>
            <h1 className="wrapped-header-title">Billing & Checkout Desk</h1>
          </div>
          <p className="header-subtitle">
            Draft order invoices and link purchases to Astrologer referrals.
          </p>
        </div>

        <div className="db-header-right">
          <div className="system-status-card">
            <div className="pulse-ring"></div>
            <span className="status-text">
              <FaBolt /> POS ACTIVE
            </span>
          </div>
        </div>
      </header>

      <div className="shopping-grid-layout">
        <div className="cart-items-section">
          <div className="super-card billing-meta-card animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <div className="super-card-header">
              <div className="header-accent-title">
                <div className="title-vertical-bar"></div>
                <h2>
                  <FaUser style={{ marginRight: 8 }} />
                  Customer & Referral Mapping
                </h2>
              </div>
            </div>

            <div className="meta-inputs-grid">
              <div className="input-group">
                <label>Seeker Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label>Customer ID</label>
                <input
                  type="text"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="super-card items-container-card animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="super-card-header">
              <div className="header-accent-title">
                <div className="title-vertical-bar gold"></div>
                <h2>
                  <FaShoppingCart style={{ marginRight: 8 }} />
                  Billing Cart Items
                </h2>
              </div>
              <span className="giant-badge gold">{cartItems.length} Items</span>
            </div>

            {cartItems.length === 0 ? (
              <div className="empty-cart-box">
                <FaShoppingCart className="empty-cart-icon" />
                <p>No items in checkout cart.</p>
              </div>
            ) : (
              <div className="cart-list">
                {cartItems.map((item, idx) => (
                  <div
                    className="cart-item-row animate-slide-up"
                    style={{ animationDelay: `${0.1 + idx * 0.08}s` }}
                    key={item.id}
                  >
                    <div className="cart-item-img-wrap">
                      <img src={item.img} alt={item.name} />
                    </div>

                    <div className="item-details">
                      <div className="item-header-meta">
                        <h3>{item.name}</h3>
                        <span className="item-rec-badge">
                          Referral: {item.recommendedBy}
                        </span>
                      </div>
                      <p>{item.desc}</p>

                      <div className="qty-controls-row">
                        <div className="qty-adjuster">
                          <button onClick={() => handleQtyChange(item.id, -1)}>
                            <FaMinus />
                          </button>
                          <span className="qty-num">{item.qty}</span>
                          <button onClick={() => handleQtyChange(item.id, 1)}>
                            <FaPlus />
                          </button>
                        </div>
                        <button
                          className="btn-delete-item"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <FaTrashAlt /> Remove Item
                        </button>
                      </div>
                    </div>

                    <div className="item-price-tag">
                      ₹{item.price * item.qty}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="billing-summary-section">
          <div className="super-card summary-card animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <div className="super-card-header">
              <div className="header-accent-title">
                <div className="title-vertical-bar purple"></div>
                <h2>
                  <FaFileInvoiceDollar style={{ marginRight: 8 }} />
                  Billing Invoice Summary
                </h2>
              </div>
            </div>

            <div className="invoice-row">
              <span>Subtotal</span>
              <span className="bold-charcoal">₹{subtotal}</span>
            </div>

            <div className="invoice-row">
              <span>Delivery Fee</span>
              <span className="bold-charcoal">₹{deliveryFee}</span>
            </div>

            {discountAmount > 0 && (
              <div className="invoice-row discount-row">
                <span>Referral Discount (ASTRO10)</span>
                <span className="bold-emerald">- ₹{discountAmount}</span>
              </div>
            )}

            <div className="invoice-row divider-row"></div>

            <div className="invoice-row total-row">
              <span>Total Billable</span>
              <span className="total-price">₹{total}</span>
            </div>

            <div className="discount-input-box">
              <label>Apply Partner Coupon</label>
              <div className="coupon-row">
                <FaTicketAlt className="coupon-icon" />
                <input
                  type="text"
                  placeholder="Enter Code"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                />
                <button className="btn-coupon-apply">Apply</button>
              </div>
            </div>

            <button className="checkout-btn" disabled={cartItems.length === 0}>
              Generate Invoice & Dispatch
            </button>
          </div>

          <div className="security-guarantee">
            <FaLock /> Audit Log Registered for Astrologer Commissions
          </div>
        </div>
      </div>
    </div>
  );
}