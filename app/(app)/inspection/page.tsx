'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { PageHeader } from '@/components/layout';
import { Button } from '@/components/ui/button';
import type { InspectionFormValues } from '@/lib/validations';
import { InspectionForm } from '@/components/forms/inspection-form';
import { createInspection } from '@/lib/api/inspection';

function NewInspectionContent() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
      const searchParams = useSearchParams();
    const initialSerialNumber = searchParams.get('serialNumber') || undefined;

    const handleSubmit = async (data: InspectionFormValues) => {
        console.log('ข้อมูลที่ส่งไปยัง API:', data);
        setIsSubmitting(true);

        try {
            await createInspection({
                assetId: data.assetId,
                serialNumber: data.serialNumber,
                condition: data.condition,
                note: data.note,
                updateStatus: data.updateStatus,
            });
            toast.success('เพิ่มการตรวจสอบสำเร็จ', {
                description: `รหัส ${data.serialNumber} ถูกเพิ่มเข้าระบบแล้ว`,
            });
            router.push('/assets');
        } catch (error) {
            toast.error('ไม่สามารถเพิ่มครุภัณฑ์ได้', {
                description: 'กรุณาลองใหม่อีกครั้ง',
            });
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader title="เพิ่มการตรวจสอบใหม่" description="กรอกข้อมูลการตรวจสอบที่ต้องการเพิ่มเข้าระบบ">
                <Button variant="ghost" asChild>
                    <Link href="/assets">
                        <ArrowLeft className="mr-2 size-4" />
                        กลับ
                    </Link>
                </Button>
            </PageHeader>

            <div className="max-w-3xl">
                <InspectionForm
                    defaultSerialNumber={initialSerialNumber}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                />
            </div>
        </div>
    );
}

export default function NewInspectionPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <NewInspectionContent />
    </Suspense>
  );
}