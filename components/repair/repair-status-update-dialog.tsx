'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { repairStatusLabels } from '@/constants/asset';
import { RepairStatusBadge } from '@/components/badge/status-badge';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import type { RepairRequest, RepairStatus } from '@/types/asset';

const repairStatusOptions: RepairStatus[] = [
  'open',
  'in-progress',
  'completed',
];

interface RepairStatusUpdateDialogProps {
  repair: RepairRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (id: string, status: RepairStatus) => Promise<void>;
}

export function RepairStatusUpdateDialog({
  repair,
  open,
  onOpenChange,
  onConfirm,
}: RepairStatusUpdateDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<RepairStatus | ''>('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenChange = (next: boolean) => {
    if (!isLoading) {
      onOpenChange(next);
      if (!next) setSelectedStatus('');
    }
  };

  const handleApply = () => {
    if (!repair || !selectedStatus || selectedStatus === repair.status) return;
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (!repair || !selectedStatus) return;
    setIsLoading(true);
    try {
      await onConfirm(repair.id, selectedStatus);
      setConfirmOpen(false);
      handleOpenChange(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>อัปเดตสถานะการซ่อม</DialogTitle>
            <DialogDescription>
              {repair?.assetName} ({repair?.serialNumber})
            </DialogDescription>
          </DialogHeader>

          {repair && (
            <section className="space-y-4 py-2">
              <p className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">สถานะปัจจุบัน:</span>
                <RepairStatusBadge status={repair.status} />
              </p>

              <fieldset className="space-y-2 border-0 p-0 m-0">
                <Label>สถานะใหม่</Label>
                <Select
                  value={selectedStatus}
                  onValueChange={(v) => setSelectedStatus(v as RepairStatus)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกสถานะ" />
                  </SelectTrigger>
                  <SelectContent>
                    {repairStatusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {repairStatusLabels[status]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </fieldset>
            </section>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isLoading}>
              ยกเลิก
            </Button>
            <Button
              onClick={handleApply}
              disabled={!selectedStatus || selectedStatus === repair?.status || isLoading}
            >
              {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
              ดำเนินการต่อ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="ยืนยันการอัปเดตสถานะ"
        description={
          repair && selectedStatus
            ? `เปลี่ยนสถานะจาก "${repairStatusLabels[repair.status]}" เป็น "${repairStatusLabels[selectedStatus]}"?`
            : undefined
        }
        confirmLabel="ยืนยัน"
        isLoading={isLoading}
        onConfirm={handleConfirm}
      />
    </>
  );
}
