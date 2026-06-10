'use client';

import { useEffect, useState } from 'react';
import { getPharmacies } from '@/lib/api';
import Link from 'next/link';

interface Pharmacy {
  id: number;
  name: string;
  address: string;
  phone: string;
  whatsapp: string;
}

export default function PharmaciesContent() {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchPharmacies();
  }, []);

  const fetchPharmacies = async (searchTerm = '') => {
    try {
      const response = await getPharmacies(0, 100, searchTerm || undefined);
      setPharmacies(response.data);
    } catch (error) {
      console.error('Failed to fetch pharmacies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    fetchPharmacies(value);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20">
        <p className="text-center text-gray-500">Loading pharmacies...</p>
      </div>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4 text-gray-900">Pharmacy Directory</h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Find pharmacies across Albania that are part of our distribution network.
          </p>
        </div>

        {/* Search */}
        <div className="mb-12">
          <input
            type="text"
            placeholder="Search pharmacies by name or location..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-6 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-lg"
          />
        </div>

        {/* Pharmacies List */}
        {pharmacies.length === 0 ? (
          <p className="text-center text-gray-500 py-20 text-lg">No pharmacies found.</p>
        ) : (
          <div className="space-y-6">
            {pharmacies.map((pharmacy) => (
              <Link
                key={pharmacy.id}
                href={`/pharmacies/${pharmacy.id}`}
                className="bg-white p-8 rounded-lg hover:shadow-lg transition shadow-md block border-l-4 border-blue-500"
              >
                <h3 className="text-3xl font-bold mb-4 text-gray-900 hover:text-blue-600">{pharmacy.name}</h3>
                <p className="text-gray-700 mb-5 text-lg">{pharmacy.address}</p>
                <div className="flex gap-4 items-center">
                  {pharmacy.phone && (
                    <a
                      href={`tel:${pharmacy.phone}`}
                      onClick={(e) => e.preventDefault()}
                      className="text-blue-600 font-bold hover:underline text-lg"
                    >
                      📞 {pharmacy.phone}
                    </a>
                  )}
                  <span className="text-gray-400">→</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
