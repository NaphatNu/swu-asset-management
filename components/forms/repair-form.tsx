'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { repairFormSchema, type RepairFormValues } from '@/lib/validations';
import { priorityLabels, mockAssets } from '@/lib/mock-data';

interface RepairFormProps {
  defaultAssetId?: string;
  onSubmit: (data: RepairFormValues) => void;
  isSubmitting?: boolean;
}

export function RepairForm({
  defaultAssetId,
  onSubmit,
  isSubmitting,
}: RepairFormProps) {
  const form = useForm<RepairFormValues>({
    resolver: zodResolver(repairFormSchema),
    defaultValues: {
      assetId: defaultAssetId || '',
      description: '',
      priority: 'medium',
    },
  });

  const watchAssetId = form.watch('assetId');
  const asset = mockAssets.find((a) => a.assetId === watchAssetId);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">ข้อมูลการแจ้งซ่อม</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="assetId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>รหัสครุภัณฑ์ *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="เช่น 7440-001-0001"
                      {...field}
                      className="font-mono"
                    />
                  </FormControl>
                  <FormDescription>
                    รูปแบบ: XXXX-XXX-XXXX
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {asset && (
              <div className="rounded-lg bg-muted p-3 space-y-1">
                <p className="text-xs text-muted-foreground">พบครุภัณฑ์:</p>
                <p className="text-sm font-medium">{asset.name}</p>
                <p className="text-xs text-muted-foreground">{asset.location}</p>
              </div>
            )}

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ระดับความเร่งด่วน *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกระดับความเร่งด่วน" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(priorityLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>รายละเอียดปัญหา *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="อธิบายอาการเสีย ปัญหา หรือสิ่งที่ต้องการซ่อมบำรุง..."
                      className="min-h-[150px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    อธิบายอย่างน้อย 10 ตัวอักษร
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* File upload placeholder */}
            <div className="space-y-2">
              <label className="text-sm font-medium">แนบไฟล์ (ถ้ามี)</label>
              <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/50 p-8 transition-colors hover:border-muted-foreground/50">
                <div className="flex flex-col items-center gap-2 text-center">
                  <Upload className="size-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์
                  </p>
                  <p className="text-xs text-muted-foreground">
                    รองรับ JPG, PNG, PDF (ไม่เกิน 10MB)
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline">
            ยกเลิก
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'กำลังส่ง...' : 'ส่งแจ้งซ่อม'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
