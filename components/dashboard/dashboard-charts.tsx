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
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getDashboardStats } from '@/lib/api';
import { useEffect, useState } from 'react';
import { DashboardStats } from '@/types/asset';

// --- กราฟวงกลมแสดงสถานะ ---
export function StatusPieChart() {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    getDashboardStats().then(setDashboardStats);
  }, []);

  const statusData = dashboardStats ? [
    { name: 'พร้อมใช้งาน', value: dashboardStats.available, color: '#10b981' },
    { name: 'ยืมใช้ภายใน', value: dashboardStats.onLoan, color: '#3b82f6' },
    { name: 'ซ่อม (ภายใน)', value: dashboardStats.internalRepair, color: '#f59e0b' },
    { name: 'ซ่อม (ภายนอก)', value: dashboardStats.externalRepair, color: '#d97706' },
    { name: 'รอจำหน่าย', value: dashboardStats.pendingDisposal, color: '#ef4444' },
    { name: 'สูญหาย', value: dashboardStats.missing, color: '#64748b' },
    { name: 'จำหน่ายแล้ว', value: dashboardStats.disposed, color: '#1e293b' },
  ].filter(item => item.value > 0) : [];

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">สถานะครุภัณฑ์</CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-[220px] md:h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
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
                        <p className="text-sm text-muted-foreground">{data.value} รายการ</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
          {statusData.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-[11px] text-muted-foreground truncate">{item.name}: {item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// --- กราฟแท่งแสดงตามประเภท (เพิ่ม Export ตรงนี้) ---
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
        <CardTitle className="text-base font-semibold">จำนวนตามประเภท</CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-[220px] md:h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} layout="vertical" margin={{ left: -20 }}>
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
                cursor={{ fill: 'transparent' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-md">
                        <p className="text-sm font-medium">{data.name}</p>
                        <p className="text-sm text-muted-foreground">{data.count} รายการ</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="count"
                fill="#3b82f6"
                radius={[0, 4, 4, 0]}
                maxBarSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}