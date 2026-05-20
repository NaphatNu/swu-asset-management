'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

import { repairFormSchema, type RepairFormValues } from '@/lib/validations';
import { repairStatusLabels } from '@/constants/asset';
import { getAssetBySerialNumber } from '@/lib/api';
import type { Asset } from '@/types/asset';

interface RepairFormProps {
  defaultSerialNumber?: string;
  onSubmit: (data: RepairFormValues) => void;
  isSubmitting?: boolean;
}

export function RepairForm({
  defaultSerialNumber,
  onSubmit,
  isSubmitting,
}: RepairFormProps) {
  const [isLoadingAsset, setIsLoadingAsset] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);

  // 1. เพิ่ม State เก็บข้อมูลครุภัณฑ์และ Index ของชิ้นส่วนย่อยที่ถูกเลือกตรวจสภาพ
  const [asset, setAsset] = useState<Asset | null>(null);
  const [selectedSubItemIdx, setSelectedSubItemIdx] = useState<string>('none');

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<RepairFormValues>({
    resolver: zodResolver(repairFormSchema),
    defaultValues: {
      serialNumber: defaultSerialNumber || '',
      description: '',
      repairStatus: 'open',
      type: 'internal-repair',
    },
  });

  const watchSerialNumber = watch('serialNumber');
  const watchAssetName = watch('assetName');

  useEffect(() => {
    const fetchAsset = async () => {
      if (!watchSerialNumber || watchSerialNumber.length < 25) {
        console.log('รหัสสั้นเกินไป, ล้างค่า Asset');
        setValue('assetName', '');
        setValue('assetId', '');
        setValue('mainSequenceNo', '');
        setAsset(null);
        setSelectedSubItemIdx('none');
        setIsNotFound(false);
        return;
      }

      setIsLoadingAsset(true);
      setIsNotFound(false);

      setValue('assetName', '');
      setValue('assetId', '');
      setValue('mainSequenceNo', '');

      try {
        const assetData = await getAssetBySerialNumber(watchSerialNumber);

        if (assetData) {
          setAsset(assetData);
          setValue('assetId', (assetData.id).toString());
          setValue('assetName', assetData.assetName);
          setValue('mainSequenceNo', assetData.mainSequenceNo || '');

          // 🔥 ตรวจสอบว่ามีชิ้นส่วนย่อยหรือไม่
          if (assetData.subItems && assetData.subItems.length > 0) {
            // วิ่งหา Index ของชิ้นส่วนย่อยที่มี itemSequenceNo น้อยที่สุด
            const lowestIdx = assetData.subItems.reduce((minIdx, currentItem, currentIdx, arr) =>
              currentItem.itemSequenceNo < arr[minIdx].itemSequenceNo ? currentIdx : minIdx
              , 0);

            const defaultItem = assetData.subItems[lowestIdx];

            // เซ็ตให้ชิ้นส่วนลำดับน้อยสุดเป็นค่าเริ่มต้นทันที
            setSelectedSubItemIdx(String(lowestIdx));
            setValue('itemSequenceNo', defaultItem.itemSequenceNo);
            setValue('itemSequenceName', defaultItem.itemSequenceName);
          } else {
            // ถ้าไม่มีชิ้นส่วนย่อย (เป็น 0) ให้เซ็ตกลับเป็นภาพรวมทั้งชุด
            setSelectedSubItemIdx('none');
            setValue('itemSequenceNo', undefined);
            setValue('itemSequenceName', undefined);
          }

          setIsNotFound(false);
        }
      } catch (error) {
        setAsset(null);
        setSelectedSubItemIdx('none');
        setValue('assetName', '');
        setValue('assetId', '');
        setValue('mainSequenceNo', '');
        console.error('Error fetching asset:', error);

        if (error === 404) {
          setIsNotFound(true);
        }
      } finally {
        setIsLoadingAsset(false);
      }
    };
    const timer = setTimeout(fetchAsset, 500);
    return () => clearTimeout(timer);
  }, [watchSerialNumber, setValue]);

  // 2. ฟังก์ชันจัดการเมื่อเจ้าหน้าที่สลับตัวเลือกว่าจะซ่อม "ทั้งชุด" หรือซ่อม "ชิ้นย่อย"
  const handleSubItemChange = (value: string) => {
    setSelectedSubItemIdx(value);

    if (value === 'none' || !asset?.subItems) {
      // แจ้งซ่อมภาพรวมของทั้งชุดครุภัณฑ์
      setValue('itemSequenceNo', undefined);
      setValue('itemSequenceName', undefined);
    } else {
      // ดึงข้อมูลลึกชิ้นส่วนย่อยนั้นไปหยอดเข้า Form state เพื่อส่งออก
      const idx = Number(value);
      const targetItem = asset.subItems[idx];
      if (targetItem) {
        setValue('itemSequenceNo', targetItem.itemSequenceNo);
        setValue('itemSequenceName', targetItem.itemSequenceName);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">ข้อมูลการแจ้งซ่อม</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">

          {/* Field: รหัสครุภัณฑ์ */}
          <div className="space-y-2">
            <Label htmlFor="serialNumber">รหัสครุภัณฑ์ *</Label>
            <div className="relative">
              <Input
                id="serialNumber"
                placeholder="เช่น 123-4567890123456789-4-56"
                className="font-mono"
                {...register('serialNumber')}
              />
              {isLoadingAsset && (
                <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>
            <p className="text-[0.8rem] text-muted-foreground">รูปแบบ: XXX-XXXXXXXXXXXXXXXX-X-XX</p>
            {errors.serialNumber && (
              <p className="text-sm font-medium text-destructive">{errors.serialNumber.message}</p>
            )}
          </div>

          {/* ชื่อครุภัณฑ์ที่ดึงมาพร้อม Tags สถานะกลุ่มหลัก/กลุ่มย่อย */}
          {watchAssetName && (
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-50 p-3 space-y-1 animate-in fade-in zoom-in-95">
              <p className="text-xs text-emerald-700 font-semibold">พบครุภัณฑ์ในระบบ:</p>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-bold text-emerald-900">{watchAssetName}</p>

                {/* แสดงลำดับชุดหลัก */}
                {watch('mainSequenceNo') && (
                  <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-md font-medium">
                    ชุดหลักที่: {watch('mainSequenceNo')}
                  </span>
                )}

                {/* แสดงชิ้นย่อยที่ระบุส่งซ่อม */}
                {selectedSubItemIdx !== 'none' && asset?.subItems?.[Number(selectedSubItemIdx)] && (
                  <span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded-md font-medium">
                    ชิ้นส่วน: {asset.subItems[Number(selectedSubItemIdx)].itemSequenceName}
                  </span>
                )}
              </div>
            </div>
          )}

          {isNotFound && !isLoadingAsset && !watchAssetName && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 animate-in fade-in slide-in-from-top-1">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <p className="text-sm font-bold">ไม่พบข้อมูลครุภัณฑ์นี้ในระบบ</p>
              </div>
              <p className="text-xs text-destructive/80 mt-1">กรุณาตรวจสอบรหัสครุภัณฑ์ใหม่อีกครั้ง</p>
            </div>
          )}

          {/* 3. เพิ่มบล็อก Select ชิ้นส่วนย่อยที่จะแจ้งซ่อม */}
          {asset && (
            <div className="space-y-2 bg-muted/40 border p-3 rounded-lg animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <Label htmlFor="subItemSelector" className="text-muted-foreground font-semibold">
                  เลือกชิ้นส่วนที่ต้องการแจ้งซ่อม
                </Label>
                {/* 🛠️ แก้ไขข้อความเตือนเมื่อไม่มีข้อมูลรายการย่อย */}
                {(!asset.subItems || asset.subItems.length === 0) && (
                  <span className="text-xs text-destructive font-normal">(ไม่มีรายการย่อย)</span>
                )}
              </div>
              <Select
                value={selectedSubItemIdx}
                onValueChange={handleSubItemChange}
                disabled={!asset.subItems || asset.subItems.length === 0}
              >
                <SelectTrigger
                  id="subItemSelector"
                  className={asset.subItems && asset.subItems.length > 0 ? "border-purple-500/30 focus:ring-purple-500 bg-background" : "bg-background"}
                >
                  <SelectValue placeholder="เลือกรายการย่อย" />
                </SelectTrigger>
                <SelectContent>
                  {asset.subItems?.map((item, idx) => (
                    <SelectItem key={idx} value={String(idx)}>
                      ลำดับที่ {item.itemSequenceNo} — {item.itemSequenceName || 'ไม่มีชื่อชิ้นส่วน'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Field: สถานะ */}
          <div className="space-y-2">
            <Label>สถานะการแจ้งซ่อม *</Label>
            <Controller
              control={control}
              name="repairStatus"
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกสถานะ" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(repairStatusLabels || {}).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.repairStatus && (
              <p className="text-sm font-medium text-destructive">{errors.repairStatus.message}</p>
            )}
          </div>

          {/* Field: รายละเอียดปัญหา */}
          <div className="space-y-2">
            <Label htmlFor="description">รายละเอียดปัญหา *</Label>
            <Textarea
              id="description"
              placeholder="อธิบายอาการเสีย..."
              className="min-h-[120px] resize-none"
              {...register('description')}
            />
            {errors.description && (
              <p className="text-sm font-medium text-destructive">{errors.description.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => {
          reset();
          setAsset(null);
          setSelectedSubItemIdx('none');
          setValue('mainSequenceNo', '');
        }}>
          ยกเลิก
        </Button>
        <Button type="submit" disabled={isSubmitting || isLoadingAsset}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? 'กำลังส่ง...' : 'ส่งแจ้งซ่อม'}
        </Button>
      </div>
    </form>
  );
}