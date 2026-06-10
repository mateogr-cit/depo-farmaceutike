'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getProducts, createProduct, updateProduct, deleteProduct, uploadProductImage } from '@/lib/api';
import { isAdminAuthenticated, getAdminToken } from '@/lib/auth';
import { FiEdit2, FiTrash2, FiPlus, FiUpload, FiX } from 'react-icons/fi';

interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  images: string[];
}

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
  });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      router.push('/admin');
    } else {
      fetchProducts();
    }
  }, [router]);

  const fetchProducts = async () => {
    try {
      const response = await getProducts(0, 100);
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
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
        await updateProduct(editingId, formData, password);
      } else {
        await createProduct({ ...formData, images: [] }, password);
      }
      fetchProducts();
      resetForm();
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  const handleDelete = async (id: number) => {
    const password = getAdminToken();
    if (!password || !confirm('Are you sure? This cannot be undone.')) return;

    try {
      await deleteProduct(id, password);
      fetchProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const handleImageUpload = async (productId: number, file: File) => {
    const password = getAdminToken();
    if (!password) return;

    setUploading(true);
    setUploadError('');
    try {
      await uploadProductImage(productId, file, password);
      fetchProducts();
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Failed to upload image:', error);
      setUploadError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', category: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
    });
    setEditingId(product.id);
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
            <h1 className="text-5xl font-bold text-gray-900">Manage Products</h1>
            <p className="text-gray-600 mt-2">Create, update, and manage pharmaceutical products</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <FiPlus className="text-2xl" />
            Add Product
          </button>
        </div>

        {uploadError && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8 font-semibold">
            {uploadError}
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="bg-white p-10 mb-10 rounded-2xl shadow-lg border-l-4 border-blue-600">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                {editingId ? 'Edit Product' : 'Add New Product'}
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
                placeholder="Product name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-6 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 shadow-sm text-gray-900 bg-white font-medium"
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-6 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 shadow-sm h-32 text-gray-900 bg-white font-medium"
              />
              <input
                type="text"
                placeholder="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-6 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 shadow-sm text-gray-900 bg-white font-medium"
              />
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {editingId ? 'Update Product' : 'Create Product'}
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

        {/* Products List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-700 to-blue-800 text-white">
                <tr>
                  <th className="px-8 py-4 text-left font-bold">Name</th>
                  <th className="px-8 py-4 text-left font-bold">Category</th>
                  <th className="px-8 py-4 text-left font-bold">Images</th>
                  <th className="px-8 py-4 text-center font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-blue-50 transition">
                    <td className="px-8 py-4 text-gray-900 font-semibold">{product.name}</td>
                    <td className="px-8 py-4 text-gray-600">{product.category || '-'}</td>
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-4">
                        <span className="text-gray-600 font-semibold">{product.images?.length || 0}</span>
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                handleImageUpload(product.id, e.target.files[0]);
                              }
                            }}
                            disabled={uploading}
                            className="hidden"
                          />
                          <span className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition ${
                            uploading
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              : 'bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer'
                          }`}>
                            <FiUpload className="text-lg" />
                            {uploading ? 'Uploading...' : 'Upload'}
                          </span>
                        </label>
                      </div>
                    </td>
                    <td className="px-8 py-4 flex gap-3 justify-center">
                      <button
                        onClick={() => handleEdit(product)}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-4 py-2 rounded-lg font-bold transition"
                      >
                        <FiEdit2 className="text-lg" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
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
