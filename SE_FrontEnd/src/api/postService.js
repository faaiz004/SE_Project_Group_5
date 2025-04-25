// src/api/postService.js
import apiClient from './apiClient.js';

export const getPosts = async () => {
  const { data } = await apiClient.get('/posts/getAll');
  return data;
};

export const createPost = async ({ image, caption, clothes }) => {
  const email = localStorage.getItem('email');
  if (!email) throw new Error('Missing email in localStorage');

  const fd = new FormData();
  fd.append('image', image);
  fd.append('caption', caption);
  fd.append('email', email);
  if (clothes?.length) fd.append('clothes', JSON.stringify(clothes));

  const { data } = await apiClient.post('/posts/create', fd, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};

export const likePost = async (postId) => {
  if (!postId) throw new Error('Post ID is required');

  const { data } = await apiClient.post(`/posts/${postId}/like`);
  return data;  
};

export const unlikePost = async (postId) => {
  if (!postId) throw new Error('Post ID is required');

  const { data } = await apiClient.post(`/posts/${postId}/unlike`);
  return data;
};