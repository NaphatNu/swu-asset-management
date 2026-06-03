'use client';

import {
  MoreHorizontal, Eye, Edit, Trash2, Calendar,
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
import { Card, CardContent } from '@/components/ui/card';
import { RepairStatusBadge, RepairTypeBadge } from '@/components/badge/status-badge';
import { TableEmptyState } from '@/components/shared/table-empty-state';
import { TableLoadingSkeleton } from '@/components/shared/table-loading-skeleton';
import type { RepairRequest } from '@/types/asset';

interface RepairTableProps {
  data: RepairRequest[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
  isLoading?: boolean;
  isDeletingId?: string | null;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onView?: (request: RepairRequest) => void;
  onUpdateStatus?: (request: RepairRequest) => void;
  onDelete?: (request: RepairRequest) => void;
}

export function RepairTable({
  data,
  pagination,
  isLoading,
  isDeletingId,
  onPageChange,
  onPageSizeChange,
  onView,
  onUpdateStatus,
  onDelete,
}: RepairTableProps) {
  const totalPages = Math.max(1, Math.ceil(pagination.total / pagination.pageSize));
  const startItem = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.pageSize + 1;
  const endItem = Math.min(pagination.page * pagination.pageSize, pagination.total);

  if (isLoading) {
    return <TableLoadingSkeleton columns={6} rows={5} />;
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <tbody>
              <TableEmptyState
                title="ไม่พบรายการแจ้งซ่อม"
                description="ลองปรับตัวกรองหรือสร้างคำขอแจ้งซ่อมใหม่"
                asTableRow={false}
              />
            </tbody>
          </table>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:hidden">
        {data.map((request) => (
          <Card key={request.id}>
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-start gap-2">
                <div className="space-y-1 min-w-0">
                  <p className="text-xs font-mono text-muted-foreground truncate">
                    {request.serialNumber}
                  </p>
                  <h4 className="font-medium text-sm line-clamp-1">{request.assetName}</h4>
                  {request.itemSequenceName && (
                    <p className="text-xs text-muted-foreground">ชิ้นส่วน: {request.itemSequenceName}</p>
                  )}
                </div>
                <RepairStatusBadge status={request.status} />
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 bg-muted/50 p-2 rounded">
                {request.description || 'ไม่มีรายละเอียด'}
              </p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>ประเภท: {request.type === 'internal-repair' ? 'ซ่อมภายใน' : 'ซ่อมภายนอก'}</p>
                <p>ผู้แจ้ง: {request.reportedByName}</p>
                <p>วันที่: {new Date(request.createdAt).toLocaleDateString('th-TH')}</p>
              </div>
              <div className="flex items-center justify-between gap-2 pt-2 border-t">
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" onClick={() => onUpdateStatus?.(request)}>
                    สถานะ
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => onDelete?.(request)}
                    disabled={isDeletingId === request.id}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="hidden md:block rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[150px]">หมายเลขครุภัณฑ์</TableHead>
              <TableHead className="w-[180px]">รายการครุภัณฑ์</TableHead>
              <TableHead className="w-[120px]">ชื่อรายการย่อย</TableHead>
              <TableHead>รายละเอียดการซ่อม</TableHead>
              <TableHead className="w-[100px]">ประเภท</TableHead>
              <TableHead className="w-[100px]">สถานะ</TableHead>
              <TableHead className="w-[130px]">ผู้แจ้ง</TableHead>
              <TableHead className="w-[120px]">วันที่แจ้ง</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-mono text-xs">{request.serialNumber}</TableCell>
                <TableCell className="font-medium text-sm">{request.assetName}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {request.itemSequenceName || '-'}
                </TableCell>
                <TableCell>
                  <span
                    className="text-sm line-clamp-1 text-muted-foreground"
                    title={request.description}
                  >
                    {request.description || '-'}
                  </span>
                </TableCell>
                <TableCell className="text-xs">
                  <RepairTypeBadge type={request.type} />
                </TableCell>
                <TableCell>
                  <RepairStatusBadge status={request.status} />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {request.reportedByName}
                </TableCell>
                <TableCell className="text-sm">
                  {new Date(request.createdAt).toLocaleDateString('th-TH')}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onView?.(request)}>
                        <Eye className="mr-2 size-4" /> ดูรายละเอียด
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onUpdateStatus?.(request)}>
                        <Edit className="mr-2 size-4" /> อัปเดตสถานะ
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete?.(request)}
                        className="text-destructive focus:text-destructive"
                        disabled={isDeletingId === request.id}
                      >
                        <Trash2 className="mr-2 size-4" /> ลบ
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/20 text-sm">
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">แสดงหน้าละ</span>
            <Select
              value={pagination.pageSize.toString()}
              onValueChange={(v) => onPageSizeChange(Number(v))}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 50].map((s) => (
                  <SelectItem key={s} value={s.toString()}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-muted-foreground">
              รายการที่ {startItem}-{endItem} จาก {pagination.total}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="mr-4">หน้า {pagination.page} จาก {totalPages}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(1)}
              disabled={pagination.page === 1}
            >
              <ChevronsLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= totalPages}
            >
              <ChevronRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(totalPages)}
              disabled={pagination.page >= totalPages}
            >
              <ChevronsRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
