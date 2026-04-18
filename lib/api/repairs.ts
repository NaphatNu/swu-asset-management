import axios from 'axios';
import { apiClient } from '@/lib/api/client';
import { listMockRepairs, createMockRepair } from '@/lib/api/mock-store';
import type { RepairPriority, RepairRequest } from '@/types/asset';

export interface CreateRepairPayload {
  assetId: string;
  description: string;
  priority: RepairPriority;
}

export async function getRepairRequests(): Promise<RepairRequest[]> {
  console.log('[API][REPAIRS] getRepairRequests called');
  try {
    const { data } = await apiClient.get<RepairRequest[]>('/repairs');
    console.log('[API][REPAIRS] getRepairRequests success', { count: data.length });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.warn('[API][REPAIRS] getRepairRequests fallback to mock data');
      const fallbackData = listMockRepairs();
      console.log('[API][REPAIRS] mock repairs result', { count: fallbackData.length });
      return fallbackData;
    }
    throw error;
  }
}

export async function createRepairRequest(payload: CreateRepairPayload): Promise<RepairRequest> {
  console.log('[API][REPAIRS] createRepairRequest called', { payload });
  try {
    const { data } = await apiClient.post<RepairRequest>('/repairs', payload);
    console.log('[API][REPAIRS] createRepairRequest success', {
      id: data.id,
      assetId: data.assetId,
    });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.warn('[API][REPAIRS] createRepairRequest fallback to mock data');
      const fallbackData = createMockRepair(payload);
      console.log('[API][REPAIRS] mock create result', {
        id: fallbackData.id,
        assetId: fallbackData.assetId,
      });
      return fallbackData;
    }
    throw error;
  }
}
