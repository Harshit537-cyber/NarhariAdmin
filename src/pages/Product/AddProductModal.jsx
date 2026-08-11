
import React, { useState, useEffect } from "react";
import { getProductCategories } from "../../api/Controller/product";
export default function AddProductModal({
  open,
  onClose,
  onSubmit,
  
}) {
  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    description: "",
    category: "",
    price: "",
    salePrice: "",
    stock: "",
    benefits: "",
    howToUse: "",
    careInstructions: "",
    isFeatured: false,
    isActive: true,
    images: [],
  });
 const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open]);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const data = await getProductCategories();
      setCategories(data?.data || data || []); // response structure check kar lena
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };
  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckbox = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleImages = (e) => {
    setFormData((prev) => ({
      ...prev,
      images: [...e.target.files],
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <>
      <style>{`
        .add-modal-overlay{
          position:fixed;
          inset:0;
          background:rgba(0,0,0,.35);
          backdrop-filter:blur(8px);
          -webkit-backdrop-filter:blur(8px);
          display:flex;
          justify-content:center;
          align-items:center;
          z-index:9999;
          animation:fade .25s ease;
          padding:20px;
        }

        .add-modal{
          width:95%;
          max-width:520px;
          max-height:90vh;
          overflow-y:auto;
          background:#ffffff;
          border-radius:26px;
          box-shadow:0 18px 50px rgba(0,0,0,.18);
          animation:popup .3s ease;
          display:flex;
          flex-direction:column;
        }

        .add-modal::-webkit-scrollbar{
          width:0;
        }

        .add-modal{
          scrollbar-width:none;
        }

        .add-modal *{
          box-sizing:border-box;
        }

        /* HEADER */

        .add-modal-header{
          display:flex;
          justify-content:space-between;
          align-items:center;
          padding:24px 28px 18px;
          border-bottom:1px solid #ececec;
          background:#fff;
          position:sticky;
          top:0;
          z-index:2;
          border-radius:26px 26px 0 0;
        }

        .add-modal-header h2{
          margin:0;
          font-size:28px;
          font-weight:700;
          background:linear-gradient(90deg,#FFD700,#000000);
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          background-clip:text;
          color:transparent;
        }

        .close-btn{
          width:40px;
          height:40px;
          flex-shrink:0;
          border:none;
          border-radius:50%;
          background:#f2f4f8;
          color:#555;
          font-size:22px;
          line-height:1;
          cursor:pointer;
          transition:.25s;
          display:flex;
          align-items:center;
          justify-content:center;
        }

        .close-btn:hover{
          background:#e8ebef;
          color:#111;
          transform:rotate(90deg);
        }

        /* BODY */

        .add-modal-body{
          padding:28px;
          display:flex;
          flex-direction:column;
        }

        .form-row{
          display:flex;
          gap:16px;
        }

        .form-row .form-group{
          flex:1;
          min-width:0;
        }

        .form-group{
          margin-bottom:22px;
        }

        .form-group label{
          display:block;
          margin-bottom:8px;
          font-size:13px;
          font-weight:700;
          color:#333;
          text-transform:uppercase;
          letter-spacing:.5px;
        }

        .form-group input[type="text"],
        .form-group input[type="number"],
        .form-group select,
        .form-group textarea{
          width:100%;
          border:1px solid #dfe3ea;
          border-radius:14px;
          padding:14px 16px;
          font-size:15px;
          font-family:inherit;
          background:#fff;
          transition:.2s ease;
          outline:none;
          color:#222;
        }

        .form-group select{
          appearance:none;
          -webkit-appearance:none;
          background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='9' viewBox='0 0 14 9'><path d='M1 1l6 6 6-6' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/></svg>");
          background-repeat:no-repeat;
          background-position:right 16px center;
          padding-right:40px;
          cursor:pointer;
        }

        .form-group textarea{
          min-height:110px;
          resize:vertical;
          line-height:1.5;
        }

        .form-group input:hover,
        .form-group select:hover,
        .form-group textarea:hover{
          border-color:#c9ccd2;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus{
          border-color:#d79a07;
          box-shadow:0 0 0 3px rgba(215,154,7,.14);
        }

        .form-hint{
          margin-top:6px;
          font-size:12px;
          color:#999;
        }

        /* CHECKBOXES */

        .checkbox-group{
          display:flex;
          align-items:center;
          gap:10px;
          cursor:pointer;
          user-select:none;
        }

        .checkbox-group input[type="checkbox"]{
          appearance:none;
          -webkit-appearance:none;
          width:20px;
          height:20px;
          border:1.5px solid #dfe3ea;
          border-radius:6px;
          cursor:pointer;
          position:relative;
          transition:.2s ease;
          flex-shrink:0;
        }

        .checkbox-group input[type="checkbox"]:hover{
          border-color:#d79a07;
        }

        .checkbox-group input[type="checkbox"]:checked{
          background:linear-gradient(90deg,#c99812,#e58a00);
          border-color:#e58a00;
        }

        .checkbox-group input[type="checkbox"]:checked::after{
          content:"";
          position:absolute;
          left:6px;
          top:2px;
          width:5px;
          height:10px;
          border:solid #fff;
          border-width:0 2px 2px 0;
          transform:rotate(45deg);
        }

        .checkbox-group span{
          font-size:14px;
          font-weight:600;
          color:#333;
          text-transform:none;
          letter-spacing:normal;
        }

        /* IMAGE */

        .image-upload{
          width:100%;
          border:2px dashed #d8dde6;
          border-radius:14px;
          padding:22px;
          text-align:center;
          background:#fafafa;
          cursor:pointer;
          transition:.25s;
        }

        .image-upload:hover{
          border-color:#d79a07;
          background:#fffdf7;
        }

        .image-upload input{
          width:100%;
          cursor:pointer;
        }

        .image-name{
          margin-top:10px;
          font-size:13px;
          color:#666;
        }

        /* FOOTER */

        .modal-footer{
          display:flex;
          gap:16px;
          padding:18px 28px 28px;
          position:sticky;
          bottom:0;
          background:#fff;
          border-top:1px solid #ececec;
          margin-top:auto;
        }

        .cancel-btn,
        .save-btn{
          flex:1;
          height:52px;
          border-radius:14px;
          font-size:16px;
          font-weight:600;
          cursor:pointer;
          transition:.2s ease;
        }

        .cancel-btn{
          border:none;
          background:#edf1f6;
          color:#222;
        }

        .cancel-btn:hover{
          background:#e5e9ef;
          transform:translateY(-2px);
        }

        .cancel-btn:active,
        .save-btn:active{
          transform:translateY(0);
        }

        .save-btn{
          border:none;
          color:#fff;
          background:linear-gradient(90deg,#c99812,#e58a00);
          box-shadow:0 10px 20px rgba(229,138,0,.28);
        }

        .save-btn:hover{
          transform:translateY(-2px);
          box-shadow:0 14px 26px rgba(229,138,0,.38);
          filter:brightness(1.05);
        }

        /* ANIMATION */

        @keyframes fade{
          from{opacity:0;}
          to{opacity:1;}
        }

        @keyframes popup{
          from{
            opacity:0;
            transform:translateY(30px) scale(.96);
          }
          to{
            opacity:1;
            transform:translateY(0) scale(1);
          }
        }
      `}</style>

      <div className="add-modal-overlay" onClick={onClose}>
        <div className="add-modal" onClick={(e) => e.stopPropagation()}>
          <div className="add-modal-header">
            <h2>Add Product</h2>
            <button className="close-btn" onClick={onClose} type="button">
              ×
            </button>
          </div>

          <div className="add-modal-body">
            {/* Product Name */}
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Rose Gold Facial Serum"
              />
            </div>

            {/* Short Description */}
            <div className="form-group">
              <label>Short Description</label>
              <textarea
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                placeholder="One line summary shown in listings"
                style={{ minHeight: 70 }}
              />
            </div>

            {/* Category */}
            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select Category</option>
                {categories?.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price + Sale Price */}
            <div className="form-row">
              <div className="form-group">
                <label>Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                />
              </div>

              <div className="form-group">
                <label>Sale Price</label>
                <input
                  type="number"
                  name="salePrice"
                  value={formData.salePrice}
                  onChange={handleChange}
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Stock */}
            <div className="form-group">
              <label>Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Available quantity"
              />
            </div>

            {/* Benefits */}
            <div className="form-group">
              <label>Benefits</label>
              <textarea
                name="benefits"
                value={formData.benefits}
                onChange={handleChange}
                placeholder="Comma separated, e.g. Hydrating, Brightening"
              />
              <div className="form-hint">Separate each benefit with a comma.</div>
            </div>

            {/* How To Use */}
            <div className="form-group">
              <label>How To Use</label>
              <textarea
                name="howToUse"
                value={formData.howToUse}
                onChange={handleChange}
                placeholder="Application instructions"
              />
            </div>

            {/* Care Instructions */}
            <div className="form-group">
              <label>Care Instructions</label>
              <textarea
                name="careInstructions"
                value={formData.careInstructions}
                onChange={handleChange}
                placeholder="Storage & handling instructions"
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Full product description"
                style={{ minHeight: 140 }}
              />
            </div>

            {/* Images */}
            <div className="form-group">
              <label>Images</label>
              <div className="image-upload">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImages}
                />
                {formData.images.length > 0 && (
                  <div className="image-name">
                    {formData.images.length} file
                    {formData.images.length > 1 ? "s" : ""} selected:{" "}
                    {formData.images.map((f) => f.name).join(", ")}
                  </div>
                )}
              </div>
            </div>

            {/* Featured */}
            <div className="form-group">
              <label className="checkbox-group">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleCheckbox}
                />
                <span>Featured</span>
              </label>
            </div>

            {/* Active */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="checkbox-group">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleCheckbox}
                />
                <span>Active</span>
              </label>
            </div>
          </div>

          <div className="modal-footer">
            <button className="cancel-btn" onClick={onClose} type="button">
              Cancel
            </button>
            <button className="save-btn" onClick={handleSubmit} type="button">
              Add Product
            </button>
          </div>
        </div>
      </div>
    </>
  );
}