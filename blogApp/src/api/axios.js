// src/api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://blog-app-q7fj.onrender.com/api',
});

// Her istekten önce token ekle
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
