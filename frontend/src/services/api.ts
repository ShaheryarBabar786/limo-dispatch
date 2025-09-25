import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials: { email: string; password: string }) => 
    api.post('/auth/login', credentials),
  register: (userData: { name: string; email: string; password: string }) => 
    api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
};

export const bookingAPI = {
  create: (bookingData: any) => api.post('/bookings', bookingData),
  getAll: (params?: { page?: number; limit?: number; status?: string; search?: string }) => 
    api.get('/bookings', { params }),
  getById: (id: string) => api.get(`/bookings/${id}`),
  updateStatus: (id: string, status: string) => 
    api.patch(`/bookings/${id}/status`, { status }),
  delete: (id: string) => api.delete(`/bookings/${id}`),
};

export const fleetAPI = {
  getAll: (params?: { page?: number; limit?: number; type?: string; active?: boolean }) => 
    api.get('/fleet', { params }),
  getById: (id: string) => api.get(`/fleet/${id}`),
  create: (vehicleData: any) => api.post('/fleet', vehicleData),
  update: (id: string, vehicleData: any) => api.put(`/fleet/${id}`, vehicleData),
  delete: (id: string) => api.delete(`/fleet/${id}`),
  toggleStatus: (id: string) => api.patch(`/fleet/${id}/status`),
};

export default api;