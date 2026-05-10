'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Pencil, History, Info, Package, User } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/layout';
import { AssetForm } from '@/components/forms';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { getAssetBySerialNumber, updateAsset } from '@/lib/api';
import type { Asset } from '@/types/asset';
import type { AssetFormValues } from '@/lib/validations';
import { ConditionBadge, StatusBadge } from '@/components/assets/status-badge';

/**
 * Helper สำหรับ Format วันที่และเวลาภาษาไทย
 * @param dateStr ISO Date String
 * @param includeTime รวมเวลาด้วยหรือไม่
 */
const formatThaiDate = (dateStr?: string | null, includeTime = false) => {
  if (!dateStr) return '—';
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('th-TH', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      ...(includeTime && {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }),
    }).format(date);
  } catch (e) {
    return dateStr;
  }
};

function assetToFormValues(asset: Asset): AssetFormValues {
  return {
    mainSerialNumber: asset.mainSerialNumber,
    serialNumber: asset.serialNumber,
    assetName: asset.assetName,
    ownerName: asset.ownerName,
    acquiredDate: asset.acquiredDate,
    location: asset.location,
    status: asset.status,
    condition: asset.condition,
  };
}

export default function AssetDetailPage() {
  const params = useParams();
  const serialNumber = typeof params.serialNumber === 'string' 
    ? decodeURIComponent(params.serialNumber) 
    : '';

  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    if (!serialNumber) {
      setLoading(false);
      setNotFound(true);
      return;
    }
    setLoading(true);
    try {
      const data = await getAssetBySerialNumber(serialNumber);
      if (!data) setNotFound(true);
      else setAsset(data);
    } catch {
      setNotFound(true);
      toast.error('โหลดข้อมูลไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  }, [serialNumber]);

  useEffect(() => { void load(); }, [load]);

  const handleUpdate = async (data: AssetFormValues) => {
    if (!serialNumber) return;
    setSubmitting(true);
    try {
      const updated = await updateAsset(serialNumber, data);
      setAsset(updated);
      setEditOpen(false);
      toast.success('บันทึกข้อมูลแล้ว');
    } catch {
      toast.error('บันทึกไม่สำเร็จ');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8"><Skeleton className="h-8 w-48 mb-4" /><Skeleton className="h-64 w-full" /></div>;

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-xl font-semibold">ไม่พบข้อมูลครุภัณฑ์</p>
        <Button asChild className="mt-4"><Link href="/search">กลับไปหน้าค้นหา</Link></Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={asset?.assetName || 'รายละเอียดครุภัณฑ์'}
        description={`รหัสครุภัณฑ์: ${asset?.serialNumber}`}
      >
        <Button variant="ghost" asChild>
          <Link href="/search"><ArrowLeft className="mr-2 size-4" /> กลับ</Link>
        </Button>
      </PageHeader>

      {asset && (
        <>
          <div className="flex gap-2">
            <Button onClick={() => setEditOpen(true)}><Pencil className="mr-2 size-4" /> แก้ไขข้อมูล</Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* 1. ข้อมูลหลัก (Main Info) */}
            <Card className="shadow-sm border-l-4 border-l-primary">
              <CardHeader className="flex flex-row items-center space-x-2 pb-2">
                <Package className="size-4 text-primary" />
                <CardTitle className="text-base font-bold">ข้อมูลครุภัณฑ์</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-y-3 text-sm">
                <DetailRow label="ชื่อครุภัณฑ์" value={asset.assetName} bold />
                <DetailRow label="รหัสครุภัณฑ์ (SN)" value={asset.serialNumber} mono />
                <DetailRow label="รหัสหลัก (Main SN)" value={asset.mainSerialNumber} mono />
                <DetailRow label="สถานะ" value={<StatusBadge status={asset.status} />} />
                <DetailRow 
                  label="สภาพเครื่อง" 
                  value={<ConditionBadge condition={asset.condition} />}
                />
              </CardContent>
            </Card>

            {/* 2. สถานที่และการจัดซื้อ */}
            <Card className="shadow-sm border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center space-x-2 pb-2">
                <Info className="size-4 text-blue-500" />
                <CardTitle className="text-base font-bold">สถานที่และความรับผิดชอบ</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-y-3 text-sm">
                <DetailRow label="สถานที่ตั้ง" value={asset.location} />
                <DetailRow label="ผู้รับผิดชอบ" value={asset.ownerName || '—'} />
                <DetailRow label="วันที่จัดซื้อ" value={formatThaiDate(asset.acquiredDate)} />
              </CardContent>
            </Card>

            {/* 3. ประวัติการบันทึก (Audit Trail) */}
            <Card className="md:col-span-2 border-dashed bg-muted/20 shadow-none">
              <CardHeader className="flex flex-row items-center space-x-2 pb-2">
                <History className="size-4 text-muted-foreground" />
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">ประวัติการทำรายการ</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2 text-xs">
                <div className="p-3 bg-background rounded-md border">
                  <p className="text-muted-foreground mb-1">ข้อมูลการสร้าง:</p>
                  <p className="font-medium flex items-center gap-1"><User className="size-3" /> {asset.createdByName}</p>
                  <p className="text-muted-foreground mt-1">{formatThaiDate(asset.createdAt, true)}</p>
                </div>
                <div className="p-3 bg-background rounded-md border">
                  <p className="text-muted-foreground mb-1">แก้ไขล่าสุดโดย:</p>
                  <p className="font-medium flex items-center gap-1"><User className="size-3" /> {asset.updatedByName}</p>
                  <p className="text-muted-foreground mt-1">{formatThaiDate(asset.updatedAt, true)}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>แก้ไขครุภัณฑ์</DialogTitle>
                <DialogDescription>อัปเดตข้อมูลให้เป็นปัจจุบัน</DialogDescription>
              </DialogHeader>
              <AssetForm
                key={asset.id}
                defaultValues={assetToFormValues(asset)}
                onSubmit={handleUpdate}
                isSubmitting={submitting}
                lockAssetId
                submitLabel="บันทึกการแก้ไข"
                onCancel={() => setEditOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}

/** Component ย่อยสำหรับจัดระเบียบ Row ข้อมูล */
function DetailRow({ 
  label, 
  value, 
  mono = false, 
  bold = false,
  valueClass = "" 
}: { 
  label: string; 
  value: any | null | undefined; 
  mono?: boolean; 
  bold?: boolean;
  valueClass?: string;
}) {
  return (
    <div className="flex justify-between items-start border-b border-muted py-1 last:border-0">
      <span className="text-muted-foreground shrink-0 mr-4">{label}:</span>
      <span className={`text-right ${mono ? 'font-mono text-[13px]' : ''} ${bold ? 'font-bold' : ''} ${valueClass}`}>
        {value || '—'}
      </span>
    </div>
  );
}