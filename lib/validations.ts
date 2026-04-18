import { z } from 'zod';

export const assetFormSchema = z.object({
  assetId: z
    .string()
    .min(1, 'กรุณากรอกรหัสครุภัณฑ์')
    .regex(/^\d{4}-\d{3}-\d{4}$/, 'รูปแบบรหัสครุภัณฑ์ไม่ถูกต้อง (เช่น 7440-001-0001)'),
  name: z
    .string()
    .min(1, 'กรุณากรอกชื่อครุภัณฑ์')
    .max(200, 'ชื่อครุภัณฑ์ต้องไม่เกิน 200 ตัวอักษร'),
  category: z.enum(['computer', 'furniture', 'equipment', 'vehicle', 'other'], {
    errorMap: () => ({ message: 'กรุณาเลือกประเภทครุภัณฑ์' }),
  }),
  location: z.string().min(1, 'กรุณากรอกสถานที่'),
  status: z.enum(['available', 'on-loan', 'internal-repair', 'external-repair', 'pending-disposal', 'missing', 'disposed'], {
    errorMap: () => ({ message: 'กรุณาเลือกสถานะ' }),
  }),
  description: z.string().max(500, 'คำอธิบายต้องไม่เกิน 500 ตัวอักษร').optional(),
  purchaseDate: z.string().optional(),
  purchasePrice: z.coerce
    .number()
    .min(0, 'ราคาต้องไม่ติดลบ')
    .optional()
    .or(z.literal('')),
  warrantyExpiry: z.string().optional(),
});

export type AssetFormValues = z.infer<typeof assetFormSchema>;

export const repairFormSchema = z.object({
  assetId: z
    .string()
    .min(1, 'กรุณากรอกรหัสครุภัณฑ์')
    .regex(/^\d{4}-\d{3}-\d{4}$/, 'รูปแบบรหัสครุภัณฑ์ไม่ถูกต้อง'),
  description: z
    .string()
    .min(10, 'กรุณาอธิบายปัญหาอย่างน้อย 10 ตัวอักษร')
    .max(1000, 'คำอธิบายต้องไม่เกิน 1000 ตัวอักษร'),
  priority: z.enum(['low', 'medium', 'high', 'urgent'], {
    errorMap: () => ({ message: 'กรุณาเลือกระดับความเร่งด่วน' }),
  }),
});

export type RepairFormValues = z.infer<typeof repairFormSchema>;

export const qrGeneratorSchema = z.object({
  assetId: z
    .string()
    .min(1, 'กรุณากรอกรหัสครุภัณฑ์')
    .regex(/^\d{4}-\d{3}-\d{4}$/, 'รูปแบบรหัสครุภัณฑ์ไม่ถูกต้อง'),
});

export type QRGeneratorValues = z.infer<typeof qrGeneratorSchema>;
