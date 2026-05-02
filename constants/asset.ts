import type { AssetCondition, AssetStatus, RepairStatus, RepairType } from '@/types/asset';

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
  'in-use': 'ใช้งานอยู่',
  'under-repair': 'ชำรุดระหว่างซ่อม',
  lost: 'สูญหาย',
  'pending-disposal': 'รอจำหน่าย',
  disposed: 'จำหน่ายออก/ตัดจำหน่าย',
};

// Condition labels for display
export const conditionLabels: Record<AssetCondition, string> = {
  normal: 'ปกติ',
  'minor-damage': 'ชำรุดเล็กน้อย',
  'major-damage': 'ชำรุดมาก',
  critical: 'ชำรุดขั้นวิกฤต',
};

// Action labels for display
export const actionLabels: Record<string, string> = {
  'update-condition': 'อัปเดตสภาพ',
  'update-status': 'อัปเดตสถานะ',
  'update-repair': 'อัปเดตการซ่อม',
  move: 'ย้ายครุภัณฑ์',
};

// Repair status labels for display

export const repairStatusLabels: Record<RepairStatus, string> = {
  'open': 'รอดำเนินการ',
  'in-progress': 'กำลังซ่อม',
  'completed': 'ซ่อมเสร็จแล้ว',
};

export const repairTypeLabels: Record<RepairType, string> = {
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

