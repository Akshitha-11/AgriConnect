import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import FarmerLogin from './components/Farmer/FarmerLogin';
import FarmerRegister from './components/Farmer/FarmerRegister';
import FarmerDashboard from './components/Farmer/FarmerDashboard';
import FarmProducts from './components/Farmer/FarmProducts';
import Messages from './components/Farmer/Messages';
import Notifications from './components/Farmer/Notifications';
import UploadProduct from './components/Farmer/UploadProduct';
import Overview from './components/Farmer/Overview';
import BuyerLogin from './components/Buyer/BuyerLogin';
import BuyerRegister from './components/Buyer/BuyerRegister';
import BuyerDashboard from './components/Buyer/BuyerDashboard';
import BuyerNav from './components/Buyer/BuyerNav';
import BuyerProducts from './components/Buyer/Products';
import Orders from './components/Farmer/Orders';
import FarmerNav from './components/Farmer/FarmerNav';
import BuyerOrders from './components/Buyer/BuyerOrders';
import CropRecommendation from './components/Farmer/CropRecommendation';
import QualityGrading from './components/Farmer/QualityGrading';
import AIChat from './components/Farmer/AIChat';

// Wrapper component for buyer routes
const BuyerLayout = () => (
  <div className="min-h-screen">
    <BuyerNav />
    <Outlet />
  </div>
);

// Wrapper component for farmer routes
const FarmerLayout = () => (
  <div className="min-h-screen">
    <FarmerNav />
    <Outlet />
  </div>
);

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Farmer Routes */}
          <Route path="/farmer/login" element={<FarmerLogin />} />
          <Route path="/farmer/register" element={<FarmerRegister />} />
          <Route path="/farmer" element={<FarmerLayout />}>
            <Route index element={<FarmerDashboard />} />
            <Route path="dashboard" element={<FarmerDashboard />} />
            <Route path="products" element={<FarmProducts />} />
            <Route path="orders" element={<Orders />} />
            <Route path="messages" element={<Messages />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="upload" element={<UploadProduct />} />
            <Route path="overview" element={<Overview />} />
            <Route path="crop-recommendation" element={<CropRecommendation />} />
            <Route path="quality-grading" element={<QualityGrading />} />
            <Route path="ai-chat" element={<AIChat />} />
          </Route>

          {/* Buyer Routes */}
          <Route path="/buyer/login" element={<BuyerLogin />} />
          <Route path="/buyer/register" element={<BuyerRegister />} />
          <Route path="/buyer" element={<BuyerLayout />}>
            <Route index element={<BuyerDashboard />} />
            <Route path="dashboard" element={<BuyerDashboard />} />
            <Route path="products" element={<BuyerProducts />} />
            <Route path="orders" element={<BuyerOrders />} />
            <Route path="messages" element={
              <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-4">Messages</h1>
                {/* Add your messages content here */}
              </div>
            } />
          </Route>
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
