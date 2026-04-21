import type { RepairRequest } from '@/types/asset';
export const mockRepairRequests: RepairRequest[] = [
  {
    id: '1',
    serialNumber: '7440-003-0001',
    name: 'เครื่องปรับอากาศ Daikin Inverter',
    description: 'เครื่องทำความเย็นไม่เพียงพอ มีเสียงดังผิดปกติ',
    requestDate: '2024-03-01T10:00:00Z',
    reportedBy: 'อ.สมศักดิ์ รักเรียน',
    repairStatus: 'internal-repair', // แก้จาก in-progress
  },
  {
    id: '2',
    serialNumber: '7440-001-0001',
    name: 'คอมพิวเตอร์ตั้งโต๊ะ Dell OptiPlex 7090',
    description: 'เครื่องเปิดไม่ติด ไฟ Power ไม่ติด',
    requestDate: '2024-03-05T14:30:00Z',
    reportedBy: 'น.ส.วิภา ชาญชัย',
    repairStatus: 'internal-repair', // แก้จาก pending
  },
  {
    id: '3',
    serialNumber: '7440-003-0002',
    name: 'เครื่องพิมพ์ HP LaserJet Pro',
    description: 'กระดาษติดบ่อย คุณภาพการพิมพ์ไม่ดี',
    requestDate: '2024-02-20T09:00:00Z',
    reportedBy: 'นายสมชาย ใจดี',
    repairStatus: 'external-repair', // แก้จาก completed
  },
];