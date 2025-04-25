import apiClient from './apiClient.js';

export const fetchTextureByName = async (textureName) => {
  const { data } = await apiClient.get(`/textures/${textureName}`);
  console.log('Texture data:', data);
  return data;
};