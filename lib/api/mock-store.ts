import { mockAssets } from '@/mocks/assets';
import { mockRepairRequests } from '@/mocks/repairRequests';
import { mockDashboardStats } from '@/mocks/dashboard';
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

export function getMockAssetBySerialNumber(SerialNumber: string): Asset | undefined {
  return assetsStore.find((a) => a.serialNumber === SerialNumber);
}

export function updateMockAssetBySerialNumber(
  SerialNumber: string,
  data: Pick<
    Asset,
    | 'mainSerialNumber'
    | 'serialNumber'
    | 'name'
    | 'status'
    | 'owner'
    | 'location'
    | 'acquiredDate'
  >
): Asset | null {
  const idx = assetsStore.findIndex((a) => a.serialNumber === SerialNumber);
  if (idx === -1) return null;
  const prev = assetsStore[idx];
  const updated: Asset = {
    ...prev,
    ...data,
    updatedAt: new Date().toISOString(),
  };
  assetsStore[idx] = updated;
  return updated;
}

export function listMockAssets(filters?: AssetFilters): Asset[] {
  if (!filters) return [...assetsStore];

  return assetsStore.filter((asset) => {
    if (filters.name) {
      const query = filters.name.toLowerCase();
      const matched =
        asset.serialNumber.toLowerCase().includes(query) ||
        asset.name.toLowerCase().includes(query);
      if (!matched) return false;
    }

    if (filters.status && asset.status !== filters.status) return false;
    if (filters.location && asset.location !== filters.location) return false;
    return true;
  });
}

export function createMockAsset(
  data: Pick<
    Asset,
    | 'mainSerialNumber'
    | 'serialNumber'
    | 'name'
    | 'status'
    | 'owner'
    | 'location'
    | 'acquiredDate'
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
  dashboardStatsStore.total += 1;
  if (newAsset.status === 'available') dashboardStatsStore.available += 1;
  if (newAsset.status === 'internal-repair') dashboardStatsStore.internalRepair += 1;
  if (newAsset.status === 'pending-disposal') dashboardStatsStore.externalRepair += 1;

  return newAsset;
}

export function listMockRepairs(): RepairRequest[] {
  return [...repairsStore];
}

export function createMockRepair(data: {
  serialNumber: string;
  name?: string;
  description: string;
}): RepairRequest {
  const assetName =
    assetsStore.find((asset) => asset.serialNumber === data.serialNumber)?.name ||
    data.name || 'ไม่ระบุชื่อครุภัณฑ์';
  const newRequest: RepairRequest = {
    id: `${repairsStore.length + 1}`,
    serialNumber: data.serialNumber,
    name: assetName,
    description: data.description,
    repairStatus: 'internal-repair',
    reportedBy: 'mock-user',
    requestDate: new Date().toISOString(),
  };

  repairsStore.unshift(newRequest);
  return newRequest;
}

export function getMockDashboardStats(): DashboardStats {
  return { ...dashboardStatsStore };
}
