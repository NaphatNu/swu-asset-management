import type { RepairRequest } from '@/types/asset';
export const mockRepairRequests: RepairRequest[] = [
  {
            id: "001",
            assetId: "10",
            serialNumber: "207-3000000378680000-2-64",
            assetName: "Dell Monitor 01",
            description: "หน้าจอเปิดไม่ติด",
            status: "open",
            type: "internal-repair",
            reportedByName: "John Doe",
            createdAt: "2024-03-20T10:00:00Z"
        },
        {
            id: "002",
            assetId: "11",
            serialNumber: "207-3000000378680000-2-64",
            assetName: "Dell Monitor 02",
            description: "หน้าจอเปิดไม่ติด",
            status: "in-progress",
            type: "internal-repair",
            reportedByName: "John Doe",
            createdAt: "2024-03-20T10:00:00Z"
        },
        {
            id: "003",
            assetId: "12",
            serialNumber: "207-3000000378680000-2-64",
            assetName: "Dell Monitor 03",
            description: "หน้าจอเปิดไม่ติด",
            status: "completed",
            type: "external-repair",
            reportedByName: "John Doe",
            createdAt: "2024-03-20T10:00:00Z"
        }
];