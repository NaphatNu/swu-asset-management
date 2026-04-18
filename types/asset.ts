// Asset Management Types

export type AssetStatus = 'available' | 'on-loan' | 'internal-repair' | 'external-repair' | 'pending-disposal' | 'missing' | 'disposed';
export type AssetCategory = 'computer' | 'furniture' | 'equipment' | 'vehicle' | 'other';
export type RepairPriority = 'low' | 'medium' | 'high' | 'urgent';
export type RepairStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';

export interface Asset {
  id: string;
  assetId: string;
  serial_number: string;
  name: string;
  category: AssetCategory;
  location: string;
  status: AssetStatus;
  description?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  warrantyExpiry?: string;
  assignedTo?: string;
  imageUrl?: string;
  qrCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RepairRequest {
  id: string;
  assetId: string;
  assetName: string;
  description: string;
  priority: RepairPriority;
  status: RepairStatus;
  attachments?: string[];
  requestedBy: string;
  requestedAt: string;
  completedAt?: string;
  notes?: string;
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
  totalAssets: number;
  availableAssets: number;
  inRepairAssets: number;
  damagedAssets: number;
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
  search?: string;
  category?: AssetCategory;
  status?: AssetStatus;
  location?: string;
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
