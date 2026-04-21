'use client';

import { formatDistanceToNow } from 'date-fns';
import { th } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { mockActivityLogs } from '@/mocks/activityLogs';
import {
  Plus,
  Edit,
  Wrench,
  QrCode,
  MoveRight,
  LucideIcon,
} from 'lucide-react';

const actionIcons: Record<string, LucideIcon> = {
  'เพิ่มครุภัณฑ์ใหม่': Plus,
  'แก้ไขข้อมูล': Edit,
  'แจ้งซ่อม': Wrench,
  'สร้าง QR Code': QrCode,
  'ย้ายครุภัณฑ์': MoveRight,
};

const actionColors: Record<string, string> = {
  'เพิ่มครุภัณฑ์ใหม่': 'bg-primary/10 text-primary',
  'แก้ไขข้อมูล': 'bg-chart-4/10 text-chart-4',
  'แจ้งซ่อม': 'bg-destructive/10 text-destructive',
  'สร้าง QR Code': 'bg-chart-2/10 text-chart-2',
  'ย้ายครุภัณฑ์': 'bg-chart-3/10 text-chart-3',
};

export function ActivityList() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          กิจกรรมล่าสุด
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px] md:h-[350px]">
          <div className="space-y-1 p-4 pt-0">
            {mockActivityLogs.map((log) => {
              const Icon = actionIcons[log.action] || Edit;
              const colorClass = actionColors[log.action] || 'bg-muted text-muted-foreground';

              return (
                <div
                  key={log.id}
                  className="flex gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50"
                >
                  <div
                    className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${colorClass}`}
                  >
                    <Icon className="size-4" />
                  </div>
                  <div className="flex-1 space-y-1 overflow-hidden">
                    <p className="text-sm font-medium leading-tight">
                      {log.action}
                    </p>
                    {log.assetName && (
                      <p className="text-xs text-muted-foreground truncate">
                        {log.assetName}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Avatar className="size-4">
                        <AvatarFallback className="text-[8px]">
                          {log.userName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate">{log.userName}</span>
                      <span className="shrink-0">•</span>
                      <span className="shrink-0">
                        {formatDistanceToNow(new Date(log.timestamp), {
                          addSuffix: true,
                          locale: th,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
