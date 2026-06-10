'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  getPharmacies,
  getProducts,
  createPharmacy,
  updatePharmacy,
  deletePharmacy,
  linkProductsToPharmacy,
} from '@/lib/api';
import { isAdminAuthenticated, getAdminToken } from '@/lib/auth';
import { FiEdit2, FiTrash2, FiPlus, FiLink, FiX } from 'react-icons/fi';

interface Pharmacy {
  id: number;
  name: string;
  address: string;
  phone: string;
  whatsapp: string;
  products: any[];
}

interface Product {
  id: number;
  name: string;
}

export default function AdminPharmaciesPage() {
  const router = useRouter();
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showProductLink, setShowProductLink] = useState<number | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    whatsapp: '',
  });

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      router.push('/admin');
    } else {
      fetchData();
    }
  }, [router]);

  const fetchData = async () => {
    try {
      const [pharmaciesRes, productsRes] = await Promise.all([
        getPharmacies(0, 100),
        getProducts(0, 100),
      ]);
      setPharmacies(pharmaciesRes.data);
      setProducts(productsRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const password = getAdminToken();
    if (!password) return;

    try {
      if (editingId) {
        await updatePharmacy(editingId, formData, password);
      } else {
        await createPharmacy(formData, password);
      }
      fetchData();
      resetForm();
    } catch (error) {
      console.error('Failed to save pharmacy:', error);
    }
  };

  const handleDelete = async (id: number) => {
    const password = getAdminToken();
    if (!password || !confirm('Are you sure? This cannot be undone.')) return;

    try {
      await deletePharmacy(id, password);
      fetchData();
    } catch (error) {
      console.error('Failed to delete pharmacy:', error);
    }
  };

  const handleLinkProducts = async (pharmacyId: number) => {
    const password = getAdminToken();
    if (!password || selectedProducts.length === 0) return;

    try {
      await linkProductsToPharmacy(pharmacyId, selectedProducts, password);
      setSelectedProducts([]);
      setShowProductLink(null);
      fetchData();
    } catch (error) {
      console.error('Failed to link products:', error);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', address: '', phone: '', whatsapp: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (pharmacy: Pharmacy) => {
    setFormData({
      name: pharmacy.name,
      address: pharmacy.address,
      phone: pharmacy.phone,
      whatsapp: pharmacy.whatsapp,
    });
    setEditingId(pharmacy.id);
    setShowForm(true);
  };

  if (loading) {
    return <div className="p-8 text-lg text-gray-600">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-5xl font-bold text-gray-900">Manage Pharmacies</h1>
            <p className="text-gray-600 mt-2">Add, edit, and manage pharmacy locations</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center gap-3 bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 font-bold rounded-xl hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <FiPlus className="text-2xl" />
            Add Pharmacy
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white p-10 mb-10 rounded-2xl shadow-lg border-l-4 border-green-600">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                {editingId ? 'Edit Pharmacy' : 'Add New Pharmacy'}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <FiX className="text-2xl text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="text"
                placeholder="Pharmacy name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-6 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 shadow-sm text-gray-900 bg-white font-medium"
                required
              />
              <input
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-6 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 shadow-sm text-gray-900 bg-white font-medium"
                required
              />
              <input
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-6 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 shadow-sm text-gray-900 bg-white font-medium"
              />
              <input
                type="tel"
                placeholder="WhatsApp"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full px-6 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 shadow-sm text-gray-900 bg-white font-medium"
              />
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 font-bold rounded-xl hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {editingId ? 'Update Pharmacy' : 'Create Pharmacy'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-8 py-3 font-bold rounded-xl hover:bg-gray-300 transition-all duration-200"
                >
                  <FiX className="text-lg" />
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Product Link Modal */}
        {showProductLink && (
          <div className="bg-white p-10 mb-10 rounded-2xl shadow-lg border-l-4 border-purple-600">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Link Products to Pharmacy</h2>
              <button
                onClick={() => {
                  setShowProductLink(null);
                  setSelectedProducts([]);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <FiX className="text-2xl text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            <div className="mb-8 max-h-96 overflow-y-auto bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
              {products.map((product) => (
                <label key={product.id} className="flex items-center mb-4 cursor-pointer hover:bg-white p-3 rounded-lg transition">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedProducts([...selectedProducts, product.id]);
                      } else {
                        setSelectedProducts(selectedProducts.filter((id) => id !== product.id));
                      }
                    }}
                    className="w-5 h-5 rounded border-gray-300 mr-4 cursor-pointer"
                  />
                  <span className="text-lg font-semibold text-gray-800">{product.name}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => handleLinkProducts(showProductLink)}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-3 font-bold rounded-xl hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <FiLink className="text-lg" />
                Link {selectedProducts.length} Product{selectedProducts.length !== 1 ? 's' : ''}
              </button>
              <button
                onClick={() => {
                  setShowProductLink(null);
                  setSelectedProducts([]);
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-8 py-3 font-bold rounded-xl hover:bg-gray-300 transition-all duration-200"
              >
                <FiX className="text-lg" />
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Pharmacies List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-green-700 to-green-800 text-white">
                <tr>
                  <th className="px-8 py-4 text-left font-bold">Name</th>
                  <th className="px-8 py-4 text-left font-bold">Address</th>
                  <th className="px-8 py-4 text-left font-bold">Phone</th>
                  <th className="px-8 py-4 text-center font-bold">Products</th>
                  <th className="px-8 py-4 text-center font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pharmacies.map((pharmacy) => (
                  <tr key={pharmacy.id} className="hover:bg-green-50 transition">
                    <td className="px-8 py-4 text-gray-900 font-semibold">{pharmacy.name}</td>
                    <td className="px-8 py-4 text-gray-600 text-sm">{pharmacy.address}</td>
                    <td className="px-8 py-4 text-gray-600 text-sm">{pharmacy.phone || '-'}</td>
                    <td className="px-8 py-4 text-gray-600 font-semibold text-center">{pharmacy.products?.length || 0}</td>
                    <td className="px-8 py-4 flex gap-2 justify-center">
                      <button
                        onClick={() => handleEdit(pharmacy)}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-4 py-2 rounded-lg font-bold transition"
                      >
                        <FiEdit2 className="text-lg" />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setShowProductLink(pharmacy.id);
                          setSelectedProducts([]);
                        }}
                        className="flex items-center gap-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 px-4 py-2 rounded-lg font-bold transition"
                      >
                        <FiLink className="text-lg" />
                        Link
                      </button>
                      <button
                        onClick={() => handleDelete(pharmacy.id)}
                        className="flex items-center gap-2 text-red-600 hover:text-red-800 hover:bg-red-50 px-4 py-2 rounded-lg font-bold transition"
                      >
                        <FiTrash2 className="text-lg" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
