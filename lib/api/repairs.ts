import axios from 'axios';
import { apiClient } from '@/lib/api/client';
import { listMockRepairs, createMockRepair } from '@/lib/api/mock-store';
import type { RepairPriority, RepairRequest } from '@/types/asset';
import { request } from 'http';
import { useSession } from 'next-auth/react';

export interface CreateRepairPayload {
  serialNumber: string;
  name?: string;
  description: string;
  repairStatus?: RepairRequest['repairStatus'];
  reportedBy?: string | null;
}

export async function getRepairRequests(): Promise<RepairRequest[]> {
  console.log('[API][REPAIRS] getRepairRequests called');
  try {
    const { data } = await apiClient.get<RepairRequest[]>('/assets/maintenance-list');
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
  const backendPayload = {
    serialNumber: payload.serialNumber,
    name: payload.name || 'ไม่ระบุชื่อครุภัณฑ์',
    description: payload.description,
    reportedBy: payload.reportedBy || 'unknown',
    repairStatus: payload.repairStatus || 'internal-repair',
    requestDate: new Date().toISOString(),
  };
  try {
    const { data } = await apiClient.post<RepairRequest>('/assets/report-repair', backendPayload);
    console.log('[API][REPAIRS] createRepairRequest success', {
      id: data.id,
      serialNumber: data.serialNumber,
    });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.warn('[API][REPAIRS] createRepairRequest fallback to mock data');
      const fallbackData = createMockRepair(backendPayload);
      console.log('[API][REPAIRS] mock create result', {
        id: fallbackData.id,
        serialNumber: fallbackData.serialNumber,
      });
      return fallbackData;
    }
    throw error;
  }
}
