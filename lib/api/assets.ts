import axios from 'axios';
import { apiClient } from '@/lib/api/client';
import {
  listMockAssets,
  createMockAsset,
  getMockAssetByAssetId,
  updateMockAssetByAssetId,
} from '@/lib/api/mock-store';
import type { AssetFormValues } from '@/lib/validations';
import type { Asset, AssetFilters } from '@/types/asset';

export interface CreateAssetPayload {
  assetId: string;
  name: string;
  category: Asset['category'];
  location: string;
  status: Asset['status'];
  description?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  warrantyExpiry?: string;
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

export async function getAssetByAssetId(assetId: string): Promise<Asset | null> {
  const path = `/assets/${encodeURIComponent(assetId)}`;
  try {
    const { data } = await apiClient.get<Asset>(path);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) return null;
      console.warn('[API][ASSETS] getAssetByAssetId fallback to mock');
      return getMockAssetByAssetId(assetId) ?? null;
    }
    throw error;
  }
}

export async function updateAsset(
  assetId: string,
  payload: AssetFormValues
): Promise<Asset> {
  const path = `/assets/${encodeURIComponent(assetId)}`;
  try {
    const { data } = await apiClient.patch<Asset>(path, payload);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.warn('[API][ASSETS] updateAsset fallback to mock');
      const updated = updateMockAssetByAssetId(assetId, {
        name: payload.name,
        category: payload.category,
        location: payload.location,
        status: payload.status,
        description: payload.description?.trim()
          ? payload.description
          : undefined,
        purchaseDate: payload.purchaseDate?.trim()
          ? payload.purchaseDate
          : undefined,
        purchasePrice:
          typeof payload.purchasePrice === 'number'
            ? payload.purchasePrice
            : undefined,
        warrantyExpiry: payload.warrantyExpiry?.trim()
          ? payload.warrantyExpiry
          : undefined,
      });
      if (!updated) {
        throw new Error('Asset not found');
      }
      return updated;
    }
    throw error;
  }
}

export async function createAsset(payload: CreateAssetPayload): Promise<Asset> {
  console.log('[API][ASSETS] createAsset called', { payload });
  try {
    const { data } = await apiClient.post<Asset>('/assets', payload);
    console.log('[API][ASSETS] createAsset success', { assetId: data.assetId, id: data.id });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.warn('[API][ASSETS] createAsset fallback to mock data');
      const fallbackData = createMockAsset(payload);
      console.log('[API][ASSETS] mock create result', {
        assetId: fallbackData.assetId,
        id: fallbackData.id,
      });
      return fallbackData;
    }
    throw error;
  }
}
