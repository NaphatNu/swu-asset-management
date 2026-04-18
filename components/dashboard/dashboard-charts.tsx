'use client';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getDashboardStats } from '@/lib/api';
import { useEffect, useState } from 'react';
import { DashboardStats } from '@/types/asset';




export function StatusPieChart() {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    getDashboardStats().then(setDashboardStats);
  }, []);

  const total = dashboardStats?.totalAssets ?? 0;
  const available = dashboardStats?.availableAssets ?? 0;
  const inRepair = dashboardStats?.inRepairAssets ?? 0;
  const damaged = dashboardStats?.damagedAssets ?? 0;
  const inUse = Math.max(0, total - available - inRepair - damaged);

  const statusData = [
    { name: 'พร้อมใช้งาน', value: available, color: 'var(--chart-1)' },
    { name: 'กำลังใช้งาน', value: inUse, color: 'var(--chart-2)' },
    { name: 'ซ่อมบำรุง', value: inRepair, color: 'var(--chart-4)' },
    { name: 'ชำรุด', value: damaged, color: 'var(--chart-5)' },
  ];

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">สถานะครุภัณฑ์</CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-[200px] md:h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-md">
                        <p className="text-sm font-medium">{data.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {data.value} รายการ
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {statusData.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="size-3 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-muted-foreground truncate">
                {item.name}: {item.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function CategoryBarChart() {

  const categoryData = [
    { name: 'คอมพิวเตอร์', count: 45 },
    { name: 'เฟอร์นิเจอร์', count: 62 },
    { name: 'อุปกรณ์', count: 38 },
    { name: 'ยานพาหนะ', count: 8 },
    { name: 'อื่นๆ', count: 3 },
  ];
  
  

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          จำนวนตามประเภท
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-[200px] md:h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} layout="vertical">
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                width={80}
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-md">
                        <p className="text-sm font-medium">{data.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {data.count} รายการ
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="count"
                fill="var(--chart-1)"
                radius={[0, 4, 4, 0]}
                maxBarSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
