import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { AssetStatus, RepairPriority, RepairStatus } from '@/types/asset';
import { statusLabels, priorityLabels, repairStatusLabels } from '@/constants/asset';

interface StatusBadgeProps {
  status: AssetStatus;
  className?: string;
}

const statusStyles: Record<AssetStatus, string> = {
  available: 'bg-success/10 text-success border-success/20 hover:bg-success/20',
  'on-loan': 'bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20',
  'internal-repair': 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/20',
  'external-repair': 'bg-orange-500/10 text-orange-600 border-orange-500/20 hover:bg-orange-500/20',
  'pending-disposal': 'bg-purple-500/10 text-purple-600 border-purple-500/20 hover:bg-purple-500/20',
  missing: 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20',
  disposed: 'bg-muted text-muted-foreground border-muted hover:bg-muted/80',
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn('font-medium', statusStyles[status], className)}
    >
      {statusLabels[status]}
    </Badge>
  );
}

interface PriorityBadgeProps {
  priority: RepairPriority;
  className?: string;
}

const priorityStyles: Record<RepairPriority, string> = {
  low: 'bg-muted text-muted-foreground border-muted',
  medium: 'bg-primary/10 text-primary border-primary/20',
  high: 'bg-warning/10 text-warning border-warning/20',
  urgent: 'bg-destructive/10 text-destructive border-destructive/20',
};

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn('font-medium', priorityStyles[priority], className)}
    >
      {priorityLabels[priority]}
    </Badge>
  );
}

interface RepairStatusBadgeProps {
  status: RepairStatus;
  className?: string;
}

const repairStatusStyles: Record<RepairStatus, string> = {
  'internal-repair': 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/20',
  'external-repair': 'bg-orange-500/10 text-orange-600 border-orange-500/20 hover:bg-orange-500/20',
};

export function RepairStatusBadge({ status, className }: RepairStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn('font-medium', repairStatusStyles[status], className)}
    >
      {repairStatusLabels[status]}
    </Badge>
  );
}
