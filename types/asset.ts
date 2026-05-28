// Asset Management Types

import { locationOptions } from "@/constants/asset";

export type AssetStatus = 'available' | 'in-use' | 'under-repair' | 'lost' | 'pending-disposal' | 'disposed';
export type AssetCondition = 'normal' | 'minor-damage' | 'major-damage' | 'critical';
export type RepairStatus = 'open' | 'in-progress' | 'completed';
/** @deprecated Legacy backend values – mapped in API layer */
export type LegacyRepairStatus = 'open' | 'in-progress';
export type RepairType = 'internal-repair' | 'external-repair' ;
export type AssetCategory = 'computer' | 'furniture' | 'equipment' | 'vehicle' | 'other';
export type RepairPriority = 'low' | 'medium' | 'high' | 'urgent';
export type Action = 'update-condition' | 'update-asset' | 'create-repair' | 'delete-asset' | 'delete-repair' | 'update-status-repair';
export type LocationOption = typeof locationOptions[number];
export type BudgetType = 'government-budget' | 'income-budget';

export interface AssetSubItem {
  itemSequenceNo: number;
  itemSequenceName: string;
}

export interface Asset {
  id: string;
  mainSerialNumber: string;
  serialNumber: string;
  assetName: string;
  location: string;
  status: AssetStatus;
  condition: AssetCondition;
  ownerName: string;
  acquiredDate: string;
  updatedByName: string;
  updatedAt: string;
  createdByName: string;
  createdAt: string;
  fiscalYear?: string;
  mainSequenceNo?: string;
  itemSequenceNo?: number;
  itemSequenceName?: string;
  subItems?: AssetSubItem[];
  budgetType?: BudgetType;
}

export interface GetAssetsResponse {
  data: Asset[];    // ตัวแปร data ข้างในนี้แหละที่เป็น Array
  total: number;
  page: number;
  pageSize: number;
}

export interface AssetLog {
  id: string;
  assetId: string;
  assetName: string;
  serialNumber: string;
  action: Action;
  note: string;
  createdByName: string;
  createdAt: string;
}

export interface GetAssetsLogsResponse {
  data: AssetLog[];    // ตัวแปร data ข้างในนี้แหละที่เป็น Array
  total: number;
  page: number;
  pageSize: number;
}

export interface RepairRequest {
  id: string;
  assetId: string;
  serialNumber: string;
  assetName: string;
  description: string;
  status: RepairStatus;
  type: RepairType;
  reportedByName: string;
  createdAt: string;
}

export interface GetRepairResponse {
  data: RepairRequest[];    // ตัวแปร data ข้างในนี้แหละที่เป็น Array
  total: number;
  page: number;
  pageSize: number;
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
  inUse: number;         // inUse: ใช้งานอยู่ 
  underRepair: number; // underRepair: ชำรุดระหว่างซ่อม
  lost: number;        // lost: สูญหาย
  pendingDisposal: number;// pending-dispose: อยู่ระหว่างดำเนินการจำหน่าย
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
  status?: AssetStatus;
  condition?: AssetCondition;
  location?: LocationOption;
  assetName?: string;
  fiscalYear?: string;
  /** @deprecated Use fiscalYear instead */
  startDate?: string;
  /** @deprecated Use fiscalYear instead */
  endDate?: string;
  budgetType?: string;
  page?: number;
  pageSize?: number;
}

export interface AssetLogFilters {
  assetName?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

export interface RepairFilters {
  status?: RepairStatus;
  type?: RepairType;
  priority?: RepairPriority;
  serialNumber?: string;
  assetName?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
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
