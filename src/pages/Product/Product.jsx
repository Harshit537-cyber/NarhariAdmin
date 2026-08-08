
import React, { useState, useEffect } from "react";
import { getProductList, addProduct, updateProduct,deleteProduct  } from "../../api/Controller/product";
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
  FaTimes,FaTrash,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

export default function Product() {
  const [showEditModal, setShowEditModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState(null);
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [deleteId, setDeleteId] = useState(null);
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchCategories();
  }, []);

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

  const handleAddProduct = async (formData) => {
    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("shortDescription", formData.shortDescription);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("price", formData.price);
      data.append("salePrice", formData.salePrice);
      data.append("stock", formData.stock);

      data.append(
        "benefits",
        JSON.stringify(formData.benefits.split(",").map((item) => item.trim()))
      );

      data.append("howToUse", formData.howToUse);
      data.append("careInstructions", formData.careInstructions);
      data.append("isFeatured", formData.isFeatured);
      data.append("isActive", formData.isActive);

      formData.images.forEach((img) => {
        data.append("images", img);
      });

      const response = await addProduct(data);

      toast.success(response.message);
      setShowAddModal(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ---- UPDATE PRODUCT ----
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

      // benefits comes in as a comma separated string from the textbox
      data.append(
        "benefits",
        JSON.stringify(
          (formData.benefits || "")
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        )
      );

      // only send new images if the admin actually picked new files
      if (formData.newImages && formData.newImages.length > 0) {
        formData.newImages.forEach((file) => {
          data.append("images", file);
        });
      }

      const response = await updateProduct(formData._id, data);

      setShowEditModal(false);
      fetchCategories();

      toast.success(response?.message || "Product updated successfully!");
    } catch (err) {
      toast.error(err.message);
    }
  };

 // opens confirm popup
const handleDeleteClick = (id) => {
  setDeleteId(id);
  setShowDeleteModal(true);
};

// actual delete call
const confirmDeleteProduct = async () => {
  if (!deleteId) return;
  try {
    const response = await deleteProduct(deleteId);
    toast.success(response?.message || "Product deleted successfully!");
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

  // Opens the edit modal, pre-filled from the actual product record
  const openEditModal = (item) => {
    setFormData({
      _id: item._id,
      productName: item.name || "",
      shortDescription: item.shortDescription || "",
      description: item.description || "",
      category:
        typeof item.category === "object"
          ? item.category?._id
          : item.category || "",
      productPrice: item.price ?? "",
      originalPrice: item.salePrice ?? "",
      stockCount: item.stock ?? 0,
      howToUse: item.howToUse || "",
      careInstructions: item.careInstructions || "",
      isFeatured: !!item.isFeatured,
      isActive: item.isActive !== undefined ? item.isActive : true,
      benefits: Array.isArray(item.benefits)
        ? item.benefits.join(", ")
        : item.benefits || "",
      image: item.images?.[0] || "",
      newImages: [],
    });
    setShowEditModal(true);
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
          <button className="btn-add-cosmic" onClick={() => setShowAddModal(true)}>
            <FaPlus /> Add Product
          </button>
        </div>
      </header>

      {/* Main Content: Category Management Card */}
      <div className="super-card main-table-card animate-fade-in-delayed">
        <div className="super-card-header">
          <div className="header-accent-title">
            <div className="title-vertical-bar gold"></div>
            <h2>Product Management</h2>
          </div>
          <span className="giant-badge gold">{categories.length} Categories</span>
        </div>

        <div className="table-responsive">
          <table className="khatarnak-table">
            <thead>
              <tr>
                <th>IMAGE</th>
                <th>PRODUCT NAME</th>
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
                    No categories found.
                  </td>
                </tr>
              ) : (
                currentCategories.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <div className="category-img-container">
                        <img className="category-img" src={item.images?.[0]} alt={item.name} />
                      </div>
                    </td>

                    <td>
                      <span className="main-name">{item.name}</span>
                    </td>

                    <td>
                      <span className="desc-cell">{item.description || "—"}</span>
                    </td>

                    <td>
                      <span className={`status-pill ${item.isActive ? "active" : "inactive"}`}>
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
                      <button className="btn-pro btn-pro-edit" onClick={() => openEditModal(item)}>
                        <FaEdit /> Edit
                      </button>
                     <button className="btn-pro btn-pro-delete" onClick={() => handleDeleteClick(item._id)}>
  <FaTrash /> Delete
</button>
                    </td>
                  </tr>
                ))
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

            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
              <button
                key={page}
                className={`pagination-btn number-btn ${currentPage === page ? "active" : ""}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}

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
        <div className="ultra-modal-backdrop" onClick={() => setShowEditModal(false)}>
          <div className="ultra-modal-box edit-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="ultra-modal-header">
              <h3>Edit Product Specifications</h3>
              <button className="modal-close-btn" onClick={() => setShowEditModal(false)}>
                <FaTimes />
              </button>
            </div>

            <div className="edit-form-body">
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Short Description</label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Selling Price (₹)</label>
                <input
                  type="text"
                  value={formData.productPrice}
                  onChange={(e) => setFormData({ ...formData, productPrice: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Sale Price (₹)</label>
                <input
                  type="text"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Stock Count</label>
                <input
                  type="number"
                  value={formData.stockCount}
                  onChange={(e) => setFormData({ ...formData, stockCount: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>How To Use</label>
                <textarea
                  value={formData.howToUse}
                  onChange={(e) => setFormData({ ...formData, howToUse: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Care Instructions</label>
                <textarea
                  value={formData.careInstructions}
                  onChange={(e) => setFormData({ ...formData, careInstructions: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Benefits (comma separated)</label>
                <input
                  type="text"
                  value={formData.benefits}
                  onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  />{" "}
                  Featured
                </label>
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />{" "}
                  Active
                </label>
              </div>

              <div className="form-group">
                <label>Product Images</label>

                {formData.image && (
                  <img
                    src={formData.image}
                    alt="Product"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginBottom: "10px",
                    }}
                  />
                )}

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      newImages: Array.from(e.target.files),
                    })
                  }
                />
              </div>
            </div>

            <div className="modal-actions-row">
              <button className="btn-modal-pro cancel" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
              <button className="btn-modal-pro save" onClick={handleSaveSpecs}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
{showDeleteModal && (
  <div className="ultra-modal-backdrop" onClick={() => setShowDeleteModal(false)}>
    <div className="ultra-modal-box delete-modal-box" onClick={(e) => e.stopPropagation()}>
      <div className="ultra-modal-header">
        <h3>Delete Product</h3>
        <button className="modal-close-btn" onClick={() => setShowDeleteModal(false)}>
          <FaTimes />
        </button>
      </div>

      <p className="delete-confirm-text">
        Are you sure you want to delete this product? This action cannot be undone.
      </p>

      <div className="modal-actions-row">
        <button className="btn-modal-pro cancel" onClick={() => setShowDeleteModal(false)}>
          Cancel
        </button>
        <button className="btn-modal-pro delete-confirm" onClick={confirmDeleteProduct}>
          Delete
        </button>
      </div>
    </div>
  </div>
)}
      <AddProductModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddProduct}
        categories={categories}
      />
    </div>
  );
}