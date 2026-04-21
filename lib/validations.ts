import { z } from 'zod';

export const assetFormSchema = z.object({
  mainSerialNumber: z
    .string()
    .min(1, 'กรุณากรอกรหัสครุภัณฑ์')
    .regex(/^\d{12}-\d{4}$/, 'รูปแบบรหัสครุภัณฑ์ไม่ถูกต้อง (เช่น 123456789123-1234)'),
  serialNumber: z
    .string()
    .min(1, 'กรุณากรอกรหัสครุภัณฑ์')
    .regex(/^\d{3}-\d{16}-\d{1}-\d{2}$/, 'รูปแบบรหัสครุภัณฑ์ไม่ถูกต้อง (เช่น 123-4567890123456789-4-56)'),
  name: z
    .string()
    .min(1, 'กรุณากรอกชื่อครุภัณฑ์')
    .max(200, 'ชื่อครุภัณฑ์ต้องไม่เกิน 200 ตัวอักษร'),
  owner: z.string().optional(),
  acquiredDate: z.string().optional(),
  // Category: z.enum(['computer', 'furniture', 'equipment', 'vehicle', 'other'], {
  //   errorMap: () => ({ message: 'กรุณาเลือกประเภทครุภัณฑ์' }),
  // }),
  location: z.string().min(1, 'กรุณากรอกสถานที่'),
  status: z.enum(['available', 'on-loan', 'internal-repair', 'external-repair', 'pending-disposal', 'missing', 'disposed'], {
    errorMap: () => ({ message: 'กรุณาเลือกสถานะ' }),
  }),
  // description: z.string().max(500, 'คำอธิบายต้องไม่เกิน 500 ตัวอักษร').optional(),
  // purchaseDate: z.string().optional(),
  // purchasePrice: z.coerce
  //   .number()
  //   .min(0, 'ราคาต้องไม่ติดลบ')
  //   .optional()
  //   .or(z.literal('')),
  // warrantyExpiry: z.string().optional(),
});

export type AssetFormValues = z.infer<typeof assetFormSchema>;

export const repairFormSchema = z.object({
  name: z.string().optional(),
  serialNumber: z
    .string()
    .min(1, 'กรุณากรอกรหัสครุภัณฑ์')
    .regex(/^\d{3}-\d{16}-\d{1}-\d{2}$/, 'รูปแบบรหัสครุภัณฑ์ไม่ถูกต้อง'),
  description: z
    .string()
    .min(5, 'กรุณาอธิบายปัญหาอย่างน้อย 5 ตัวอักษร')
    .max(1000, 'คำอธิบายต้องไม่เกิน 1000 ตัวอักษร'),
  repairStatus: z.enum(['internal-repair', 'external-repair']),
  // priority: z.enum(['low', 'medium', 'high', 'urgent'], {
  //   errorMap: () => ({ message: 'กรุณาเลือกระดับความเร่งด่วน' }),
  // }),
});

export type RepairFormValues = z.infer<typeof repairFormSchema>;

export const qrGeneratorSchema = z.object({
  serialNumber: z
    .string()
    .min(1, 'กรุณากรอกรหัสครุภัณฑ์')
    .regex(/^\d{4}-\d{3}-\d{4}$/, 'รูปแบบรหัสครุภัณฑ์ไม่ถูกต้อง'),
});

export type QRGeneratorValues = z.infer<typeof qrGeneratorSchema>;
