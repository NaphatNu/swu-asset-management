'use client';

import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import {
    MapPin,
    Calendar,
    User,
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
import { ActionBadge } from './status-badge';
import { conditionLabels } from '@/constants/asset';
import { useIsMobile } from '@/hooks/use-mobile';
import type { AssetLog } from '@/types/asset';

interface AssetLogDetailDrawerProps {
    log: AssetLog | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onGenerateQR?: (log: AssetLog) => void;
    onRepair?: (log: AssetLog) => void;
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

function AssetLogDetailContent({
    log,
    onGenerateQR,
    onRepair,
}: {
    log: AssetLog;
    onGenerateQR?: (log: AssetLog) => void;
    onRepair?: (log: AssetLog) => void;
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
                                S/N: {log.serialNumber}
                            </span>
                        </div>
                        <ActionBadge action={log.action} />
                    </div>
                    {/* <div className="flex items-center gap-2">
            <Hash className="size-3.5 text-muted-foreground" />
            <span className="font-mono text-xs text-muted-foreground">
              {log.mainSerialNumber}
            </span>
          </div> */}
                </div>

                <Separator />

                <div className="space-y-1">
                    <DetailItem
                        icon={MapPin}
                        label="รายละเอียด"
                        value={log.note || 'ไม่มีรายละเอียดเพิ่มเติม'}
                    />
                    {/* <DetailItem
            icon={User}
            label="ผู้รับผิดชอบ"
            value={log.ownerName || 'ไม่ได้ระบุ'}
          />
          <DetailItem
            icon={Shield}
            label="สภาพปัจจุบัน"
            value={conditionLabels[log.condition]}
          /> */}
                </div>

                <Separator />

                <div className="space-y-1">
                    <DetailItem
                        icon={User}
                        label="ผู้ทำรายการ"
                        value={log.createdByName || 'ไม่ได้ระบุ'}
                    />
                    <DetailItem
                        icon={Calendar}
                        label="วันที่จัดซื้อ"
                        value={
                            log.createdAt
                                ? format(new Date(log.createdAt), 'd MMMM yyyy', {
                                    locale: th,
                                })
                                : undefined
                        }
                    />
                </div>
            </div>

            <div className="flex flex-wrap gap-2 px-4 pt-4">
                {/* <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onEdit?.(log)}
        >
          <Edit className="mr-2 size-4" />
          แก้ไข
        </Button> */}
                <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => onGenerateQR?.(log)}
                >
                    <QrCode className="mr-2 size-4" />
                    QR Code
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => onRepair?.(log)}
                >
                    <Wrench className="mr-2 size-4" />
                    แจ้งซ่อม
                </Button>
            </div>
        </>
    );
}

export function AssetLogDetailDrawer({
    log,
    open,
    onOpenChange,
    onGenerateQR,
    onRepair,
}: AssetLogDetailDrawerProps) {
    const isMobile = useIsMobile();

    if (!log) return null;

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={onOpenChange}>
                <DrawerContent className="max-h-[90vh]">
                    <DrawerHeader className="text-left">
                        <DrawerTitle className="text-lg leading-tight pr-8">
                            {log.assetName}
                        </DrawerTitle>
                        <DrawerDescription className="sr-only">
                            รายละเอียดครุภัณฑ์
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="overflow-auto pb-4">
                        <AssetLogDetailContent
                            log={log}
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
            <DialogContent className="max-w-lg p-0">
                <DialogHeader className="px-6 pt-6 pb-4">
                    <DialogTitle className="text-xl font-semibold leading-tight">
                        {log.assetName}
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                        รายละเอียดครุภัณฑ์
                    </DialogDescription>
                </DialogHeader>

                <div className="max-h-[70vh] overflow-y-auto py-2">
                    <AssetLogDetailContent
                        log={log}
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