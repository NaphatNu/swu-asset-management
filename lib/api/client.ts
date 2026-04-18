import axios from 'axios';

const DEFAULT_TIMEOUT_MS = 10000;

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
  timeout: DEFAULT_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  console.log('[API][REQUEST]', {
    method: config.method?.toUpperCase(),
    url: `${config.baseURL || ''}${config.url || ''}`,
    params: config.params,
    data: config.data,
  });

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    console.log('[API][RESPONSE]', {
      method: response.config.method?.toUpperCase(),
      url: `${response.config.baseURL || ''}${response.config.url || ''}`,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error('[API][ERROR]', {
      method: error.config?.method?.toUpperCase(),
      url: `${error.config?.baseURL || ''}${error.config?.url || ''}`,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);
