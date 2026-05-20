'use client';

import {
  MoreHorizontal, Eye, Edit, QrCode, Wrench, Trash2,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ConditionBadge, StatusBadge } from '../badge/status-badge';
import { TableEmptyState } from '@/components/shared/table-empty-state';
import { TableLoadingSkeleton } from '@/components/shared/table-loading-skeleton';
import type { Asset } from '@/types/asset';

interface AssetTableProps {
  assets: Asset[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
  isLoading?: boolean;
  isDeletingId?: string | null;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onView?: (asset: Asset) => void;
  onEdit?: (asset: Asset) => void;
  onGenerateQR?: (asset: Asset) => void;
  onRepair?: (asset: Asset) => void;
  onDelete?: (asset: Asset) => void;
}

export function AssetTable({
  assets,
  pagination,
  isLoading,
  isDeletingId,
  onPageChange,
  onPageSizeChange,
  onView,
  onEdit,
  onGenerateQR,
  onRepair,
  onDelete,
}: AssetTableProps) {
  const totalPages = Math.max(1, Math.ceil(pagination.total / pagination.pageSize));
  const startItem = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.pageSize + 1;
  const endItem = Math.min(pagination.page * pagination.pageSize, pagination.total);

  if (isLoading) {
    return <TableLoadingSkeleton columns={11} rows={6} />;
  }

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead>รายการครุภัณฑ์</TableHead>
              <TableHead className="hidden lg:table-cell">ปีงบ</TableHead>
              {/* <TableHead className="hidden lg:table-cell">ลำดับหลัก</TableHead>
              <TableHead className="hidden xl:table-cell">ลำดับรายการ</TableHead>*/}
              <TableHead className="hidden xl:table-cell">ชื่อรายการย่อย</TableHead> 
              <TableHead>หมายเลขครุภัณฑ์ หลัก-ย่อย</TableHead>
              <TableHead className="hidden md:table-cell">หมายเลขเดิม</TableHead>
              <TableHead className="hidden lg:table-cell">สถานที่ตั้ง</TableHead>
              <TableHead>สถานะ</TableHead>
              <TableHead>สภาพ</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.length > 0 ? (
              assets.map((asset) => (
                <TableRow
                  key={asset.id}
                  className="cursor-pointer"
                  onClick={() => onView?.(asset)}
                >
                  <TableCell className="font-medium min-w-[140px]">{asset.assetName}</TableCell>
                  <TableCell className="hidden lg:table-cell text-sm">{asset.fiscalYear ?? '-'}</TableCell>
                  {/* <TableCell className="hidden lg:table-cell text-sm">{asset.mainSequenceNo ?? '-'}</TableCell>
                  <TableCell className="hidden xl:table-cell text-sm">{asset.itemSequenceNo ?? '-'}</TableCell>*/}
                  <TableCell className="hidden xl:table-cell text-sm max-w-[160px] truncate">
                    {asset.itemSequenceName=="" ? '-' : asset.itemSequenceName}
                  </TableCell> 
                  <TableCell className="font-mono text-xs whitespace-nowrap">{asset.mainSerialNumber}</TableCell>
                  <TableCell className="hidden md:table-cell font-mono text-xs whitespace-nowrap">
                    {asset.serialNumber}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm">{asset.location}</TableCell>
                  <TableCell><StatusBadge status={asset.status} /></TableCell>
                  <TableCell><ConditionBadge condition={asset.condition} /></TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView?.(asset)}>
                          <Eye className="mr-2 size-4" /> ดูรายละเอียด
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit?.(asset)}>
                          <Edit className="mr-2 size-4" /> แก้ไข
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onGenerateQR?.(asset)}>
                          <QrCode className="mr-2 size-4" /> สร้าง QR Code
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onRepair?.(asset)}>
                          <Wrench className="mr-2 size-4" /> แจ้งซ่อม
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete?.(asset)}
                          className="text-destructive focus:text-destructive"
                          disabled={isDeletingId === asset.id}
                        >
                          <Trash2 className="mr-2 size-4" /> ลบ
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableEmptyState colSpan={11} />
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/20">
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <p className="hidden sm:block whitespace-nowrap">รายการต่อหน้า</p>
            <Select
              value={pagination.pageSize.toString()}
              onValueChange={(value) => onPageSizeChange?.(Number(value))}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pagination.pageSize} />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 30, 50].map((size) => (
                  <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="hidden md:block">
            {startItem}-{endItem} จาก {pagination.total} รายการ
          </p>
        </div>

        <div className="flex items-center gap-4 lg:gap-8">
          <div className="flex items-center justify-center text-sm font-medium">
            หน้า {pagination.page} จาก {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => onPageChange(1)}
              disabled={pagination.page <= 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => onPageChange(totalPages)}
              disabled={pagination.page >= totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
