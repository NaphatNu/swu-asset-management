import type { AssetStatus, RepairStatus } from '@/types/asset';

// Category labels for display
export const categoryLabels: Record<string, string> = {
  computer: 'คอมพิวเตอร์',
  furniture: 'เฟอร์นิเจอร์',
  equipment: 'อุปกรณ์',
  vehicle: 'ยานพาหนะ',
  other: 'อื่นๆ',
};

// Status labels for display
export const statusLabels: Record<AssetStatus, string> = {
  available: 'ใช้งานได้ตามปกติ',
  'on-loan': 'ยืมใช้ภายในหน่วยงาน',
  'internal-repair': 'ชำรุดระหว่างซ่อม (ภายใน)',
  'external-repair': 'ชำรุดระหว่างซ่อม (ภายนอก)',
  'pending-disposal': 'รอจำหน่าย',
  missing: 'สูญหาย',
  disposed: 'จำหน่ายออก/ตัดจำหน่าย',
};

export const repairStatusLabels: Record<RepairStatus, string> = {
  'internal-repair': 'ซ่อมภายใน มหาวิทยาลัย',
  'external-repair': 'ซ่อมภายนอก มหาวิทยาลัย',
};

// Priority labels for display
export const priorityLabels: Record<string, string> = {
  low: 'ต่ำ',
  medium: 'ปานกลาง',
  high: 'สูง',
  urgent: 'เร่งด่วน',
};

// Location options
export const locationOptions = [
  'ห้อง G630',
  'ห้อง G631',
  'ห้อง G632',
  'ห้อง G633',
  'ห้อง G634',
  'ห้อง G635',
  'ห้อง G636',
  'ห้อง G637',
  'ห้อง G638',
  'ห้อง G639',
  'ห้อง G640',
  'ห้อง G641',
  'ห้อง G642',
  'ห้อง G643',
  'ห้อง G644',
  'ห้อง G645',
  'ห้อง G646',
  'ห้อง G647',
  'ห้อง G648',
  'ห้อง G649',
  'ห้อง G650',
  'ห้อง G651',
  'ห้อง G652',
  'ห้อง G653',
  'ห้อง G654',
  'ห้อง G655',
  'ห้อง G656',
  'ห้อง G657',
  'ห้อง G658',
  'ห้อง G659',
  'ห้อง G660',
  'ห้อง G661',
  'ห้อง G662',
  'ห้อง G663',
  'ห้อง G664',
  'ห้อง G665',
] as const;

