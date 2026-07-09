import React from "react";
import "./Shop.css";

export default function Shop() {
  return (
    <div className="shop-page">

      <div className="shop-banner">
        <h1>Cosmic Shop</h1>
        <p>Discover spiritual products for positivity & wellness.</p>
      </div>

      <div className="shop-grid">

        <div className="product-card">
          <img
            src="https://images.unsplash.com/photo-1616628182509-6c0b5d0f4a55?w=500"
            alt="Gemstone"
          />
          <h3>Healing Crystal</h3>
          <p>Natural Energy Stone</p>
          <h4>₹799</h4>
          <button>Buy Now</button>
        </div>

        <div className="product-card">
          <img
            src="https://images.unsplash.com/photo-1605106702734-205df224ecce?w=500"
            alt="Bracelet"
          />
          <h3>Rudraksha Mala</h3>
          <p>Original 5 Mukhi</p>
          <h4>₹599</h4>
          <button>Buy Now</button>
        </div>

        <div className="product-card">
          <img
            src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=500"
            alt="Ring"
          />
          <h3>Lucky Ring</h3>
          <p>Astrology Recommended</p>
          <h4>₹1,299</h4>
          <button>Buy Now</button>
        </div>

        <div className="product-card">
          <img
            src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=500"
            alt="Yantra"
          />
          <h3>Shree Yantra</h3>
          <p>Premium Brass Finish</p>
          <h4>₹999</h4>
          <button>Buy Now</button>
        </div>

      </div>

    </div>
  );
}