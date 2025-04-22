import React, { useState } from 'react';
import { db } from '../../firebase';
import { ref, set } from 'firebase/database';

function UploadProduct() {
  const [product, setProduct] = useState({
    name: '',
    price: '',
    quantity: '',
    image: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const phoneNumber = localStorage.getItem('farmerPhone');
    if (!phoneNumber) {
      alert('Please login first');
      return;
    }

    try {
      // Create a product key from the name (lowercase, replace spaces with hyphens)
      const productKey = product.name.toLowerCase().replace(/\s+/g, '-');
      
      // Reference to the specific product under the farmer's products
      const productRef = ref(db, `farmers/${phoneNumber}/products/${productKey}`);
      
      // Set the product details including the name
      await set(productRef, {
        name: product.name, // Include the name in the stored data
        price: product.price,
        quantity: product.quantity,
        image: product.image,
        timestamp: Date.now()
      });

      alert('Product uploaded successfully!');
      setProduct({
        name: '',
        price: '',
        quantity: '',
        image: null
      });
    } catch (error) {
      console.error('Error uploading product:', error);
      alert('Error uploading product. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload New Product</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2">Product Name</label>
            <input
              type="text"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2">Price (₹/kg)</label>
              <input
                type="number"
                value={product.price}
                onChange={(e) => setProduct({ ...product, price: e.target.value })}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Quantity (kg)</label>
              <input
                type="number"
                value={product.quantity}
                onChange={(e) => setProduct({ ...product, quantity: e.target.value })}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    // Get the base64 string without the data URL prefix
                    const base64String = event.target.result.split(',')[1];
                    setProduct({ ...product, image: base64String });
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            {product.image && (
              <div className="mt-4">
                <img 
                  src={`data:image/jpeg;base64,${product.image}`}
                  alt="Preview" 
                  className="h-32 w-32 object-cover rounded"
                />
              </div>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
          >
            Upload Product
          </button>
        </form>
      </div>
    </div>
  );
}

export default UploadProduct; 