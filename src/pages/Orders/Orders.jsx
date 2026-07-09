import React from "react";
import "./Orders.css";

export default function Orders() {
  return (
    <div className="orders-page">

      <div className="orders-header">
        <h2>My Orders</h2>
        <p>Track your recent purchases</p>
      </div>

      <div className="order-card">

        <div className="order-top">
          <h3>Order #AST1025</h3>
          <span className="delivered">Delivered</span>
        </div>

        <div className="order-body">
          <img
            src="https://images.unsplash.com/photo-1616628182509-6c0b5d0f4a55?w=500"
            alt="Product"
          />

          <div className="order-info">
            <h4>Healing Crystal</h4>
            <p>Qty : 1</p>
            <p>Order Date : 24 Oct 2024</p>
            <strong>₹799</strong>
          </div>
        </div>

        <button>View Details</button>

      </div>

      <div className="order-card">

        <div className="order-top">
          <h3>Order #AST1026</h3>
          <span className="shipping">Shipping</span>
        </div>

        <div className="order-body">
          <img
            src="https://images.unsplash.com/photo-1605106702734-205df224ecce?w=500"
            alt="Product"
          />

          <div className="order-info">
            <h4>Rudraksha Mala</h4>
            <p>Qty : 2</p>
            <p>Order Date : 20 Oct 2024</p>
            <strong>₹599</strong>
          </div>
        </div>

        <button>Track Order</button>

      </div>

    </div>
  );
}