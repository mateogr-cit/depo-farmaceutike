'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#0A1628] to-[#1a2e4a] text-white py-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight tracking-tight">
            Professional Pharmaceutical Supply
          </h1>
          <p className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto leading-relaxed">
            Depo Farmaceutike is a trusted B2B supplier of pharmaceutical products to pharmacies across Albania.
          </p>
          <div className="flex gap-6 justify-center flex-wrap">
            <Link
              href="/products"
              className="bg-white text-[#0A1628] px-10 py-4 font-bold rounded-lg hover:bg-gray-100 shadow-lg hover:shadow-xl"
            >
              Browse Products
            </Link>
            <Link
              href="/pharmacies"
              className="bg-blue-500 text-white px-10 py-4 font-bold rounded-lg hover:bg-blue-600 shadow-lg hover:shadow-xl border-2 border-blue-400"
            >
              Find Pharmacies
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-16 text-center text-gray-900">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-10 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="w-14 h-14 bg-blue-500 rounded-lg mb-6"></div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Wide Selection</h3>
              <p className="text-gray-700 leading-relaxed">
                Comprehensive catalog of pharmaceutical products to meet all pharmacy needs across Albania.
              </p>
            </div>
            <div className="bg-white p-10 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="w-14 h-14 bg-blue-500 rounded-lg mb-6"></div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Reliable Supplier</h3>
              <p className="text-gray-700 leading-relaxed">
                Professional service with consistent quality and reliable delivery to all partners.
              </p>
            </div>
            <div className="bg-white p-10 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="w-14 h-14 bg-blue-500 rounded-lg mb-6"></div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Easy Access</h3>
              <p className="text-gray-700 leading-relaxed">
                Simple directory to find pharmacies and connect with suppliers in your area.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#0A1628] text-white py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to explore our catalog?</h2>
          <p className="text-lg text-gray-200 mb-10">
            Browse our complete product list or find pharmacies near you.
          </p>
          <Link
            href="/products"
            className="inline-block bg-blue-500 text-white px-12 py-4 font-bold rounded-lg hover:bg-blue-600 shadow-lg hover:shadow-xl"
          >
            Start Browsing Now
          </Link>
        </div>
      </section>
    </main>
  );
}
