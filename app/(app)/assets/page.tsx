'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, LayoutGrid, LayoutList } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { PageHeader } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AssetFilters,
  AssetCard,
  AssetTable,
  AssetDetailDrawer,
} from '@/components/assets';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { deleteAsset, getAssets } from '@/lib/api';
import { useIsMobile } from '@/hooks/use-mobile';
import type { Asset, AssetFilters as FiltersType } from '@/types/asset';

export default function AssetsPage() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [filters, setFilters] = useState<FiltersType>({});
  const [assets, setAssets] = useState<Asset[]>([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pageSize: 20 });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Asset | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadAssets = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getAssets({
        ...filters,
        page: pagination.page,
        pageSize: pagination.pageSize,
      });
      setAssets(res.data);
      setPagination((prev) => ({ ...prev, total: res.total }));
    } catch {
      toast.error('ไม่สามารถโหลดรายการครุภัณฑ์ได้');
    } finally {
      setIsLoading(false);
    }
  }, [filters, pagination.page, pagination.pageSize]);

  useEffect(() => {
    loadAssets();
  }, [loadAssets]);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [filters]);

  const handleViewAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setDrawerOpen(true);
  };

  const handleEditAsset = (asset: Asset) => {
    router.push(`/assets/${encodeURIComponent(asset.serialNumber)}`);
  };

  const handleGenerateQR = (asset: Asset) => {
    const params = new URLSearchParams({
      assetId: asset.serialNumber,
      fiscalYear: asset.fiscalYear ?? '',
      mainSequenceNo: asset.mainSequenceNo ?? '',
      itemSequenceName: asset.itemSequenceName ?? '',
      itemSequenceNo: String(asset.itemSequenceNo ?? ''),
      budgetType: asset.budgetType ?? '',
    });
    router.push(`/qr-generator?${params.toString()}`);
  };

  const handleRepair = (asset: Asset) => {
    router.push(`/repair?serialNumber=${asset.serialNumber}`);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget || isDeleting) return;
    setIsDeleting(true);
    try {
      await deleteAsset(deleteTarget.id);
      toast.success('ลบครุภัณฑ์สำเร็จ', {
        description: `รหัส ${deleteTarget.serialNumber} ถูกลบแล้ว`,
      });
      setDeleteTarget(null);
      await loadAssets();
    } catch {
      toast.error('ไม่สามารถลบครุภัณฑ์ได้');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="รายการครุภัณฑ์"
        description={
          isLoading
            ? 'กำลังโหลด...'
            : `ทั้งหมด ${pagination.total} รายการ`
        }
      >
        <Button asChild>
          <Link href="/assets-new">
            <Plus className="mr-2 size-4" />
            เพิ่มครุภัณฑ์
          </Link>
        </Button>
      </PageHeader>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <AssetFilters
          filters={filters}
          onFiltersChange={(f) => {
            setFilters(f);
            setPagination((prev) => ({ ...prev, page: 1 }));
          }}
        />

        {!isMobile && (
          <ToggleGroup
            type="single"
            value={viewMode}
            onValueChange={(value) => value && setViewMode(value as 'grid' | 'list')}
            className="hidden sm:flex"
          >
            <ToggleGroupItem value="list" aria-label="List view">
              <LayoutList className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="grid" aria-label="Grid view">
              <LayoutGrid className="size-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        )}
      </div>

      {isMobile ? (
        <div className="space-y-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-lg" />
            ))
          ) : assets.length > 0 ? (
            assets.map((asset) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                onClick={() => handleViewAsset(asset)}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center rounded-lg border border-dashed">
              <p className="text-muted-foreground">ไม่พบรายการครุภัณฑ์</p>
              <p className="text-sm text-muted-foreground">ลองปรับเงื่อนไขการค้นหา</p>
            </div>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-lg" />
            ))
          ) : assets.length > 0 ? (
            assets.map((asset) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                onClick={() => handleViewAsset(asset)}
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center rounded-lg border border-dashed">
              <p className="text-muted-foreground">ไม่พบรายการครุภัณฑ์</p>
              <p className="text-sm text-muted-foreground">ลองปรับเงื่อนไขการค้นหา</p>
            </div>
          )}
        </div>
      ) : (
        <AssetTable
          assets={assets}
          pagination={pagination}
          isLoading={isLoading}
          isDeletingId={isDeleting ? deleteTarget?.id ?? null : null}
          onPageChange={(newPage) => {
            setPagination((prev) => ({ ...prev, page: newPage }));
            window.scrollTo(0, 0);
          }}
          onPageSizeChange={(newSize) =>
            setPagination((prev) => ({ ...prev, pageSize: newSize, page: 1 }))
          }
          onView={handleViewAsset}
          onEdit={handleEditAsset}
          onGenerateQR={handleGenerateQR}
          onRepair={handleRepair}
          onDelete={setDeleteTarget}
        />
      )}

      <AssetDetailDrawer
        asset={selectedAsset}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onEdit={handleEditAsset}
        onGenerateQR={handleGenerateQR}
        onRepair={handleRepair}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && !isDeleting && setDeleteTarget(null)}
        title="ยืนยันการลบครุภัณฑ์"
        description={
          deleteTarget
            ? `ต้องการลบ "${deleteTarget.assetName}" (${deleteTarget.serialNumber}) หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้`
            : undefined
        }
        confirmLabel="ลบ"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
