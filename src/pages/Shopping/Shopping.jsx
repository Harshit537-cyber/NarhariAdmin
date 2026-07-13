import React, { useState } from "react";
import "./Shopping.css";

export default function Shopping() {
  // 1. Live Cart Items State
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

  // 2. Billing Assignment States
  const [customerName, setCustomerName] = useState("Aman Sharma");
  const [customerId, setCustomerId] = useState("USR-8821");
  const [discountCode, setDiscountCode] = useState("ASTRO10");

  // Quantity Handlers
  const handleQtyChange = (id, amount) => {
    setCartItems(
      cartItems.map((item) => {
        if (item.id === id) {
          const newQty = item.qty + amount;
          return { ...item, qty: newQty < 1 ? 1 : newQty };
        }
        return item;
      }),
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  // Calculations
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0,
  );
  const deliveryFee = subtotal > 0 ? 100 : 0;
  const discountAmount = discountCode === "ASTRO10" && subtotal > 0 ? 150 : 0;
  const total = subtotal + deliveryFee - discountAmount;

  return (
    <div className="shopping-page animate-fade-in">
      {/* Header aligned to left */}
      <header className="shopping-header">
        <h2>POS Billing & Checkout Desk</h2>
        <p>Draft order invoices and link purchases to Astrologer referrals.</p>
      </header>

      {/* Two Column POS Grid */}
      <div className="shopping-grid-layout">
        {/* Left Column: Cart Items & Seeker Mapping */}
        <div className="cart-items-section">
          {/* Seeker Assignment Header Card */}
          <div className="billing-meta-card">
            <h3>Customer & Referral Mapping</h3>
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

          {/* Cart Items List */}
          <div className="items-container-card">
            <h3>Billing Cart Items ({cartItems.length})</h3>

            {cartItems.length === 0 ? (
              <p className="empty-cart-text">No items in checkout cart.</p>
            ) : (
              <div className="cart-list">
                {cartItems.map((item) => (
                  <div className="cart-item-row" key={item.id}>
                    <img src={item.img} alt={item.name} className="item-img" />

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
                            −
                          </button>
                          <span className="qty-num">{item.qty}</span>
                          <button onClick={() => handleQtyChange(item.id, 1)}>
                            +
                          </button>
                        </div>
                        <button
                          className="btn-delete-item"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          Remove Item
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

        {/* Right Column: Invoice and Checkout Summary */}
        <div className="billing-summary-section">
          <div className="summary-card">
            <h3>Billing Invoice Summary</h3>

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
                <span className="bold-red">- ₹{discountAmount}</span>
              </div>
            )}

            <div className="invoice-row divider-row"></div>

            <div className="invoice-row total-row">
              <span>Total Billable</span>
              <span className="total-price">₹{total}</span>
            </div>

            {/* Discount Code Input Box */}
            <div className="discount-input-box">
              <label>Apply Partner Coupon</label>
              <div className="coupon-row">
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
            🔒 Audit Log Registered for Astrologer Commissions
          </div>
        </div>
      </div>
    </div>
  );
}
