'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { CalendarIcon, Check, ChevronsUpDown, ScanLine } from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { categoryLabels, statusLabels, locationOptions } from '@/constants/asset';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
    formState: { errors },
  } = useForm<AssetFormValues>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: {
      mainSerialNumber: '',
      serialNumber: '',
      name: '',
      owner: '',
      acquiredDate: '',
      // category: undefined,
      location: '',
      status: 'available',
      // description: '',
      // purchaseDate: '',
      // purchasePrice: undefined,
      // warrantyExpiry: '',
      ...defaultValues,
    },
  });

  const router = useRouter();

  // 1. เฝ้าดูการเปลี่ยนแปลงของ serialNumber
  const serialNumberValue = watch('serialNumber');

  useEffect(() => {
    if (serialNumberValue) {
      // แยกข้อความด้วย "-"
      const parts = serialNumberValue.split('-');

      // ตรวจสอบว่ามีส่วนที่ 2 (index 1) หรือไม่
      if (parts.length >= 2) {
        const rawMainSerial = parts[1]; // ได้ค่า "3000000378580000"

        // ถ้าต้องการใส่ขีดกลาง (dash) ให้ตรงตามรูปแบบ "หลัก-ย่อย" (12 หลักแรก - 4 หลักหลัง)
        if (rawMainSerial.length >= 16) {
          const main = rawMainSerial.substring(0, 12);
          const sub = rawMainSerial.substring(12, 16);
          const formatted = `${main}-${sub}`;

          // 2. อัปเดตค่าลงใน mainSerialNumber อัตโนมัติ
          setValue('mainSerialNumber', formatted, { shouldValidate: true });
        } else {
          // กรณีเลขไม่ครบ 16 หลัก แต่อยากให้แสดงค่าเท่าที่มีไปก่อน
          setValue('mainSerialNumber', rawMainSerial, { shouldValidate: true });
        }
      }
    }
  }, [serialNumberValue, setValue]);

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
            <label>รหัสครุภัณฑ์เดิม / Serial Number *</label>
            <div className="flex gap-2">
              <Input
                disabled={lockAssetId}
                placeholder='เช่น 123-4567890123456789-4-56'
                className="font-mono"
                {...register('serialNumber')}
              />
              {!lockAssetId && (
                <Button type="button" variant="outline" size="icon" onClick={() => router.push('/search')} >
                  <ScanLine className="size-4" />
                </Button>
              )}

            </div>
            {errors.serialNumber && (
              <p className="text-sm font-medium text-destructive">{errors.serialNumber.message}</p>
            )}
          </div>

          {/* Serial number */}
          <div>
            <label>หมายเลขครุภัณฑ์ หลัก-ย่อย *</label>
            <Input
              disabled={lockAssetId}
              placeholder='เช่น 123456789123-1234'
              className="font-mono"
              {...register('mainSerialNumber')}
            />
            {errors.mainSerialNumber && (
              <p className="text-sm font-medium text-destructive">{errors.mainSerialNumber.message}</p>
            )}
          </div>

          {/* Name */}
          <div>
            <label>รายการครุภัณฑ์ *</label>
            <Input {...register('name')} />
            {errors.name && (
              <p className="text-sm font-medium text-destructive">{errors.name.message}</p>
            )}
          </div>


          {/* Location */}
          <div>
            <label className="text-sm font-medium">สถานที่ *</label>
            <Controller
              control={control}
              name="location"
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? locationOptions.find((loc) => loc === field.value)
                        : "เลือกหรือค้นหาสถานที่..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                      <CommandInput placeholder="พิมพ์เพื่อค้นหาเลขห้อง..." />
                      <CommandList> {/* ตรวจสอบว่ามีตัวนี้ครอบ Group */}
                        <CommandEmpty>ไม่พบสถานที่นี้</CommandEmpty>
                        <CommandGroup>
                          {locationOptions.map((loc) => (
                            <CommandItem
                              key={loc}
                              // สำคัญ: value ของ CommandItem ใช้สำหรับ Search 
                              // ถ้าใส่ภาษาไทยลงไปตรงๆ บางครั้ง cmdk จะมีปัญหากับการ Subscribe สเตต
                              value={loc}
                              onSelect={() => {
                                field.onChange(loc); // อัปเดตค่าเข้า react-hook-form
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  loc === field.value ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {loc}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.location && (
              <p className="text-sm font-medium text-destructive">{errors.location.message}</p>
            )}
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

          {/* Category
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
          </div> */}



          {/* Description */}
          {/* <div>
            <label>รายละเอียด</label>
            <Textarea {...register('description')} />
          </div> */}

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
              name="acquiredDate"
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
                      onSelect={(date) => {
                        // ใช้ format แทน toISOString เพื่อให้ได้วันที่ตามเครื่องผู้ใช้ (Local Time)
                        const formattedDate = date ? format(date, 'yyyy-MM-dd') : "";
                        field.onChange(formattedDate);
                      }}
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
          </div>

          {/* Price */}
          {/* <div>
            <label>ราคา</label>
            <Input
              type="number"
              {...register('purchasePrice')}
            />
          </div> */}

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