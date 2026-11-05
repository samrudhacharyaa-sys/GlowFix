import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('glowfix_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred.';
    return Promise.reject(new Error(message));
  }
);

// Auth endpoints
export const authService = {
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },
  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
  updateProfile: async (profileData) => {
    const res = await api.put('/auth/profile', profileData);
    return res.data;
  },
  changePassword: async (passwordData) => {
    const res = await api.put('/auth/password', passwordData);
    return res.data;
  }
};

// Complaint endpoints
export const complaintService = {
  submitComplaint: async (formData) => {
    // When sending FormData with images, let browser set multipart/form-data boundary
    const res = await api.post('/complaints', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data;
  },
  getMyComplaints: async () => {
    const res = await api.get('/complaints/my');
    return res.data;
  },
  trackComplaint: async (complaintId) => {
    const res = await api.get(`/complaints/track/${encodeURIComponent(complaintId)}`);
    return res.data;
  },
  getComplaintById: async (id) => {
    const res = await api.get(`/complaints/${id}`);
    return res.data;
  }
};

// Admin endpoints
export const adminService = {
  getComplaints: async (params = {}) => {
    const res = await api.get('/admin/complaints', { params });
    return res.data;
  },
  updateComplaintStatus: async (id, data) => {
    const res = await api.put(`/admin/complaints/${id}/status`, data);
    return res.data;
  },
  getUsers: async () => {
    const res = await api.get('/admin/users');
    return res.data;
  },
  getStats: async () => {
    const res = await api.get('/admin/stats');
    return res.data;
  }
};

// Helper for image URLs
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  return imagePath; // Vite proxies /uploads to backend
};

export default api;
