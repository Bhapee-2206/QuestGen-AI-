import axios from 'axios';

// Use empty string for relative paths when combined hosting is used
const API_URL = import.meta.env.VITE_AI_SERVICE_URL || '';

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor to add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  register: async (email, password, fullName) => {
    const response = await api.post('/auth/register', { email, password, full_name: fullName });
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('guestMode');
  },
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  updateProfile: async (fullName, institution) => {
    const response = await api.put('/auth/profile', { full_name: fullName, institution });
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  }
};

export const papers = {
  generate: async (formData) => {
    const response = await api.post('/generate', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  save: async (paperData) => {
    const response = await api.post('/papers', paperData);
    return response.data;
  },
  list: async () => {
    const response = await api.get('/papers');
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/papers/${id}`);
    return response.data;
  }
};

export default api;
