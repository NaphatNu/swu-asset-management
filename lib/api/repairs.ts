import axios from 'axios';
import { apiClient } from '@/lib/api/client';
import {
  listMockRepairs,
  createMockRepair,
  deleteMockRepair,
  updateMockRepairStatus,
} from '@/mocks/mock-store';
import type { GetRepairResponse, RepairRequest, RepairStatus } from '@/types/asset';

export interface CreateRepairPayload {
  assetId: string | number;
  description: string;
  status?: RepairRequest['status'];
  type?: RepairRequest['type'];
}

export interface RepairListFilters {
  search?: string;
  status?: RepairStatus;
  page?: number;
  pageSize?: number;
}

export async function getRepairRequests(filters?: RepairListFilters): Promise<GetRepairResponse> {
  console.log('[API][REPAIRS] getRepairRequests called');
  try {
    const { data } = await apiClient.get<GetRepairResponse>('/repairs', { params: filters });
    console.log('[API][REPAIRS] getRepairRequests success', { count: data.data.length });
    return data; // ส่งต่อ data ที่ได้จากหลังบ้านได้ทันที ไม่ต้อง map ข้อมูลแล้ว
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.warn('[API][REPAIRS] getRepairRequests fallback to mock data');
      const fallbackData = listMockRepairs(filters);
      console.log('[API][REPAIRS] mock repairs result', { count: fallbackData.data.length });
      return fallbackData;
    }
    throw error;
  }
}

export async function createRepairRequest(payload: CreateRepairPayload): Promise<RepairRequest> {
  console.log('[API][REPAIRS] createRepairRequest called', { payload });
  const backendPayload = {
    assetId: String(payload.assetId),
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

export async function deleteRepairRequest(id: string): Promise<void> {
  const path = `/repairs/${encodeURIComponent(id)}`;
  try {
    await apiClient.delete(path);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.warn('[API][REPAIRS] deleteRepairRequest fallback to mock');
      const deleted = deleteMockRepair(id);
      if (!deleted) {
        throw new Error('Repair request not found');
      }
      return;
    }
    throw error;
  }
}

export async function updateRepairStatus(
  id: string,
  status: RepairStatus
): Promise<RepairRequest> {
  const path = `/repairs/${encodeURIComponent(id)}/status`;
  try {
    const { data } = await apiClient.put<RepairRequest>(path, {
      status, // ส่งค่า status ที่รับมาจากหน้าบ้านไปให้หลังบ้านได้โดยตรง
    });
    return data; // ส่งคืน data ตรง ๆ ไม่ต้องผ่านฟังก์ชันแปลงสถานะ
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.warn('[API][REPAIRS] updateRepairStatus fallback to mock');
      const updated = updateMockRepairStatus(id, status);
      if (!updated) {
        throw new Error('Repair request not found');
      }
      return updated;
    }
    throw error;
  }
}