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
          background:rgba(0,0,0,.45);
          backdrop-filter:blur(6px);
          -webkit-backdrop-filter:blur(6px);
          display:flex;
          justify-content:center;
          align-items:center;
          z-index:9999;
          animation:fade .3s ease;
        }

        .add-modal{
          width:95%;
          max-width:550px;
          background:#fff;
          border-radius:18px;
          overflow:hidden;
          box-shadow:0 18px 45px rgba(0,0,0,.25);
          animation:popup .35s ease;
          box-sizing:border-box;
        }

        .add-modal *{
          box-sizing:border-box;
        }

        .add-modal-header{
          background:linear-gradient(135deg,#b91c1c,#871313);
          color:#fff;
          padding:18px 24px;
          display:flex;
          justify-content:space-between;
          align-items:center;
          position:relative;
        }
        .add-modal-header h2{
          margin:0;
          font-size:22px;
        }

        .close-btn{
          border:none;
          background:none;
          color:#fff;
          font-size:24px;
          cursor:pointer;
        }

        .add-modal-body{
          padding:25px;
        }

        .form-group{
          display:flex;
          flex-direction:column;
          align-items:center;
          margin-bottom:18px;
        }
        .form-group label{
          margin-bottom:8px;
          color:#b91c1c;
          font-weight:600;
          font-size:14px;
        }

        .form-group input,
        .form-group textarea{
          width:90%;
          padding:12px 14px;
          border:1px solid #eab308;
          border-radius:10px;
          font-size:14px;
          outline:none;
          transition:.3s;
        }

        .form-group input:focus,
        .form-group textarea:focus{
          border-color:#b91c1c;
          box-shadow:0 0 8px rgba(185,28,28,.15);
        }

        .form-group textarea{
          resize:none;
          min-height:120px;
        }

        .image-upload{
          border:2px dashed #eab308;
          border-radius:12px;
          padding:25px;
          text-align:center;
          cursor:pointer;
          background:#fffdf3;
          transition:.3s;
          width:90%;
        }

        .image-upload:hover{
          background:#fff7df;
        }

        .image-upload input{
          border:none;
          padding:0;
        }

        .image-name{
          margin-top:10px;
          font-size:13px;
          color:#666;
        }

        .modal-footer{
          display:flex;
          flex-direction:row;
          flex-wrap:nowrap;
          justify-content:center;
          align-items:center;
          gap:16px;
          padding:20px 25px;
          border-top:1px solid #eee;
        }

        .cancel-btn,
        .save-btn{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          flex:0 0 auto;
          width:170px;
          height:50px;
          border-radius:10px;
          font-size:15px;
          font-weight:600;
          cursor:pointer;
          transition:.3s;
        }

        .cancel-btn{
          border:2px solid #b91c1c;
          background:#fff;
          color:#b91c1c;
        }

        .save-btn{
          border:none;
          background:linear-gradient(135deg,#b91c1c,#871313);
          color:#fff;
        }

        .cancel-btn:hover{
          background:#fff5f5;
        }

        .save-btn:hover{
          transform:translateY(-2px);
          box-shadow:0 10px 25px rgba(185,28,28,.25);
        }

        @keyframes fade{
          from{opacity:0;}
          to{opacity:1;}
        }

        @keyframes popup{
          from{
            opacity:0;
            transform:translateY(40px) scale(.95);
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
            <h2>Add Product</h2>

            <button className="close-btn" onClick={onClose}>
              ×
            </button>
          </div>

          <div className="add-modal-body">
            <div className="form-group">
              <label>Product Name</label>

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
              <label>Product Image</label>

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
              Add Product
            </button>
          </div>
        </div>
      </div>
    </>
  );
}