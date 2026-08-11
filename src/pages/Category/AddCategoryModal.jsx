import React, { useState } from "react";
export default function AddProductModal({ open, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null,
  });

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImage = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
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
}

.add-modal-header h2{
  margin:0;
  font-size:30px;
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
  border:none;
  border-radius:50%;
  background:#f2f4f8;
  color:#555;
  font-size:26px;
  cursor:pointer;
  transition:.25s;
}

.close-btn:hover{
  background:#e8ebef;
}

/* BODY */

.add-modal-body{
  padding:28px;
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

.form-group input,
.form-group textarea{
  width:100%;
  border:1px solid #dfe3ea;
  border-radius:14px;
  padding:15px 18px;
  font-size:15px;
  background:#fff;
  transition:.25s;
  outline:none;
}

.form-group textarea{
  min-height:130px;
  resize:none;
}

.form-group input:focus,
.form-group textarea:focus{
  border-color:#d79a07;
  box-shadow:0 0 0 3px rgba(215,154,7,.12);
}

/* IMAGE */

.image-upload{
  width:100%;
  border:2px dashed #d8dde6;
  border-radius:14px;
  padding:26px;
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
  border:none;
  padding:0;
}

.image-name{
  margin-top:10px;
  font-size:14px;
  color:#666;
}

/* FOOTER */

.modal-footer{
  display:flex;
  gap:16px;
  padding:0 28px 28px;
}

.cancel-btn,
.save-btn{
  flex:1;
  height:52px;
  border-radius:14px;
  font-size:16px;
  font-weight:600;
  cursor:pointer;
  transition:.25s;
}

.cancel-btn{
  border:none;
  background:#edf1f6;
  color:#222;
}

.cancel-btn:hover{
  background:#e5e9ef;
}

.save-btn{
  border:none;
  color:#fff;
  background:linear-gradient(90deg,#c99812,#e58a00);
  box-shadow:0 10px 20px rgba(229,138,0,.28);
}

.save-btn:hover{
  transform:translateY(-2px);
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
        <div
          className="add-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="add-modal-header">
            <h2>Add Category</h2>

            <button className="close-btn" onClick={onClose}>
              ×
            </button>
          </div>

          <div className="add-modal-body">
            <div className="form-group">
              <label>Category Name</label>

              <input
                type="text"
                name="name"
                placeholder="Enter product name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Description</label>

              <textarea
                name="description"
                placeholder="Enter description..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Category Image</label>

              <div className="image-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                />

                {formData.image && (
                  <div className="image-name">
                    {formData.image.name}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              className="save-btn"
              onClick={handleSubmit}
            >
              Add Category
            </button>
          </div>
        </div>
      </div>
    </>
  );
}