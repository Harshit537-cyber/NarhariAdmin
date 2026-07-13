import React, { useState } from "react";
import "./Shop.css";

export default function Shop() {
  // 1. Initial Products State (Admin Inventory)
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
      stock: 4, // Low Stock
      sales: 238,
      img: "https://images.unsplash.com/photo-1605106702734-205df224ecce?w=500",
    },
    {
      id: "PROD-103",
      name: "Lucky Ring",
      category: "Ring",
      description: "Astrology Recommended",
      price: "1299",
      stock: 0, // Out of Stock
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

  // 2. Cosmic Shop Orders (Connecting User and Pandit recommendations)
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

  // 3. Form States for Adding New Product
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

    // Reset Form fields
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
      orders.map((o) => (o.id === id ? { ...o, status: newStatus } : o)),
    );
  };

  // Stock status helper
  const getStockStatus = (stock) => {
    if (stock === 0) return { text: "Out of Stock", class: "out-of-stock" };
    if (stock <= 5) return { text: "Low Stock", class: "low-stock" };
    return { text: "In Stock", class: "in-stock" };
  };

  return (
    <div className="shop-page animate-fade-in">
      {/* Header */}
      <header className="page-header">
        <h2>Cosmic Shop & Inventory Hub</h2>
        <p>
          Monitor product demand, manage spiritual inventory, and dispatch
          seeker orders.
        </p>
      </header>

      {/* Admin Shop Metrics Grid */}
      <div className="shop-metrics-grid">
        <div className="metric-card">
          <p>Total Shop Revenue</p>
          <h2 className="text-gold">₹ 3,45,200.00</h2>
          <span>Direct & recommended sales</span>
        </div>
        <div className="metric-card">
          <p>Active Inventory Items</p>
          <h2>{products.length} Products</h2>
          <span>Listed in cosmic store</span>
        </div>
        <div className="metric-card">
          <p>Low / Out of Stock</p>
          <h2 className="text-red">
            {products.filter((p) => p.stock <= 5).length} Items
          </h2>
          <span>Action recommended</span>
        </div>
        <div className="metric-card">
          <p>Pending Dispatch</p>
          <h2 className="text-green-dark">
            {orders.filter((o) => o.status === "Processing").length} Orders
          </h2>
          <span>Awaiting shipment</span>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="shop-layout-grid">
        {/* Left Column: Product Management Grid */}
        <div className="layout-left-col">
          <div className="panel-card">
            <div className="panel-header">
              <h3>Inventory Products</h3>
              <span className="badge-inventory">Active Store</span>
            </div>

            <div className="inventory-grid">
              {products.map((prod) => {
                const stockStatus = getStockStatus(prod.stock);
                return (
                  <div className="inventory-card" key={prod.id}>
                    <img
                      src={prod.img}
                      alt={prod.name}
                      className="inventory-img"
                    />

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
                      <button className="btn-edit">Edit Details</button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteProduct(prod.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Add Product & Orders Tracking */}
        <div className="layout-right-col">
          {/* Section: Add New Product Form */}
          <div className="panel-card">
            <div className="panel-header">
              <h3>Add Cosmic Product</h3>
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
                Publish to Shop Catalog
              </button>
            </form>
          </div>

          {/* Section: Recent Orders & Pandit Recs Tracker */}
          <div className="panel-card">
            <div className="panel-header">
              <h3>Incoming Cosmic Orders</h3>
            </div>

            <div className="orders-list">
              {orders.map((ord) => (
                <div className="order-item" key={ord.id}>
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
                        Mark Shipped
                      </button>
                    )}
                    {ord.status === "Shipped" && (
                      <button
                        className="btn-deliver"
                        onClick={() =>
                          handleUpdateOrderStatus(ord.id, "Delivered")
                        }
                      >
                        Mark Delivered
                      </button>
                    )}
                    {ord.status === "Delivered" && (
                      <span className="dispatch-success">
                        ✓ Dispatched & Delivered
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
