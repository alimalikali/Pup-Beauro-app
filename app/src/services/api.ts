import axios from 'axios';
import { getToken } from '@/utils/secureStorage';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use(async (config) => {
  const token = await getToken('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res.data,
  (err) => Promise.reject(err.response?.data ?? err),
);

// Auth
export const authApi = {
  register: (data: object) => api.post('/auth/register', data),
  login: (data: object) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

// Profile
export const profileApi = {
  get: () => api.get('/profile'),
  update: (data: object) => api.put('/profile', data),
  updatePurpose: (data: object) => api.post('/profile/purpose', data),
  updatePriorities: (data: object) => api.post('/profile/priorities', data),
  publish: () => api.post('/profile/publish'),
  completeness: () => api.get('/profile/completeness'),
};

// Matching
export const matchApi = {
  getFeed: () => api.get('/matches/feed'),
  expressInterest: (userId: string, score: number) =>
    api.post(`/matches/interest/${userId}`, { score }),
  getMutual: () => api.get('/matches/mutual'),
  skip: (matchId: string) => api.put(`/matches/${matchId}/skip`),
};

// Chat
export const chatApi = {
  getConversations: () => api.get('/chat/conversations'),
  getMessages: (id: string) => api.get(`/chat/conversations/${id}`),
  setWali: (id: string, waliEmail: string) =>
    api.post(`/chat/conversations/${id}/wali`, { waliEmail }),
};

// Verification
export const verificationApi = {
  getStatus: () => api.get('/verification/status'),
  upload: (formData: FormData) =>
    api.post('/verification/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};
