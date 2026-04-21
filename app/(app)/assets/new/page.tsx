'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { PageHeader } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { AssetForm } from '@/components/forms';
import { createAsset } from '@/lib/api';
import type { AssetFormValues } from '@/lib/validations';

export default function NewAssetPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const handleSubmit = async (data: AssetFormValues) => {
    setIsSubmitting(true);

    try {
      await createAsset(data);
      toast.success('เพิ่มครุภัณฑ์สำเร็จ', {
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

  const handleCancel = () => {
    router.push('/assets');
    console.log('ยกเลิกการเพิ่มครุภัณฑ์');
  };


  return (
    <div className="space-y-6">
      <PageHeader title="เพิ่มครุภัณฑ์ใหม่" description="กรอกข้อมูลครุภัณฑ์ที่ต้องการเพิ่มเข้าระบบ">
        <Button variant="ghost" asChild>
          <Link href="/assets">
            <ArrowLeft className="mr-2 size-4" />
            กลับ
          </Link>
        </Button>
      </PageHeader>

      <div className="max-w-3xl mx-auto">
        <AssetForm onSubmit={handleSubmit} isSubmitting={isSubmitting} onCancel={handleCancel}/>
      </div>
    </div>
  );
}
