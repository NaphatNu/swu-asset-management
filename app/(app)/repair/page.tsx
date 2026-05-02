'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ClipboardList, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createRepairRequest, getRepairRequests } from '@/lib/api';
import type { RepairRequest } from '@/types/asset';
import type { RepairFormValues } from '@/lib/validations';
import { RepairTable } from '@/components/repair/RepairTable';
import { RepairFilters } from '@/components/repair/RepairFilters';
import { RepairForm } from '@/components/forms';

function RepairContent() {
  const searchParams = useSearchParams();
  const initialSerialNumber = searchParams.get('serialNumber') ?? undefined;

  const [activeTab, setActiveTab] = useState(initialSerialNumber ? 'new' : 'list');
  const [repairRequests, setRepairRequests] = useState<RepairRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // States สำหรับ Filter & Pagination
  const [filters, setFilters] = useState({ search: '', status: undefined });
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: 0 });

  const loadRepairRequests = async () => {
    setIsLoading(true);
    try {
      // ส่งทั้ง filters และ pagination ไปยัง API
      const res = await getRepairRequests({
        ...filters,
        page: pagination.page,
        pageSize: pagination.pageSize
      });
      setRepairRequests(res.data);
      setPagination(prev => ({ ...prev, total: res.total }));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRepairRequests();
  }, [filters, pagination.page, pagination.pageSize]);

  const handleSubmit = async (data: RepairFormValues) => {
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
    } catch (error) {
      toast.error('ไม่สามารถส่งแจ้งซ่อมได้', {
        description: 'กรุณาลองใหม่อีกครั้ง',
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="แจ้งซ่อม" description="สร้างคำขอแจ้งซ่อมครุภัณฑ์และติดตามสถานะ" />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="list" className="gap-2"><ClipboardList className="size-4" />รายการแจ้งซ่อม</TabsTrigger>
            <TabsTrigger value="new" className="gap-2"><Plus className="size-4" />แจ้งซ่อมใหม่</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="list" className="mt-6 space-y-4">
          <RepairFilters filters={filters} onFiltersChange={(f: any) => {
            setFilters(f);
            setPagination(p => ({ ...p, page: 1 })); // Reset หน้าเมื่อ Filter เปลี่ยน
          }} />

          <RepairTable
            data={repairRequests}
            pagination={pagination}
            onPageChange={(p) => setPagination(prev => ({ ...prev, page: p }))}
            onPageSizeChange={(s) => setPagination(prev => ({ ...prev, pageSize: s, page: 1 }))}
            onView={(req) => {/* Open Drawer/Dialog */ }}
          />
        </TabsContent>

        <TabsContent value="new" className="mt-6">
          <div className="max-w-2xl ">
            <RepairForm
              defaultSerialNumber={initialSerialNumber}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        </TabsContent>
      </Tabs>
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
