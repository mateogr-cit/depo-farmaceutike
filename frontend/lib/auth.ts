export const isAdminAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('admin_token');
};

export const setAdminToken = (password: string) => {
  localStorage.setItem('admin_token', password);
};

export const getAdminToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin_token');
};

export const clearAdminToken = () => {
  localStorage.removeItem('admin_token');
};

export const formatPhoneNumber = (phone: string) => {
  return phone?.replace(/(\+\d{3})(\d+)/, '$1 $2') || '';
};
