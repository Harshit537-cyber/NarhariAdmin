import React, { useState } from "react";
import "./Product.css";

export default function Product() {
  // Admin Product Live Stats
  const [stockCount, setStockCount] = useState(45);
  const [productPrice, setProductPrice] = useState("799");
  const [originalPrice, setOriginalPrice] = useState("999");
  const [showEditModal, setShowEditModal] = useState(false);
  const [productName, setProductName] = useState("Healing Crystal");
  const [category, setCategory] = useState("Gemstone");

  // Temp form state (so edits only apply on Save)
  const [formData, setFormData] = useState(null);
  const handleSaveSpecs = () => {
    setProductName(formData.productName);
    setCategory(formData.category);
    setProductPrice(formData.productPrice);
    setOriginalPrice(formData.originalPrice);
    setStockCount(Number(formData.stockCount));
    setShowEditModal(false);
  };
  return (
    <div className="product-page animate-fade-in">
      <header className="catalog-header">
        <h2>Product Specification & Inventory Manager</h2>
        <p>
          Monitor sales velocity, manage specs, and review Astrologer
          endorsements.
        </p>
      </header>

      <div className="product-card">
        <div className="product-image-section">
          <div className="product-image">
            <img
              src="https://images.unsplash.com/photo-1616628182509-6c0b5d0f4a55?w=600"
              alt="Healing Crystal"
            />
          </div>

          {/* Quick Stats for Admin */}
          <div className="admin-quick-stats">
            <div className="stat-row">
              <span>Total Revenue</span>
              <strong>₹ 1,13,458</strong>
            </div>
            <div className="stat-row">
              <span>30-Day Sales</span>
              <strong>142 Units</strong>
            </div>
          </div>
        </div>

        <div className="product-details-section">
          <div className="tag-row">
            <span className="badge-tag">Best Seller</span>
            <span className="recommendation-badge">
              ✨ Recommended by 14 Pandits
            </span>
          </div>

          <h2>{productName}</h2>

          <div className="price-row">
            <p className="price-value">
              ₹{productPrice}{" "}
              <span className="slashed-price">₹{originalPrice}</span>
            </p>
            <span className="margin-tag">20% Margin</span>
          </div>

          <p className="desc-text">
            Natural healing crystal recommended by Vedic experts to promote
            positivity, peace, and spiritual growth. Ideal for seekers looking
            to balance cosmic energy during meditation.
          </p>

          {/* Core Specifications Grid */}
          <div className="info-grid">
            <div className="info-box">
              <h4>Category</h4>
              <p>{category}</p>
            </div>

            <div className="info-box">
              <h4>Rating</h4>
              <p>⭐ 4.9 / 5.0</p>
            </div>

            <div className="info-box">
              <h4>Stock Status</h4>
              <p className={stockCount > 5 ? "status-green" : "status-red"}>
                {stockCount > 0 ? `In Stock (${stockCount})` : "Out of Stock"}
              </p>
            </div>
          </div>

          {/* Admin Action Operations */}
          <div className="admin-actions">
            <button
              className="btn-edit-specs"
              onClick={() => {
                setFormData({
                  productName,
                  category,
                  productPrice,
                  originalPrice,
                  stockCount,
                });
                setShowEditModal(true);
              }}
            >
              Edit Product Specifications
            </button>

            <button className="btn-manage-stock">Update Stock & Pricing</button>
          </div>
        </div>
      </div>
      {showEditModal && (
        <div
          className="invoice-modal-overlay"
          onClick={() => setShowEditModal(false)}
        >
          <div className="invoice-modal" onClick={(e) => e.stopPropagation()}>
            <div className="invoice-modal-header">
              <h3>Edit Product Specifications</h3>
              <button
                className="invoice-modal-close"
                onClick={() => setShowEditModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="invoice-modal-body edit-form-body">
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  value={formData.productName}
                  onChange={(e) =>
                    setFormData({ ...formData, productName: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Selling Price (₹)</label>
                <input
                  type="text"
                  value={formData.productPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, productPrice: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Original Price (₹)</label>
                <input
                  type="text"
                  value={formData.originalPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, originalPrice: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Stock Count</label>
                <input
                  type="number"
                  value={formData.stockCount}
                  onChange={(e) =>
                    setFormData({ ...formData, stockCount: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="invoice-modal-footer">
              <button
                className="btn-view-invoice"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button className="btn-update-dispatch" onClick={handleSaveSpecs}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
