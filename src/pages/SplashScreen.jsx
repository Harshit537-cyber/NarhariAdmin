import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom"; // Add this import

export default function SplashScreen() {
  const [stage, setStage] = useState(0);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 100);
    const t2 = setTimeout(() => setStage(2), 700);
    const t3 = setTimeout(() => setStage(3), 1150);
    const t4 = setTimeout(() => {
      navigate("/login"); // Redirect here
    }, 2600);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, [navigate]);

  return (
    <div className="an-splash" data-stage={stage}>
      <style>{`
        .an-splash {
          position: relative;
          width: 100%;
          min-height: 100vh;
          background: #fffdf9;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          font-family: 'EB Garamond', 'Cormorant Garamond', Georgia, serif;
        }

        .an-splash::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at 50% 38%, rgba(201,162,39,0.07) 0%, rgba(201,162,39,0) 60%);
          pointer-events: none;
        }

        .an-stack {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 22px;
          transform: translateY(4px);
        }

        /* --- Moon + sparkle emblem --- */
        .an-emblem {
          position: relative;
          width: 84px;
          height: 84px;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transform: scale(0.72);
          transition: opacity 0.65s cubic-bezier(0.22, 1, 0.36, 1),
                      transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .an-splash[data-stage="1"] .an-emblem,
        .an-splash[data-stage="2"] .an-emblem,
        .an-splash[data-stage="3"] .an-emblem {
          opacity: 1;
          transform: scale(1);
        }

        .an-emblem svg { width: 100%; height: 100%; display: block; }

        .an-moonGlow {
          animation: anGlowPulse 3.2s ease-in-out infinite;
          transform-origin: center;
        }
        @keyframes anGlowPulse {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 0.95; }
        }

        .an-sparkle {
          transform-origin: center;
          animation: anTwinkle 2.4s ease-in-out infinite;
        }
        .an-sparkle--b { animation-delay: 0.6s; }
        .an-sparkle--c { animation-delay: 1.2s; }
        @keyframes anTwinkle {
          0%, 100% { opacity: 0.25; transform: scale(0.7); }
          50% { opacity: 1; transform: scale(1); }
        }

        /* --- Wordmark --- */
        .an-wordmark {
          font-size: 26px;
          letter-spacing: 0.34em;
          font-weight: 500;
          color: #5b3a8e;
          text-transform: uppercase;
          margin: 0;
          padding-left: 0.34em; /* balance the trailing letter-spacing */
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .an-splash[data-stage="2"] .an-wordmark,
        .an-splash[data-stage="3"] .an-wordmark {
          opacity: 1;
          transform: translateY(0);
        }

        /* --- Tagline with hairline rules --- */
        .an-tagline {
          display: flex;
          align-items: center;
          gap: 10px;
          opacity: 0;
          transition: opacity 0.6s ease 0.1s;
        }
        .an-splash[data-stage="3"] .an-tagline {
          opacity: 1;
        }

        .an-rule {
          width: 26px;
          height: 1px;
          background: #c9a227;
        }

        .an-taglineText {
          font-size: 10px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #9a8f7c;
          font-family: 'Cormorant Garamond', Georgia, serif;
          white-space: nowrap;
        }

        @media (prefers-reduced-motion: reduce) {
          .an-emblem, .an-wordmark, .an-tagline, .an-moonGlow, .an-sparkle {
            transition: none !important;
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      <div className="an-stack">
        <div className="an-emblem">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <g className="an-moonGlow">
              <path
                d="M62 20C44 20 30 34 30 52C30 70 44 84 62 84C68 84 73.5 82.5 78 79.8C68.4 76.7 61.5 67.8 61.5 57.2C61.5 43.6 71 32.4 84 29.6C78.2 23.6 70.5 20 62 20Z"
                fill="#c9a227"
              />
            </g>
            <g className="an-sparkle an-sparkle--a">
              <path
                d="M83 22L84.4 27.6L90 29L84.4 30.4L83 36L81.6 30.4L76 29L81.6 27.6Z"
                fill="#d9b23e"
              />
            </g>
            <g className="an-sparkle an-sparkle--b">
              <path
                d="M88 38L88.9 41.6L92.5 42.5L88.9 43.4L88 47L87.1 43.4L83.5 42.5L87.1 41.6Z"
                fill="#d9b23e"
              />
            </g>
            <g className="an-sparkle an-sparkle--c">
              <path
                d="M70 16L70.7 18.8L73.5 19.5L70.7 20.2L70 23L69.3 20.2L66.5 19.5L69.3 18.8Z"
                fill="#d9b23e"
              />
            </g>
          </svg>
        </div>

        <p className="an-wordmark">Astronarhari</p>

        <div className="an-tagline">
          <span className="an-rule" />
          <span className="an-taglineText">Since the dawn of time</span>
          <span className="an-rule" />
        </div>
      </div>
    </div>
  );
}
