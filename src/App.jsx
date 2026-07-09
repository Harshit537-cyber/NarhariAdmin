import { BrowserRouter, Routes, Route } from "react-router-dom";
import SplashScreen from "./pages/SplashScreen";
import Login from "./pages/Login/Login";
import MainLayout from "./layouts/Mainlayout";

import Dashboard from "./pages/Dashboard/Dashboard";
import Astrologer from "./pages/Astrologer/Astrologer";
import Consultation from "./pages/Consultation/Consultation";
import Wallet from "./pages/Wallet/Wallet";
import Shop from "./pages/Shop/Shop";
import Product from "./pages/Product/Product";
import Shopping from "./pages/Shopping/Shopping";
import Orders from "./pages/Orders/Orders";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<Login />} />

        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/astrologer" element={<Astrologer />} />
          <Route path="/consultation" element={<Consultation />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product" element={<Product />} />
          <Route path="/shopping" element={<Shopping />} />
          <Route path="/orders" element={<Orders />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
