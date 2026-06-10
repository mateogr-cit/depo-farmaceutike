'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { verifyAdminPassword, getProducts, getPharmacies } from '@/lib/api';
import { isAdminAuthenticated, setAdminToken, getAdminToken } from '@/lib/auth';
import Link from 'next/link';
import { FiPackage, FiMapPin, FiLock } from 'react-icons/fi';

interface DashboardStats {
  productCount: number;
  pharmacyCount: number;
}

interface DashboardStats {
  productCount: number;
  pharmacyCount: number;
}

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({ productCount: 0, pharmacyCount: 0 });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAdminAuthenticated()) {
      setIsAuthenticated(true);
      fetchStats();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchStats = async () => {
    try {
      const [productsRes, pharmaciesRes] = await Promise.all([
        getProducts(0, 1),
        getPharmacies(0, 1),
      ]);
      setStats({
        productCount: productsRes.data.length,
        pharmacyCount: pharmaciesRes.data.length,
      });
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await verifyAdminPassword(password);
      if (response.data.authenticated) {
        setAdminToken(password);
        setIsAuthenticated(true);
        await fetchStats();
      } else {
        setError('Invalid password');
      }
    } catch (error) {
      setError('Authentication failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center px-6">
        <div className="bg-white p-12 rounded-2xl shadow-2xl max-w-md w-full">
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl">
              <FiLock className="text-4xl text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2 text-gray-900 text-center">Admin Access</h1>
          <p className="text-gray-600 mb-8 text-center">Enter your password to access the dashboard</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-3 border-2 border-gray-200 rounded-xl mb-4 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-gray-900 bg-white text-lg font-medium"
            />
            {error && <p className="text-red-600 mb-6 text-sm font-semibold bg-red-50 p-4 rounded-xl border border-red-200">{error}</p>}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200 text-lg"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-2 text-gray-900">Dashboard</h1>
          <p className="text-lg text-gray-600">Manage your pharmaceutical depot</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-10 rounded-2xl shadow-lg border-l-4 border-blue-600">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-700 text-lg font-semibold">Total Products</h3>
              <div className="p-3 bg-blue-600 rounded-xl">
                <FiPackage className="text-2xl text-white" />
              </div>
            </div>
            <p className="text-6xl font-bold text-gray-900">{stats.productCount}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-10 rounded-2xl shadow-lg border-l-4 border-green-600">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-700 text-lg font-semibold">Total Pharmacies</h3>
              <div className="p-3 bg-green-600 rounded-xl">
                <FiMapPin className="text-2xl text-white" />
              </div>
            </div>
            <p className="text-6xl font-bold text-gray-900">{stats.pharmacyCount}</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link
            href="/admin/products"
            className="group bg-gradient-to-br from-white to-gray-50 p-10 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-l-4 border-blue-600 hover:border-blue-700"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition">Manage Products</h3>
              <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-600 transition">
                <FiPackage className="text-2xl text-blue-600 group-hover:text-white transition" />
              </div>
            </div>
            <p className="text-gray-600 text-lg group-hover:text-gray-700 transition">Add, edit, or delete pharmaceutical products from the catalog</p>
          </Link>
          <Link
            href="/admin/pharmacies"
            className="group bg-gradient-to-br from-white to-gray-50 p-10 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-l-4 border-green-600 hover:border-green-700"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-3xl font-bold text-gray-900 group-hover:text-green-600 transition">Manage Pharmacies</h3>
              <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-600 transition">
                <FiMapPin className="text-2xl text-green-600 group-hover:text-white transition" />
              </div>
            </div>
            <p className="text-gray-600 text-lg group-hover:text-gray-700 transition">Add, edit, or delete pharmacies and link products</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
