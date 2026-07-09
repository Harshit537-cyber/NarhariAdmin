import React from "react";
import "./Astrologer.css";

export default function Astrologer() {
  return (
    <div className="astro-page">

      <h2>Find Your Astrologer</h2>

      <input
        type="text"
        placeholder="Search astrologer..."
        className="search"
      />

      <div className="category">
        <button className="active">All</button>
        <button>Vedic</button>
        <button>Tarot</button>
        <button>Numerology</button>
      </div>

      <div className="card">

        <div className="top">
          <img
            src="https://i.pravatar.cc/100?img=12"
            alt=""
          />

          <div>
            <h3>Acharya Rahul</h3>
            <p>⭐ 4.9 | 10+ Years</p>
            <span>Hindi • English</span>
          </div>
        </div>

        <h4>₹25 / min</h4>

        <div className="btns">
          <button className="chat">Chat</button>
          <button className="call">Call</button>
        </div>

      </div>

      <div className="card">

        <div className="top">
          <img
            src="https://i.pravatar.cc/100?img=32"
            alt=""
          />

          <div>
            <h3>Pandit Sharma</h3>
            <p>⭐ 4.8 | 8+ Years</p>
            <span>Hindi • Marathi</span>
          </div>
        </div>

        <h4>₹20 / min</h4>

        <div className="btns">
          <button className="chat">Chat</button>
          <button className="call">Call</button>
        </div>

      </div>

    </div>
  );
}