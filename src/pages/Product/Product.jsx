import React from "react";
import "./Product.css";

export default function Product() {
  return (
    <div className="product-page">

      <div className="product-card">

        <div className="product-image">
          <img
            src="https://images.unsplash.com/photo-1616628182509-6c0b5d0f4a55?w=600"
            alt="Healing Crystal"
          />
        </div>

        <div className="product-details">

          <span className="tag">Best Seller</span>

          <h2>Healing Crystal</h2>

          <p className="price">
            ₹799 <span>₹999</span>
          </p>

          <p className="desc">
            Natural healing crystal that promotes positivity, peace, and
            spiritual growth. Ideal for meditation and daily energy balance.
          </p>

          <div className="info">
            <div>
              <h4>Category</h4>
              <p>Gemstone</p>
            </div>

            <div>
              <h4>Rating</h4>
              <p>⭐ 4.9</p>
            </div>

            <div>
              <h4>Stock</h4>
              <p>Available</p>
            </div>
          </div>

          <div className="buttons">
            <button className="cart-btn">
              Add To Cart
            </button>

            <button className="buy-btn">
              Buy Now
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}