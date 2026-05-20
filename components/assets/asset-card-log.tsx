'use client';

import { MapPin, Calendar, Tag, UserCircle, CalendarDays, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ActionBadge, StatusBadge } from '../badge/status-badge';
import { categoryLabels } from '@/constants/asset';
import type { Asset, AssetLog } from '@/types/asset';
import { cn } from '@/lib/utils';

interface AssetCardProps {
  assetLog: AssetLog;
  onClick?: () => void;
  className?: string;
}

export function AssetCardLog({ assetLog, onClick, className }: AssetCardProps) {
  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:shadow-md hover:border-primary/30 active:scale-[0.98]',
        className
      )}
      onClick={onClick}
    >
 <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2 overflow-hidden">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">
                {assetLog.serialNumber}
              </span>
              <ActionBadge action={assetLog.action} />
            </div>
            <h3 className="font-semibold text-sm leading-tight line-clamp-2">
              {assetLog.assetName}
            </h3>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="size-3" />
                <span className="truncate max-w-[150px]">{assetLog.createdByName}</span>
              </div>
              {assetLog.createdAt && (
                <div className="flex items-center gap-1">
                  <CalendarDays className="size-3" />
                  <span>
                    {new Date(assetLog.createdAt).toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
