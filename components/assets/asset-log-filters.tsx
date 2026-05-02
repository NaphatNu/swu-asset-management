'use client';

import { Search, X, Filter, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { cn } from '@/lib/utils';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import type { AssetLogFilters as AssetLogFiltersType } from '@/types/asset';
import { useIsMobile } from '@/hooks/use-mobile';
import { actionLabels } from '@/constants/asset';

interface AssetLogFiltersProps {
  filters: AssetLogFiltersType;
  onFiltersChange: (filters: AssetLogFiltersType) => void;
}

export function AssetLogFilters({ filters, onFiltersChange }: AssetLogFiltersProps) {
  const isMobile = useIsMobile();

  // นับจำนวน Filter ที่ถูกใช้งาน (ไม่นับชื่อและ pagination)
  const activeFiltersCount = [
    filters.action,
    filters.startDate,
    filters.endDate,
  ].filter(Boolean).length;

  const clearFilters = () => {
    // ล้าง filter ทั้งหมดแต่คงค่าการค้นหาชื่อไว้ (หรือล้างหมดเลยก็ได้ตาม UX ที่ต้องการ)
    onFiltersChange({ assetName: filters.assetName, page: 1, pageSize: filters.pageSize });
  };

  const handleStartDateChange = (date: Date | undefined) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    if (date) {
      const formattedDate = format(date, 'yyyy-MM-dd');
      onFiltersChange({
        ...filters,
        startDate: formattedDate,
        endDate: filters.endDate ? filters.endDate : today,
        page: 1, // รีเซ็ตหน้าเมื่อมีการกรอง
      });
    } else {
      onFiltersChange({
        ...filters,
        startDate: undefined,
        endDate: undefined,
        page: 1,
      });
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    if (!filters.startDate) return;
    onFiltersChange({
      ...filters,
      endDate: date ? format(date, 'yyyy-MM-dd') : undefined,
      page: 1,
    });
  };

  const disableDatesBeforeStart = (date: Date) => {
    if (!filters.startDate) return false;
    const startDate = new Date(filters.startDate + 'T00:00:00');
    startDate.setHours(0, 0, 0, 0);
    return date < startDate;
  };

  const FilterContent = () => (
    <div className="space-y-4">
      {/* Search สำหรับ Mobile */}
      {isMobile && (
        <div className="space-y-2 px-4">
          <label className="text-sm font-medium">ชื่อครุภัณฑ์</label>
          <Input
            placeholder="ค้นหาชื่อครุภัณฑ์..."
            value={filters.assetName || ''}
            onChange={(e) => onFiltersChange({ ...filters, assetName: e.target.value, page: 1 })}
          />
        </div>
      )}

      {/* Action Select */}
      <div className="space-y-2 px-4">
        <label className="text-sm font-medium">ประเภทรายการ</label>
        <Select
          value={filters.action || 'all'}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              action: value === 'all' ? undefined : value,
              page: 1,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="ทุกรายการ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทุกรายการ</SelectItem>
            {Object.entries(actionLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Date Range สำหรับ Mobile */}
      <div className="grid grid-cols-2 gap-4 px-4">
        <div className="space-y-2 flex flex-col">
          <label className="text-sm font-medium text-muted-foreground">วันที่เริ่มต้น</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal px-3',
                  !filters.startDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 size-4" />
                {filters.startDate ? format(new Date(filters.startDate), 'd MMM yy', { locale: th }) : <span>เลือกวันที่</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.startDate ? new Date(filters.startDate) : undefined}
                onSelect={handleStartDateChange}
                captionLayout="dropdown"
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2 flex flex-col">
          <label className="text-sm font-medium text-muted-foreground">วันที่สิ้นสุด</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                disabled={!filters.startDate}
                className={cn(
                  'w-full justify-start text-left font-normal px-3',
                  !filters.endDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 size-4" />
                {filters.endDate ? format(new Date(filters.endDate), 'd MMM yy', { locale: th }) : <span>เลือกวันที่</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.endDate ? new Date(filters.endDate) : undefined}
                onSelect={handleEndDateChange}
                disabled={disableDatesBeforeStart}
                initialFocus
                captionLayout="dropdown"
                fromYear={2020}
                toYear={2030}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {activeFiltersCount > 0 && (
        <div className="px-4 pt-2">
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
      {/* Search Input (Desktop & Mobile) */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="ค้นหาด้วยชื่อครุภัณฑ์..."
          value={filters.assetName || ''}
          onChange={(e) => onFiltersChange({ ...filters, assetName: e.target.value, page: 1 })}
          className="pl-9"
        />
        {filters.assetName && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 size-7 -translate-y-1/2"
            onClick={() => onFiltersChange({ ...filters, assetName: '', page: 1 })}
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
              <SheetTitle>ตัวกรองประวัติรายการ</SheetTitle>
              <SheetDescription>กรองข้อมูลประวัติการทำรายการตามเงื่อนไข</SheetDescription>
            </SheetHeader>
            <div className="pb-8">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        /* Desktop: Inline Select & Dates */
        <div className="flex items-center gap-2">
          {/* Action Select */}
          <Select
            value={filters.action || 'all'}
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                action: value === 'all' ? undefined : value,
                page: 1,
              })
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="ประเภทรายการ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทุกประเภท</SelectItem>
              {Object.entries(actionLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Date Picker Container */}
          <div className="flex items-center gap-1 bg-background border border-input rounded-md px-2 py-1 h-10 focus-within:ring-1 focus-within:ring-ring">
            <div className="flex items-center">
              <span className="text-xs font-medium text-muted-foreground select-none pl-1 mr-1">เริ่ม:</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      'h-8 w-[110px] justify-start text-left font-normal px-2 text-xs',
                      !filters.startDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-1 size-3" />
                    {filters.startDate ? format(new Date(filters.startDate), 'd MMM yy', { locale: th }) : <span>เลือกวันที่</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.startDate ? new Date(filters.startDate) : undefined}
                    onSelect={handleStartDateChange}
                    initialFocus
                    captionLayout="dropdown"
                    fromYear={2020}
                    toYear={2030}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <span className="text-muted-foreground/30 text-sm">|</span>

            <div className="flex items-center">
              <span className="text-xs font-medium text-muted-foreground select-none pl-1 mr-1">สิ้นสุด:</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    disabled={!filters.startDate}
                    className={cn(
                      'h-8 w-[110px] justify-start text-left font-normal px-2 text-xs',
                      !filters.endDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-1 size-3" />
                    {filters.endDate ? format(new Date(filters.endDate), 'd MMM yy', { locale: th }) : <span>เลือกวันที่</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.endDate ? new Date(filters.endDate) : undefined}
                    onSelect={handleEndDateChange}
                    disabled={disableDatesBeforeStart}
                    initialFocus
                    captionLayout="dropdown"
                    fromYear={2020}
                    toYear={2030}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="icon" onClick={clearFilters} title="ล้างตัวกรอง">
              <X className="size-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}