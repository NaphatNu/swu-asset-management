'use client';

import { useEffect, useState } from 'react';
import { 
  Package, 
  CheckCircle2, 
  Wrench, 
  AlertTriangle, 
  Users, 
  Settings, 
  HelpCircle, 
  Trash2 
} from 'lucide-react';
import { PageHeader } from '@/components/layout';
import {
  StatsCard,
  StatusPieChart,
  CategoryBarChart,
} from '@/components/dashboard';
import { getDashboardStats } from '@/lib/api';
import type { DashboardStats } from '@/types/asset';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="p-6 text-muted-foreground">
        กำลังโหลดข้อมูล...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="แดชบอร์ด"
        description="ภาพรวมระบบจัดการครุภัณฑ์ คณะวิศวกรรมศาสตร์ มศว"
      />

      {/* Stats Cards - แถวที่ 1: สถานะการใช้งานทั่วไป */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="ครุภัณฑ์ทั้งหมด"
          value={stats.total}
          icon={Package}
          variant="primary"
        />
        <StatsCard
          title="ใช้งานปกติ"
          value={stats.available}
          icon={CheckCircle2}
          variant="success"
        />
        <StatsCard
          title="ยืมใช้ภายใน"
          value={stats.onLoan}
          icon={Users}
          variant="primary"
        />
        <StatsCard
          title="สูญหาย"
          value={stats.missing}
          icon={HelpCircle}
          variant="destructive"
        />
      </div>

      {/* Stats Cards - แถวที่ 2: สถานะการซ่อมบำรุงและจำหน่าย */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="ซ่อม (ภายใน)"
          value={stats.internalRepair}
          icon={Wrench}
          variant="warning"
        />
        <StatsCard
          title="ซ่อม (ภายนอก)"
          value={stats.externalRepair}
          icon={Settings}
          variant="warning"
        />
        <StatsCard
          title="รอจำหน่าย"
          value={stats.pendingDisposal}
          icon={AlertTriangle}
          variant="destructive"
        />
        <StatsCard
          title="จำหน่ายแล้ว"
          value={stats.disposed}
          icon={Trash2}
          variant="secondary"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <StatusPieChart />
        {/* <CategoryBarChart /> */}
      </div>
    </div>
  );
}