import { Metadata } from 'next';
import Head from 'next/head';
import { OrganizationSchema } from '@/lib/schemas';
import ProductsContent from './ProductsContent';

export const metadata: Metadata = {
  title: 'Product Catalog - Depo Farmaceutike',
  description: 'Browse our complete selection of pharmaceutical products available for distribution to pharmacies in Albania.',
  keywords: 'pharmaceutical products, Albania, pharmacy supplier, B2B',
};

export default function ProductsPage() {
  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(OrganizationSchema('http://localhost:3000')),
          }}
        />
      </Head>
      <ProductsContent />
    </>
  );
}
