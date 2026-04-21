'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';

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
import { repairStatusLabels, statusLabels } from '@/constants/asset';
import { getAssetBySerialNumber } from '@/lib/api';

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
      name: '',
      description: '',
      repairStatus: 'internal-repair',
    },
  });

  const watchSerialNumber = watch('serialNumber');
  const watchAssetName = watch('name');

  useEffect(() => {
    const fetchAsset = async () => {
      if (watchSerialNumber && watchSerialNumber.length >= 5) {
        setIsLoadingAsset(true);
        try {
          const assetData = await getAssetBySerialNumber(watchSerialNumber);
          setValue('name', assetData?.name || '');
        } catch (error) {
          setValue('name', '');
        } finally {
          setIsLoadingAsset(false);
        }
      } else {
        setValue('name', '');
      }
    };

    const timeoutId = setTimeout(fetchAsset, 500);
    return () => clearTimeout(timeoutId);
  }, [watchSerialNumber, setValue]);

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
                {...register('serialNumber')} // ใช้ register ตรงๆ
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

          {/* ชื่อครุภัณฑ์ที่ดึงมา */}
          {watchAssetName && (
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-50 p-3 space-y-1 animate-in fade-in zoom-in-95">
              <p className="text-xs text-emerald-700 font-semibold">พบครุภัณฑ์ในระบบ:</p>
              <p className="text-sm font-bold text-emerald-900">{watchAssetName}</p>
            </div>
          )}

          {/* Field: สถานะ (ต้องใช้ Controller เพราะ Select ไม่ใช่ Native Input) */}
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
              {...register('description')} // ใช้ register ตรงๆ
            />
            {errors.description && (
              <p className="text-sm font-medium text-destructive">{errors.description.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => reset()}>
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