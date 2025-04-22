import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { ref, get } from 'firebase/database';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Overview() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    acceptedOrders: 0,
    pendingOrders: 0,
    productTypes: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const farmerPhone = localStorage.getItem('farmerPhone');
        if (!farmerPhone) {
          setError('Please login to view dashboard');
          return;
        }

        // Fetch products
        const productsRef = ref(db, `farmers/${farmerPhone}/products`);
        const productsSnapshot = await get(productsRef);
        const products = productsSnapshot.exists() ? productsSnapshot.val() : {};

        // Fetch orders
        const ordersRef = ref(db, `farmers/${farmerPhone}/orders`);
        const ordersSnapshot = await get(ordersRef);
        const orders = ordersSnapshot.exists() ? ordersSnapshot.val() : {};

        // Calculate statistics
        const productTypes = {};
        let totalRevenue = 0;
        let acceptedOrders = 0;
        let pendingOrders = 0;

        // Process products
        Object.values(products).forEach(product => {
          const type = product.name;
          productTypes[type] = (productTypes[type] || 0) + 1;
        });

        // Process orders
        Object.values(orders).forEach(order => {
          if (order.status === 'accepted') {
            totalRevenue += order.totalAmount;
            acceptedOrders++;
          } else if (order.status === 'pending') {
            pendingOrders++;
          }
        });

        setStats({
          totalProducts: Object.keys(products).length,
          totalOrders: Object.keys(orders).length,
          totalRevenue,
          acceptedOrders,
          pendingOrders,
          productTypes
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to fetch statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const revenueChartData = {
    labels: ['Total Revenue'],
    datasets: [
      {
        label: 'Revenue (₹)',
        data: [stats.totalRevenue],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      }
    ]
  };

  const productChartData = {
    labels: Object.keys(stats.productTypes),
    datasets: [
      {
        data: Object.values(stats.productTypes),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      }
    ]
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 text-sm font-medium">Total Products</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 text-sm font-medium">Total Orders</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 text-sm font-medium">Total Revenue</h3>
          <p className="text-3xl font-bold text-green-600">₹{stats.totalRevenue}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 text-sm font-medium">Accepted Orders</h3>
          <p className="text-3xl font-bold text-green-600">{stats.acceptedOrders}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
          <div className="h-64">
            <Line data={revenueChartData} options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Product Distribution</h3>
          <div className="h-64">
            <Pie data={productChartData} options={{
              responsive: true,
              maintainAspectRatio: false
            }} />
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Order Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h4 className="text-gray-600 font-medium mb-2">Pending Orders</h4>
            <p className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h4 className="text-gray-600 font-medium mb-2">Accepted Orders</h4>
            <p className="text-2xl font-bold text-green-600">{stats.acceptedOrders}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Overview; 