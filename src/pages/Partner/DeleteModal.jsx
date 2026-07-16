import React from "react";
import toast from "react-hot-toast";

export default function DeleteModal({ isOpen, onClose, onConfirm }) {
  const styles = {
    overlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.45)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
    },
    modal: {
      width: "420px",
      background: "#fff",
      borderRadius: "18px",
      padding: "30px",
      textAlign: "center",
      boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
    },
    deleteBtn: {
      background: "#b91c1c",
      color: "#fff",
      border: "none",
      padding: "12px 28px",
      borderRadius: "10px",
      cursor: "pointer",
      marginLeft: "10px",
    },
    cancelBtn: {
      background: "#e5e7eb",
      color: "#333",
      border: "none",
      padding: "12px 28px",
      borderRadius: "10px",
      cursor: "pointer",
    },
  };

  if (!isOpen) return null;

  const handleDelete = () => {
    onConfirm(); // parent function jo actual delete API call karega
    toast.success("Partner deleted successfully!");
    onClose(); // modal band karna
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>Delete Partner</h2>

        <p style={{ color: "#666", margin: "20px 0" }}>
          Are you sure you want to delete this partner?
        </p>

        <button style={styles.cancelBtn} onClick={onClose}>
          Cancel
        </button>

        <button style={styles.deleteBtn} onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}