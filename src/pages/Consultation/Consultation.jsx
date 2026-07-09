import React from "react";
import "./Consultation.css";

export default function Consultation() {
  return (
    <div className="consultation">

      <div className="success-icon">
        ✓
      </div>

      <h2>Booking Confirmed!</h2>

      <p className="subtitle">
        Your appointment with Acharya Sharma is confirmed.
      </p>

      <div className="details">

        <div className="box">
          <span>Date</span>
          <h4>Oct 24, 2024</h4>
        </div>

        <div className="box">
          <span>Time</span>
          <h4>10:30 AM</h4>
        </div>

        <div className="box">
          <span>Mode</span>
          <h4>Voice Call</h4>
        </div>

        <div className="box">
          <span>Duration</span>
          <h4>20 Min</h4>
        </div>

      </div>

      <div className="note">
        Join the call from <b>My Bookings</b> at your scheduled time.
      </div>

      <div className="astrologer">

        <img
          src="https://i.pravatar.cc/100?img=12"
          alt=""
        />

        <div>
          <h3>Acharya Sharma</h3>
          <p>⭐ 4.9 | Vedic Astrology</p>
        </div>

      </div>

      <button className="booking-btn">
        Go To My Bookings
      </button>

    </div>
  );
}