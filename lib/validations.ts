import { sub } from 'date-fns';
import { it } from 'node:test';
import { z } from 'zod';

export const assetSubItemSchema = z.object({
  itemSequenceNo: z.coerce.number().int().min(1, 'กรุณาระบุลำดับย่อย'),
  itemSequenceName: z.string().min(1, 'กรุณาระบุชื่อรายการย่อย'),
});

export const assetFormSchema = z.object({
  mainSerialNumber: z
    .string()
    .min(1, 'กรุณากรอกรหัสครุภัณฑ์')
    .regex(/^\d{12}-\d{4}$/, 'รูปแบบรหัสครุภัณฑ์ไม่ถูกต้อง (เช่น 123456789123-1234)'),
  serialNumber: z
    .string()
    .min(1, 'กรุณากรอกรหัสครุภัณฑ์')
    .regex(/^\d{3}-\d{16}-\d{1}-\d{2}$/, 'รูปแบบรหัสครุภัณฑ์ไม่ถูกต้อง (เช่น 123-4567890123456789-4-56)'),
  assetName: z
    .string()
    .min(1, 'กรุณากรอกชื่อครุภัณฑ์')
    .max(200, 'ชื่อครุภัณฑ์ต้องไม่เกิน 200 ตัวอักษร'),

  fiscalYear: z.string().regex(/^\d{2}$/, 'ปีงบประมาณต้องเป็นตัวเลข 2 หลักเท่านั้น'),
  location: z.string().optional(),

  status: z.enum(['available', 'in-use', 'under-repair', 'lost', 'pending-disposal', 'disposed'], {
    errorMap: () => ({ message: 'กรุณาเลือกสถานะ' }),
  }),
  condition: z.enum(['normal', 'minor-damage', 'major-damage', 'critical'], {
    errorMap: () => ({ message: 'กรุณาเลือกสภาพ' }),
  }).optional(),
  ownerName: z.string().optional(),
  acquiredDate: z.string().optional(),
  mainSequenceNo: z.string().min(1, 'กรุณาระบุลำดับหลัก'),
  // itemSequenceNo: z.coerce.number().int().min(1, 'กรุณาระบุลำดับรายการ'),
  // itemSequenceName: z.string().min(1, 'กรุณาระบุชื่อรายการ'),
  subItems: z.array(assetSubItemSchema).optional(),


});

export type AssetFormValues = z.infer<typeof assetFormSchema>;

export const inspectionFormSchema = z.object({
  assetName: z.string().optional(),
  assetId: z.string(),
  serialNumber: z
    .string()
    .min(1, 'กรุณากรอกรหัสครุภัณฑ์')
    .regex(/^\d{3}-\d{16}-\d{1}-\d{2}$/, 'รูปแบบรหัสครุภัณฑ์ไม่ถูกต้อง (เช่น 123-4567890123456789-4-56)'),
  condition: z.enum(['normal', 'minor-damage', 'major-damage', 'critical'], {
    errorMap: () => ({ message: 'กรุณาเลือกสภาพ' }),
  }),
  note: z.string().max(1000, 'หมายเหตุต้องไม่เกิน 1000 ตัวอักษร').optional(),
  updateStatus: z.boolean().default(false),
  mainSequenceNo: z.string().optional().nullable(),
  itemSequenceNo: z.number().int().optional().nullable(),
  itemSequenceName: z.string().optional().nullable(),
  subItems: z.array(assetSubItemSchema).optional(),
});

export type InspectionFormValues = z.infer<typeof inspectionFormSchema>;

export const repairFormSchema = z.object({
  assetId: z.string().optional(),
  assetName: z.string().optional(),
  serialNumber: z
    .string()
    .min(1, 'กรุณากรอกรหัสครุภัณฑ์')
    .regex(/^\d{3}-\d{16}-\d{1}-\d{2}$/, 'รูปแบบรหัสครุภัณฑ์ไม่ถูกต้อง'),
  description: z
    .string()
    .min(5, 'กรุณาอธิบายปัญหาอย่างน้อย 5 ตัวอักษร')
    .max(1000, 'คำอธิบายต้องไม่เกิน 1000 ตัวอักษร'),
  repairStatus: z.enum(['open', 'in-progress', 'completed']),
  type: z.enum(['internal-repair', 'external-repair']),
  mainSequenceNo: z.string().optional().nullable(),
  itemSequenceNo: z.number().int().optional().nullable(),
  itemSequenceName: z.string().optional().nullable(),
  subItems: z.array(assetSubItemSchema).optional(),
});

export type RepairFormValues = z.infer<typeof repairFormSchema>;

export const qrGeneratorSchema = z.object({
  assetCode: z
    .string()
    .min(1, 'กรุณากรอกรหัสครุภัณฑ์')
    .regex(/^\d{3}-\d{16}-\d{1}-\d{2}$/, 'รูปแบบรหัสครุภัณฑ์ไม่ถูกต้อง'),
  fiscalYear: z.string().min(1, 'กรุณาระบุปีงบประมาณ'),
  mainSequenceNo: z.string().min(1, 'กรุณาระบุลำดับหลัก'),
  itemSequenceName: z.string().min(1, 'กรุณาระบุชื่อรายการ'),
  itemSequenceNo: z.coerce.number().int().min(1, 'กรุณาระบุลำดับรายการ'),
  printSize: z.enum(['small', 'medium', 'large']),
});

export type QRGeneratorValues = z.infer<typeof qrGeneratorSchema>;

