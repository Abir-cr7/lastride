import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('rider_rescue_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for unified error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const customMessage =
      error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(customMessage));
  }
);

// Auth Services
export const authService = {
  register: (data) => api.post('/auth/register', data),
  verifyOtp: (data) => api.post('/auth/verify-otp', data),
  resendOtp: (data) => api.post('/auth/resend-otp', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Public Services
export const publicService = {
  getFuels: () => api.get('/fuels'),
  getServiceCenters: () => api.get('/service-centers'),
  getAlerts: () => api.get('/alerts'),
};

// Rider / Request Services
export const requestService = {
  createRequest: (data) => api.post('/requests', data),
  getMyRequests: () => api.get('/requests/my-requests'),
  getRequestById: (id) => api.get(`/requests/${id}`),
  rateAndReview: (id, data) => api.put(`/requests/${id}/review`, data),
};

// Admin Services
export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getFuels: () => api.get('/admin/fuels'),
  addFuel: (data) => api.post('/admin/fuels', data),
  updateFuel: (id, data) => api.put(`/admin/fuels/${id}`, data),
  deleteFuel: (id) => api.delete(`/admin/fuels/${id}`),
  getRequests: (params) => api.get('/admin/requests', { params }),
  acceptRequest: (id) => api.put(`/admin/requests/${id}/accept`),
  updateRequestStatus: (id, status) => api.put(`/admin/requests/${id}/status`, { status }),
  getUsers: () => api.get('/admin/users'),
  toggleRestrictUser: (id, isRestricted) => api.put(`/admin/users/${id}/restrict`, { isRestricted }),
  getServiceCenters: () => api.get('/admin/service-centers'),
  addServiceCenter: (data) => api.post('/admin/service-centers', data),
  deleteServiceCenter: (id) => api.delete(`/admin/service-centers/${id}`),
  getAlerts: () => api.get('/admin/alerts'),
  createAlert: (data) => api.post('/admin/alerts', data),
  deleteAlert: (id) => api.delete(`/admin/alerts/${id}`),
};

export default api;
