import axios from 'axios';
import { apiClient } from '@/lib/api/client';
import {
  listMockAssets,
  createMockAsset,
  getMockAssetBySerialNumber,
  updateMockAssetBySerialNumber,
  deleteMockAssetById,
} from '@/mocks/mock-store';
import type { AssetFormValues } from '@/lib/validations';
import type { Asset, AssetCondition, AssetFilters, AssetStatus, GetAssetsLogsResponse, GetAssetsResponse } from '@/types/asset';

interface CreateAssetBackendPayload {
  mainSerialNumber: string;
  serialNumber: string;
  assetName: string;
  location: string;
  ownerName: string;
  acquiredDate: string;
  fiscalYear?: string;
  mainSequenceNo?: string;
  itemSequenceNo?: number;
  itemSequenceName?: string;
  subItems?: { id?: number; itemSequenceNo: number; itemSequenceName: string; status?: AssetStatus; condition?: AssetCondition }[];
  budgetType?: Asset['budgetType'];
}

function mapAssetFormValuesToBackendPayload(values: AssetFormValues): CreateAssetBackendPayload {
  return {
    mainSerialNumber: values.mainSerialNumber,
    serialNumber: values.serialNumber,
    assetName: values.assetName,
    location: values.location ?? '',
    ownerName: values.ownerName ?? '',
    acquiredDate: values.acquiredDate ?? '',
    fiscalYear: values.fiscalYear,
    mainSequenceNo: values.mainSequenceNo,
    subItems: values.subItems,
    budgetType: values.budgetType,
  };
}

export async function getAssets(filters?: AssetFilters): Promise<GetAssetsResponse> {
  console.log('[API][ASSETS] getAssets called', { filters });
  try {
    const { data } = await apiClient.get<GetAssetsResponse>('/assets', { params: filters });
    console.log('[API][ASSETS] getAssets success', { count: data.data.length });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.warn('[API][ASSETS] getAssets fallback to mock data');
      const fallbackData = listMockAssets(filters);
      console.log('[API][ASSETS] mock assets result', { count: fallbackData.data.length });
      return fallbackData;
    }
    throw error;
  }
}

export async function getAssetsSearch(filters?: AssetFilters): Promise<GetAssetsResponse> {
  console.log('[API][ASSETS] getAssetsSearch called', { filters });
  try {
    const { data } = await apiClient.get<GetAssetsResponse>('/assets', { params: filters });
    console.log('[API][ASSETS] getAssetsSearch success', { count: data.data.length });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.warn('[API][ASSETS] getAssetsSearch fallback to mock data');
      const fallbackData = listMockAssets(filters);
      console.log('[API][ASSETS] mock assets result', { count: fallbackData.data.length });
      return fallbackData;
    }
    throw error;
  }
}

export async function getAssetBySerialNumber(serialNumber: string): Promise<Asset | null> {
  const path = `/assets/by-serial/${encodeURIComponent(serialNumber)}`;
  try {
    const { data } = await apiClient.get<Asset>(path);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) return null;
      console.warn('[API][ASSETS] getAssetBySerialNumber fallback to mock');
      return getMockAssetBySerialNumber(serialNumber) ?? null;
    }
    throw error;
  }
}

export async function updateAsset(
  serialNumber: string,
  payload: AssetFormValues
): Promise<Asset> {
  const path = `/assets/${encodeURIComponent(serialNumber)}`;
  const backendPayload = mapAssetFormValuesToBackendPayload(payload);
  try {
    const { data } = await apiClient.put<Asset>(path, backendPayload);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.warn('[API][ASSETS] updateAsset fallback to mock');
      const asset = await getMockAssetBySerialNumber(serialNumber);
      const updated = updateMockAssetBySerialNumber(serialNumber, {
        mainSerialNumber: asset?.mainSerialNumber || '',
        serialNumber: asset?.serialNumber || serialNumber,
        assetName: payload.assetName,
        location: payload.location || asset?.location || '',
        ownerName: asset?.ownerName || '',
        acquiredDate: asset?.acquiredDate || '',
      });
      if (!updated) {
        throw new Error('Asset not found');
      }
      return updated;
    }
    throw error;
  }
}

export async function createAsset(values: AssetFormValues): Promise<Asset> {
  const payload = mapAssetFormValuesToBackendPayload(values);
  console.log('[API][ASSETS] createAsset called', { payload });
  try {
    const { data } = await apiClient.post<Asset>('/assets/', payload);
    console.log('[API][ASSETS] createAsset success', { assetId: data.serialNumber, id: data.id });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.warn('[API][ASSETS] createAsset fallback to mock data');
      const fallbackData = createMockAsset({
        mainSerialNumber: payload.mainSerialNumber,
        serialNumber: payload.serialNumber,
        assetName: payload.assetName,
        ownerName: payload.ownerName,
        location: payload.location,
        status: 'available',
        condition: 'normal',
        acquiredDate: payload.acquiredDate,
      });
      console.log('[API][ASSETS] mock create result', {
        serialNumber: fallbackData.serialNumber,
        id: fallbackData.id,
      });
      return fallbackData;
    }
    throw error;
  }
}

export async function deleteAsset(id: string): Promise<void> {
  try {
    await apiClient.delete( `/assets/${encodeURIComponent(id)}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.warn('[API][ASSETS] deleteAsset fallback to mock');
      const deleted = deleteMockAssetById(id);
      if (!deleted) {
        throw new Error('Asset not found');
      }
      return;
    }
    throw error;
  }
}

export async function getAssetsLogs(filters?: AssetFilters): Promise<GetAssetsLogsResponse> {
  console.log('[API][ASSETS] getAssetsLogs called', { filters });
    const { data } = await apiClient.get<GetAssetsLogsResponse>('/asset-logs', { params: filters });
    console.log('[API][ASSETS] getAssetsLogs success', { count: data });
    console.log('[API][ASSETS] getAssetsLogs success', { count: data.data.length });
    return data;
}