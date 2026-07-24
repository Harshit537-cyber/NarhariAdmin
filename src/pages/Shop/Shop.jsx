import React, { useState } from "react";
import "./Shop.css";
import {
  FaCrown,
  FaBolt,
  FaRupeeSign,
  FaBoxes,
  FaExclamationTriangle,
  FaClock,
  FaEdit,
  FaTrashAlt,
  FaPlusCircle,
  FaShippingFast,
  FaCheckCircle,
  FaStore,
} from "react-icons/fa";

export default function Shop() {
  const [products, setProducts] = useState([
    {
      id: "PROD-101",
      name: "Healing Crystal",
      category: "Gemstone",
      description: "Natural Energy Stone",
      price: "799",
      stock: 45,
      sales: 124,
      img: "https://images.unsplash.com/photo-1616628182509-6c0b5d0f4a55?w=500",
    },
    {
      id: "PROD-102",
      name: "Rudraksha Mala",
      category: "Mala",
      description: "Original 5 Mukhi",
      price: "599",
      stock: 4,
      sales: 238,
      img: "https://images.unsplash.com/photo-1605106702734-205df224ecce?w=500",
    },
    {
      id: "PROD-103",
      name: "Lucky Ring",
      category: "Ring",
      description: "Astrology Recommended",
      price: "1299",
      stock: 0,
      sales: 89,
      img: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=500",
    },
    {
      id: "PROD-104",
      name: "Shree Yantra",
      category: "Yantra",
      description: "Premium Brass Finish",
      price: "999",
      stock: 18,
      sales: 64,
      img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=500",
    },
  ]);

  const [orders, setOrders] = useState([
    {
      id: "ORD-9901",
      user: "Aman Sharma",
      product: "Rudraksha Mala",
      recommendedBy: "Acharya Rahul",
      status: "Processing",
    },
    {
      id: "ORD-9902",
      user: "Priya Patel",
      product: "Healing Crystal",
      recommendedBy: "Direct Purchase",
      status: "Shipped",
    },
    {
      id: "ORD-9903",
      user: "Rajesh Kumar",
      product: "Lucky Ring",
      recommendedBy: "Pandit Kamlesh Dev",
      status: "Delivered",
    },
  ]);

  const [newProdName, setNewProdName] = useState("");
  const [newProdCategory, setNewProdCategory] = useState("Gemstone");
  const [newProdDesc, setNewProdDesc] = useState("");
  const [newProdPrice, setNewProdPrice] = useState("");
  const [newProdStock, setNewProdStock] = useState("");
  const [newProdImg, setNewProdImg] = useState("");

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) return;

    const newProduct = {
      id: `PROD-${Math.floor(100 + Math.random() * 900)}`,
      name: newProdName,
      category: newProdCategory,
      description: newProdDesc || "Spiritual Accessory",
      price: newProdPrice,
      stock: parseInt(newProdStock) || 10,
      sales: 0,
      img:
        newProdImg ||
        "https://images.unsplash.com/photo-1616628182509-6c0b5d0f4a55?w=500",
    };

    setProducts([...products, newProduct]);

    setNewProdName("");
    setNewProdDesc("");
    setNewProdPrice("");
    setNewProdStock("");
    setNewProdImg("");
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleUpdateOrderStatus = (id, newStatus) => {
    setOrders(
      orders.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: "Out of Stock", class: "out-of-stock" };
    if (stock <= 5) return { text: "Low Stock", class: "low-stock" };
    return { text: "In Stock", class: "in-stock" };
  };

  return (
    <div className="an-shop-container">
      <div className="ambient-orb orb-1"></div>
      <div className="ambient-orb orb-2"></div>
      <div className="ambient-orb orb-3"></div>

      <header className="db-header animate-fade-in">
        <div className="db-header-left">
          <div className="header-title-container">
            <span className="enterprise-badge">
              <FaCrown className="crown-icon" /> COSMIC SHOP HUB
            </span>
            <h1 className="wrapped-header-title">Shop & Inventory Hub</h1>
          </div>
          <p className="header-subtitle">
            Monitor product demand, manage spiritual inventory & dispatch
            seeker orders.
          </p>
        </div>

        <div className="db-header-right">
          <div className="system-status-card">
            <div className="pulse-ring"></div>
            <span className="status-text">
              <FaBolt /> STORE LIVE
            </span>
          </div>
        </div>
      </header>

      <div className="db-metrics-grid">
        <div
          className="khatarnak-card gold-theme animate-slide-up"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="card-glass-shine"></div>
          <div className="card-top-bar">
            <div className="big-icon-box gold-glow">
              <FaRupeeSign />
            </div>
            <span className="trend-badge gold-pill">REVENUE</span>
          </div>
          <div className="card-middle-data">
            <h2 className="giant-stat-number">₹3.45L</h2>
            <p className="giant-stat-label">Total Shop Revenue</p>
          </div>
          <div className="card-bottom-accent">
            <div className="glow-bar gold-bar"></div>
          </div>
        </div>

        <div
          className="khatarnak-card cyan-theme animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="card-glass-shine"></div>
          <div className="card-top-bar">
            <div className="big-icon-box cyan-glow">
              <FaBoxes />
            </div>
            <span className="trend-badge cyan-pill">LISTED</span>
          </div>
          <div className="card-middle-data">
            <h2 className="giant-stat-number">{products.length}</h2>
            <p className="giant-stat-label">Active Inventory Items</p>
          </div>
          <div className="card-bottom-accent">
            <div className="glow-bar cyan-bar"></div>
          </div>
        </div>

        <div
          className="khatarnak-card danger-theme animate-slide-up"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="card-glass-shine"></div>
          <div className="card-top-bar">
            <div className="big-icon-box danger-glow">
              <FaExclamationTriangle />
            </div>
            <span className="trend-badge danger-pill">ACTION NEEDED</span>
          </div>
          <div className="card-middle-data">
            <h2 className="giant-stat-number">
              {products.filter((p) => p.stock <= 5).length}
            </h2>
            <p className="giant-stat-label">Low / Out of Stock</p>
          </div>
          <div className="card-bottom-accent">
            <div className="glow-bar danger-bar"></div>
          </div>
        </div>

        <div
          className="khatarnak-card purple-theme animate-slide-up"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="card-glass-shine"></div>
          <div className="card-top-bar">
            <div className="big-icon-box purple-glow">
              <FaClock />
            </div>
            <span className="trend-badge purple-pill">PENDING</span>
          </div>
          <div className="card-middle-data">
            <h2 className="giant-stat-number">
              {orders.filter((o) => o.status === "Processing").length}
            </h2>
            <p className="giant-stat-label">Pending Dispatch</p>
          </div>
          <div className="card-bottom-accent">
            <div className="glow-bar purple-bar"></div>
          </div>
        </div>
      </div>

      <div className="shop-layout-grid">
        <div className="layout-left-col">
          <div className="super-card animate-fade-in-delayed">
            <div className="super-card-header">
              <div className="header-accent-title">
                <div className="title-vertical-bar"></div>
                <h2>
                  <FaStore style={{ marginRight: 8 }} />
                  Inventory Products
                </h2>
              </div>
              <span className="giant-badge">Active Store</span>
            </div>

            <div className="inventory-grid">
              {products.map((prod, idx) => {
                const stockStatus = getStockStatus(prod.stock);
                return (
                  <div
                    className="inventory-card animate-slide-up"
                    style={{ animationDelay: `${0.1 + idx * 0.08}s` }}
                    key={prod.id}
                  >
                    <div className="card-glass-shine"></div>
                    <div className="inventory-img-wrap">
                      <img src={prod.img} alt={prod.name} />
                    </div>

                    <div className="inventory-body">
                      <div className="category-and-id">
                        <span className="category-badge">{prod.category}</span>
                        <span className="prod-id">{prod.id}</span>
                      </div>

                      <h3>{prod.name}</h3>
                      <p className="desc-text">{prod.description}</p>

                      <div className="price-and-sales">
                        <h4>₹ {prod.price}</h4>
                        <span className="sales-text">{prod.sales} Sold</span>
                      </div>

                      <div className="stock-line">
                        <span
                          className={`stock-status-pill ${stockStatus.class}`}
                        >
                          {stockStatus.text} ({prod.stock} units)
                        </span>
                      </div>
                    </div>

                    <div className="inventory-actions">
                      <button className="btn-edit">
                        <FaEdit /> Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteProduct(prod.id)}
                      >
                        <FaTrashAlt /> Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="layout-right-col">
          <div
            className="super-card animate-fade-in-delayed"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="super-card-header">
              <div className="header-accent-title">
                <div className="title-vertical-bar gold"></div>
                <h2>
                  <FaPlusCircle style={{ marginRight: 8 }} />
                  Add Cosmic Product
                </h2>
              </div>
            </div>

            <form onSubmit={handleAddProduct} className="add-product-form">
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  placeholder="e.g. Energized Emerald Ring"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group-row">
                <div className="form-group flex-2">
                  <label>Category</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                  >
                    <option value="Gemstone">Gemstone</option>
                    <option value="Mala">Mala</option>
                    <option value="Ring">Ring</option>
                    <option value="Yantra">Yantra</option>
                  </select>
                </div>

                <div className="form-group flex-1">
                  <label>Price (₹)</label>
                  <input
                    type="number"
                    placeholder="799"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-group flex-2">
                  <label>Image URL (Optional)</label>
                  <input
                    type="text"
                    placeholder="Unsplash image link"
                    value={newProdImg}
                    onChange={(e) => setNewProdImg(e.target.value)}
                  />
                </div>

                <div className="form-group flex-1">
                  <label>Stock Qty</label>
                  <input
                    type="number"
                    placeholder="20"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Short Description</label>
                <input
                  type="text"
                  placeholder="e.g. Recommended for positive aura"
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                />
              </div>

              <button type="submit" className="add-product-submit-btn">
                <FaPlusCircle /> Publish to Shop Catalog
              </button>
            </form>
          </div>

          <div
            className="super-card animate-fade-in-delayed"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="super-card-header">
              <div className="header-accent-title">
                <div className="title-vertical-bar purple"></div>
                <h2>
                  <FaShippingFast style={{ marginRight: 8 }} />
                  Incoming Cosmic Orders
                </h2>
              </div>
            </div>

            <div className="orders-list">
              {orders.map((ord, idx) => (
                <div
                  className="order-item animate-slide-up"
                  style={{ animationDelay: `${0.1 + idx * 0.08}s` }}
                  key={ord.id}
                >
                  <div className="order-meta">
                    <span className="order-id">{ord.id}</span>
                    <span
                      className={`order-status-badge ${ord.status.toLowerCase()}`}
                    >
                      {ord.status}
                    </span>
                  </div>

                  <div className="order-details-text">
                    <p>
                      <strong>{ord.user}</strong> ordered{" "}
                      <strong>{ord.product}</strong>
                    </p>
                    <p className="rec-text">
                      ✨ Recommended By:{" "}
                      <span className="rec-tag">{ord.recommendedBy}</span>
                    </p>
                  </div>

                  <div className="order-actions">
                    {ord.status === "Processing" && (
                      <button
                        className="btn-ship"
                        onClick={() =>
                          handleUpdateOrderStatus(ord.id, "Shipped")
                        }
                      >
                        <FaShippingFast /> Mark Shipped
                      </button>
                    )}
                    {ord.status === "Shipped" && (
                      <button
                        className="btn-deliver"
                        onClick={() =>
                          handleUpdateOrderStatus(ord.id, "Delivered")
                        }
                      >
                        <FaCheckCircle /> Mark Delivered
                      </button>
                    )}
                    {ord.status === "Delivered" && (
                      <span className="dispatch-success">
                        <FaCheckCircle /> Dispatched & Delivered
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}