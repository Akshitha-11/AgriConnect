import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { ref, get } from 'firebase/database';

function BuyerNav() {
  const [buyerData, setBuyerData] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBuyerData = async () => {
      try {
        const phoneNumber = localStorage.getItem('buyerPhone');
        if (!phoneNumber) {
          navigate('/buyer/login');
          return;
        }

        const buyerRef = ref(db, `buyers/${phoneNumber}`);
        const snapshot = await get(buyerRef);

        if (snapshot.exists()) {
          setBuyerData(snapshot.val());
        }
      } catch (err) {
        console.error('Error fetching buyer data:', err);
      }
    };

    fetchBuyerData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('buyerPhone');
    navigate('/buyer/login');
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/buyer/dashboard" className="text-xl font-bold text-green-600">
                AgriGrade
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/buyer/dashboard"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Products
              </Link>
              <Link
                to="/buyer/orders"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Orders
              </Link>
              <Link
                to="/buyer/messages"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Messages
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="ml-3 relative">
              <div>
                <button
                  type="button"
                  className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  onClick={() => setShowProfile(!showProfile)}
                >
                  <span className="sr-only">Open profile menu</span>
                  <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white">
                    {buyerData?.name?.charAt(0) || 'B'}
                  </div>
                </button>
              </div>
              {showProfile && (
                <div className="origin-top-right absolute right-0 mt-2 w-72 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-4 py-3 border-b">
                    <p className="text-sm font-medium text-gray-900">{buyerData?.name}</p>
                  </div>
                  <div className="px-4 py-3 border-b">
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-500">Phone Number</p>
                        <p className="text-sm font-medium">{buyerData?.phoneNumber}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Address</p>
                        <p className="text-sm font-medium">{buyerData?.address}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Member Since</p>
                        <p className="text-sm font-medium">
                          {new Date(buyerData?.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default BuyerNav; 