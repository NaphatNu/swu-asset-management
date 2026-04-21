'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ScanLine, Keyboard, Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AssetCard, AssetDetailDrawer } from '@/components/assets';
import { QrScannerPanel } from '@/components/qr/qr-scanner-panel';
import { getAssets, getAssetsSearch } from '@/lib/api';
import { parseAssetIdFromQrValue } from '@/lib/qr/parse-asset-id';
import { toast } from 'sonner';
import type { Asset } from '@/types/asset';

const SEARCH_DEBOUNCE_MS = 300;

export default function SearchPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Asset[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [manualId, setManualId] = useState('');

  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    let cancelled = false;
    setIsSearching(true);
    const timer = window.setTimeout(() => {
      getAssetsSearch({ name: trimmed })
        .then((data) => {
          if (!cancelled) setSearchResults(data);
        })
        .finally(() => {
          if (!cancelled) setIsSearching(false);
        });
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [searchQuery]);

  const handleViewAsset = (asset: Asset) => {
    console.log('assetView', asset);
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
    router.push(`/repair?assetId=${asset.serialNumber}`);
  };

  const handleManualLookup = () => {
    const parsed = parseAssetIdFromQrValue(manualId.trim());
    if (!parsed) {
      toast.error('รหัสไม่ถูกต้อง', {
        description: 'ใช้รูปแบบ XXX-XXXXXXXXXXXXXXXX-X-XX หรือวาง URL จาก QR',
      });
      return;
    }
    router.push(`/assets/${encodeURIComponent(parsed)}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="ค้นหาครุภัณฑ์"
        description="ค้นหาด้วยรหัสครุภัณฑ์หรือสแกน QR Code"
      />

      <Tabs defaultValue="scan" className="w-full">
        {/* <TabsList className="grid w-full grid-cols-2 max-w-md">
        <TabsTrigger value="scan" className="gap-2">
            <ScanLine className="size-4" />
            สแกน QR
          </TabsTrigger>
          <TabsTrigger value="search" className="gap-2">
            <Search className="size-4" />
            ค้นหา
          </TabsTrigger>

        </TabsList> */}

        <TabsContent value="search" className="mt-6 space-y-6">
          {/* Search Input */}
          <div className="relative max-w-lg">
            <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="พิมพ์รหัสครุภัณฑ์ เช่น 7440-001-0001"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 pl-10 text-base"
            />
          </div>

          {/* Search Results */}
          {searchQuery.trim() && (
            <div className="space-y-4">
              {isSearching ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" />
                  กำลังค้นหา…
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  พบ {searchResults.length} รายการ
                </p>
              )}

              {!isSearching && searchResults.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {searchResults.map((asset) => (
                    <AssetCard
                      key={asset.id}
                      asset={asset}
                      onClick={() => handleViewAsset(asset)}
                    />
                  ))}
                </div>
              ) : null}

              {!isSearching && searchResults.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Search className="size-12 text-muted-foreground/50" />
                    <p className="mt-4 text-muted-foreground">
                      ไม่พบครุภัณฑ์ที่ค้นหา
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ลองค้นหาด้วยรหัสหรือชื่ออื่น
                    </p>
                  </CardContent>
                </Card>
              ) : null}
            </div>
          )}

          {!searchQuery.trim() && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Search className="size-12 text-muted-foreground/50" />
                <p className="mt-4 text-muted-foreground">
                  พิมพ์รหัสครุภัณฑ์เพื่อค้นหา
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="scan" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">สแกน QR Code</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="camera" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-sm mx-auto">
                  <TabsTrigger value="camera" className="gap-2">
                    <ScanLine className="size-4" />
                    สแกน
                  </TabsTrigger>
                  <TabsTrigger value="manual" className="gap-2">
                    <Keyboard className="size-4" />
                    กรอกรหัส
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="camera" className="mt-6">
                  <QrScannerPanel />
                </TabsContent>
                <TabsContent value="manual" className="mt-6 space-y-4">
                  <p className="text-center text-sm text-muted-foreground">
                    กรอกรหัสครุภัณฑ์ (XXX-XXXXXXXXXXXXXXXX-X-XX) หรือวางข้อความจาก QR
                  </p>
                  <div className="mx-auto flex w-full max-w-sm flex-col gap-3">
                    <Input
                      placeholder="เช่น 123-4567890123456789-4-56"
                      value={manualId}
                      onChange={(e) => setManualId(e.target.value)}
                      className="h-12 font-mono text-base"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleManualLookup();
                      }}
                    />
                    <Button
                      size="lg"
                      className="w-full"
                      type="button"
                      onClick={handleManualLookup}
                    >
                      เปิดข้อมูลครุภัณฑ์
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
