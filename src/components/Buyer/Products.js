import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { ref, get } from 'firebase/database';
import PlaceOrder from './PlaceOrder';

function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const farmersRef = ref(db, 'farmers');
        const farmersSnapshot = await get(farmersRef);
        
        if (farmersSnapshot.exists()) {
          const farmersData = farmersSnapshot.val();
          const allProducts = [];
          
          Object.entries(farmersData).forEach(([phone, farmer]) => {
            if (farmer.products) {
              Object.entries(farmer.products).forEach(([id, product]) => {
                allProducts.push({
                  id,
                  ...product,
                  farmer: {
                    name: farmer.farmer_details?.name || 'Unknown Farmer',
                    phone: phone,
                    address: farmer.farmer_details?.address || 'Address not available'
                  },
                  image: product.image ? `data:image/jpeg;base64,${product.image}` : null
                });
              });
            }
          });
          
          setProducts(allProducts);
          setFilteredProducts(allProducts);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Apply filters whenever filter states change
  useEffect(() => {
    let filtered = [...products];

    // Filter by search term (product name)
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by price range
    if (priceRange.min) {
      filtered = filtered.filter(product => product.price >= Number(priceRange.min));
    }
    if (priceRange.max) {
      filtered = filtered.filter(product => product.price <= Number(priceRange.max));
    }

    // Filter by location
    if (location) {
      filtered = filtered.filter(product => 
        product.farmer.address.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Filter by category
    if (category) {
      filtered = filtered.filter(product => 
        product.category?.toLowerCase() === category.toLowerCase()
      );
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, priceRange, location, category]);

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
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Products</h2>
      
      {selectedProduct ? (
        <div className="space-y-6">
          <button
            onClick={() => setSelectedProduct(null)}
            className="text-green-600 hover:text-green-700 mb-4"
          >
            ← Back to Products
          </button>
          <PlaceOrder 
            product={selectedProduct} 
            farmer={selectedProduct.farmer} 
          />
        </div>
      ) : (
        <>
          {/* Filters Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search by product name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search Products
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Product name..."
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Price range filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price Range (₹)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                    placeholder="Min"
                    className="w-1/2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                    placeholder="Max"
                    className="w-1/2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Location filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Farmer Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter location..."
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Category filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">All Categories</option>
                  <option value="vegetables">Vegetables</option>
                  <option value="fruits">Fruits</option>
                  <option value="grains">Grains</option>
                  <option value="dairy">Dairy</option>
                  <option value="meat">Meat</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 overflow-hidden bg-gray-100">
                  {product.image ? (
                    <img 
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image Available
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-gray-700">
                      <span className="font-medium">Price:</span> ₹{product.price} per kg
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Available:</span> {product.quantity} kg
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Farmer:</span> {product.farmer.name}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Location:</span> {product.farmer.address}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Place Order
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">No products found matching your filters</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Products; 