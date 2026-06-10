import { Metadata } from 'next';
import Head from 'next/head';
import { OrganizationSchema } from '@/lib/schemas';
import PharmaciesContent from './PharmaciesContent';

export const metadata: Metadata = {
  title: 'Pharmacy Directory - Depo Farmaceutike',
  description: 'Find pharmacies across Albania that are part of our pharmaceutical distribution network.',
  keywords: 'pharmacies, Albania, directory, pharmacy finder',
};

export default function PharmaciesPage() {
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
      <PharmaciesContent />
    </>
  );
}
