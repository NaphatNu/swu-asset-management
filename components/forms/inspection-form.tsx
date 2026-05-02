'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, AlertCircle, ScanLine } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

import { getAssetBySerialNumber } from '@/lib/api';
import { inspectionFormSchema, type InspectionFormValues } from '@/lib/validations';
import { useRouter } from 'next/navigation';

interface InspectionFormProps {
    defaultSerialNumber?: string;
    onSubmit: (data: InspectionFormValues) => void;
    isSubmitting?: boolean;
}

export function InspectionForm({ defaultSerialNumber, onSubmit, isSubmitting }: InspectionFormProps) {
    const [isLoadingAsset, setIsLoadingAsset] = useState(false);
    const router = useRouter();

    const { register, handleSubmit, control, setValue, watch, reset, formState: { errors } } = useForm<InspectionFormValues>({
        resolver: zodResolver(inspectionFormSchema),
        defaultValues: {
            serialNumber: defaultSerialNumber || '',
            condition: 'NORMAL',
            updateStatus: false,
        },
    });

    const watchSerialNumber = watch('serialNumber');
    const watchAssetName = watch('assetName');

    // Logic การดึงข้อมูล Asset เมื่อพิมพ์ Serial Number
    useEffect(() => {
        const fetchAsset = async () => {
            if (watchSerialNumber && watchSerialNumber.length >= 5) {
                setIsLoadingAsset(true);
                try {
                    const assetData = await getAssetBySerialNumber(watchSerialNumber);
                    if (assetData) {
                        setValue('assetId', (assetData.id).toString());
                        setValue('assetName', assetData.assetName);
                    }
                } catch (error) {
                    setValue('assetName', '');
                } finally {
                    setIsLoadingAsset(false);
                }
            }
        };
        const timer = setTimeout(fetchAsset, 500);
        return () => clearTimeout(timer);
    }, [watchSerialNumber, setValue]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">บันทึกการตรวจสภาพ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">

                    {/* ค้นหาครุภัณฑ์ */}
                    <div className="space-y-2">
                        <Label htmlFor="serialNumber">รหัสครุภัณฑ์ *</Label>
                        <div className="flex gap-2"> {/* ใช้ Flex เพื่อให้ปุ่มสแกนอยู่ข้างๆ Input */}
                            <div className="relative flex-1">
                                <Input
                                    id="serialNumber"
                                    placeholder="ระบุรหัสครุภัณฑ์เพื่อตรวจสภาพ"
                                    className="font-mono pr-10" // เผื่อที่ด้านขวาไว้ให้ Spinner
                                    {...register('serialNumber')}
                                />
                                {isLoadingAsset && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                    </div>
                                )}
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => router.push('/search')}
                                title="สแกนรหัส"
                            >
                                <ScanLine className="size-4" />
                            </Button>
                        </div>

                        {errors.serialNumber && (
                            <p className="text-xs text-destructive">{errors.serialNumber.message}</p>
                        )}
                    </div>

                    {watchAssetName && (
                        <div className="rounded-lg border border-blue-500/20 bg-blue-50 p-3 animate-in fade-in slide-in-from-top-1">
                            <p className="text-xs text-blue-700 font-semibold">ทรัพย์สินที่เลือก:</p>
                            <p className="text-sm font-bold text-blue-900">{watchAssetName}</p>
                        </div>
                    )}

                    {/* เลือกสภาพ (Condition) */}
                    <div className="space-y-2">
                        <Label>สภาพที่ตรวจพบ *</Label>
                        <Controller
                            control={control}
                            name="condition"
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="เลือกสภาพ" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="NORMAL">ปกติ (NORMAL)</SelectItem>
                                        <SelectItem value="MINOR_DAMAGE">ชำรุดเล็กน้อย (MINOR DAMAGE)</SelectItem>
                                        <SelectItem value="MAJOR_DAMAGE">ชำรุดหนัก (MAJOR DAMAGE)</SelectItem>
                                        <SelectItem value="CRITICAL">ขั้นวิกฤต (CRITICAL)</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                    {/* รายละเอียด */}
                    <div className="space-y-2">
                        <Label htmlFor="note">บันทึกรายละเอียดการตรวจสภาพ *</Label>
                        <Textarea
                            id="note"
                            placeholder="ระบุสิ่งที่พบจากการตรวจสอบ เช่น รอยขีดข่วน, อุปกรณ์หลวม..."
                            className="min-h-[100px]"
                            {...register('note')}
                        />
                        {errors.note && <p className="text-xs text-destructive">{errors.note.message}</p>}
                    </div>

                    {/* อัปเดตสถานะอัตโนมัติ */}
                    <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
                        <div className="space-y-0.5">
                            <Label className="text-base">อัปเดตสถานะการใช้งาน</Label>
                            <p className="text-sm text-muted-foreground">
                                เปลี่ยนสถานะทรัพย์สินอัตโนมัติ (เช่น เป็น 'ส่งซ่อม' หากชำรุดหนัก)
                            </p>
                        </div>
                        <Controller
                            control={control}
                            name="updateStatus"
                            render={({ field }) => (
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            )}
                        />
                    </div>

                </CardContent>
            </Card>

            <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => reset()}>ยกเลิก</Button>
                <Button type="submit" disabled={isSubmitting || isLoadingAsset}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSubmitting ? 'กำลังส่ง...' : 'บันทึกการตรวจสภาพ'}
                </Button>
            </div>
        </form>
    );
}