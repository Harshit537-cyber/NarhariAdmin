import React, { useState, useEffect } from "react";
// 1. Updated imports to use Product APIs
import { getProductList, addProduct, updateProduct, deleteProduct } from "../../api/Controller/product";
import "./Shop.css";
import AddProductModal from "../Product/AddProductModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaCrown,
  FaPlus,
  FaEdit,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaTrash, // Added Trash icon
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

export default function Shop() {
  // Logic states from Product module
  const [categories, setCategories] = useState([]); // This will now hold Product data
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState(null);
  
  // Delete states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchCategories();
  }, []);

  // 2. Updated to use getProductList
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getProductList();
      setCategories(response.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // 3. Updated to use addProduct (Product Logic)
  const handleAddShop = async (formData) => {
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("shortDescription", formData.shortDescription);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("price", formData.price);
      data.append("salePrice", formData.salePrice);
      data.append("stock", formData.stock);
      data.append("benefits", JSON.stringify(formData.benefits.split(",").map((item) => item.trim())));
      data.append("howToUse", formData.howToUse);
      data.append("careInstructions", formData.careInstructions);
      data.append("isFeatured", formData.isFeatured);
      data.append("isActive", formData.isActive);

      formData.images.forEach((img) => {
        data.append("images", img);
      });

      const response = await addProduct(data);
      toast.success(response.message || "Shop Product added successfully!");
      setShowAddModal(false);
      fetchCategories();
    } catch (error) {
      toast.error(error.message || "Failed to add shop product");
    }
  };

  // 4. Updated to use updateProduct (Product Logic)
  const handleSaveSpecs = async () => {
    if (!formData) return;
    try {
      const data = new FormData();
      data.append("name", formData.productName);
      data.append("shortDescription", formData.shortDescription || "");
      data.append("description", formData.description || "");
      data.append("category", formData.category);
      data.append("price", formData.productPrice);
      data.append("salePrice", formData.originalPrice);
      data.append("stock", formData.stockCount);
      data.append("howToUse", formData.howToUse || "");
      data.append("careInstructions", formData.careInstructions || "");
      data.append("isFeatured", formData.isFeatured);
      data.append("isActive", formData.isActive);
      data.append("benefits", JSON.stringify((formData.benefits || "").split(",").map((item) => item.trim()).filter(Boolean)));

      if (formData.newImages && formData.newImages.length > 0) {
        formData.newImages.forEach((file) => {
          data.append("images", file);
        });
      }

      const response = await updateProduct(formData._id, data);
      setShowEditModal(false);
      fetchCategories();
      toast.success(response?.message || "Shop updated successfully!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  // 5. Delete Logic Implementation
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDeleteProduct = async () => {
    if (!deleteId) return;
    try {
      const response = await deleteProduct(deleteId);
      toast.success(response?.message || "Shop deleted successfully!");
      fetchCategories();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setShowDeleteModal(false);
      setDeleteId(null);
    }
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

  // Function to pre-fill the edit modal
  const openEditModal = (item) => {
    setFormData({
      _id: item._id,
      productName: item.name || "",
      shortDescription: item.shortDescription || "",
      description: item.description || "",
      category: typeof item.category === "object" ? item.category?._id : item.category || "",
      productPrice: item.price ?? "",
      originalPrice: item.salePrice ?? "",
      stockCount: item.stock ?? 0,
      howToUse: item.howToUse || "",
      careInstructions: item.careInstructions || "",
      isFeatured: !!item.isFeatured,
      isActive: item.isActive !== undefined ? item.isActive : true,
      benefits: Array.isArray(item.benefits) ? item.benefits.join(", ") : item.benefits || "",
      image: item.images?.[0] || "",
      newImages: [],
    });
    setShowEditModal(true);
  };

  return (
    <div className="an-dashboard-container shop-page">
      <ToastContainer />
      <div className="ambient-orb orb-1"></div>
      <div className="ambient-orb orb-2"></div>
      <div className="ambient-orb orb-3"></div>

      {/* UI Remains Same: Shop & Inventory Hub */}
      <header className="db-header animate-fade-in">
        <div className="db-header-left">
          <div className="header-title-container">
            <span className="enterprise-badge">
              <FaCrown className="crown-icon" /> COSMIC INVENTORY HUB
            </span>
            <h1 className="wrapped-header-title">Shop & Inventory Hub</h1>
          </div>
          <p className="header-subtitle">
            Monitor sales velocity, manage specs, and review shop categories.
          </p>
        </div>

        <div className="db-header-right">
          <button className="btn-add-cosmic" onClick={() => setShowAddModal(true)}>
            <FaPlus /> Add Shop
          </button>
        </div>
      </header>

      {/* UI Remains Same: Shop Management Card */}
      <div className="super-card main-table-card animate-fade-in-delayed">
        <div className="super-card-header">
          <div className="header-accent-title">
            <div className="title-vertical-bar gold"></div>
            <h2>Shop Management</h2>
          </div>
          <span className="giant-badge gold">{categories.length} Items</span>
        </div>

        <div className="table-responsive">
          <table className="khatarnak-table">
            <thead>
              <tr>
                <th>IMAGE</th>
                <th>SHOP NAME</th>
                <th>DESCRIPTION</th>
                <th>STATUS</th>
                <th style={{ textAlign: "right" }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "60px" }}>
                    <div className="gold-loader"></div>
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "40px" }}>
                    No shops found.
                  </td>
                </tr>
              ) : (
                currentCategories.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <div className="category-img-container">
                        <img
                          className="category-img"
                          src={item.images?.[0] || item.image}
                          alt={item.name}
                        />
                      </div>
                    </td>
                    <td><span className="main-name">{item.name}</span></td>
                    <td><span className="desc-cell">{item.description || "—"}</span></td>
                    <td>
                      <span className={`status-pill ${item.isActive ? "active" : "inactive"}`}>
                        {item.isActive ? <><FaCheckCircle /> Active</> : <><FaTimesCircle /> Inactive</>}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button className="btn-pro btn-pro-edit" onClick={() => openEditModal(item)}>
                        <FaEdit /> Edit
                      </button>
                      <button className="btn-pro btn-pro-delete" style={{marginLeft: '8px', color: '#ef4444'}} onClick={() => handleDeleteClick(item._id)}>
                        <FaTrash /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Logic Remains Same */}
        <div className="table-pagination-footer">
          <div className="pagination-container">
            <button className="pagination-btn arrow-btn" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}><FaChevronLeft /></button>
            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
              <button key={page} className={`pagination-btn number-btn ${currentPage === page ? "active" : ""}`} onClick={() => handlePageChange(page)}>{page}</button>
            ))}
            <button className="pagination-btn arrow-btn" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}><FaChevronRight /></button>
          </div>
        </div>
      </div>

      {/* Edit Modal - Logic updated to match Product fields */}
      {showEditModal && formData && (
        <div className="ultra-modal-backdrop" onClick={() => setShowEditModal(false)}>
          <div className="ultra-modal-box edit-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="ultra-modal-header">
              <h3>Edit Shop Specifications</h3>
              <button className="modal-close-btn" onClick={() => setShowEditModal(false)}><FaTimes /></button>
            </div>
            <div className="edit-form-body">
              <div className="form-group">
                <label>Shop Name</label>
                <input type="text" value={formData.productName} onChange={(e) => setFormData({ ...formData, productName: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Selling Price (₹)</label>
                <input type="text" value={formData.productPrice} onChange={(e) => setFormData({ ...formData, productPrice: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Original Price (₹)</label>
                <input type="text" value={formData.originalPrice} onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Stock Count</label>
                <input type="number" value={formData.stockCount} onChange={(e) => setFormData({ ...formData, stockCount: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>
            </div>
            <div className="modal-actions-row">
              <button className="btn-modal-pro cancel" onClick={() => setShowEditModal(false)}>Cancel</button>
              <button className="btn-modal-pro save" onClick={handleSaveSpecs}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="ultra-modal-backdrop" onClick={() => setShowDeleteModal(false)}>
          <div className="ultra-modal-box delete-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="ultra-modal-header">
              <h3>Delete Item</h3>
              <button className="modal-close-btn" onClick={() => setShowDeleteModal(false)}><FaTimes /></button>
            </div>
            <p className="delete-confirm-text">Are you sure? This action cannot be undone.</p>
            <div className="modal-actions-row">
              <button className="btn-modal-pro cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="btn-modal-pro delete-confirm" style={{backgroundColor: '#ef4444', color: '#fff'}} onClick={confirmDeleteProduct}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <AddProductModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddShop}
        categories={categories}
      />
    </div>
  );
}