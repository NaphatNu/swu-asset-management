import axios from 'axios';
import { apiClient } from '@/lib/api/client';
import { listMockRepairs, createMockRepair } from '@/lib/api/mock-store';
import type { GetRepairResponse, RepairPriority, RepairRequest } from '@/types/asset';


export interface CreateRepairPayload {
  assetId: string;
  description: string;
  status?: RepairRequest['status'];
  type?: RepairRequest['type'];
}

export async function getRepairRequests(filters: any): Promise<GetRepairResponse> {
  console.log('[API][REPAIRS] getRepairRequests called');
  try {
    const { data } = await apiClient.get<GetRepairResponse>('/repairs', { params: filters });
    console.log('[API][REPAIRS] getRepairRequests success', { count: data.data.length });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.warn('[API][REPAIRS] getRepairRequests fallback to mock data');
      const fallbackData = listMockRepairs();
      console.log('[API][REPAIRS] mock repairs result', { count: fallbackData.data.length });
      return fallbackData;
    }
    throw error;
  }
}

export async function createRepairRequest(payload: CreateRepairPayload): Promise<RepairRequest> {
  console.log('[API][REPAIRS] createRepairRequest called', { payload });
  const backendPayload = {
    assetId: payload.assetId,
    description: payload.description,
    status: payload.status || 'open',
    type: payload.type || 'internal-repair',
  };
  try {
    const { data } = await apiClient.post<RepairRequest>('/repairs', backendPayload);
    console.log('[API][REPAIRS] createRepairRequest success', {
      id: data.id,
      assetId: data.assetId,
    });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.warn('[API][REPAIRS] createRepairRequest fallback to mock data');
      const fallbackData = createMockRepair(backendPayload);
      console.log('[API][REPAIRS] mock create result', {
        id: fallbackData.id,
        assetId: fallbackData.assetId,
      });
      return fallbackData;
    }
    throw error;
  }
}
