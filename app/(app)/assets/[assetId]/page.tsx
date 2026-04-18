'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Pencil } from 'lucide-react';
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
import { getAssetByAssetId, updateAsset } from '@/lib/api';
import { categoryLabels, statusLabels } from '@/lib/mock-data';
import type { Asset } from '@/types/asset';
import type { AssetFormValues } from '@/lib/validations';

function assetToFormValues(asset: Asset): AssetFormValues {
  return {
    assetId: asset.assetId,
    name: asset.name,
    category: asset.category,
    location: asset.location,
    status: asset.status,
    description: asset.description ?? '',
    purchaseDate: asset.purchaseDate ?? '',
    purchasePrice:
      asset.purchasePrice === undefined || asset.purchasePrice === null
        ? ''
        : asset.purchasePrice,
    warrantyExpiry: asset.warrantyExpiry ?? '',
  };
}

function DetailSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-full max-w-md" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-24 rounded-lg" />
        <Skeleton className="h-24 rounded-lg" />
        <Skeleton className="h-24 rounded-lg sm:col-span-2" />
      </div>
    </div>
  );
}

export default function AssetDetailPage() {
  const params = useParams();
  const raw = params.assetId;
  const assetId =
    typeof raw === 'string'
      ? decodeURIComponent(raw)
      : Array.isArray(raw)
        ? decodeURIComponent(raw[0] ?? '')
        : '';

  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    if (!assetId) {
      setLoading(false);
      setNotFound(true);
      setAsset(null);
      return;
    }
    setLoading(true);
    setNotFound(false);
    try {
      const data = await getAssetByAssetId(assetId);
      console.log('data', data);
      if (!data) {
        setAsset(null);
        setNotFound(true);
      } else {
        setAsset(data);
        setNotFound(false);
      }
    } catch {
      setAsset(null);
      setNotFound(true);
      toast.error('โหลดข้อมูลไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  }, [assetId]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleUpdate = async (data: AssetFormValues) => {
    if (!assetId) return;
    setSubmitting(true);
    try {
      const updated = await updateAsset(assetId, data);
      setAsset(updated);
      setEditOpen(false);
      toast.success('บันทึกข้อมูลแล้ว');
    } catch {
      toast.error('บันทึกไม่สำเร็จ');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="รายละเอียดครุภัณฑ์"
        description={
          loading
            ? 'กำลังโหลด…'
            : asset
              ? `รหัส ${asset.assetId}`
              : notFound
                ? 'ไม่พบข้อมูล'
                : undefined
        }
      >
        <Button variant="ghost" asChild>
          <Link href="/search">
            <ArrowLeft className="mr-2 size-4" />
            กลับ
          </Link>
        </Button>
      </PageHeader>

      {loading ? <DetailSkeleton /> : null}

      {!loading && notFound ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <p className="text-lg text-muted-foreground">
              ไม่พบครุภัณฑ์รหัส{' '}
              <span className="font-mono font-medium text-foreground">
                {assetId || '—'}
              </span>
            </p>
            <p className="text-sm text-muted-foreground">
              ตรวจสอบรหัสจาก QR หรือกลับไปที่หน้าค้นหา
            </p>
            <Button asChild>
              <Link href="/search">ไปหน้าค้นหา</Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {!loading && asset ? (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" onClick={() => setEditOpen(true)}>
              <Pencil className="mr-2 size-4" />
              แก้ไข
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/qr-generator?assetId=${encodeURIComponent(asset.assetId)}`}>
                สร้าง QR
              </Link>
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">ข้อมูลหลัก</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">ชื่อ</p>
                  <p className="font-medium">{asset.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">ประเภท</p>
                  <p>{categoryLabels[asset.category]}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">สถานะ</p>
                  <p>{statusLabels[asset.status]}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">สถานที่</p>
                  <p>{asset.location}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">การจัดซื้อ / ประกัน</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">วันที่จัดซื้อ</p>
                  <p>{asset.purchaseDate ?? '—'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">ราคา</p>
                  <p>
                    {asset.purchasePrice != null
                      ? `${asset.purchasePrice.toLocaleString('th-TH')} บาท`
                      : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">หมดประกัน</p>
                  <p>{asset.warrantyExpiry ?? '—'}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="sm:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">รายละเอียด</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                  {asset.description?.trim() ? asset.description : '—'}
                </p>
              </CardContent>
            </Card>
          </div>

          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogContent
              className="max-h-[min(90vh,720px)] max-w-[calc(100%-2rem)] overflow-y-auto sm:max-w-2xl"
              showCloseButton
            >
              <DialogHeader>
                <DialogTitle>แก้ไขครุภัณฑ์</DialogTitle>
                <DialogDescription>
                  บันทึกแล้วข้อมูลบนหน้านี้จะอัปเดตทันที
                </DialogDescription>
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
      ) : null}
    </div>
  );
}
