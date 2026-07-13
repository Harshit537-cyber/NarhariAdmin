import React, { useState } from "react";
import "./Astrologer.css";

export default function Astrologer() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Astrologers data with matching statuses and prices
  const astrologersList = [
    {
      id: 1,
      name: "Acharya Rahul",
      rating: "4.9",
      exp: "10+ Years",
      languages: "Hindi • English",
      price: "25",
      category: "Vedic",
      img: "https://i.pravatar.cc/150?img=12",
      isOnline: true,
    },
    {
      id: 2,
      name: "Pandit Sharma",
      rating: "4.8",
      exp: "8+ Years",
      languages: "Hindi • Marathi",
      price: "20",
      category: "Vedic",
      img: "https://i.pravatar.cc/150?img=32",
      isOnline: true,
    },
    {
      id: 3,
      name: "Tarot Jessica",
      rating: "4.7",
      exp: "5+ Years",
      languages: "English • Spanish",
      price: "30",
      category: "Tarot",
      img: "https://i.pravatar.cc/150?img=47",
      isOnline: false,
    },
    {
      id: 4,
      name: "Dr. Ananya (Numerology)",
      rating: "4.9",
      exp: "12+ Years",
      languages: "Hindi • English",
      price: "35",
      category: "Numerology",
      img: "https://i.pravatar.cc/150?img=49",
      isOnline: true,
    }
  ];

  const categories = ["All", "Vedic", "Tarot", "Numerology"];

  // Filter logic for live search & categories
  const filteredAstrologers = astrologersList.filter((astro) => {
    const matchesCategory = activeCategory === "All" || astro.category === activeCategory;
    const matchesSearch = astro.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="astro-page animate-fade-in">
      
      <header className="astro-header">
        <h2>Find Your Astrologer</h2>
        <p>Connect with trusted guides, tarot readers, and Vedic scholars.</p>
      </header>

      {/* Search Input Box */}
      <div className="search-container">
        <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search astrologers by name..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Categories Filter Tabs */}
      <div className="category-tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`tab-btn ${activeCategory === cat ? "active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Astrologers Grid Card Layout */}
      <div className="astrologer-grid">
        {filteredAstrologers.map((astro) => (
          <div className="astro-card animate-slide-up" key={astro.id}>
            
            {/* Online/Offline Status Pill */}
            <div className="status-badge-container">
              <span className={`status-pill ${astro.isOnline ? "online" : "offline"}`}>
                {astro.isOnline ? "Online" : "Offline"}
              </span>
            </div>

            <div className="card-top-section">
              <div className="avatar-wrapper">
                <img src={astro.img} alt={astro.name} className="astro-img" />
                {astro.isOnline && <span className="green-pulse"></span>}
              </div>

              <div className="astro-meta">
                <h3>{astro.name}</h3>
                <div className="rating-exp">
                  <span className="star-rating">⭐ {astro.rating}</span>
                  <span className="divider">|</span>
                  <span className="experience-tag">{astro.exp}</span>
                </div>
                <p className="languages-tag">{astro.languages}</p>
              </div>
            </div>

            <div className="card-pricing">
              <span className="price-label">Consultation Fee</span>
              <h4 className="price-value">₹{astro.price} <span className="per-min">/ min</span></h4>
            </div>

            <div className="card-actions">
              <button className="btn-action chat-btn">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Chat
              </button>
              
              <button className="btn-action call-btn">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}