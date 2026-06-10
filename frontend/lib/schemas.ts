export const ProductSchema = (product: any, baseUrl: string) => {
  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    category: product.category,
    image: product.images?.length > 0 ? `${baseUrl}${product.images[0]}` : undefined,
  };
};

export const LocalBusinessSchema = (pharmacy: any) => {
  return {
    '@context': 'https://schema.org/',
    '@type': 'LocalBusiness',
    name: pharmacy.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: pharmacy.address,
      addressCountry: 'AL',
    },
    telephone: pharmacy.phone,
  };
};

export const OrganizationSchema = (baseUrl: string) => {
  return {
    '@context': 'https://schema.org/',
    '@type': 'Organization',
    name: 'Depo Farmaceutike',
    url: baseUrl,
    description: 'Professional pharmaceutical supplier serving pharmacies in Albania',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'AL',
      addressLocality: 'Tirana',
    },
  };
};
