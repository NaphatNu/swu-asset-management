import { mockAssets } from '@/mocks/assets';
import { mockRepairRequests } from '@/mocks/repairRequests';
import { mockDashboardStats } from '@/mocks/dashboard';
import type {
  Asset,
  AssetFilters,
  RepairRequest,
  RepairStatus,
  DashboardStats,
  GetAssetsResponse,
  GetRepairResponse,
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
    | 'assetName'
    | 'status'
    | 'ownerName'
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

export function listMockAssets(filters?: AssetFilters): GetAssetsResponse {
  if (!filters) return { data: [...assetsStore], total: assetsStore.length, page: 1, pageSize: assetsStore.length };

  const filteredAssets = assetsStore.filter((asset) => {
    if (filters.assetName) {
      const query = filters.assetName.toLowerCase();
      const matched =
        asset.serialNumber.toLowerCase().includes(query) ||
        asset.assetName.toLowerCase().includes(query);
      if (!matched) return false;
    }

    if (filters.status && asset.status !== filters.status) return false;
    if (filters.location && asset.location !== filters.location) return false;
    if (filters.condition && asset.condition !== filters.condition) return false;
    if (filters.fiscalYear && asset.fiscalYear !== filters.fiscalYear) return false;
    return true;
  });
  return { data: filteredAssets, total: filteredAssets.length, page: 1, pageSize: filteredAssets.length };
}

export function createMockAsset(
  data: Pick<
    Asset,
    | 'mainSerialNumber'
    | 'serialNumber'
    | 'assetName'
    | 'status'
    | 'ownerName'
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
    condition: 'normal',
    updatedByName: 'mock-user',
    createdByName: 'mock-user',
  };

  assetsStore.unshift(newAsset);
  dashboardStatsStore.total += 1;
  if (newAsset.status === 'available') dashboardStatsStore.available += 1;
  if (newAsset.status === 'under-repair') dashboardStatsStore.underRepair += 1;
  if (newAsset.status === 'pending-disposal') dashboardStatsStore.pendingDisposal += 1;

  return newAsset;
}

export function deleteMockAssetById(id: string): boolean {
  const idx = assetsStore.findIndex((a) => a.id === id);
  if (idx === -1) return false;
  assetsStore.splice(idx, 1);
  return true;
}

export function listMockRepairs(filters?: {
  search?: string;
  status?: RepairStatus;
  page?: number;
  pageSize?: number;
}): GetRepairResponse {
  let data = repairsStore.map((r) => ({
    ...r,
    status: r.status as RepairStatus, 
  }));

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    data = data.filter(
      (r) =>
        r.serialNumber.toLowerCase().includes(q) ||
        r.assetName.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
    );
  }
  if (filters?.status) {
    data = data.filter((r) => r.status === filters.status);
  }

  const page = filters?.page ?? 1;
  const pageSize = filters?.pageSize ?? data.length;
  const start = (page - 1) * pageSize;
  const paged = data.slice(start, start + pageSize);

  return { data: paged, total: data.length, page, pageSize };
}

export function deleteMockRepair(id: string): boolean {
  const idx = repairsStore.findIndex((r) => r.id === id);
  if (idx === -1) return false;
  repairsStore.splice(idx, 1);
  return true;
}

export function updateMockRepairStatus(id: string, status: RepairStatus): RepairRequest | null {
  const idx = repairsStore.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  repairsStore[idx] = { ...repairsStore[idx], status };
  return repairsStore[idx];
}

export function createMockRepair(data: {
  assetId: string;
  description: string;
  status?: string;
  type?: string;
}): RepairRequest {
  // 1. ค้นหาข้อมูลครุภัณฑ์จาก assetsStore เพื่อดึง serialNumber และ assetName
  // สมมติว่า assetsStore เก็บ Object ที่มี { id, serialNumber, assetName }
  const asset = assetsStore.find((a) => a.id === data.assetId || a.serialNumber === data.assetId);

  // 2. สร้าง Object ใหม่ตาม interface RepairRequest เป๊ะๆ
  const newRequest: RepairRequest = {
    id: `MOCK-${Math.floor(Math.random() * 10000)}`, // จำลอง ID
    assetId: data.assetId,
    serialNumber: asset?.serialNumber || 'N/A', // ดึงจาก store ถ้าหาไม่เจอใส่ N/A
    assetName: asset?.assetName || 'ไม่ระบุชื่อครุภัณฑ์', // ดึงจาก store
    description: data.description,
    status: (data.status as RepairStatus) || 'pending',
    type: (data.type as any) || 'internal-repair', // ตาม Type RepairType
    reportedByName: 'ผู้ใช้งานทดสอบ (Mock)', // ต้องมีเพราะ UI เรียกใช้
    createdAt: new Date().toISOString(), // ใช้ ISO String
  };

  // 3. บันทึกลงใน Store จำลอง (repairsStore)
  // หมายเหตุ: ถ้า API จริงส่งกลับมาเป็น { data: [...] } 
  // ตัว repairsStore ของคุณอาจจะต้องเป็น Array ตรงๆ เพื่อให้ .unshift ทำงานได้
  if (Array.isArray(repairsStore)) {
    repairsStore.unshift(newRequest);
  }

  return newRequest;
}

export function getMockDashboardStats(): DashboardStats {
  return { ...dashboardStatsStore };
}
