import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import SplashScreen from "./pages/SplashScreen";
import Login from "./pages/Login/Login";
import MainLayout from "./layouts/Mainlayout";
import AllUsers from "./pages/User/AllUsers";
import Dashboard from "./pages/Dashboard/Dashboard";
import BannerManagement from "./pages/BannerManagement/BannerManagement.jsx";
import Consultation from "./pages/Consultation/Consultation";
import Wallet from "./pages/Wallet/Wallet";
import Shop from "./pages/Shop/Shop";
import Product from "./pages/Product/Product";
import Shopping from "./pages/Shopping/Shopping";
import Orders from "./pages/Orders/Orders";
import Partner from "./pages/Partner/Partner";
import ProfileApproval from "./pages/Partner/Approval/ApprovalModal";
import KycVerification from "./pages/KycVerification/KycVerification";
import UserAstroChat from "./pages/Chats/UserAstroChat";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import Complaints from "./pages/Complaints/Complaints";
import Tickets from "./pages/Tickets/Tickets";

const ProtectedRoute = () => {
  const isAuthenticated = localStorage.getItem("token");
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const PublicRoute = () => {
  const isAuthenticated = localStorage.getItem("token");
  return !isAuthenticated ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

const AppRoutes = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/" element={<SplashScreen />} />
            <Route path="/login" element={<Login />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/banners" element={<BannerManagement />} />
              <Route path="/chats/user-astro-chats" element={<UserAstroChat />} />
              <Route path="/consultation" element={<Consultation />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product" element={<Product />} />
              <Route path="/shopping" element={<Shopping />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/partner" element={<Partner />} />
              <Route
                path="/partner/kyc-verification"
                element={<KycVerification />}
              />
              <Route
                path="/partner/profile-approval"
                element={<ProfileApproval />}
              />
              <Route path="/user" element={<AllUsers />} />
              <Route path="/complaints" element={<Complaints />} />
              <Route path="/tickets" element={<Tickets />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>

      <Toaster position="top-right" />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default AppRoutes;