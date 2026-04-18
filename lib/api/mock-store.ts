import { mockAssets, mockRepairRequests, mockDashboardStats } from '@/lib/mock-data';
import type {
  Asset,
  AssetFilters,
  RepairRequest,
  RepairPriority,
  DashboardStats,
} from '@/types/asset';

const assetsStore: Asset[] = [...mockAssets];
const repairsStore: RepairRequest[] = [...mockRepairRequests];
const dashboardStatsStore: DashboardStats = { ...mockDashboardStats };

export function getMockAssetByAssetId(assetId: string): Asset | undefined {
  return assetsStore.find((a) => a.assetId === assetId);
}

export function updateMockAssetByAssetId(
  assetId: string,
  data: Pick<
    Asset,
    | 'name'
    | 'category'
    | 'location'
    | 'status'
    | 'description'
    | 'purchaseDate'
    | 'purchasePrice'
    | 'warrantyExpiry'
  >
): Asset | null {
  const idx = assetsStore.findIndex((a) => a.assetId === assetId);
  if (idx === -1) return null;
  const prev = assetsStore[idx];
  const updated: Asset = {
    ...prev,
    ...data,
    description: data.description || undefined,
    purchaseDate: data.purchaseDate || undefined,
    purchasePrice: data.purchasePrice,
    warrantyExpiry: data.warrantyExpiry || undefined,
    updatedAt: new Date().toISOString(),
  };
  assetsStore[idx] = updated;
  return updated;
}

export function listMockAssets(filters?: AssetFilters): Asset[] {
  if (!filters) return [...assetsStore];

  return assetsStore.filter((asset) => {
    if (filters.search) {
      const query = filters.search.toLowerCase();
      const matched =
        asset.assetId.toLowerCase().includes(query) ||
        asset.name.toLowerCase().includes(query) ||
        asset.description?.toLowerCase().includes(query);
      if (!matched) return false;
    }

    if (filters.category && asset.category !== filters.category) return false;
    if (filters.status && asset.status !== filters.status) return false;
    if (filters.location && asset.location !== filters.location) return false;
    return true;
  });
}

export function createMockAsset(
  data: Pick<
    Asset,
    | 'assetId'
    | 'name'
    | 'category'
    | 'location'
    | 'status'
    | 'description'
    | 'purchaseDate'
    | 'purchasePrice'
    | 'warrantyExpiry'
  >
): Asset {
  const now = new Date().toISOString();
  const newAsset: Asset = {
    id: `${assetsStore.length + 1}`,
    ...data,
    createdAt: now,
    updatedAt: now,
  };

  assetsStore.unshift(newAsset);
  dashboardStatsStore.totalAssets += 1;
  if (newAsset.status === 'available') dashboardStatsStore.availableAssets += 1;
  if (newAsset.status === 'repair') dashboardStatsStore.inRepairAssets += 1;
  if (newAsset.status === 'damaged') dashboardStatsStore.damagedAssets += 1;

  return newAsset;
}

export function listMockRepairs(): RepairRequest[] {
  return [...repairsStore];
}

export function createMockRepair(data: {
  assetId: string;
  description: string;
  priority: RepairPriority;
}): RepairRequest {
  const assetName = assetsStore.find((asset) => asset.assetId === data.assetId)?.name || data.assetId;
  const newRequest: RepairRequest = {
    id: `${repairsStore.length + 1}`,
    assetId: data.assetId,
    assetName,
    description: data.description,
    priority: data.priority,
    status: 'pending',
    requestedBy: 'ผู้ใช้งานระบบ',
    requestedAt: new Date().toISOString(),
  };

  repairsStore.unshift(newRequest);
  return newRequest;
}

export function getMockDashboardStats(): DashboardStats {
  return { ...dashboardStatsStore };
}
