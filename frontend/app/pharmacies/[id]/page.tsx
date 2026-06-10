'use client';

import { useEffect, useState } from 'react';
import { getPharmacy } from '@/lib/api';
import { useParams } from 'next/navigation';
import Head from 'next/head';
import { LocalBusinessSchema } from '@/lib/schemas';

interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
}

interface Pharmacy {
  id: number;
  name: string;
  address: string;
  phone: string;
  whatsapp: string;
  products: Product[];
}

export default function PharmacyDetailPage() {
  const params = useParams();
  const pharmacyId = Number(params.id);
  const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pharmacyId) {
      fetchPharmacy();
    }
  }, [pharmacyId]);

  const fetchPharmacy = async () => {
    try {
      const response = await getPharmacy(pharmacyId);
      setPharmacy(response.data);
    } catch (error) {
      console.error('Failed to fetch pharmacy:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20">
        <p className="text-center text-gray-500">Loading pharmacy...</p>
      </div>
    );
  }

  if (!pharmacy) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20">
        <p className="text-center text-gray-500">Pharmacy not found.</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{pharmacy.name} - Depo Farmaceutike</title>
        <meta name="description" content={`${pharmacy.name} - ${pharmacy.address}`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(LocalBusinessSchema(pharmacy)),
          }}
        />
      </Head>
      <main className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Pharmacy Header */}
          <div className="mb-12 bg-white p-10 rounded-lg shadow-lg">
            <h1 className="text-5xl font-bold mb-6 text-gray-900">{pharmacy.name}</h1>
            <p className="text-xl text-gray-700 mb-10 leading-relaxed">{pharmacy.address}</p>

            {/* Contact Options */}
            <div className="flex gap-4 flex-wrap">
              {pharmacy.phone && (
                <a
                  href={`tel:${pharmacy.phone}`}
                  className="bg-blue-600 text-white px-10 py-4 font-bold rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg"
                >
                  📞 Call: {pharmacy.phone}
                </a>
              )}
              {pharmacy.whatsapp && (
                <a
                  href={`https://wa.me/${pharmacy.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 text-white px-10 py-4 font-bold rounded-lg hover:bg-green-600 shadow-md hover:shadow-lg"
                >
                  💬 WhatsApp
                </a>
              )}
            </div>
          </div>

          {/* Products Carried */}
          <section>
            <h2 className="text-4xl font-bold mb-10 text-gray-900">Products Stocked</h2>
            {pharmacy.products && pharmacy.products.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg text-gray-700">
                No products currently stocked.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {pharmacy.products.map((product) => (
                  <div key={product.id} className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition border-l-4 border-blue-500">
                    <h3 className="text-2xl font-bold mb-3 text-gray-900">{product.name}</h3>
                    {product.category && (
                      <p className="text-lg text-blue-600 font-semibold mb-4">{product.category}</p>
                    )}
                    <p className="text-gray-700 leading-relaxed">{product.description}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
