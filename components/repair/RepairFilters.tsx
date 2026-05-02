import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function RepairFilters({ filters, onFiltersChange }: any) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="ค้นหาหมายเลขครุภัณฑ์ หรือชื่อ..."
          className="pl-8"
          value={filters.search || ''}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
        />
      </div>
      <Select 
        value={filters.status || 'all'} 
        onValueChange={(v) => onFiltersChange({ ...filters, status: v === 'all' ? undefined : v })}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="สถานะทั้งหมด" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">สถานะทั้งหมด</SelectItem>
          <SelectItem value="open">รอดำเนินการ</SelectItem>
          <SelectItem value="in-progress">กำลังซ่อม</SelectItem>
          <SelectItem value="completed">ซ่อมเสร็จสิ้น</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}