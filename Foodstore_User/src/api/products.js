import { api } from './client';
export const listProducts = () => api('/products');
export const getProduct = (id) => api(`/products/${id}`);
