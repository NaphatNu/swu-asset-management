'use client';

import { useCallback, useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ClipboardList, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  createRepairRequest,
  deleteRepairRequest,
  getRepairRequests,
  updateRepairStatus,
  type RepairListFilters,
} from '@/lib/api/repairs';
import type { RepairRequest, RepairStatus } from '@/types/asset';
import type { RepairFormValues } from '@/lib/validations';
import { RepairTable } from '@/components/repair/RepairTable';
import { RepairFilters } from '@/components/repair/RepairFilters';
import { RepairForm } from '@/components/forms';
import { RepairStatusUpdateDialog } from '@/components/repair/repair-status-update-dialog';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RepairStatusBadge } from '@/components/badge/status-badge';
import { Button } from '@/components/ui/button';

function RepairContent() {
  const searchParams = useSearchParams();
  const initialSerialNumber = searchParams.get('serialNumber') ?? undefined;

  const [activeTab, setActiveTab] = useState(initialSerialNumber ? 'new' : 'list');
  const [repairRequests, setRepairRequests] = useState<RepairRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filters, setFilters] = useState<RepairListFilters>({});
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: 0 });
  const [statusTarget, setStatusTarget] = useState<RepairRequest | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RepairRequest | null>(null);
  const [viewTarget, setViewTarget] = useState<RepairRequest | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadRepairRequests = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getRepairRequests({
        ...filters,
        page: pagination.page,
        pageSize: pagination.pageSize,
      });
      setRepairRequests(res.data);
      setPagination((prev) => ({ ...prev, total: res.total }));
    } catch {
      toast.error('ไม่สามารถโหลดรายการแจ้งซ่อมได้');
    } finally {
      setIsLoading(false);
    }
  }, [filters, pagination.page, pagination.pageSize]);

  useEffect(() => {
    if (activeTab === 'list') {
      loadRepairRequests();
    }
  }, [activeTab, loadRepairRequests]);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [filters]);

  const handleSubmit = async (data: RepairFormValues) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await createRepairRequest({
        assetId: data.assetId || '',
        description: data.description,
        status: data.repairStatus || 'open',
        type: data.type || 'internal-repair',
      });
      await loadRepairRequests();
      toast.success('ส่งแจ้งซ่อมสำเร็จ', {
        description: `รหัสครุภัณฑ์ ${data.serialNumber} ถูกส่งแจ้งซ่อมแล้ว`,
      });
      setActiveTab('list');
    } catch {
      toast.error('ไม่สามารถส่งแจ้งซ่อมได้', {
        description: 'กรุณาลองใหม่อีกครั้ง',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: RepairStatus) => {
    try {
      await updateRepairStatus(id, status);
      toast.success('อัปเดตสถานะสำเร็จ');
      await loadRepairRequests();
    } catch {
      toast.error('ไม่สามารถอัปเดตสถานะได้');
      throw new Error('update failed');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget || isDeleting) return;
    setIsDeleting(true);
    try {
      await deleteRepairRequest(deleteTarget.id);
      toast.success('ลบรายการแจ้งซ่อมสำเร็จ');
      setDeleteTarget(null);
      await loadRepairRequests();
    } catch {
      toast.error('ไม่สามารถลบรายการแจ้งซ่อมได้');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="แจ้งซ่อม" description="สร้างคำขอแจ้งซ่อมครุภัณฑ์และติดตามสถานะ" />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="list" className="gap-2">
            <ClipboardList className="size-4" />
            รายการแจ้งซ่อม
          </TabsTrigger>
          <TabsTrigger value="new" className="gap-2">
            <Plus className="size-4" />
            แจ้งซ่อมใหม่
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6 space-y-4">
          <RepairFilters
            filters={filters}
            onFiltersChange={(f) => {
              setFilters(f);
              setPagination((p) => ({ ...p, page: 1 }));
            }}
          />

          <RepairTable
            data={repairRequests}
            pagination={pagination}
            isLoading={isLoading}
            isDeletingId={isDeleting ? deleteTarget?.id ?? null : null}
            onPageChange={(p) => setPagination((prev) => ({ ...prev, page: p }))}
            onPageSizeChange={(s) =>
              setPagination((prev) => ({ ...prev, pageSize: s, page: 1 }))
            }
            onView={setViewTarget}
            onUpdateStatus={setStatusTarget}
            onDelete={setDeleteTarget}
          />
        </TabsContent>

        <TabsContent value="new" className="mt-6">
          <div className="max-w-2xl">
            <RepairForm
              defaultSerialNumber={initialSerialNumber}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        </TabsContent>
      </Tabs>

      <RepairStatusUpdateDialog
        repair={statusTarget}
        open={Boolean(statusTarget)}
        onOpenChange={(open) => !open && setStatusTarget(null)}
        onConfirm={handleStatusUpdate}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && !isDeleting && setDeleteTarget(null)}
        title="ยืนยันการลบรายการแจ้งซ่อม"
        description={
          deleteTarget
            ? `ต้องการลบรายการซ่อมของ "${deleteTarget.assetName}" หรือไม่?`
            : undefined
        }
        confirmLabel="ลบ"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
      />

      <Dialog open={Boolean(viewTarget)} onOpenChange={(open) => !open && setViewTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>รายละเอียดการแจ้งซ่อม</DialogTitle>
            <DialogDescription>{viewTarget?.serialNumber}</DialogDescription>
          </DialogHeader>
          {viewTarget && (
            <div className="space-y-3 text-sm">
              <p>
                <span className="text-muted-foreground">ครุภัณฑ์: </span>
                {viewTarget.assetName}
              </p>
              <p>
                <span className="text-muted-foreground">รายละเอียด: </span>
                {viewTarget.description}
              </p>
              <p className="flex items-center gap-2">
                <span className="text-muted-foreground">สถานะ: </span>
                <RepairStatusBadge status={viewTarget.status} />
              </p>
              <p>
                <span className="text-muted-foreground">ผู้แจ้ง: </span>
                {viewTarget.reportedByName}
              </p>
              <p>
                <span className="text-muted-foreground">วันที่แจ้ง: </span>
                {new Date(viewTarget.createdAt).toLocaleString('th-TH')}
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setViewTarget(null);
                  setStatusTarget(viewTarget);
                }}
              >
                อัปเดตสถานะ
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function RepairPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <RepairContent />
    </Suspense>
  );
}
