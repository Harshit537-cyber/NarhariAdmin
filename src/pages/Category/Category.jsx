import React, { useState, useEffect } from "react";
import { getProductCategories, createProductCategory } from "../../api/Controller/product";
import {
  updateProductCategory,
  deleteProductCategory,
} from "../../api/Controller/category";
import "./Category.css";
import AddCategoryModal from "../Category/AddCategoryModal";
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
  FaTrash,
} from "react-icons/fa";

export default function Category() {
  const [stockCount, setStockCount] = useState(45);
  const [categoryPrice, setCategoryPrice] = useState("799");
  const [originalPrice, setOriginalPrice] = useState("999");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("Healing Crystal");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getProductCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (formData) => {
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
const handleSaveSpecs = async () => {
  if (!formData) return;

  try {
    const data = new FormData();

    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("isActive", formData.isActive);

    if (formData.image instanceof File) {
      data.append("image", formData.image);
    }

    const response = await updateProductCategory(formData._id, data);

    setCategories((prev) =>
      prev.map((item) =>
        item._id === formData._id ? response.data : item
      )
    );

    setShowEditModal(false);
    toast.success("Category updated successfully!");
  } catch (error) {
    console.log(error);
    toast.error(error.message || "Failed to update category");
  }
};
const handleDeleteCategory = async () => {
  if (!selectedCategory) return;

  try {
    await deleteProductCategory(selectedCategory._id);

    setCategories((prev) =>
      prev.filter((item) => item._id !== selectedCategory._id)
    );

    setShowDeleteModal(false);
    setSelectedCategory(null);

    toast.success("Category deleted successfully!");
  } catch (error) {
    console.log(error);
    toast.error(error.message || "Failed to delete category");
  }
};
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
    <div className="an-dashboard-container category-page">
      <div className="ambient-orb orb-1"></div>
      <div className="ambient-orb orb-2"></div>
      <div className="ambient-orb orb-3"></div>

      <header className="db-header animate-fade-in">
        <div className="db-header-left">
          <div className="header-title-container">
            <span className="enterprise-badge">
              <FaCrown className="crown-icon" /> COSMIC INVENTORY HUB
            </span>
            <h1 className="wrapped-header-title">Category Management</h1>
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
            <FaPlus /> Add Category
          </button>
        </div>
      </header>

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
  _id: item._id,
  name: item.name,
  description: item.description,
  isActive: item.isActive,
  image: item.image,
});
                          setShowEditModal(true);
                        }}
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
  className="btn-pro btn-pro-delete"
  onClick={() => {
    setSelectedCategory(item);
    setShowDeleteModal(true);
  }}
>
  <FaTrash /> 
</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

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
              <h3>Edit Category Specifications</h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowEditModal(false)}
              >
                <FaTimes />
              </button>
            </div>

       <div className="edit-form-body">

  <div className="form-group">
    <label>Name</label>
    <input
      type="text"
      value={formData.name}
      onChange={(e) =>
        setFormData({ ...formData, name: e.target.value })
      }
    />
  </div>

  <div className="form-group">
    <label>Description</label>
    <textarea
      value={formData.description}
      onChange={(e) =>
        setFormData({ ...formData, description: e.target.value })
      }
    />
  </div>

  <div className="form-group">
    <label>Status</label>
    <select
      value={formData.isActive}
      onChange={(e) =>
        setFormData({
          ...formData,
          isActive: e.target.value === "true",
        })
      }
    >
      <option value={true}>Active</option>
      <option value={false}>Inactive</option>
    </select>
  </div>

  <div className="form-group">
    <label>Image</label>
    <input
      type="file"
      onChange={(e) =>
        setFormData({
          ...formData,
          image: e.target.files[0],
        })
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
{showDeleteModal && (
  <div
    className="ultra-modal-backdrop"
    onClick={() => setShowDeleteModal(false)}
  >
    <div
      className="ultra-modal-box"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="ultra-modal-header">
        <h3>Delete Category</h3>
        <button
          className="modal-close-btn"
          onClick={() => setShowDeleteModal(false)}
        >
          <FaTimes />
        </button>
      </div>

      <p style={{ margin: "20px 0" }}>
        Are you sure you want to delete
        <strong> {selectedCategory?.name}</strong>?
      </p>

      <div className="modal-actions-row">
        <button
          className="btn-modal-pro cancel"
          onClick={() => setShowDeleteModal(false)}
        >
          Cancel
        </button>

      <button
  className="btn-modal-pro delete"
  onClick={handleDeleteCategory}
>
  Delete
</button>
      </div>
    </div>
  </div>
)}
      <AddCategoryModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddCategory}
      />
    </div>
  );
}