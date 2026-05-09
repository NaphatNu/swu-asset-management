import axios from 'axios';
import { apiClient } from '@/lib/api/client';
import { getMockAssetBySerialNumber } from '@/lib/api/mock-store';
import type { InspectionFormValues } from '@/lib/validations';
import type { Asset,} from '@/types/asset';

interface CreateInspectionBackendPayload {
  assetId: string;
  condition: string;
  note?: string;
  updateStatus: boolean;
}

function mapInspectionFormValuesToBackendPayload(values: InspectionFormValues): CreateInspectionBackendPayload {
  return {
    assetId: values.assetId,
    condition: values.condition,
    note: values.note,
    updateStatus: values.updateStatus,
  };
}

export async function createInspection(values: InspectionFormValues): Promise<Asset> {
  const payload = mapInspectionFormValuesToBackendPayload(values);
  console.log('[API][INSPECTIONS] createInspection called', { payload });
  try {
    const { data } = await apiClient.post<Asset>('/inspections/', payload);
    console.log('[API][INSPECTIONS] createInspection success', { inspectionId: data.serialNumber, id: data.id });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.warn('[API][INSPECTIONS] createInspection fallback to mock data');
      const fallbackData = getMockAssetBySerialNumber(payload.assetId);
      if (!fallbackData) {
        throw error;
      }
      console.log('[API][INSPECTIONS] mock create result', {
        serialNumber: fallbackData.serialNumber,
        id: fallbackData.id,
      });
      return fallbackData;
    }
    throw error;
  }
}