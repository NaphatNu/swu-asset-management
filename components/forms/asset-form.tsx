'use client';

import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { CalendarIcon, Check, ChevronsUpDown, Plus, ScanLine, Trash2 } from 'lucide-react';
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
import { statusLabels, locationOptions, conditionLabels } from '@/constants/asset';
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
      assetName: '',
      location: '',
      status: 'available',
      condition: 'normal',
      ownerName: '',
      acquiredDate: '',
      fiscalYear: '',
      mainSequenceNo: '',
      subItems: [],
      ...defaultValues,
    },
  });

  const router = useRouter();

  const { fields: subItemFields, append: appendSubItem, remove: removeSubItem } = useFieldArray({
    control,
    name: 'subItems',
  });

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

      if (parts.length >= 4) {
        const fiscalYear = parts[3];
        setValue('fiscalYear', fiscalYear, { shouldValidate: true });
      }
    }
  }, [serialNumberValue, setValue]);

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log("❌ Validation Errors:", errors);
    }
  }, [errors]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">ข้อมูลพื้นฐาน</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">

          {/* Serial Number */}
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

          {/* Main Serial Number */}
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

          {/* Asset Name */}
          <div>
            <label>ชื่อรายการครุภัณฑ์ *</label>
            <Input {...register('assetName')} />
            {errors.assetName && (
              <p className="text-sm font-medium text-destructive">{errors.assetName.message}</p>
            )}
          </div>

          <section className="grid gap-4 sm:grid-cols-2">
            <div>
              <label>ปีงบประมาณ *</label>
              <Input {...register('fiscalYear')} placeholder="เช่น 69" />
              {errors.fiscalYear && (
                <p className="text-sm font-medium text-destructive">{errors.fiscalYear.message}</p>
              )}
            </div>
            <div>
              <label>ลำดับรายการหลัก *</label>
              <Input type="number" min={0} {...register('mainSequenceNo')} placeholder="เช่น 1" />
              {errors.mainSequenceNo && (
                <p className="text-sm font-medium text-destructive">{errors.mainSequenceNo.message}</p>
              )}
            </div>
          </section>

          {/* Location */}
          <div>
            <label className="text-sm font-medium">สถานที่</label>
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

          

          {/* Condition */}
          <div>
            <label>สภาพ *</label>
            <Controller
              control={control}
              name="condition"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกสภาพ" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(conditionLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-lg">รายการย่อย</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              appendSubItem({
                itemSequenceNo: subItemFields.length + 1,
                itemSequenceName: '',
              })
            }
          >
            <Plus className="mr-1 size-4" />
            เพิ่มรายการย่อย
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {subItemFields.length === 0 ? (
            <p className="text-sm text-muted-foreground">ยังไม่มีรายการย่อย (ไม่บังคับ)</p>
          ) : (
            subItemFields.map((field, index) => (
              <div key={field.id} className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <label>ลำดับรายการย่อย *</label>
                  <Input
                    type="number"
                    min={1}
                    {...register(`subItems.${index}.itemSequenceNo` as const)}
                  />
                </div>
                <fieldset className="min-w-0 flex-[2] border-0 p-0 m-0">
                  <label>ชื่อรายการย่อย *</label>
                  <Input {...register(`subItems.${index}.itemSequenceName` as const)} />
                </fieldset>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive shrink-0"
                  onClick={() => removeSubItem(index)}
                  aria-label="ลบรายการย่อย"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))
          )}
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