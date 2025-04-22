import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { ref, get, update } from 'firebase/database';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const phoneNumber = localStorage.getItem('farmerPhone');
      if (!phoneNumber) return;

      try {
        const ordersRef = ref(db, `farmers/${phoneNumber}/orders`);
        const ordersSnapshot = await get(ordersRef);
        
        if (ordersSnapshot.exists()) {
          const ordersData = ordersSnapshot.val();
          const ordersList = Object.entries(ordersData).map(([id, order]) => ({
            id,
            ...order
          }));
          // Sort orders by timestamp (newest first)
          ordersList.sort((a, b) => b.timestamp - a.timestamp);
          setOrders(ordersList);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleAcceptOrder = async (orderId) => {
    try {
      const phoneNumber = localStorage.getItem('farmerPhone');
      const orderRef = ref(db, `farmers/${phoneNumber}/orders/${orderId}`);
      
      await update(orderRef, {
        status: 'accepted',
        acceptedAt: Date.now()
      });

      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: 'accepted', acceptedAt: Date.now() }
          : order
      ));
    } catch (error) {
      console.error('Error accepting order:', error);
    }
  };

  const handleRejectOrder = async (orderId) => {
    try {
      const phoneNumber = localStorage.getItem('farmerPhone');
      const orderRef = ref(db, `farmers/${phoneNumber}/orders/${orderId}`);
      
      await update(orderRef, {
        status: 'rejected',
        rejectedAt: Date.now()
      });

      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: 'rejected', rejectedAt: Date.now() }
          : order
      ));
    } catch (error) {
      console.error('Error rejecting order:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Orders</h2>
      
      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Order #{order.id}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(order.timestamp).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Buyer: {order.buyerName} ({order.buyerPhone})
                  </p>
                  <p className="text-sm text-gray-600">
                    Delivery Address: {order.deliveryAddress}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'accepted' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {order.status}
                </span>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-700 mb-2">Products</h4>
                <div className="space-y-2">
                  {order.products.map((product, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <p className="text-gray-800">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.quantity} kg</p>
                      </div>
                      <p className="text-gray-800">₹{product.price * product.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">Total Amount</p>
                  <p className="text-lg font-semibold text-gray-800">
                    ₹{order.products.reduce((sum, product) => sum + (product.price * product.quantity), 0)}
                  </p>
                </div>
              </div>

              {order.status === 'pending' && (
                <div className="border-t pt-4 mt-4 flex justify-end space-x-4">
                  <button
                    onClick={() => handleRejectOrder(order.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Reject Order
                  </button>
                  <button
                    onClick={() => handleAcceptOrder(order.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Accept Order
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No orders found</p>
      )}
    </div>
  );
}

export default Orders; 