import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import LogoutModal from "../../pages/Logout/LogoutModal";
import "./Sidebar.css";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: <IconGrid /> },
  { to: "/consultation", label: "Consultation", icon: <IconChat /> },
  { to: "/product", label: "Product", icon: <IconBox /> },
  { to: "/wallet", label: "Wallet", icon: <IconWallet /> },
  { to: "/shop", label: "Shop", icon: <IconStore /> },
  { to: "/shopping", label: "Shopping", icon: <IconBag /> },
  { to: "/orders", label: "Orders", icon: <IconList /> },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [partnerOpen, setPartnerOpen] = useState(
    location.pathname.startsWith("/partner")
  );

  return (
    <aside className="an-sidebar">
      {/* Brand Header */}
      <div className="an-sidebar-brand">
        <div className="an-brand-icon-wrapper">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M62 20C44 20 30 34 30 52C30 70 44 84 62 84C68 84 73.5 82.5 78 79.8C68.4 76.7 61.5 67.8 61.5 57.2C61.5 43.6 71 32.4 84 29.6C78.2 23.6 70.5 20 62 20Z"
              fill="url(#brandGradient)"
            />
            <defs>
              <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f0abfc" />
                <stop offset="100%" stopColor="#c084fc" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <span className="an-sidebar-brand-text">ASTRONARHARI</span>
      </div>

      {/* Navigation List */}
      <nav className="an-sidebar-nav">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `an-nav-item ${isActive ? "is-active" : ""}`
          }
        >
          <IconGrid />
          <span className="an-nav-text">Dashboard</span>
        </NavLink>

        {/* Collapsible Partner Menu */}
        <div className="an-nav-group">
          <button
            className={`an-nav-item an-nav-parent ${
              partnerOpen ? "is-open" : ""
            }`}
            onClick={() => setPartnerOpen((prev) => !prev)}
          >
            <IconPartner />
            <span className="an-nav-text">Partner</span>
            <IconChevron className="an-nav-chevron" />
          </button>

          {partnerOpen && (
            <div className="an-nav-submenu">
              <NavLink
                to="/partner"
                end
                className={({ isActive }) =>
                  `an-nav-subitem ${isActive ? "is-active" : ""}`
                }
              >
                <span>All Partners</span>
              </NavLink>
              <NavLink
                to="/partner/profile-approval"
                className={({ isActive }) =>
                  `an-nav-subitem ${isActive ? "is-active" : ""}`
                }
              >
                <span>Profile Approval</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* Other Items */}
        {navItems.slice(1).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `an-nav-item ${isActive ? "is-active" : ""}`
            }
          >
            {item.icon}
            <span className="an-nav-text">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      <button className="an-nav-item logout-btn" onClick={() => setShowModal(true)}>
        <IconLogout />
        <span className="an-nav-text">Logout</span>
      </button>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => {
          setShowModal(false);
          navigate("/login");
        }}
      />
    </aside>
  );
}

/* ==========================================
   SVG ICONS
   ========================================== */
function IconGrid() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="2" />
      <rect x="14" y="3" width="7" height="7" rx="2" />
      <rect x="3" y="14" width="7" height="7" rx="2" />
      <rect x="14" y="14" width="7" height="7" rx="2" />
    </svg>
  );
}

function IconChat() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 9h8m-8 4h6m4-9H4a2 2 0 0 0-2 2v15l4-4h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z" />
    </svg>
  );
}

function IconWallet() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 8h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h3m6 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
    </svg>
  );
}

function IconStore() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18M3 7v14M21 7v14M3 7l9-4 9 4M12 21V7" />
    </svg>
  );
}

function IconBox() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3L2 8l10 5 10-5-10-5zM2 12l10 5 10-5M12 3v18" />
    </svg>
  );
}

function IconBag() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 5h12l2 5v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V10l2-5zM10 5a2 2 0 1 0 4 0" />
    </svg>
  );
}

function IconList() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 6h11M9 12h11M9 18h11M5 6v.01M5 12v.01M5 18v.01" />
    </svg>
  );
}

function IconPartner() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="10" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconChevron({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function IconLogout() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  );
}