import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Action, AssetCondition, AssetStatus, RepairPriority, RepairStatus, RepairType } from '@/types/asset';
import { statusLabels, priorityLabels, repairStatusLabels, conditionLabels, repairTypeLabels, actionLabels } from '@/constants/asset';

interface StatusBadgeProps {
  status: AssetStatus;
  className?: string;
}

const statusStyles: Record<AssetStatus, string> = {
  available: 'bg-success/10 text-success border-success/20 hover:bg-success/20',
  'in-use': 'bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20',
  'under-repair': 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/20',
  'pending-disposal': 'bg-purple-500/10 text-purple-600 border-purple-500/20 hover:bg-purple-500/20',
  lost: 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20',
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

interface ConditionBadgeProps {
  condition: AssetCondition;
  className?: string;
}
  
const conditionStyles: Record<AssetCondition, string> = {
  normal: 'bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20',
  'minor-damage': 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20 hover:bg-yellow-500/20',
  'major-damage': 'bg-orange-500/10 text-orange-600 border-orange-500/20 hover:bg-orange-500/20',
  critical: 'bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20',
};

export function ConditionBadge({ condition, className }: ConditionBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn('font-medium', conditionStyles[condition], className)}
    >
      {conditionLabels[condition]}
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
  'open': 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20 hover:bg-yellow-500/20',
  'in-progress': 'bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20',
  'completed': 'bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20',
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

interface RepairTypeBadgeProps {
  type: RepairType;
  className?: string;
}

const repairTypeStyles: Record<RepairType, string> = {
  'internal-repair': 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/20',
  'external-repair': 'bg-orange-500/10 text-orange-600 border-orange-500/20 hover:bg-orange-500/20',
};

export function RepairTypeBadge({ type, className }: RepairTypeBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn('font-medium', repairTypeStyles[type], className)}
    >
      {repairTypeLabels[type]}
    </Badge>
  );
}

interface ActionBadgeProps {
  action: Action;
  className?: string;
}

const actionStyles: Record<Action, string> = {
  'update-condition': 'bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20',
  'update-status': 'bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20',
  'update-repair': 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20 hover:bg-yellow-500/20',
  'move': 'bg-orange-500/10 text-orange-600 border-orange-500/20 hover:bg-orange-500/20',
};

export function ActionBadge({ action, className }: ActionBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn('font-medium', actionStyles[action], className)}
    >
      {actionLabels[action]}
    </Badge>
  );
}
