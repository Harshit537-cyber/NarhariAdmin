import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import LogoutModal from "../../pages/Logout/LogoutModal";
import "./sidebar.css";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: <IconGrid /> },
  { to: "/astrologer", label: "Astrologer", icon: <IconStar /> },
  { to: "/consultation", label: "Consultation", icon: <IconChat /> },
  { to: "/wallet", label: "Wallet", icon: <IconWallet /> },
  { to: "/shop", label: "Shop", icon: <IconStore /> },
  { to: "/product", label: "Product", icon: <IconBox /> },
  { to: "/shopping", label: "Shopping", icon: <IconBag /> },
  { to: "/orders", label: "Orders", icon: <IconList /> },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  return (
    <aside className="an-sidebar">
      <div className="an-sidebar-brand">
        <div style={{ transform: "rotate(-10deg)" }}>
          <svg
            width="35"
            height="35"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M62 20C44 20 30 34 30 52C30 70 44 84 62 84C68 84 73.5 82.5 78 79.8C68.4 76.7 61.5 67.8 61.5 57.2C61.5 43.6 71 32.4 84 29.6C78.2 23.6 70.5 20 62 20Z"
              fill="#c9a227"
            />
          </svg>
        </div>
        <span className="an-sidebar-brand-text">AUSTRONARHARI</span>
      </div>

      <nav className="an-sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `an-nav-item ${isActive ? "is-active" : ""}`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
       
      </nav>
<button
          className="an-nav-item logout-btn"
          onClick={() => setShowModal(true)}
        >
          <IconLogout />
          <span>Logout</span>
        </button>
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

function IconGrid() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}
function IconStar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 17.75l-6.172 3.245 1.179-6.873-4.993-4.867 6.9-1.002L12 2l3.086 6.253 6.9 1.002-4.993 4.867 1.179 6.873z" />
    </svg>
  );
}
function IconChat() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 9h8m-8 4h6m4-9H4a2 2 0 0 0-2 2v15l4-4h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z" />
    </svg>
  );
}
function IconWallet() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 8h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h3m6 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
    </svg>
  );
}
function IconStore() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 21h18M3 7v14M21 7v14M3 7l9-4 9 4M12 21V7" />
    </svg>
  );
}
function IconBox() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3L2 8l10 5 10-5-10-5zM2 12l10 5 10-5M12 3v18" />
    </svg>
  );
}
function IconBag() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 5h12l2 5v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V10l2-5zM10 5a2 2 0 1 0 4 0" />
    </svg>
  );
}
function IconList() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 6h11M9 12h11M9 18h11M5 6v.01M5 12v.01M5 18v.01" />
    </svg>
  );
}
function IconLogout() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  );
}
