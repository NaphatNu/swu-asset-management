'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, LayoutGrid, LayoutList } from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  AssetFilters,
  AssetCard,
  AssetTable,
  AssetDetailDrawer,
} from '@/components/assets';
import { getAssets, getAssetsLogs, getAssetsSearch } from '@/lib/api';
import { useIsMobile } from '@/hooks/use-mobile';
import type { Asset, AssetLog, AssetFilters as FiltersType } from '@/types/asset';
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { AssetLogTable } from '@/components/assets/asset-log-table';
import { AssetCardLog } from '@/components/assets/asset-card-log';
import { AssetLogFilters } from '@/components/assets/asset-log-filters';
import { AssetLogDetailDrawer } from '@/components/assets/asset-log-detail-drawer';

export default function AssetsPage() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [filters, setFilters] = useState<FiltersType>({});
  const [assets, setAssets] = useState<AssetLog[]>([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pageSize: 20 });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState<AssetLog | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);

    getAssetsLogs({ ...filters, page: pagination.page, pageSize: pagination.pageSize })
      .then((res) => {
        if (mounted) {
          setAssets(res.data); // เก็บเฉพาะ Array ของ Assets
          setPagination(prev => ({
            ...prev,
            total: res.total,
            // ไม่ต้อง set page ซ้ำที่นี่เพื่อป้องกัน loop ถ้า API return page เดิมกลับมา
          }));
          setIsLoading(false);
        }
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [filters, pagination.page]);

  // ฟังก์ชันสำหรับเปลี่ยนหน้า
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo(0, 0); // เลื่อนขึ้นบนเมื่อเปลี่ยนหน้า
  };

  // คำนวณจำนวนหน้าทั้งหมด
  const totalPages = Math.ceil(pagination.total / pagination.pageSize);

  const handleViewAsset = (asset: AssetLog) => {
    setSelectedAsset(asset);
    setDrawerOpen(true);
  };

  const handleGenerateQR = (asset: AssetLog) => {
    router.push(`/qr-generator?assetId=${asset.serialNumber}`);
  };

  const handleRepair = (asset: AssetLog) => {
    router.push(`/repair?serialNumber=${asset.serialNumber}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="ประวัติการทำรายการ"
        description={`ทั้งหมด ${assets.length} รายการ`}
      >
        <Button asChild>
          <Link href="/assets/new">
            <Plus className="mr-2 size-4" />
            เพิ่มครุภัณฑ์
          </Link>
        </Button>
      </PageHeader>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <AssetLogFilters filters={filters} onFiltersChange={setFilters} />

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
          {assets.map((asset) => (
            <AssetCardLog
              key={asset.id}
              assetLog={asset}
              onClick={() => handleViewAsset(asset)}
            />
          ))}
          {!isLoading && assets.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">ไม่พบรายการครุภัณฑ์</p>
              <p className="text-sm text-muted-foreground">
                ลองปรับเงื่อนไขการค้นหา
              </p>
            </div>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {assets.map((asset) => (
            <AssetCardLog
              key={asset.id}
              assetLog={asset}
              onClick={() => handleViewAsset(asset)}
            />
          ))}
          {!isLoading && assets.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">ไม่พบรายการครุภัณฑ์</p>
              <p className="text-sm text-muted-foreground">
                ลองปรับเงื่อนไขการค้นหา
              </p>
            </div>
          )}
        </div>
      ) : (
        <AssetLogTable
          assetsLogs={assets}
          pagination={pagination} // { page: 1, pageSize: 20, total: 150 }
          onPageChange={(newPage) => setPagination(prev => ({ ...prev, page: newPage }))}
          onPageSizeChange={(newSize) => setPagination(prev => ({ ...prev, pageSize: newSize, page: 1 }))}
          onView={handleViewAsset}
          onGenerateQR={handleGenerateQR}
          onRepair={handleRepair}
        />
      )}

        <AssetLogDetailDrawer
        log={selectedAsset}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onGenerateQR={handleGenerateQR}
        onRepair={handleRepair}
      />
    </div>
  );
}
