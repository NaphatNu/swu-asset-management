'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ClipboardList, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RepairForm } from '@/components/forms/repair-form';
import { PriorityBadge, RepairStatusBadge } from '@/components/assets';
import { createRepairRequest, getRepairRequests } from '@/lib/api';
import type { RepairRequest } from '@/types/asset';
import type { RepairFormValues } from '@/lib/validations';
import { useSession } from 'next-auth/react';

function RepairContent() {
  const searchParams = useSearchParams();
  const initialSerialNumber = searchParams.get('serialNumber') || undefined;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState(initialSerialNumber ? 'new' : 'list');
  const [repairRequests, setRepairRequests] = useState<RepairRequest[]>([]);

  const { data: session } = useSession();

  const loadRepairRequests = async () => {
    const data = await getRepairRequests();
    setRepairRequests(data);
  };

  useEffect(() => {
    getRepairRequests().then(setRepairRequests);
  }, []);

  const handleSubmit = async (data: RepairFormValues) => {
    setIsSubmitting(true);
    try {
      await createRepairRequest({
        serialNumber: data.serialNumber,
        name: data.name || 'ไม่ระบุชื่อครุภัณฑ์',
        description: data.description,
        repairStatus: data.repairStatus,
        reportedBy: session?.user?.email
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
      <PageHeader
        title="แจ้งซ่อม"
        description="สร้างคำขอแจ้งซ่อมครุภัณฑ์และติดตามสถานะ"
      />

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

        <TabsContent value="list" className="mt-6">
          <div className="space-y-4">
            {repairRequests.map((request) => (
              <Card
                key={request.id}
                className="cursor-pointer transition-all hover:shadow-md"
              >
                <CardContent className="p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-sm text-muted-foreground">
                          {request.serialNumber}
                        </span>
                        {/* <PriorityBadge priority={request.priority} /> */}
                        <RepairStatusBadge status={request.repairStatus} />
                      </div>
                      <h3 className="font-medium">{request.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {request.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span>แจ้งโดย: {request.reportedBy}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>
                          {new Date(request.requestDate).toLocaleDateString(
                            'th-TH',
                            {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            }
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* {request.notes && (
                    <div className="mt-3 rounded-lg bg-muted p-3">
                      <p className="text-xs text-muted-foreground">หมายเหตุ:</p>
                      <p className="text-sm">{request.notes}</p>
                    </div>
                  )} */}
                </CardContent>
              </Card>
            ))}

            {repairRequests.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <ClipboardList className="size-12 text-muted-foreground/50" />
                  <p className="mt-4 text-muted-foreground">
                    ยังไม่มีรายการแจ้งซ่อม
                  </p>
                  <Button
                    className="mt-4"
                    onClick={() => setActiveTab('new')}
                  >
                    <Plus className="mr-2 size-4" />
                    แจ้งซ่อมใหม่
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
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
