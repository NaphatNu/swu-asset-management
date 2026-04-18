'use client';

import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import {
  MapPin,
  Calendar,
  Tag,
  User,
  FileText,
  DollarSign,
  Shield,
  Edit,
  QrCode,
  Wrench,
  Hash,
  Fingerprint,
} from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from '@/components/ui/drawer';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { StatusBadge } from './status-badge';
import { categoryLabels } from '@/lib/mock-data';
import { useIsMobile } from '@/hooks/use-mobile';
import type { Asset } from '@/types/asset';

interface AssetDetailDrawerProps {
  asset: Asset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (asset: Asset) => void;
  onGenerateQR?: (asset: Asset) => void;
  onRepair?: (asset: Asset) => void;
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value?: string | number | null;
}) {
  if (!value) return null;

  return (
    <div className="flex items-start gap-3 py-2">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

function AssetDetailContent({
  asset,
  onEdit,
  onGenerateQR,
  onRepair,
}: {
  asset: Asset;
  onEdit?: (asset: Asset) => void;
  onGenerateQR?: (asset: Asset) => void;
  onRepair?: (asset: Asset) => void;
}) {
  return (
    <>
      <div className="space-y-4 px-4">
        {/* Header Info */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Fingerprint className="size-3.5 text-muted-foreground" />
              <span className="font-mono text-sm font-semibold">
                S/N: {asset.serial_number}
              </span>


            </div>
            <StatusBadge status={asset.status} />
          </div>
          {/* แสดง Serial Number ในส่วนหัวเพื่อให้เห็นชัดเจน */}
          <div className="flex items-center gap-2">
            <Hash className="size-3.5 text-muted-foreground" />
            <span className="font-mono text-xs text-muted-foreground">
              {asset.assetId}
            </span>
          </div>
        </div>

        <Separator />

        <div className="space-y-1">
          <DetailItem
            icon={Tag}
            label="ประเภท"
            value={categoryLabels[asset.category]}
          />
          <DetailItem
            icon={MapPin}
            label="สถานที่"
            value={asset.location}
          />
          <DetailItem
            icon={User}
            label="ผู้รับผิดชอบ"
            value={asset.assignedTo || 'ไม่ได้ระบุ'}
          />
          <DetailItem
            icon={FileText}
            label="รายละเอียด"
            value={asset.description}
          />
        </div>

        <Separator />

        <div className="space-y-1">
          <DetailItem
            icon={Calendar}
            label="วันที่จัดซื้อ"
            value={
              asset.purchaseDate
                ? format(new Date(asset.purchaseDate), 'd MMMM yyyy', {
                  locale: th,
                })
                : undefined
            }
          />
          <DetailItem
            icon={DollarSign}
            label="ราคา"
            value={
              asset.purchasePrice
                ? `${asset.purchasePrice.toLocaleString()} บาท`
                : undefined
            }
          />
          {/* <DetailItem
            icon={Shield}
            label="หมดประกัน"
            value={
              asset.warrantyExpiry
                ? format(new Date(asset.warrantyExpiry), 'd MMMM yyyy', {
                  locale: th,
                })
                : undefined
            }
          /> */}
        </div>

        {/* เพิ่มส่วนบันทึกเวลาการแก้ไขล่าสุด (Optional) */}
        <p className="text-[10px] text-center text-muted-foreground pt-2">
          อัปเดตล่าสุดเมื่อ: {format(new Date(asset.updatedAt), 'd MMM yy HH:mm', { locale: th })}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 px-4 pt-4">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onEdit?.(asset)}
        >
          <Edit className="mr-2 size-4" />
          แก้ไข
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onGenerateQR?.(asset)}
        >
          <QrCode className="mr-2 size-4" />
          QR Code
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => onRepair?.(asset)}
        >
          <Wrench className="mr-2 size-4" />
          แจ้งซ่อม
        </Button>
      </div>
    </>
  );
}

export function AssetDetailDrawer({
  asset,
  open,
  onOpenChange,
  onEdit,
  onGenerateQR,
  onRepair,
}: AssetDetailDrawerProps) {
  const isMobile = useIsMobile();

  if (!asset) return null;

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="text-left">
            <DrawerTitle className="text-lg leading-tight pr-8">
              {asset.name}
            </DrawerTitle>
            <DrawerDescription className="sr-only">
              รายละเอียดครุภัณฑ์
            </DrawerDescription>
          </DrawerHeader>
          <div className="overflow-auto pb-4">
            <AssetDetailContent
              asset={asset}
              onEdit={onEdit}
              onGenerateQR={onGenerateQR}
              onRepair={onRepair}
            />
          </div>
          <DrawerFooter className="pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              ปิด
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0"> {/* p-0 เพื่อให้จัดการ padding ภายในเองได้สวยเหมือนเดิม */}
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-xl font-semibold leading-tight">
            {asset.name}
          </DialogTitle>
          <DialogDescription className="sr-only">
            รายละเอียดครุภัณฑ์
          </DialogDescription>
        </DialogHeader>

        {/* ใช้ ScrollArea หรือ div จัดการเนื้อหา */}
        <div className="max-h-[70vh] overflow-y-auto py-2">
          <AssetDetailContent
            asset={asset}
            onEdit={onEdit}
            onGenerateQR={onGenerateQR}
            onRepair={onRepair}
          />
        </div>

        <DialogFooter className="px-6 py-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            ปิด
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
