'use client';

import { useEffect, useState } from 'react';
import { getProduct } from '@/lib/api';
import { useParams } from 'next/navigation';
import Head from 'next/head';
import { ProductSchema } from '@/lib/schemas';

interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  images: string[];
}

interface Pharmacy {
  id: number;
  name: string;
  phone: string;
  whatsapp: string;
  address: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const productId = Number(params.id);
  const [product, setProduct] = useState<Product | null>(null);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await getProduct(productId);
      setProduct(response.data);
      setPharmacies(response.data.pharmacies || []);
    } catch (error) {
      console.error('Failed to fetch product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20">
        <p className="text-center text-gray-500">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20">
        <p className="text-center text-gray-500">Product not found.</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{product.name} - Depo Farmaceutike</title>
        <meta name="description" content={product.description} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(ProductSchema(product, 'http://localhost:3000')),
          }}
        />
      </Head>
      <main className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Product Image */}
            <div>
              {product.images && product.images[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-lg shadow-lg"
                />
              ) : (
                <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                  No image available
                </div>
              )}
            </div>

            {/* Product Details */}
            <div>
              <h1 className="text-5xl font-bold mb-4 text-gray-900">{product.name}</h1>
              {product.category && (
                <p className="text-lg text-blue-600 font-semibold mb-6">{product.category}</p>
              )}
              <p className="text-gray-700 mb-12 leading-relaxed text-lg">{product.description}</p>

              {/* Pharmacies Carrying This Product */}
              <section>
                <h2 className="text-3xl font-bold mb-8 text-gray-900">Available at Pharmacies</h2>
                {pharmacies.length === 0 ? (
                  <p className="text-gray-600 bg-yellow-50 p-4 rounded-lg">No pharmacies currently carry this product.</p>
                ) : (
                  <div className="space-y-6">
                    {pharmacies.map((pharmacy) => (
                      <div key={pharmacy.id} className="bg-white border-l-4 border-blue-500 p-6 rounded-lg shadow-md hover:shadow-lg transition">
                        <h3 className="text-2xl font-bold mb-3 text-gray-900">{pharmacy.name}</h3>
                        <p className="text-gray-600 mb-5">{pharmacy.address}</p>
                        <div className="flex gap-4 flex-wrap">
                          {pharmacy.phone && (
                            <a
                              href={`tel:${pharmacy.phone}`}
                              className="bg-blue-600 text-white px-8 py-3 font-bold rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg"
                            >
                              📞 Call: {pharmacy.phone}
                            </a>
                          )}
                          {pharmacy.whatsapp && (
                            <a
                              href={`https://wa.me/${pharmacy.whatsapp.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-green-500 text-white px-8 py-3 font-bold rounded-lg hover:bg-green-600 shadow-md hover:shadow-lg"
                            >
                              💬 WhatsApp
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
