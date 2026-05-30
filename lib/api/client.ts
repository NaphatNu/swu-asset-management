import axios from 'axios';
import { getSession } from 'next-auth/react';

const DEFAULT_TIMEOUT_MS = 10000;

export const apiClient = axios.create({
  baseURL: '/api',
  timeout: DEFAULT_TIMEOUT_MS,
  headers: {},
});

apiClient.interceptors.request.use(async (config) => {
  // ดึง session ออกมา (NextAuth จะไปอ่านจาก Cookie ให้เอง)
  const session = await getSession();

  if (session && session.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
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
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    // ถ้าเจอ 401 หรือ Refresh Error ให้สั่ง Logout หน้าบ้านด้วย
    if (error.response?.status === 401) {
      // window.location.href = '/login'; // หรือใช้ signOut() จาก next-auth/react
    }
    return Promise.reject(error);
  }
);
