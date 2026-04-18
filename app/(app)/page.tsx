'use client';

import { useEffect, useState } from 'react';
import { Package, CheckCircle2, Wrench, AlertTriangle } from 'lucide-react';
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

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="ครุภัณฑ์ทั้งหมด"
          value={stats.totalAssets}
          icon={Package}
          variant="primary"
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="พร้อมใช้งาน"
          value={stats.availableAssets}
          icon={CheckCircle2}
          variant="success"
        />
        <StatsCard
          title="ซ่อมบำรุง"
          value={stats.inRepairAssets}
          icon={Wrench}
          variant="warning"
        />
        <StatsCard
          title="ชำรุด"
          value={stats.damagedAssets}
          icon={AlertTriangle}
          variant="destructive"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <StatusPieChart />
        <CategoryBarChart />
      </div>
    </div>
  );
}