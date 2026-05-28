'use client';

import * as React from 'react';
import { Search, X, Filter, ChevronsUpDown, Check } from 'lucide-react';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import {
  statusLabels,
  locationOptions,
  conditionLabels,
  budgetTypeLabels,
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
  const [openLocation, setOpenLocation] = React.useState(false);

  const activeFiltersCount = [
    filters.assetName,
    filters.status,
    filters.location,
    filters.condition,
    filters.fiscalYear,
    filters.budgetType,
  ].filter(Boolean).length;

  const clearFilters = () => {
    onFiltersChange({ assetName: filters.assetName });
  };

  const fiscalYearSelect = (
    <Input
      placeholder="ค้นหาปีงบประมาณ"
      value={filters.fiscalYear || ''}
      onChange={(e) =>
        onFiltersChange({
          ...filters,
          fiscalYear: e.target.value || undefined,
        })
      }
      className={isMobile ? 'w-full' : 'w-[135px]'}
    />
  );

  // แยกส่วน Combobox สถานที่ออกมาเพื่อให้เรียกใช้ซ้ำได้ทั้ง Desktop และ Mobile
  const LocationSearchSelect = ({ className }: { className?: string }) => (
    <Popover open={openLocation} onOpenChange={setOpenLocation}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={openLocation}
          className={cn(
            "justify-between font-normal",
            !filters.location && "text-muted-foreground",
            className
          )}
        >
          <span className="truncate">
            {filters.location
              ? locationOptions.find((loc) => loc === filters.location)
              : "ทุกสถานที่"}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className={cn("p-0", isMobile ? "w-[calc(100vw-32px)]" : "w-[200px]")}>
        <Command>
          <CommandInput placeholder="พิมพ์เพื่อค้นหาเลขห้อง..." />
          <CommandList>
            <CommandEmpty>ไม่พบสถานที่นี้</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value="all-locations" // ใช้ string ภาษาอังกฤษเพื่อไม่ให้โดนซ่อนเวลาผู้ใช้พิมพ์ค้นหาตัวอักษรไทย
                onSelect={() => {
                  onFiltersChange({
                    ...filters,
                    location: undefined,
                  });
                  setOpenLocation(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    !filters.location ? "opacity-100" : "opacity-0"
                  )}
                />
                ทุกสถานที่
              </CommandItem>
              {locationOptions.map((loc) => (
                <CommandItem
                  key={loc}
                  value={loc}
                  onSelect={() => {
                    onFiltersChange({
                      ...filters,
                      location: loc as LocationOption,
                    });
                    setOpenLocation(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      filters.location === loc ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {loc}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );

  const FilterContent = () => (
    <div className="space-y-4">

      <div className="space-y-2 px-4 flex flex-col">
        <label className="text-sm font-medium">สถานที่ตั้ง</label>
        <LocationSearchSelect className="w-full" />
      </div>

      <div className="space-y-2 px-4">
        <label className="text-sm font-medium">ปีงบประมาณ</label>
        {fiscalYearSelect}
      </div>

      <div className="space-y-2 px-4">
        <label className="text-sm font-medium">ประเภทงบประมาณ</label>
        <Select
          value={filters.budgetType || 'all'}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              budgetType: value === 'all' ? undefined : value,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="ทั้งหมด" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทั้งหมด</SelectItem>
            {Object.entries(budgetTypeLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
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

          <LocationSearchSelect className="w-[160px]" />

          {fiscalYearSelect}

          <Select
            value={filters.budgetType || 'all'}
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                budgetType: value === 'all' ? undefined : value,
              })
            }
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="ประเภทงบประมาณ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">งบทุกประเภท</SelectItem>
              {Object.entries(budgetTypeLabels).map(([key, label]) => (
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