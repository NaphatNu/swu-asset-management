'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, ScanLine } from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

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
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { assetFormSchema, type AssetFormValues } from '@/lib/validations';
import { categoryLabels, statusLabels, locationOptions } from '@/lib/mock-data';

interface AssetFormProps {
  defaultValues?: Partial<AssetFormValues>;
  onSubmit: (data: AssetFormValues) => void;
  isSubmitting?: boolean;
  lockAssetId?: boolean;
  onCancel?: () => void;
  submitLabel?: string;
}

export function AssetForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  lockAssetId,
  onCancel,
  submitLabel,
}: AssetFormProps) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
  } = useForm<AssetFormValues>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: {
      assetId: '',
      name: '',
      category: undefined,
      location: '',
      status: 'available',
      description: '',
      purchaseDate: '',
      purchasePrice: undefined,
      warrantyExpiry: '',
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">ข้อมูลพื้นฐาน</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">

          {/* Asset ID */}
          <div>
            <label>รหัสครุภัณฑ์ *</label>
            <div className="flex gap-2">
              <Input
                {...register('assetId')}
                className="font-mono"
                disabled={lockAssetId}
              />
              {!lockAssetId && (
                <Button type="button" variant="outline" size="icon">
                  <ScanLine className="size-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Name */}
          <div>
            <label>ชื่อครุภัณฑ์ *</label>
            <Input {...register('name')} />
          </div>

          {/* Category */}
          <div>
            <label>ประเภท *</label>
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกประเภท" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Status */}
          <div>
            <label>สถานะ *</label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกสถานะ" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Location */}
          <div>
            <label>สถานที่ *</label>
            <Controller
              control={control}
              name="location"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกสถานที่" />
                  </SelectTrigger>
                  <SelectContent>
                    {locationOptions.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Description */}
          <div>
            <label>รายละเอียด</label>
            <Textarea {...register('description')} />
          </div>

        </CardContent>
      </Card>

      {/* Purchase */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">ข้อมูลการจัดซื้อ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">

          {/* Purchase Date */}
          <div>
            <label>วันที่จัดซื้อ</label>
            <Controller
              control={control}
              name="purchaseDate"
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">
                      {field.value
                        ? format(new Date(field.value), 'PPP', { locale: th })
                        : 'เลือกวันที่'}
                      <CalendarIcon className="ml-2 size-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Calendar
                      mode="single"
                      selected={
                        field.value ? new Date(field.value) : undefined
                      }
                      onSelect={(date) =>
                        field.onChange(date?.toISOString().split('T')[0])
                      }
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
          </div>

          {/* Price */}
          <div>
            <label>ราคา</label>
            <Input
              type="number"
              {...register('purchasePrice')}
            />
          </div>

        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          ยกเลิก
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'กำลังบันทึก...' : submitLabel ?? 'บันทึก'}
        </Button>
      </div>
    </form>
  );
}