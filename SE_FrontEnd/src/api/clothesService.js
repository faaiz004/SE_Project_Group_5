// src/api/clothesService.js
// this file contains functions to interact with the clothing-related API endpoints.
import apiClient from './apiClient.js';
import axios from 'axios';

// export const purchaseClothes = async clothesId => {
//   const email = localStorage.getItem('email');
//   if (!email) throw new Error('Missing email in localStorage');

//   const { data } = await apiClient.post('/clothes/purchase', { email, clothesId });
//   return data;
// };
export const purchaseClothes = async (cartItems) => {
  const token = localStorage.getItem('jwt');

  const res = await apiClient.post(
    '/checkout',
    { cartItems },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
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


export const getUserPreferences = async () => {
  const token = localStorage.getItem('jwt');
  if (!token) throw new Error('No authentication token found');

  // GET /api/auth/fetch-references
  const { data } = await apiClient.get('/auth/fetch-preferences', {
    headers: { Authorization: `Bearer ${token}` }
  });

  return data;
};

export const updateUserPreferences = async prefs => {
  const token = localStorage.getItem('jwt');
  if (!token) throw new Error('No authentication token found');

  const { data } = await apiClient.put('/auth/update-preferences', prefs, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
};

export const sampleClothes = async ({ count = 3, categories = [], gender, upper }) => {
  if (!categories.length) throw new Error('At least one category is required');
  if (!gender) throw new Error('Gender is required');

  const { data } = await apiClient.get('/clothes/sample', {
    params: {
      count,
      categories: categories.join(','), 
      gender,
      upper
    }
  });

  return data;  
};




