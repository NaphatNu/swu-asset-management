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
import { getAssets, getAssetsSearch } from '@/lib/api';
import { useIsMobile } from '@/hooks/use-mobile';
import type { Asset, AssetFilters as FiltersType } from '@/types/asset';
import { da } from 'date-fns/locale';

export default function AssetsPage() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [filters, setFilters] = useState<FiltersType>({});
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);

    getAssetsSearch(filters)
      .then((data) => {
        if (mounted) setAssets(data);
        console.log(data);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [filters]);

  const handleViewAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setDrawerOpen(true);
  };

  const handleEditAsset = (asset: Asset) => {
    router.push(`/assets/${encodeURIComponent(asset.serialNumber)}`);
  };

  const handleGenerateQR = (asset: Asset) => {
    router.push(`/qr-generator?assetId=${asset.serialNumber}`);
  };

  const handleRepair = (asset: Asset) => {
    router.push(`/repair?serialNumber=${asset.serialNumber}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="รายการครุภัณฑ์"
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
        <AssetFilters filters={filters} onFiltersChange={setFilters} />

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
            <AssetCard
              key={asset.id}
              asset={asset}
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
            <AssetCard
              key={asset.id}
              asset={asset}
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
        <AssetTable
          assets={assets}
          onView={handleViewAsset}
          onEdit={handleEditAsset}
          onGenerateQR={handleGenerateQR}
          onRepair={handleRepair}
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
    </div>
  );
}
