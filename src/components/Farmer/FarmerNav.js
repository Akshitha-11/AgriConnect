import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';

function FarmerNav() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('farmerPhone');
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/farmer/dashboard" className="text-xl font-bold text-green-600">
            AgriGrade
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link
              to="/farmer/dashboard"
              className="text-gray-600 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/farmer/products"
              className="text-gray-600 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              Products
            </Link>
            <Link
              to="/farmer/orders"
              className="text-gray-600 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              Orders
            </Link>
            <Link
              to="/farmer/upload"
              className="text-gray-600 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              Upload Products
            </Link>
            <Link
              to="/farmer/messages"
              className="text-gray-600 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              Messages
            </Link>
            <div className="relative">
              <button
                type="button"
                className="text-gray-600 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors flex items-center"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                More
                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isDropdownOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <Link
                    to="/farmer/crop-recommendation"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Crop Recommendation
                  </Link>
                  <Link
                    to="/farmer/ai-chat"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    AI Assistant
                  </Link>
                  <Link
                    to="/farmer/quality-grading"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Quality Grading
                  </Link>
                  <Link
                    to="/farmer/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/farmer/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Settings
                  </Link>
                  <Link
                    to="/farmer/help"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Help & Support
                  </Link>
                  <Link
                    to="/farmer/feedback"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Send Feedback
                  </Link>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default FarmerNav; 