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
import { categoryLabels, statusLabels, locationOptions } from '@/lib/mock-data';
import type { AssetFilters as AssetFiltersType, AssetCategory, AssetStatus } from '@/types/asset';
import { useIsMobile } from '@/hooks/use-mobile';

interface AssetFiltersProps {
  filters: AssetFiltersType;
  onFiltersChange: (filters: AssetFiltersType) => void;
}

export function AssetFilters({ filters, onFiltersChange }: AssetFiltersProps) {
  const isMobile = useIsMobile();

  const activeFiltersCount = [
    filters.category,
    filters.status,
    filters.location,
  ].filter(Boolean).length;

  const clearFilters = () => {
    onFiltersChange({ search: filters.search });
  };

  const FilterContent = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">ประเภท</label>
        <Select
          value={filters.category || 'all'}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              category: value === 'all' ? undefined : (value as AssetCategory),
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="ทั้งหมด" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทั้งหมด</SelectItem>
            {Object.entries(categoryLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
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

      <div className="space-y-2">
        <label className="text-sm font-medium">สถานที่</label>
        <Select
          value={filters.location || 'all'}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              location: value === 'all' ? undefined : value,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="ทั้งหมด" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทั้งหมด</SelectItem>
            {locationOptions.map((location) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {activeFiltersCount > 0 && (
        <Button
          variant="outline"
          className="w-full"
          onClick={clearFilters}
        >
          <X className="mr-2 size-4" />
          ล้างตัวกรอง
        </Button>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="ค้นหาด้วยรหัส, ชื่อ, หรือคำอธิบาย..."
          value={filters.search || ''}
          onChange={(e) =>
            onFiltersChange({ ...filters, search: e.target.value })
          }
          className="pl-9"
        />
        {filters.search && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 size-7 -translate-y-1/2"
            onClick={() => onFiltersChange({ ...filters, search: '' })}
          >
            <X className="size-4" />
          </Button>
        )}
      </div>

      {/* Mobile: Filter Sheet */}
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
          <SheetContent side="bottom" className="h-auto rounded-t-xl">
            <SheetHeader>
              <SheetTitle>ตัวกรอง</SheetTitle>
              <SheetDescription>กรองรายการครุภัณฑ์ตามเงื่อนไข</SheetDescription>
            </SheetHeader>
            <div className="py-6">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        /* Desktop: Inline Selects */
        <div className="flex items-center gap-2">
          <Select
            value={filters.category || 'all'}
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                category: value === 'all' ? undefined : (value as AssetCategory),
              })
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="ประเภท" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทุกประเภท</SelectItem>
              {Object.entries(categoryLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
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
            <SelectTrigger className="w-[140px]">
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

          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="icon" onClick={clearFilters}>
              <X className="size-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
