// Asset Management Types

import { locationOptions } from "@/constants/asset";

export type AssetStatus = 'available' | 'on-loan' | 'internal-repair' | 'external-repair' | 'pending-disposal' | 'missing' | 'disposed';
export type RepairStatus = 'internal-repair' | 'external-repair' ;
export type AssetCategory = 'computer' | 'furniture' | 'equipment' | 'vehicle' | 'other';
export type RepairPriority = 'low' | 'medium' | 'high' | 'urgent';
export type LocationOption = typeof locationOptions[number];

export interface Asset {
  id: string;
  mainSerialNumber: string;
  serialNumber: string;
  name: string;
  status: AssetStatus;
  owner: string;
  location: string;
  acquiredDate: string;
  // category: AssetCategory;
  // description?: string;
  // purchaseDate?: string;
  // purchasePrice?: number;
  // warrantyExpiry?: string;
  // assignedTo?: string;
  // imageUrl?: string;
  // qrCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RepairRequest {
  id: string;
  serialNumber: string;
  name: string;
  description: string;
  requestDate: string;
  reportedBy: string;
  repairStatus: RepairStatus;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'viewer';
  department?: string;
  avatar?: string;
}

export interface DashboardStats {
  total: number;          // ครุภัณฑ์ทั้งหมด
  available: number;      // available: ใช้งานได้ตามปกติ
  onLoan: number;         // on-loan: ยืมใช้ภายในหน่วยงาน
  internalRepair: number; // internal-repair: ชำรุดระหว่างซ่อม (ภายใน)
  externalRepair: number; // external-repair: ชำรุดระหว่างซ่อม (ภายนอก)
  pendingDisposal: number;// pending-disposal: รอจำหน่าย
  missing: number;        // missing: สูญหาย
  disposed: number;       // disposed: จำหน่ายออก/ตัดจำหน่าย
}

export interface ActivityLog {
  id: string;
  action: string;
  assetId?: string;
  assetName?: string;
  userId: string;
  userName: string;
  timestamp: string;
  details?: string;
}

// Form schemas will use these types with Zod validation
export interface AssetFormData {
  assetId: string;
  name: string;
  category: AssetCategory;
  location: string;
  status: AssetStatus;
  description?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  warrantyExpiry?: string;
}

export interface RepairFormData {
  assetId: string;
  description: string;
  priority: RepairPriority;
  attachments?: File[];
}

// Filter and pagination types
export interface AssetFilters {
  name?: string;
  status?: AssetStatus;
  location?: LocationOption;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

export interface SortState {
  field: keyof Asset;
  direction: 'asc' | 'desc';
}
