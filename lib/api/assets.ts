import axios from 'axios';
import { apiClient } from '@/lib/api/client';
import {
  listMockAssets,
  createMockAsset,
  getMockAssetBySerialNumber,
  updateMockAssetBySerialNumber,
} from '@/lib/api/mock-store';
import type { AssetFormValues } from '@/lib/validations';
import type { Asset, AssetFilters } from '@/types/asset';

interface CreateAssetBackendPayload {
  mainSerialNumber: string;
  serialNumber: string;
  name: string;
  status: Asset['status'];
  owner: string;
  location: string;
  acquiredDate: string;
}

function mapAssetFormValuesToBackendPayload(values: AssetFormValues): CreateAssetBackendPayload {
  return {
    mainSerialNumber: values.mainSerialNumber,
    serialNumber: values.serialNumber,
    name: values.name,
    status: values.status,
    owner: values.owner ?? '',
    location: values.location,
    acquiredDate: values.acquiredDate ?? '',
  };
}

export async function getAssets(filters?: AssetFilters): Promise<Asset[]> {
  console.log('[API][ASSETS] getAssets called', { filters });
  try {
    const { data } = await apiClient.get<Asset[]>('/assets', { params: filters });
    console.log('[API][ASSETS] getAssets success', { count: data.length });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.warn('[API][ASSETS] getAssets fallback to mock data');
      const fallbackData = listMockAssets(filters);
      console.log('[API][ASSETS] mock assets result', { count: fallbackData.length });
      return fallbackData;
    }
    throw error;
  }
}

export async function getAssetsSearch(filters?: AssetFilters): Promise<Asset[]> {
  console.log('[API][ASSETS] getAssetsSearch called', { filters });
  try {
    const { data } = await apiClient.get<Asset[]>('/assets/search', { params: filters });
    console.log('[API][ASSETS] getAssetsSearch success', { count: data.length });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.warn('[API][ASSETS] getAssetsSearch fallback to mock data');
      const fallbackData = listMockAssets(filters);
      console.log('[API][ASSETS] mock assets result', { count: fallbackData.length });
      return fallbackData;
    }
    throw error;
  }
}

export async function getAssetBySerialNumber(serialNumber: string): Promise<Asset | null> {
  const path = `/assets/details/${encodeURIComponent(serialNumber)}`;
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
  const path = `/assets/update-by-serial/${encodeURIComponent(serialNumber)}`;
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
        name: payload.name,
        // category: payload.category,
        location: payload.location,
        status: payload.status,
        owner: asset?.owner || '',
        acquiredDate: asset?.acquiredDate || '',
        // description: payload.description?.trim()
        //   ? payload.description
        //   : undefined,
        // purchaseDate: payload.purchaseDate?.trim()
        //   ? payload.purchaseDate
        //   : undefined,
        // purchasePrice:
        //   typeof payload.purchasePrice === 'number'
        //     ? payload.purchasePrice
        //     : undefined,
        // warrantyExpiry: payload.warrantyExpiry?.trim()
        //   ? payload.warrantyExpiry
        //   : undefined,
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
        name: payload.name,
        status: payload.status,
        owner: payload.owner,
        location: payload.location,
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
