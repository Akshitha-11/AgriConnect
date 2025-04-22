import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { ref, get, push, update, set } from 'firebase/database';

function PlaceOrder({ product, farmer }) {
  const [quantity, setQuantity] = useState(1);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Get buyer details from localStorage
      const buyerPhone = localStorage.getItem('buyerPhone');
      const buyerName = localStorage.getItem('buyerName');
      const buyerAddress = localStorage.getItem('buyerAddress');
      
      console.log('Buyer Details:', { buyerPhone, buyerName, buyerAddress });

      if (!buyerPhone || !buyerName) {
        throw new Error('Please login to place an order');
      }

      if (quantity > product.quantity) {
        throw new Error('Order quantity exceeds available stock');
      }

      // Create order data
      const orderData = {
        buyerName,
        buyerPhone,
        deliveryAddress: deliveryAddress || buyerAddress, // Use provided address or buyer's default address
        products: [{
          name: product.name,
          price: product.price,
          quantity: quantity,
          productId: product.id
        }],
        farmerPhone: farmer.phone,
        farmerName: farmer.name,
        status: 'pending',
        timestamp: Date.now(),
        totalAmount: product.price * quantity
      };

      console.log('Order Data:', orderData);

      // Generate a unique order ID
      const orderId = push(ref(db, 'orders')).key;

      // Add order to farmer's orders
      const farmerOrdersRef = ref(db, `farmers/${farmer.phone}/orders/${orderId}`);
      await set(farmerOrdersRef, {
        ...orderData,
        orderId,
        status: 'pending',
        farmerAction: 'pending' // For farmer to accept/reject
      });

      // Add order to buyer's orders
      const buyerOrdersRef = ref(db, `buyers/${buyerPhone}/orders/${orderId}`);
      await set(buyerOrdersRef, {
        ...orderData,
        orderId,
        status: 'pending',
        farmerAction: 'pending'
      });

      // Update product quantity
      const productRef = ref(db, `farmers/${farmer.phone}/products/${product.id}`);
      await update(productRef, {
        quantity: product.quantity - quantity
      });

      setSuccess(true);
      setQuantity(1);
      setDeliveryAddress('');
    } catch (error) {
      console.error('Order Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Place Order</h3>
      
      {success ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          Order placed successfully!
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Quantity (kg)</label>
            <input
              type="number"
              min="1"
              max={product.quantity}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Available: {product.quantity} kg
            </p>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Delivery Address</label>
            <textarea
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              rows="3"
              placeholder="Enter delivery address or leave empty to use your default address"
            />
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-600">Price per kg</p>
              <p className="text-gray-800">₹{product.price}</p>
            </div>
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-600">Total Amount</p>
              <p className="text-lg font-semibold text-gray-800">
                ₹{product.price * quantity}
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </form>
      )}
    </div>
  );
}

export default PlaceOrder; 