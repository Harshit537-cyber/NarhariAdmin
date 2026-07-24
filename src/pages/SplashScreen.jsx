import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import splashBg from "../assets/splash_Austro.png"; // Dynamic background reference

export default function SplashScreen() {
  const [stage, setStage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 150); // Background & Orbs reveal
    const t2 = setTimeout(() => setStage(2), 600); // Emblem & Rotating Rings reveal
    const t3 = setTimeout(() => setStage(3), 1200); // Typography & Tagline reveal
    const t4 = setTimeout(() => setStage(4), 1800); // Progress bar active
    const t5 = setTimeout(() => {
      navigate("/login");
    }, 3400); // Smooth redirect

    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, [navigate]);

  return (
    <div className="an-splash-container" data-stage={stage}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=Plus+Jakarta+Sans:wght@300;400;600&display=swap');

        .an-splash-container {
          position: relative;
          width: 100vw;
          height: 100vh;
          background-color: #faf8ff;
          background-image: radial-gradient(circle at 50% 30%, rgba(243, 232, 255, 0.8) 0%, rgba(250, 248, 255, 1) 70%), url(${splashBg});
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          font-family: 'Cinzel', serif;
          user-select: none;
        }

        /* Ambient Glowing Background Orbs */
        .an-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          opacity: 0;
          transition: opacity 1.2s ease-in-out;
        }

        .an-orb-1 {
          width: 380px;
          height: 380px;
          background: rgba(124, 58, 237, 0.22); /* Deep Royal Purple */
          top: 15%;
          left: 20%;
          animation: floatOrb 8s ease-in-out infinite alternate;
        }

        .an-orb-2 {
          width: 300px;
          height: 300px;
          background: rgba(168, 85, 247, 0.18); /* Vivid Lavender */
          bottom: 15%;
          right: 20%;
          animation: floatOrb 10s ease-in-out infinite alternate-reverse;
        }

        .an-splash-container[data-stage="1"] .an-orb,
        .an-splash-container[data-stage="2"] .an-orb,
        .an-splash-container[data-stage="3"] .an-orb,
        .an-splash-container[data-stage="4"] .an-orb {
          opacity: 1;
        }

        @keyframes floatOrb {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(30px, -40px) scale(1.1); }
        }

        /* Glassmorphic Central Card Layout */
        .an-card {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 50px 40px;
          background: rgba(255, 255, 255, 0.55);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.8);
          border-radius: 32px;
          box-shadow: 
            0 20px 50px rgba(91, 33, 182, 0.08),
            inset 0 0 20px rgba(255, 255, 255, 0.5);
          transform: translateY(20px) scale(0.95);
          opacity: 0;
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .an-splash-container[data-stage="1"] .an-card,
        .an-splash-container[data-stage="2"] .an-card,
        .an-splash-container[data-stage="3"] .an-card,
        .an-splash-container[data-stage="4"] .an-card {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        /* --- Celestial Emblem with Rotating Rings --- */
        .an-emblem-wrapper {
          position: relative;
          width: 130px;
          height: 130px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }

        .an-ring-outer {
          position: absolute;
          inset: 0;
          border: 1.5px dashed rgba(124, 58, 237, 0.4);
          border-radius: 50%;
          animation: spinRing 20s linear infinite;
        }

        .an-ring-inner {
          position: absolute;
          inset: 12px;
          border: 1px solid rgba(168, 85, 247, 0.3);
          border-radius: 50%;
          border-top-color: #6d28d9;
          animation: spinRing 8s ease-in-out infinite reverse;
        }

        @keyframes spinRing {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .an-icon-box {
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 25px rgba(124, 58, 237, 0.35);
          opacity: 0;
          transform: scale(0.5);
          transition: all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .an-splash-container[data-stage="2"] .an-icon-box,
        .an-splash-container[data-stage="3"] .an-icon-box,
        .an-splash-container[data-stage="4"] .an-icon-box {
          opacity: 1;
          transform: scale(1);
        }

        .an-icon-box svg {
          width: 36px;
          height: 36px;
          fill: #ffffff;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15));
        }

        /* --- Brand Wordmark & Typography --- */
        .an-title {
          font-size: 28px;
          font-weight: 900;
          letter-spacing: 0.3em;
          background: linear-gradient(135deg, #3b0764 0%, #6d28d9 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0 0 10px 0;
          text-transform: uppercase;
          text-align: center;
          padding-left: 0.3em; /* Visual balance */
          opacity: 0;
          transform: translateY(12px);
          transition: all 0.6s ease-out;
        }

        .an-splash-container[data-stage="3"] .an-title,
        .an-splash-container[data-stage="4"] .an-title {
          opacity: 1;
          transform: translateY(0);
        }

        /* --- Tagline Row --- */
        .an-tagline-box {
          display: flex;
          align-items: center;
          gap: 12px;
          opacity: 0;
          transform: translateY(8px);
          transition: all 0.6s ease-out 0.15s;
        }

        .an-splash-container[data-stage="3"] .an-tagline-box,
        .an-splash-container[data-stage="4"] .an-tagline-box {
          opacity: 1;
          transform: translateY(0);
        }

        .an-line {
          width: 24px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #a855f7, transparent);
        }

        .an-tagline-text {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.32em;
          color: #7e22ce;
          text-transform: uppercase;
          white-space: nowrap;
        }

        /* --- Sleek Bottom Progress Indicator --- */
        .an-progress-track {
          width: 140px;
          height: 3px;
          background: rgba(221, 214, 254, 0.5);
          border-radius: 10px;
          margin-top: 32px;
          overflow: hidden;
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .an-splash-container[data-stage="4"] .an-progress-track {
          opacity: 1;
        }

        .an-progress-fill {
          width: 0%;
          height: 100%;
          background: linear-gradient(90deg, #a855f7, #6d28d9);
          border-radius: 10px;
          transition: width 1.4s cubic-bezier(0.65, 0, 0.35, 1);
        }

        .an-splash-container[data-stage="4"] .an-progress-fill {
          width: 100%;
        }

        @media (max-width: 480px) {
          .an-card {
            padding: 40px 24px;
            width: 85%;
          }
          .an-title {
            font-size: 22px;
          }
          .an-tagline-text {
            font-size: 9px;
          }
        }
      `}</style>

      {/* Ambient Lighting Orbs */}
      <div className="an-orb an-orb-1" />
      <div className="an-orb an-orb-2" />

      {/* Central Glassmorphism Card */}
      <div className="an-card">
        
        {/* Emblem Section with Dynamic Celestial Rings */}
        <div className="an-emblem-wrapper">
          <div className="an-ring-outer" />
          <div className="an-ring-inner" />
          <div className="an-icon-box">
            {/* Custom Celestial Moon & Sparkles Icon */}
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2a10 10 0 1 0 10 10 7 7 0 0 1-7-7 10 10 0 0 0-3-3z" />
              <path d="M19 3l.6 1.8L21 5.4l-1.4.6L19 7.8l-.6-1.8L17 5.4l1.4-.6z" />
            </svg>
          </div>
        </div>

        {/* Brand Typography */}
        <h1 className="an-title">Astronarhari</h1>

        {/* Tagline Divider */}
        <div className="an-tagline-box">
          <span className="an-line" />
          <span className="an-tagline-text">Since the dawn of time</span>
          <span className="an-line" />
        </div>

        {/* Loading Progress Bar */}
        <div className="an-progress-track">
          <div className="an-progress-fill" />
        </div>

      </div>
    </div>
  );
}