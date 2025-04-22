import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BuyerNav from './BuyerNav';

function BuyerDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to products page by default
    navigate('/buyer/products');
  }, [navigate]);

  return (
    <div className="min-h-screen">
      <BuyerNav />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Redirecting to products...</div>
      </div>
    </div>
  );
}

export default BuyerDashboard; 