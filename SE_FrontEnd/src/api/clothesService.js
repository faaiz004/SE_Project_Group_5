// src/api/clothesService.js
import apiClient from './apiClient.js';

export const purchaseClothes = async clothesId => {
  const email = localStorage.getItem('email');
  if (!email) throw new Error('Missing email in localStorage');

  const { data } = await apiClient.post('/clothes/purchase', { email, clothesId });
  return data;
};

export const getPurchases = async () => {
  const email = localStorage.getItem('email');
  if (!email) throw new Error('Missing email in localStorage');

  const { data } = await apiClient.post('/clothes/purchased', { email });
  return data;
};

export const saveClothes = async id => {
  const { data } = await apiClient.post(`/clothes/saveClothes/${id}`);
  return data;
};

export const unsaveClothes = async id => {
  const { data } = await apiClient.delete(`/clothes/unsaveClothes/${id}`);
  return data;
};

export const getSavedClothes = async () => {
  const { data } = await apiClient.get('/clothes/savedClothes');
  return data.clothes;
};

export const fetchOutfits = async () => {
  const { data } = await apiClient.get('/clothes/getClothes');
  return data;
};
