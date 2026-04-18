import axios from 'axios';
import { apiClient } from '@/lib/api/client';
import { getMockDashboardStats } from '@/lib/api/mock-store';
import type { DashboardStats } from '@/types/asset';

export async function getDashboardStats(): Promise<DashboardStats> {
  console.log('[API][DASHBOARD] getDashboardStats called');
  try {
    const { data } = await apiClient.get<DashboardStats>('/dashboard/stats');
    console.log('[API][DASHBOARD] getDashboardStats success', data);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.warn('[API][DASHBOARD] getDashboardStats fallback to mock data');
      const fallbackData = getMockDashboardStats();
      console.log('[API][DASHBOARD] mock stats result', fallbackData);
      return fallbackData;
    }
    throw error;
  }
}
