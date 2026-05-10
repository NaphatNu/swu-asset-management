'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ScanLine, Keyboard, QrCode } from 'lucide-react';
import { PageHeader } from '@/components/layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QrScannerPanel } from '@/components/qr/qr-scanner-panel';
import { parseAssetIdFromQrValue } from '@/lib/qr/parse-asset-id';
import { useIsMobile } from '@/hooks/use-mobile'; // นำเข้า Hook
import { toast } from 'sonner';

export default function SearchPage() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [manualId, setManualId] = useState('');
  const [activeTab, setActiveTab] = useState<string>('manual'); // ค่า Default เริ่มต้น

  // ตั้งค่า Tab ตามอุปกรณ์ที่ตรวจพบครั้งแรก
  useEffect(() => {
    if (isMobile) {
      setActiveTab('camera');
    } else {
      setActiveTab('manual');
    }
  }, [isMobile]); // ทำงานเมื่อตรวจพบสถานะ isMobile ครั้งแรก

  const handleManualLookup = () => {
    const trimmedId = manualId.trim();
    if (!trimmedId) return;

    const parsed = parseAssetIdFromQrValue(trimmedId);
    if (!parsed) {
      toast.error('รูปแบบรหัสไม่ถูกต้อง', {
        description: 'กรุณาตรวจสอบรหัสครุภัณฑ์อีกครั้ง',
      });
      return;
    }
    router.push(`/assets/${encodeURIComponent(parsed)}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="ค้นหาครุภัณฑ์"
        description="สแกน QR Code หรือกรอกรหัสเพื่อดูข้อมูล"
      />

      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <QrCode className="size-5 text-primary" />
            เลือกวิธีการตรวจสอบ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="camera" className="gap-2">
                <ScanLine className="size-4" />
                สแกน QR
              </TabsTrigger>
              <TabsTrigger value="manual" className="gap-2">
                <Keyboard className="size-4" />
                กรอกรหัส
              </TabsTrigger>
            </TabsList>

            <TabsContent value="camera" className="space-y-4">
              <div className="overflow-hidden rounded-lg border bg-black/5">
                <QrScannerPanel />
              </div>
              <p className="text-center text-sm text-muted-foreground">
                วาง QR Code ให้ตรงกับกรอบเพื่อสแกนอัตโนมัติ
              </p>
            </TabsContent>

            <TabsContent value="manual" className="space-y-4 py-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground text-center">
                  กรอกรหัสครุภัณฑ์เพื่อตรวจสอบข้อมูล
                </p>
                <Input
                  type="text"
                  placeholder="พิมพ์รหัสที่นี่..."
                  value={manualId}
                  onChange={(e) => setManualId(e.target.value)}
                  className="h-12 text-center font-mono text-base uppercase"
                  onKeyDown={(e) => e.key === 'Enter' && handleManualLookup()}
                  autoFocus={!isMobile} // โฟกัสอัตโนมัติเฉพาะบน Desktop
                />
              </div>
              <Button 
                size="lg" 
                className="w-full" 
                onClick={handleManualLookup}
                disabled={!manualId.trim()}
              >
                ตรวจสอบข้อมูล
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}