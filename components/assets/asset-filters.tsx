'use client';

import { Search, X, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import {
  statusLabels,
  locationOptions,
  conditionLabels,
} from '@/constants/asset';
import type {
  AssetFilters as AssetFiltersType,
  AssetStatus,
  LocationOption,
  AssetCondition,
} from '@/types/asset';
import { useIsMobile } from '@/hooks/use-mobile';

interface AssetFiltersProps {
  filters: AssetFiltersType;
  onFiltersChange: (filters: AssetFiltersType) => void;
}

export function AssetFilters({ filters, onFiltersChange }: AssetFiltersProps) {
  const isMobile = useIsMobile();

  const activeFiltersCount = [
    filters.assetName,
    filters.status,
    filters.location,
    filters.condition,
    filters.fiscalYear,
  ].filter(Boolean).length;

  const clearFilters = () => {
    onFiltersChange({ assetName: filters.assetName });
  };

  const fiscalYearSelect = (
    <Input
      placeholder="ค้นหาปีงบประมาณ..."
      value={filters.fiscalYear || ''}
      onChange={(e) =>
        onFiltersChange({
          ...filters,
          fiscalYear: e.target.value || undefined,
        })
      }
      className={isMobile ? 'w-full' : 'w-[130px]'}
    />
  );

  const FilterContent = () => (
    <div className="space-y-4">
      <div className="space-y-2 px-4">
        <label className="text-sm font-medium">ปีงบประมาณ</label>
        {fiscalYearSelect}
      </div>

      <div className="space-y-2 px-4">
        <label className="text-sm font-medium">สถานที่ตั้ง</label>
        <Select
          value={filters.location || 'all'}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              location: value === 'all' ? undefined : (value as LocationOption),
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="ทั้งหมด" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทั้งหมด</SelectItem>
            {locationOptions.map((loc) => (
              <SelectItem key={loc} value={loc}>
                {loc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 px-4">
        <label className="text-sm font-medium">สถานะ</label>
        <Select
          value={filters.status || 'all'}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              status: value === 'all' ? undefined : (value as AssetStatus),
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="ทั้งหมด" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทั้งหมด</SelectItem>
            {Object.entries(statusLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 px-4">
        <label className="text-sm font-medium">สภาพปัจจุบัน</label>
        <Select
          value={filters.condition || 'all'}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              condition: value === 'all' ? undefined : (value as AssetCondition),
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="ทั้งหมด" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทั้งหมด</SelectItem>
            {Object.entries(conditionLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {activeFiltersCount > 0 && (
        <div className="px-4">
          <Button variant="outline" className="w-full" onClick={clearFilters}>
            <X className="mr-2 size-4" />
            ล้างตัวกรอง
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="ค้นหาด้วยชื่อครุภัณฑ์..."
          value={filters.assetName || ''}
          onChange={(e) =>
            onFiltersChange({ ...filters, assetName: e.target.value })
          }
          className="pl-9"
        />
        {filters.assetName && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 size-7 -translate-y-1/2"
            onClick={() => onFiltersChange({ ...filters, assetName: '' })}
          >
            <X className="size-4" />
          </Button>
        )}
      </div>

      {isMobile ? (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="shrink-0">
              <Filter className="mr-2 size-4" />
              ตัวกรอง
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-auto max-h-[90vh] overflow-y-auto rounded-t-xl">
            <SheetHeader className="mb-4">
              <SheetTitle>ตัวกรอง</SheetTitle>
              <SheetDescription>กรองรายการครุภัณฑ์ตามเงื่อนไข</SheetDescription>
            </SheetHeader>
            <div className="pb-4">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <div className="flex items-center gap-2 flex-wrap lg:flex-nowrap">
          {fiscalYearSelect}
          <Select
            value={filters.location || 'all'}
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                location: value === 'all' ? undefined : (value as LocationOption),
              })
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="สถานที่ตั้ง" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทุกสถานที่</SelectItem>
              {locationOptions.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.status || 'all'}
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                status: value === 'all' ? undefined : (value as AssetStatus),
              })
            }
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="สถานะ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทุกสถานะ</SelectItem>
              {Object.entries(statusLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.condition || 'all'}
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                condition: value === 'all' ? undefined : (value as AssetCondition),
              })
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="สภาพปัจจุบัน" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทุกสภาพ</SelectItem>
              {Object.entries(conditionLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="icon" onClick={clearFilters} aria-label="ล้างตัวกรอง">
              <X className="size-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
