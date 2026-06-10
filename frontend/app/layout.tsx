import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Depo Farmaceutike - B2B Pharmaceutical Supplier",
  description: "Professional pharmaceutical supplier serving pharmacies in Albania",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="bg-white text-gray-900 antialiased flex flex-col min-h-screen">
        <nav className="bg-[#0A1628] text-white border-b-4 border-blue-600 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold tracking-tight hover:opacity-80">
              Depo Farmaceutike
            </Link>
            <div className="flex gap-8">
              <Link href="/" className="hover:text-blue-300 transition font-medium">
                Home
              </Link>
              <Link href="/products" className="hover:text-blue-300 transition font-medium">
                Products
              </Link>
              <Link href="/pharmacies" className="hover:text-blue-300 transition font-medium">
                Pharmacies
              </Link>
              <Link href="/admin" className="hover:text-blue-300 transition font-medium opacity-80">
                Admin
              </Link>
            </div>
          </div>
        </nav>

        <main className="flex-1">{children}</main>

        <footer className="bg-gray-900 text-white border-t border-gray-800 mt-24">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="grid grid-cols-3 gap-12 mb-12">
              <div>
                <h3 className="font-bold text-lg mb-4 text-blue-300">Depo Farmaceutike</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Professional pharmaceutical supplier for pharmacies across Albania. Quality products, reliable service.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-4 text-blue-300">Quick Links</h4>
                <ul className="space-y-3 text-sm">
                  <li><Link href="/products" className="text-gray-300 hover:text-white transition">Products</Link></li>
                  <li><Link href="/pharmacies" className="text-gray-300 hover:text-white transition">Pharmacies</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-4 text-blue-300">Contact</h4>
                <p className="text-gray-300 text-sm">Tirana, Albania</p>
              </div>
            </div>
            <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
              <p>&copy; 2026 Depo Farmaceutike. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
