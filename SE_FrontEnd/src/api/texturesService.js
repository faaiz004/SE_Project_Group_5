import apiClient from './apiClient.js';

export const fetchTextureByName = async (textureName) => {
  const { data } = await apiClient.get(`/textures/${textureName}`);
  return data;
};