import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { ref, onValue } from 'firebase/database';

function FarmProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const phoneNumber = localStorage.getItem('farmerPhone');
    if (!phoneNumber) {
      setError('No farmer phone number found in localStorage');
      setLoading(false);
      return;
    }

    const productsRef = ref(db, `farmers/${phoneNumber}/products`);
    
    onValue(productsRef, (snapshot) => {
      try {
        const data = snapshot.val();
        
        if (!data) {
          setProducts([]);
          setLoading(false);
          return;
        }

        const productsList = Object.entries(data).map(([id, product]) => {
          let imageUrl = null;
          if (product.image) {
            try {
              if (typeof product.image === 'string' && product.image.startsWith('data:image')) {
                imageUrl = product.image;
              } else {
                imageUrl = `data:image/jpeg;base64,${product.image}`;
              }
            } catch (error) {
              console.error('Error processing image:', error);
              setError(`Error processing image for product ${id}: ${error.message}`);
            }
          }

          return {
            id,
            ...product,
            imageUrl,
            totalCost: (parseFloat(product.price || 0) * parseFloat(product.quantity || 0)).toFixed(2)
          };
        });

        setProducts(productsList);
      } catch (error) {
        console.error('Error processing products:', error);
        setError(`Error processing products: ${error.message}`);
      }
      setLoading(false);
    }, (error) => {
      console.error('Firebase error:', error);
      setError(`Firebase error: ${error.message}`);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-800 mb-4">Error</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Products</h2>
        
        {products.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No products added yet.</p>
            <a 
              href="/farmer/upload" 
              className="inline-block bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Add Your First Product
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <div key={product.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-64 bg-gray-100">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/300?text=No+Image';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                  <p className="text-gray-600 mt-2">{product.description}</p>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-medium">₹{product.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quantity:</span>
                      <span className="font-medium">{product.quantity} kg</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-gray-800 font-semibold">Total Cost:</span>
                      <span className="text-green-600 font-bold">₹{product.totalCost}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FarmProducts; 