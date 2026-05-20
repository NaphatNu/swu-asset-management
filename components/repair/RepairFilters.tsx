'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { repairStatusLabels } from '@/constants/asset';
import type { RepairListFilters } from '@/lib/api/repairs';
import type { RepairStatus } from '@/types/asset';

interface RepairFiltersProps {
  filters: RepairListFilters;
  onFiltersChange: (filters: RepairListFilters) => void;
}

export function RepairFilters({ filters, onFiltersChange }: RepairFiltersProps) {
  const hasActiveFilters = Boolean(filters.search || filters.status);

  return (
    <section className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <label className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="ค้นหาหมายเลขครุภัณฑ์ หรือชื่อ..."
          className="pl-8"
          value={filters.search || ''}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
        />
        {filters.search && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 size-7 -translate-y-1/2"
            onClick={() => onFiltersChange({ ...filters, search: '' })}
          >
            <X className="size-4" />
          </Button>
        )}
      </label>
      <Select
        value={filters.status || 'all'}
        onValueChange={(v) =>
          onFiltersChange({
            ...filters,
            status: v === 'all' ? undefined : (v as RepairStatus),
          })
        }
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="สถานะทั้งหมด" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">สถานะทั้งหมด</SelectItem>
          {(Object.keys(repairStatusLabels) as RepairStatus[]).map((status) => (
            <SelectItem key={status} value={status}>
              {repairStatusLabels[status]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hasActiveFilters && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onFiltersChange({ search: '', status: undefined })}
          aria-label="ล้างตัวกรอง"
        >
          <X className="size-4" />
        </Button>
      )}
    </section>
  );
}
