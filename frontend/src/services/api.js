import axios from 'axios';
import { handleMockRequest, isMockMode } from './mockData';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Check if running on static host (GitHub Pages, etc.)
const isStaticHost =
  typeof window !== 'undefined' &&
  (window.location.hostname.includes('github.io') ||
    window.location.hostname.includes('vercel.app') ||
    window.location.hostname.includes('netlify.app') ||
    localStorage.getItem('edupulse_mock_mode') === 'true');

// Request interceptor: Attach JWT token or route to mock adapter
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('edupulse_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (isStaticHost || isMockMode()) {
      config.adapter = async (cfg) => {
        return handleMockRequest(cfg);
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle session expiry & fallback on network failure
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      if (!window.location.hash.includes('login') && !window.location.hash.includes('register')) {
        localStorage.removeItem('edupulse_token');
        localStorage.removeItem('edupulse_user');
      }
      return Promise.reject(error);
    }

    // Seamless fallback to mock dataset if backend is unreachable locally
    if ((error.code === 'ERR_NETWORK' || error.response?.status === 404) && error.config) {
      console.warn('[EduPulse] Backend unreachable. Falling back to local interactive dataset for:', error.config.url);
      try {
        return await handleMockRequest(error.config);
      } catch (mockErr) {
        return Promise.reject(mockErr);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

