'use client';

import { useEffect, useMemo, useState } from 'react';
import { Camera, Mail, Building, Shield, Save } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useSession } from 'next-auth/react';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const initials = (user?.name ?? user?.email ?? '?').slice(0, 1).toUpperCase();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
  });

  useEffect(() => {
    if (status !== 'authenticated') return;
    setFormData((prev) => ({
      ...prev,
      name: user?.name ?? '',
      email: user?.email ?? '',
    }));
  }, [status, user?.name, user?.email]);

  const handleSave = () => {
    // Simulate API call
    toast.success('บันทึกข้อมูลสำเร็จ');
    setIsEditing(false);
  };

  const roleLabels: Record<string, string> = {
    admin: 'ผู้ดูแลระบบ',
    staff: 'เจ้าหน้าที่',
    viewer: 'ผู้ใช้ทั่วไป',
  };

  const roleLabel = useMemo(() => {
    const firstRole = session?.roles?.[0];
    if (!firstRole) return undefined;
    return roleLabels[firstRole] ?? firstRole;
  }, [session?.roles]);

  if (status === 'loading') {
    return (
      <div className="p-6 text-muted-foreground">กำลังโหลดข้อมูล...</div>
    );
  }

  if (status === 'unauthenticated') {
    // Should not happen due to middleware, but keep UI safe.
    return <div className="p-6 text-muted-foreground">กรุณาเข้าสู่ระบบ</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="โปรไฟล์"
        description="จัดการข้อมูลส่วนตัวและการตั้งค่าบัญชี"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="flex flex-col items-center pt-6">
            <div className="relative">
              <Avatar className="size-24 border-4 border-primary/20">
                <AvatarImage
                  src={user?.image ?? undefined}
                  alt={user?.name ?? user?.email ?? 'User'}
                />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="secondary"
                className="absolute -bottom-2 -right-2 size-8 rounded-full"
              >
                <Camera className="size-4" />
              </Button>
            </div>

            <h2 className="mt-4 text-xl font-semibold">
              {user?.name ?? 'Signed in'}
            </h2>
            {user?.email && (
              <p className="text-sm text-muted-foreground">{user.email}</p>
            )}

            {roleLabel && (
              <div className="mt-4 flex items-center gap-2">
                <Badge variant="secondary">
                  <Shield className="mr-1 size-3" />
                  {roleLabel}
                </Badge>
              </div>
            )}

            <Separator className="my-6" />

            <div className="w-full space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">อีเมล:</span>
                <span className="truncate">{user?.email ?? '-'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Building className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">หน่วยงาน:</span>
                <span className="truncate">
                  {formData.department || '-'}
                </span>
              </div>
            </div>

            {/* <Button
              variant="outline"
              className="mt-6 w-full"
              onClick={() => setIsEditing(true)}
            >
              แก้ไขโปรไฟล์
            </Button> */}
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">ข้อมูลส่วนตัว</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">ชื่อ-นามสกุล</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">อีเมล</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                อีเมลถูกเชื่อมต่อกับบัญชี Microsoft ไม่สามารถเปลี่ยนได้
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">หน่วยงาน</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
                disabled={!isEditing}
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-medium">การเชื่อมต่อบัญชี</h3>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded bg-[#0078d4]">
                    <svg
                      className="size-6 text-white"
                      viewBox="0 0 23 23"
                      fill="currentColor"
                    >
                      <path d="M0 0h11v11H0zM12 0h11v11H12zM0 12h11v11H0zM12 12h11v11H12z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Microsoft</p>
                    <p className="text-xs text-muted-foreground">
                      เชื่อมต่อแล้ว
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-success/10 text-success">
                  เชื่อมต่อแล้ว
                </Badge>
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  ยกเลิก
                </Button>
                <Button onClick={handleSave}>
                  <Save className="mr-2 size-4" />
                  บันทึก
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
