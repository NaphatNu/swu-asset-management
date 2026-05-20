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
import type { Asset } from '@/types/asset';

interface InspectionFormProps {
    defaultSerialNumber?: string;
    onSubmit: (data: InspectionFormValues) => void;
    isSubmitting?: boolean;
}

export function InspectionForm({ defaultSerialNumber, onSubmit, isSubmitting }: InspectionFormProps) {
    const [isLoadingAsset, setIsLoadingAsset] = useState(false);
    const [isNotFound, setIsNotFound] = useState(false);

    // 1. เพิ่ม State สำหรับเก็บข้อมูล Asset เต็มรูปแบบและ Index ของชิ้นส่วนย่อยที่เลือก
    const [asset, setAsset] = useState<Asset | null>(null);
    const [selectedSubItemIdx, setSelectedSubItemIdx] = useState<string>('none');

    const router = useRouter();

    const { register, handleSubmit, control, setValue, watch, reset, formState: { errors } } = useForm<InspectionFormValues>({
        resolver: zodResolver(inspectionFormSchema),
        defaultValues: {
            serialNumber: defaultSerialNumber || '',
            condition: 'normal',
            updateStatus: false,
        },
    });

    const watchSerialNumber = watch('serialNumber');
    const watchAssetName = watch('assetName');

    useEffect(() => {
        const fetchAsset = async () => {
            if (!watchSerialNumber || watchSerialNumber.length < 25) {
                setValue('assetName', '');
                setValue('assetId', '');
                setValue('mainSequenceNo', ''); // 👈 เพิ่มจุดเคลียร์ค่า
                setAsset(null);
                setSelectedSubItemIdx('none');
                setIsNotFound(false);
                return;
            }

            setIsLoadingAsset(true);
            setIsNotFound(false);
            setValue('assetName', '');
            setValue('assetId', '');
            setValue('mainSequenceNo', ''); // 👈 เพิ่มจุดเคลียร์ค่า

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
                setValue('mainSequenceNo', ''); // 👈 เพิ่มจุดเคลียร์ค่า
                console.error('Error fetching asset:', error);
                if (error === 404) setIsNotFound(true);
            } finally {
                setIsLoadingAsset(false);
            }
        };
        const timer = setTimeout(fetchAsset, 500);
        return () => clearTimeout(timer);
    }, [watchSerialNumber, setValue]);

    // 2. ฟังก์ชันจัดการตอนเปลี่ยนชิ้นส่วนย่อยเพื่อ Auto-fill ลง Form ข้อมูลส่งฐานข้อมูล
    const handleSubItemChange = (value: string) => {
        setSelectedSubItemIdx(value);

        if (value === 'none' || !asset?.subItems) {
            // ถ้าเลือก "ไม่ใส่" ให้ล้างค่าลำดับและชื่อชิ้นส่วนย่อยใน Form
            setValue('itemSequenceNo', undefined);
            setValue('itemSequenceName', undefined);
        } else {
            // ถ้าเลือกชิ้นส่วน ให้ดึงข้อมูลชิ้นนั้นไปฝังในฟอร์มสำหรับการ Submit
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
                    <CardTitle className="text-lg">บันทึกการตรวจสภาพ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">

                    {/* ค้นหาครุภัณฑ์ */}
                    <div className="space-y-2">
                        <Label htmlFor="serialNumber">รหัสครุภัณฑ์ *</Label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Input
                                    id="serialNumber"
                                    placeholder="ระบุรหัสครุภัณฑ์เพื่อตรวจสภาพ"
                                    className="font-mono pr-10"
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

                    {/* จุดแสดงผลแบนเนอร์สีเขียว พบครุภัณฑ์ในระบบ */}
                    {watchAssetName && (
                        <div className="rounded-lg border border-emerald-500/20 bg-emerald-50 p-3 space-y-1 animate-in fade-in zoom-in-95">
                            <p className="text-xs text-emerald-700 font-semibold">พบครุภัณฑ์ในระบบ:</p>
                            <div className="flex items-center gap-2 flex-wrap">
                                <p className="text-sm font-bold text-emerald-900">{watchAssetName}</p>

                                {/* 🔵 แสดงลำดับชุดหลัก (เช่น ชุดหลักที่: 1) */}
                                {watch('mainSequenceNo') && (
                                    <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-md font-medium">
                                        ชุดหลักที่: {watch('mainSequenceNo')}
                                    </span>
                                )}

                                {/* 🟢 แสดงชิ้นส่วนย่อยหากมีการเลือกเกิดขึ้น */}
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

                    {/* 3. ส่วนการเลือกชิ้นส่วนย่อย (Sub Items) */}
                    {asset && (
                        <div className="space-y-2 bg-muted/40 border p-3 rounded-lg animate-in fade-in duration-200">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="subItemSelector" className="text-muted-foreground font-semibold">
                                    เลือกชิ้นส่วนที่ต้องการตรวจสภาพ
                                </Label>
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
                                        <SelectItem value="normal">ปกติ (NORMAL)</SelectItem>
                                        <SelectItem value="minor-damage">ชำรุดเล็กน้อย (MINOR DAMAGE)</SelectItem>
                                        <SelectItem value="major-damage">ชำรุดหนัก (MAJOR DAMAGE)</SelectItem>
                                        <SelectItem value="critical">ขั้นวิกฤต (CRITICAL)</SelectItem>
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
                                เปลี่ยนสถานะครุภัณฑ์อัตโนมัติ (เช่น เป็น 'ส่งซ่อม' หากชำรุดหนัก)
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
                <Button type="button" variant="outline" onClick={() => {
                    reset();
                    setAsset(null);
                    setSelectedSubItemIdx('none');
                    setValue('mainSequenceNo', '');
                }}>ยกเลิก</Button>
                <Button type="submit" disabled={isSubmitting || isLoadingAsset}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSubmitting ? 'กำลังส่ง...' : 'บันทึกการตรวจสภาพ'}
                </Button>
            </div>
        </form>
    );
}