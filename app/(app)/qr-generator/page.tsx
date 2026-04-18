'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { Download, RefreshCw } from 'lucide-react';
import { PageHeader } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { mockAssets } from '@/lib/mock-data';

function QRGeneratorContent() {
  const searchParams = useSearchParams();
  const initialAssetId = searchParams.get('assetId') || '';

  const [assetId, setAssetId] = useState(initialAssetId);
  const [qrSize, setQrSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [generated, setGenerated] = useState(!!initialAssetId);
  const qrRef = useRef<HTMLDivElement>(null);

  const asset = mockAssets.find((a) => a.assetId === assetId);

  const sizeMap = {
    small: 150,
    medium: 200,
    large: 300,
  };

  const handleGenerate = () => {
    if (!assetId) {
      toast.error('กรุณากรอกรหัสครุภัณฑ์');
      return;
    }

    const pattern = /^\d{3}-\d{11}-\d{1}-\d{2}$/;
    if (!pattern.test(assetId)) {
      toast.error('รูปแบบรหัสไม่ถูกต้อง', {
        description: 'รูปแบบที่ถูกต้อง: XXX-XXXXXXXXX-X-XX',
      });
      return;
    }

    setGenerated(true);
    toast.success('สร้าง QR Code สำเร็จ');
  };

  const handleDownload = () => {
    if (!qrRef.current) return;

    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    // Create a canvas and draw the SVG
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const size = sizeMap[qrSize];
    canvas.width = size + 40;
    canvas.height = size + 80;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    img.onload = () => {
      if (!ctx) return;

      // White background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw QR code
      ctx.drawImage(img, 20, 20, size, size);

      // Draw asset ID text
      ctx.fillStyle = 'black';
      ctx.font = '14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(assetId, canvas.width / 2, size + 50);

      // Download
      const link = document.createElement('a');
      link.download = `qr-${assetId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      URL.revokeObjectURL(svgUrl);
      toast.success('ดาวน์โหลด QR Code สำเร็จ');
    };

    img.src = svgUrl;
  };

  useEffect(() => {
    if (initialAssetId) {
      setGenerated(true);
    }
  }, [initialAssetId]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="สร้าง QR Code"
        description="สร้าง QR Code สำหรับติดครุภัณฑ์"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">ข้อมูล QR Code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="assetId">รหัสครุภัณฑ์</Label>
              <Input
                id="assetId"
                placeholder="เช่น 123-4567890123-4-56"
                value={assetId}
                onChange={(e) => {
                  setAssetId(e.target.value);
                  setGenerated(false);
                }}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                รูปแบบ: XXX-XXXXXXXXX-X-XX 
              </p>
            </div>

            <div className="space-y-2">
              <Label>ขนาด QR Code</Label>
              <Select
                value={qrSize}
                onValueChange={(value) =>
                  setQrSize(value as 'small' | 'medium' | 'large')
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">เล็ก (150x150)</SelectItem>
                  <SelectItem value="medium">กลาง (200x200)</SelectItem>
                  <SelectItem value="large">ใหญ่ (300x300)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {asset && (
              <div className="rounded-lg bg-muted p-3 space-y-1">
                <p className="text-xs text-muted-foreground">พบครุภัณฑ์:</p>
                <p className="text-sm font-medium">{asset.name}</p>
                <p className="text-xs text-muted-foreground">{asset.location}</p>
              </div>
            )}

            <Button onClick={handleGenerate} className="w-full">
              <RefreshCw className="mr-2 size-4" />
              สร้าง QR Code
            </Button>
          </CardContent>
        </Card>

        {/* Preview Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">ตัวอย่าง QR Code</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              {generated && assetId ? (
                <>
                  <div
                    ref={qrRef}
                    className="flex flex-col items-center gap-3 rounded-xl border bg-white p-6"
                  >
                    <QRCodeSVG
                      value={`https://assets.swu.ac.th/${assetId}`}
                      size={sizeMap[qrSize]}
                      level="H"
                      includeMargin={false}
                      fgColor="#000000"
                      bgColor="#ffffff"
                    />
                    <p className="font-mono text-sm text-gray-700">{assetId}</p>
                  </div>

                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    className="w-full max-w-xs"
                  >
                    <Download className="mr-2 size-4" />
                    ดาวน์โหลด PNG
                  </Button>
                </>
              ) : (
                <div className="flex aspect-square w-full max-w-xs items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/50">
                  <p className="text-sm text-muted-foreground text-center px-4">
                    กรอกรหัสครุภัณฑ์แล้วกด "สร้าง QR Code"
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function QRGeneratorPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <QRGeneratorContent />
    </Suspense>
  );
}
