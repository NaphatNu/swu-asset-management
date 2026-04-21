import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'destructive';
  className?: string;
}

const variantStyles = {
  default: 'bg-card border-border',
  // Blue - เพิ่มความสดใสให้ "ครุภัณฑ์ทั้งหมด" และ "ยืมใช้"
  primary: 'bg-blue-100/80 border-blue-300/50 dark:bg-blue-900/40 dark:border-blue-700/50',
  // Slate - ให้สีเทาที่ชัดเจนสำหรับ "จำหน่ายแล้ว"
  secondary: 'bg-slate-100/80 border-slate-300/50 dark:bg-slate-800/60 dark:border-slate-700/50',
  // Emerald - เขียวแบบตะโกนว่า "พร้อมใช้งาน"
  success: 'bg-emerald-100/80 border-emerald-300/50 dark:bg-emerald-900/40 dark:border-emerald-700/50',
  // Amber - ส้ม/เหลืองที่ดูออกว่า "กำลังซ่อม"
  warning: 'bg-amber-100/80 border-amber-300/50 dark:bg-amber-900/40 dark:border-amber-700/50',
  // Red - แดงที่เตือนชัดๆ ว่า "ชำรุด/สูญหาย"
  destructive: 'bg-red-100/80 border-red-300/50 dark:bg-red-900/40 dark:border-red-700/50',
};

const iconVariantStyles = {
  default: 'bg-muted text-muted-foreground',
  primary: 'bg-blue-600 text-white shadow-md shadow-blue-200/50',
  secondary: 'bg-slate-600 text-white shadow-md shadow-slate-200/50',
  success: 'bg-emerald-600 text-white shadow-md shadow-emerald-200/50',
  warning: 'bg-amber-500 text-white shadow-md shadow-amber-200/50',
  destructive: 'bg-red-600 text-white shadow-md shadow-red-200/50',
};

export function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  variant = 'default',
  className,
}: StatsCardProps) {
  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all hover:shadow-md',
        variantStyles[variant],
        className
      )}
    >
      <CardContent className="p-4 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold tracking-tight md:text-3xl">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
            {trend && (
              <p
                className={cn(
                  'text-xs font-medium',
                  trend.isPositive ? 'text-success' : 'text-destructive'
                )}
              >
                {trend.isPositive ? '+' : '-'}
                {Math.abs(trend.value)}% จากเดือนที่แล้ว
              </p>
            )}
          </div>
          <div
            className={cn(
              'flex size-12 shrink-0 items-center justify-center rounded-xl shadow-sm md:size-14',
              iconVariantStyles[variant]
            )}
          >
            <Icon className="size-5 md:size-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
