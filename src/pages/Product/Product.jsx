import React, { useState, useEffect } from "react";
import { getProductCategories, createProductCategory } from "../../api/Controller/product";
import "./Product.css";
import AddProductModal from "./AddProductModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaCrown,
  FaPlus,
  FaEdit,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

export default function Product() {
  // Admin Product Live Stats & Form State
  const [stockCount, setStockCount] = useState(45);
  const [productPrice, setProductPrice] = useState("799");
  const [originalPrice, setOriginalPrice] = useState("999");
  const [showEditModal, setShowEditModal] = useState(false);
  const [productName, setProductName] = useState("Healing Crystal");
  const [categories, setCategories] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getProductCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddProduct = async (formData) => {
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("image", formData.image);

      const response = await createProductCategory(data);
      console.log(response);

      setCategories((prev) => [...prev, response.data]);
      setShowAddModal(false);
      toast.success("Category added successfully!");
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Failed to add category");
    }
  };

  const handleSaveSpecs = () => {
    if (!formData) return;
    setProductName(formData.productName);
    setProductPrice(formData.productPrice);
    setOriginalPrice(formData.originalPrice);
    setStockCount(Number(formData.stockCount));
    setShowEditModal(false);
    toast.success("Category updated successfully!");
  };

  // Pagination Logic
  const totalPages = Math.max(1, Math.ceil(categories.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = categories.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="an-dashboard-container product-page">
      {/* Background Ambient Orbs */}
      <div className="ambient-orb orb-1"></div>
      <div className="ambient-orb orb-2"></div>
      <div className="ambient-orb orb-3"></div>

      {/* Header Section */}
      <header className="db-header animate-fade-in">
        <div className="db-header-left">
          <div className="header-title-container">
            <span className="enterprise-badge">
              <FaCrown className="crown-icon" /> COSMIC INVENTORY HUB
            </span>
            <h1 className="wrapped-header-title">Product & Category Manager</h1>
          </div>
          <p className="header-subtitle">
            Monitor sales velocity, manage specs, and review product categories.
          </p>
        </div>

        <div className="db-header-right">
          <button
            className="btn-add-cosmic"
            onClick={() => setShowAddModal(true)}
          >
            <FaPlus /> Add Product
          </button>
        </div>
      </header>

      {/* Main Content: Category Management Card */}
      <div className="super-card main-table-card animate-fade-in-delayed">
        <div className="super-card-header">
          <div className="header-accent-title">
            <div className="title-vertical-bar gold"></div>
            <h2>Category Management</h2>
          </div>
          <span className="giant-badge gold">{categories.length} Categories</span>
        </div>

        <div className="table-responsive">
          <table className="khatarnak-table">
            <thead>
              <tr>
                <th>IMAGE</th>
                <th>CATEGORY NAME</th>
                <th>DESCRIPTION</th>
                <th>STATUS</th>
                <th style={{ textAlign: "right" }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {currentCategories.map((item) => (
                <tr key={item._id}>
                  <td>
                    <div className="category-img-container">
                      <img
                        className="category-img"
                        src={item.image}
                        alt={item.name}
                      />
                    </div>
                  </td>
                  <td>
                    <span className="main-name">{item.name}</span>
                  </td>
                  <td>
                    <span className="desc-cell">{item.description || "—"}</span>
                  </td>
                  <td>
                    <span
                      className={`status-pill ${
                        item.isActive ? "active" : "inactive"
                      }`}
                    >
                      {item.isActive ? (
                        <>
                          <FaCheckCircle /> Active
                        </>
                      ) : (
                        <>
                          <FaTimesCircle /> Inactive
                        </>
                      )}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      className="btn-pro btn-pro-edit"
                      onClick={() => {
                        setFormData({
                          productName: item.name,
                          category: item.name,
                          productPrice: productPrice,
                          originalPrice: originalPrice,
                          stockCount: stockCount,
                        });
                        setShowEditModal(true);
                      }}
                    >
                      <FaEdit /> Edit
                    </button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "40px" }}>
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom Right Pagination Bar */}
        <div className="table-pagination-footer">
          <div className="pagination-container">
            <button
              className="pagination-btn arrow-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <FaChevronLeft />
            </button>

            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(
              (page) => (
                <button
                  key={page}
                  className={`pagination-btn number-btn ${
                    currentPage === page ? "active" : ""
                  }`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              )
            )}

            <button
              className="pagination-btn arrow-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Specifications Ultra Modal */}
      {showEditModal && formData && (
        <div
          className="ultra-modal-backdrop"
          onClick={() => setShowEditModal(false)}
        >
          <div
            className="ultra-modal-box edit-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ultra-modal-header">
              <h3>Edit Product Specifications</h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowEditModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <div className="edit-form-body">
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

            <div className="modal-actions-row">
              <button
                className="btn-modal-pro cancel"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn-modal-pro save"
                onClick={handleSaveSpecs}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product / Category Modal Component */}
      <AddProductModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddProduct}
      />
    </div>
  );
}