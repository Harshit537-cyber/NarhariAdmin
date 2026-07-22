import React, { useState, useEffect } from "react";
import { getProductCategories } from "../../api/Controller/product";
import "./Product.css";

export default function Product() {
  // Admin Product Live Stats
  const [stockCount, setStockCount] = useState(45);
  const [productPrice, setProductPrice] = useState("799");
  const [originalPrice, setOriginalPrice] = useState("999");
  const [showEditModal, setShowEditModal] = useState(false);
  const [productName, setProductName] = useState("Healing Crystal");
const [categories, setCategories] = useState([]);
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
  useEffect(() => {
  fetchCategories();
}, []);

const fetchCategories = async () => {
  try {
    const response = await getProductCategories();
    setCategories(response.data);
  } catch (error) {
    console.log(error);
  }
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

     

      <div className="category-table-wrapper">

  <div className="table-header">
    <h3>Category Management</h3>
<span>{categories.length} Categories</span>  </div>

  <table className="category-table">
    <thead>
      <tr>
        <th>Image</th>
        <th>Category Name</th>
        <th>Description</th>
        <th>Status</th>
        <th>Action</th>
      </tr>
    </thead>

 <tbody>
  {categories.map((item) => (
    <tr key={item._id}>
      <td>
        <img
          className="category-img"
          src={item.image}
          alt={item.name}
        />
      </td>

      <td>
        <h4>{item.name}</h4>
      </td>

      <td>{item.description}</td>

      <td>
        <span className={`status ${item.isActive ? "active" : "inactive"}`}>
          {item.isActive ? "Active" : "Inactive"}
        </span>
      </td>

      <td>
        <button className="table-btn">Edit</button>
      </td>
    </tr>
  ))}
</tbody>

  </table>


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
