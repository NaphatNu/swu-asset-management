'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { Download } from 'lucide-react';
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
import { QrLabelDisplay } from '@/components/qr/qr-label-display';
import { getAssetBySerialNumber } from '@/lib/api';
import type { Asset } from '@/types/asset';
import { budgetTypeLabels } from '@/constants/asset';

const getBudgetTypeNumber = (type?: string | null): string => {
  if (type === 'government-budget') return '1';
  if (type === 'income-budget') return '2';
  return '-';
};

// const sizeMap = {
//   small: 200,
//   medium: 300,
//   large: 400,
// } as const;

// type PrintSize = keyof typeof sizeMap;

function QRGeneratorContent() {
  const searchParams = useSearchParams();

  const [assetCode, setAssetCode] = useState(searchParams.get('assetId') || '');
  const [fiscalYear, setFiscalYear] = useState(searchParams.get('fiscalYear') || '');
  const [mainSequenceNo, setMainSequenceNo] = useState(searchParams.get('mainSequenceNo') || '');
  const [itemSequenceName, setItemSequenceName] = useState(
    searchParams.get('itemSequenceName') || ''
  );
  const [itemSequenceNo, setItemSequenceNo] = useState(
    searchParams.get('itemSequenceNo') || ''
  );
  // const [printSize, setPrintSize] = useState<PrintSize>('medium');
  const [asset, setAsset] = useState<Asset | null>(null);
  const [budgetType, setBudgetType] = useState<string | undefined>(undefined);

  // เพิ่ม State สำหรับจำว่ากำลังเลือก subItem ชิ้นไหนอยู่ (default เป็น 'none' คือไม่ใส่)
  const [selectedSubItemIdx, setSelectedSubItemIdx] = useState<string>('none');

  const qrRef = useRef<HTMLDivElement>(null);

  const serialPattern = /^\d{3}-\d{16}-\d{1}-\d{2}$/;

  useEffect(() => {
    if (!assetCode || !serialPattern.test(assetCode)) {
      setAsset(null);
      setSelectedSubItemIdx('none');
      return;
    }

    let mounted = true;
    getAssetBySerialNumber(assetCode).then((data) => {
      if (!mounted || !data) return;
      setAsset(data);
      if (!fiscalYear && data.fiscalYear) setFiscalYear(data.fiscalYear);
      if (!mainSequenceNo && data.mainSequenceNo) setMainSequenceNo(data.mainSequenceNo);
      if (!budgetType && data.budgetType) setBudgetType(data.budgetType);
      // บังคับให้ชื่อรายการใช้ assetName ของตัวหลักเสมอ
      setItemSequenceName(data.assetName || '');

      // ตรวจสอบเงื่อนไขกรณีมีชิ้นส่วนย่อย (Sub Items)
      if (data.subItems && data.subItems.length > 0) {
        setSelectedSubItemIdx('none');
        setItemSequenceNo('');
      } else {
        setSelectedSubItemIdx('none');
        if (!itemSequenceNo && data.itemSequenceNo != null) {
          setItemSequenceNo(String(data.itemSequenceNo));
        }
      }
    });

    return () => {
      mounted = false;
    };
  }, [assetCode]);

  // ฟังก์ชันจัดการตอนเปลี่ยนการเลือกชิ้นส่วนย่อย
  const handleSubItemChange = (value: string) => {
    setSelectedSubItemIdx(value);

    if (value === 'none' || !asset?.subItems) {
      // ใช้ชื่อ assetName ของตัวหลักเสมอ และเคลียร์ลำดับรายการย่อย
      setItemSequenceName(asset?.assetName || '');
      setItemSequenceNo('');
    } else {
      // ดึงลำดับไอเทมย่อยมาใส่ แต่ตัวชื่อรายการยังคงล็อกให้ใช้ assetName เหมือนเดิม
      const idx = Number(value);
      const targetItem = asset.subItems[idx];
      if (targetItem) {
        setItemSequenceName(asset.assetName || '');
        setItemSequenceNo(targetItem.itemSequenceNo != null ? String(targetItem.itemSequenceNo) : '');
      }
    }
  };

  const labelData = {
    fiscalYear: fiscalYear || undefined,
    mainSequenceNo: mainSequenceNo || undefined,
    itemSequenceName: itemSequenceName || undefined,
    itemSequenceNo: itemSequenceNo ? Number(itemSequenceNo) : undefined,
    fullAssetCode: assetCode,
    budgetType: getBudgetTypeNumber(budgetType),
  };

  const canPreview = Boolean(assetCode && serialPattern.test(assetCode));

  const handleDownload = () => {
    if (!qrRef.current || !canPreview) return;

    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const canvasSize = 400;
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    
    // ตั้งค่าตัวแปรตามที่คุณกำหนด
    const padding = 16;
    const fontSize = 22;
    const gapAfterQr = 16;
    const gapLineToLine = 8;

    const textBlockHeight = fontSize + gapLineToLine + fontSize + gapAfterQr;

    const qrSize = canvasSize - (padding * 2) - textBlockHeight;

    const qrX = Math.floor((canvasSize - qrSize) / 2);
    const qrY = padding; 

    const qrBottom = qrY + qrSize; 

    const img = new Image();
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    img.onload = () => {
      if (!ctx) return;

      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, qrX, qrY, qrSize, qrSize);

      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top'; 

      // --- บรรทัดที่ 1 ---
      ctx.font = `${fontSize}px sans-serif`;
      const line1 = `ปี ${fiscalYear || '-'} (${getBudgetTypeNumber(budgetType) || '-'})(${mainSequenceNo || '-'}) ${itemSequenceName || '-'} (${itemSequenceNo || '-'})`;
      
      const text1Y = qrBottom + gapAfterQr;
      ctx.fillText(line1, canvasSize / 2, text1Y, canvasSize - (padding * 2));

      // --- บรรทัดที่ 2 ---
      ctx.font = `${fontSize}px monospace`;
      
      const text2Y = text1Y + fontSize + gapLineToLine;
      ctx.fillText(assetCode, canvasSize / 2, text2Y);

      const link = document.createElement('a');
      link.download = `${fiscalYear || '-'} (${getBudgetTypeNumber(budgetType) || '-'})(${mainSequenceNo || '-'}) ${itemSequenceName || '-'} (${itemSequenceNo || '-'}).png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      URL.revokeObjectURL(svgUrl);
      toast.success('ดาวน์โหลด QR Code สำเร็จ');
    };

    img.src = svgUrl;
  };

  return (
    <div className="space-y-6 print:space-y-4">
      <PageHeader
        title="สร้าง QR Code"
        description="สร้าง QR Code สำหรับติดครุภัณฑ์"
      />

      <div className="grid gap-6 lg:grid-cols-2 print:block">
        <Card className="print:hidden">
          <CardHeader>
            <CardTitle className="text-lg">ข้อมูล QR Code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="assetCode">รหัสครุภัณฑ์ (asset_code)</Label>
              <Input
                id="assetCode"
                placeholder="เช่น 207-3000000378580000-2-64"
                value={assetCode}
                onChange={(e) => setAssetCode(e.target.value)}
                className="font-mono"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fiscalYear">ปีงบประมาณ</Label>
                <Input
                  id="fiscalYear"
                  placeholder="เช่น 69"
                  value={fiscalYear}
                  onChange={(e) => setFiscalYear(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mainSequenceNo">ลำดับหลัก</Label>
                <Input
                  id="mainSequenceNo"
                  placeholder="เช่น 1"
                  value={mainSequenceNo}
                  onChange={(e) => setMainSequenceNo(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budgetType">ประเภทงบประมาณ</Label>
                <Select
                  value={budgetType}
                  onValueChange={(v) => setBudgetType(v)}
                >
                  <SelectTrigger id="budgetType">
                    <SelectValue placeholder="เลือกประเภทงบประมาณ" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(budgetTypeLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* ส่วนเลือกชิ้นส่วนย่อย: แสดง Select แบบปิดใช้งานเมื่อไม่มีข้อมูลย่อย */}
            {asset && (
              <div className="space-y-2 bg-muted/40 border p-3 rounded-lg animate-in fade-in-50 duration-200">
                <Label htmlFor="subItemSelector" className="text-muted-foreground font-semibold flex items-center justify-between">
                  <span>เลือกชิ้นส่วนย่อย (Auto-fill ข้อมูลด้านล่าง)</span>
                  {(!asset.subItems || asset.subItems.length === 0) && (
                    <span className="text-xs text-destructive font-normal">(ไม่มีข้อมูลย่อย)</span>
                  )}
                </Label>
                <Select
                  value={selectedSubItemIdx}
                  onValueChange={handleSubItemChange}
                  disabled={!asset.subItems || asset.subItems.length === 0}
                >
                  <SelectTrigger id="subItemSelector" className={asset.subItems && asset.subItems.length > 0 ? "border-purple-500/30 focus:ring-purple-500" : ""}>
                    <SelectValue placeholder="ไม่ใส่" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">ไม่ใส่</SelectItem>
                    {asset.subItems?.map((item, idx) => (
                      <SelectItem key={idx} value={String(idx)}>
                        ลำดับที่ {item.itemSequenceNo} — {item.itemSequenceName || 'ไม่มีชื่อชิ้นส่วน'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="itemSequenceName">ชื่อรายการ</Label>
                <Input
                  id="itemSequenceName"
                  placeholder="เช่น ชุดปฏิบัติการคอมพิวเตอร์"
                  value={itemSequenceName}
                  onChange={(e) => setItemSequenceName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="itemSequenceNo">ลำดับรายการ</Label>
                <Input
                  id="itemSequenceNo"
                  type="number"
                  min={1}
                  placeholder="เช่น 1"
                  value={itemSequenceNo}
                  onChange={(e) => setItemSequenceNo(e.target.value)}
                />
              </div>
            </div>

            {/* <div className="space-y-2">
              <Label>ขนาดพิมพ์ (print_size)</Label>
              <Select
                value={printSize}
                onValueChange={(v) => setPrintSize(v as PrintSize)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">เล็ก (200×200)</SelectItem>
                  <SelectItem value="medium">กลาง (300×300)</SelectItem>
                  <SelectItem value="large">ใหญ่ (400×400)</SelectItem>
                </SelectContent>
              </Select>
            </div> */}

            {!canPreview && assetCode && (
              <p className="text-sm text-destructive">
                รูปแบบรหัสไม่ถูกต้อง (XXX-XXXXXXXXXXXXXXXX-X-XX)
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="print:border-0 print:shadow-none">
          <CardHeader className="print:hidden">
            <CardTitle className="text-lg">ตัวอย่าง QR Code</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4 print:py-0">
              {canPreview ? (
                <>
                  <div
                    ref={qrRef}
                    className="qr-print-label flex flex-col items-center gap-3 rounded-xl border bg-white p-6 print:border-0 print:p-2 print:shadow-none"
                  >
                    <QRCodeSVG
                      value={`https://assets.swu.ac.th/${assetCode}`}
                      size={400}
                      level="H"
                      includeMargin={false}
                      fgColor="#000000"
                      bgColor="#ffffff"
                    />
                    <QrLabelDisplay data={labelData} className="max-w-full" />
                  </div>

                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    className="w-full max-w-xs print:hidden"
                    type="button"
                  >
                    <Download className="mr-2 size-4" />
                    ดาวน์โหลด PNG
                  </Button>
                </>
              ) : (
                <div className="flex aspect-square w-full max-w-xs items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/50 print:hidden">
                  <p className="text-sm text-muted-foreground text-center px-4">
                    กรอกรหัสครุภัณฑ์ให้ครบเพื่อดูตัวอย่าง
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .qr-print-label,
          .qr-print-label * {
            visibility: visible;
          }
          .qr-print-label {
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          }
        }
      `}</style>
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