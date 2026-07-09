import React from "react";
import "./Shopping.css";

export default function Shopping() {
  return (
    <div className="shopping-page">
      <div className="shopping-header">
        <h2>My Shopping Cart</h2>
        <p>2 Items in your cart</p>
      </div>

      <div className="cart-item">
        <img
          src="https://images.unsplash.com/photo-1616628182509-6c0b5d0f4a55?w=500"
          alt="Crystal"
        />

        <div className="item-info">
          <h3>Healing Crystal</h3>
          <p>Natural Energy Stone</p>
          <span>Qty : 1</span>
        </div>

        <div className="item-price">₹799</div>
      </div>

      <div className="cart-item">
        <img
          src="https://images.unsplash.com/photo-1605106702734-205df224ecce?w=500"
          alt="Bracelet"
        />

        <div className="item-info">
          <h3>Rudraksha Mala</h3>
          <p>5 Mukhi Original</p>
          <span>Qty : 2</span>
        </div>

        <div className="item-price">₹599</div>
      </div>

      <div className="summary">
        <h3>Order Summary</h3>

        <div className="row">
          <span>Subtotal</span>
          <span>₹1,398</span>
        </div>

        <div className="row">
          <span>Delivery</span>
          <span>₹100</span>
        </div>

        <div className="row total">
          <span>Total</span>
          <span>₹1,498</span>
        </div>

        <button className="checkout-btn">Proceed To Checkout</button>
      </div>
    </div>
  );
}
