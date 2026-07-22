import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import "../components/Sidebar/Sidebar.css";
import "./MainLayout.css";
export default function MainLayout() {
  return (
    <div className="layout">
      <Sidebar />

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
