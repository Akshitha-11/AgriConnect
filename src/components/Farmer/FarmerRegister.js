import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../../firebase'; // Make sure to import your Firebase configuration
import { ref, set } from 'firebase/database';

function FarmerRegister() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Create the farmer's main node using phone number as the key
      const farmerRef = ref(db, `farmers/${formData.phone}`);
      
      // Create the nested structure
      await set(farmerRef, {
        farmer_details: {
          name: formData.name,
          phone: formData.phone,
          address: formData.address
        },
        products: {}, // Empty products node
        messages: {}, // Empty messages node
        offers: {}, // Empty offers node
        notifications: {} // Empty notifications node
      });

      // Store phone number in localStorage for authentication
      localStorage.setItem('farmerPhone', formData.phone);
      
      // Navigate to products page
      navigate('/farmer/products');
    } catch (error) {
      console.error('Error registering farmer:', error);
      // Handle error (show error message to user)
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-green-600">
              AgriGrade
            </Link>
            <div className="flex space-x-4">
              <Link
                to="/farmer/login"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/farmer/register"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Farmer Registration</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                pattern="[0-9]{10}"
                title="Please enter a 10-digit phone number"
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
            >
              Register
            </button>
            <p className="text-center text-gray-600">
              Already have an account?{' '}
              <Link to="/farmer/login" className="text-green-600 hover:text-green-700">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FarmerRegister; 