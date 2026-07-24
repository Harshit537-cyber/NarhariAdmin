import { BrowserRouter, Routes, Route } from "react-router-dom";
import SplashScreen from "./pages/SplashScreen";
import Login from "./pages/Login/Login";
import MainLayout from "./layouts/Mainlayout";

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
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import KycVerification from "./pages/KycVerification/KycVerification";

<Toaster position="top-right" />
const AppRoutes = () => {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<Login />} />

        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/banners" element={<BannerManagement />} /> 
          <Route path="/consultation" element={<Consultation />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product" element={<Product />} />
          <Route path="/shopping" element={<Shopping />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/partner" element={<Partner />} />
          <Route path="/partner/kyc-verification" element={<KycVerification />} />
          <Route path="/partner/profile-approval" element={<ProfileApproval />} />
        </Route>
      </Routes>
    </BrowserRouter>
     <Toaster position="top-right" />
           <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default AppRoutes;
