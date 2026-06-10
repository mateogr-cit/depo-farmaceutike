'use client';

import { useEffect, useState } from 'react';
import { getProducts } from '@/lib/api';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  images: string[];
}

export default function ProductsContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (searchTerm = '', selectedCategory = '') => {
    try {
      const response = await getProducts(0, 100, selectedCategory || undefined, searchTerm || undefined);
      setProducts(response.data);
      
      const uniqueCategories = Array.from(
        new Set(response.data.map((p: Product) => p.category).filter(Boolean))
      );
      setCategories(uniqueCategories as string[]);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    fetchProducts(value, category);
  };

  const handleCategoryFilter = (value: string) => {
    setCategory(value);
    fetchProducts(search, value);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20">
        <p className="text-center text-gray-500">Loading products...</p>
      </div>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4 text-gray-900">Product Catalog</h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Browse our complete selection of pharmaceutical products available for distribution.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-12 flex gap-4 flex-col md:flex-row">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
          <select
            value={category}
            onChange={(e) => handleCategoryFilter(e.target.value)}
            className="px-6 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-white"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <p className="text-center text-gray-500 py-20">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="bg-white rounded-lg overflow-hidden hover:shadow-xl transition shadow-md"
              >
                {product.images && product.images[0] ? (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition"
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{product.name}</h3>
                  {product.category && (
                    <p className="text-sm text-blue-600 font-semibold mb-3">{product.category}</p>
                  )}
                  <p className="text-gray-700 line-clamp-3">{product.description}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
