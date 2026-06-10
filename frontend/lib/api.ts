import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Products
export const getProducts = (skip = 0, limit = 100, category?: string, search?: string) => {
  const params = new URLSearchParams({ skip: String(skip), limit: String(limit) });
  if (category) params.append('category', category);
  if (search) params.append('search', search);
  return apiClient.get('/products', { params });
};

export const getProduct = (id: number) => apiClient.get(`/products/${id}`);

export const createProduct = (data: any, password: string) => 
  apiClient.post('/products', data, { params: { password } });

export const updateProduct = (id: number, data: any, password: string) =>
  apiClient.put(`/products/${id}`, data, { params: { password } });

export const deleteProduct = (id: number, password: string) =>
  apiClient.delete(`/products/${id}`, { params: { password } });

export const uploadProductImage = (productId: number, file: File, password: string) => {
  const formData = new FormData();
  formData.append('file', file);
  
  // Create a separate axios instance for multipart/form-data
  const multipartClient = axios.create({
    baseURL: API_URL,
  });
  
  return multipartClient.post(`/products/${productId}/image`, formData, {
    params: { password },
  });
};

// Pharmacies
export const getPharmacies = (skip = 0, limit = 100, search?: string) => {
  const params = new URLSearchParams({ skip: String(skip), limit: String(limit) });
  if (search) params.append('search', search);
  return apiClient.get('/pharmacies', { params });
};

export const getPharmacy = (id: number) => apiClient.get(`/pharmacies/${id}`);

export const createPharmacy = (data: any, password: string) =>
  apiClient.post('/pharmacies', data, { params: { password } });

export const updatePharmacy = (id: number, data: any, password: string) =>
  apiClient.put(`/pharmacies/${id}`, data, { params: { password } });

export const deletePharmacy = (id: number, password: string) =>
  apiClient.delete(`/pharmacies/${id}`, { params: { password } });

export const linkProductsToPharmacy = (pharmacyId: number, productIds: number[], password: string) =>
  apiClient.post(`/pharmacies/${pharmacyId}/products`, { product_ids: productIds }, { params: { password } });

export const unlinkProductFromPharmacy = (pharmacyId: number, productId: number, password: string) =>
  apiClient.delete(`/pharmacies/${pharmacyId}/products/${productId}`, { params: { password } });

// Admin
export const verifyAdminPassword = (password: string) =>
  apiClient.post('/admin/verify', { password });
