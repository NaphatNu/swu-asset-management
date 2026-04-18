'use client';

import { MapPin, Calendar, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from './status-badge';
import { categoryLabels } from '@/lib/mock-data';
import type { Asset } from '@/types/asset';
import { cn } from '@/lib/utils';

interface AssetCardProps {
  asset: Asset;
  onClick?: () => void;
  className?: string;
}

export function AssetCard({ asset, onClick, className }: AssetCardProps) {
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
                {asset.assetId}
              </span>
              <StatusBadge status={asset.status} />
            </div>
            <h3 className="font-semibold text-sm leading-tight line-clamp-2">
              {asset.name}
            </h3>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Tag className="size-3" />
                <span>{categoryLabels[asset.category]}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="size-3" />
                <span className="truncate max-w-[150px]">{asset.location}</span>
              </div>
              {asset.purchaseDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="size-3" />
                  <span>
                    {new Date(asset.purchaseDate).toLocaleDateString('th-TH', {
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
