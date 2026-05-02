'use client';

import { 
  MoreHorizontal, Eye, Edit, Calendar, 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight 
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from '@/components/ui/card';
import { RepairStatusBadge, RepairTypeBadge } from '@/components/assets/status-badge';
import type { RepairRequest } from '@/types/asset';

interface RepairTableProps {
  data: RepairRequest[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onView?: (request: RepairRequest) => void;
  onEdit?: (request: RepairRequest) => void;
}

export function RepairTable({ 
  data, 
  pagination, 
  onPageChange, 
  onPageSizeChange, 
  onView, 
  onEdit 
}: RepairTableProps) {
  const totalPages = Math.ceil(pagination.total / pagination.pageSize);
  const startItem = (pagination.page - 1) * pagination.pageSize + 1;
  const endItem = Math.min(pagination.page * pagination.pageSize, pagination.total);

  if (data.length === 0) {
    return (
      <Card><CardContent className="py-12 text-center text-muted-foreground">ไม่พบรายการแจ้งซ่อม</CardContent></Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile View */}
      <div className="grid gap-4 md:hidden">
        {data.map((request) => (
          <Card key={request.id} onClick={() => onView?.(request)}>
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-xs font-mono text-muted-foreground">{request.serialNumber}</p>
                  <h4 className="font-medium text-sm line-clamp-1">{request.assetName}</h4>
                </div>
                <RepairStatusBadge status={request.status} />
              </div>
              {/* รายละเอียดในมือถือ */}
              <p className="text-sm text-muted-foreground line-clamp-2 bg-muted/50 p-2 rounded">
                {request.description || 'ไม่มีรายละเอียด'}
              </p>
              <div className="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground">
                <span>{request.reportedByName}</span>
                <div className="flex items-center gap-1"><Calendar className="size-3" />{new Date(request.createdAt).toLocaleDateString('th-TH')}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[150px]">หมายเลขครุภัณฑ์</TableHead>
              <TableHead className="w-[200px]">รายการ</TableHead>
              <TableHead>รายละเอียดการซ่อม</TableHead>
              <TableHead className="w-[120px]">สถานะ</TableHead>
              <TableHead className="w-[120px]">วันที่แจ้ง</TableHead>
              {/* <TableHead className="w-[70px]"></TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((request) => (
              <TableRow key={request.id} className="cursor-pointer" onClick={() => onView?.(request)}>
                <TableCell className="font-mono text-xs">{request.serialNumber}</TableCell>
                <TableCell className="font-medium">{request.assetName}</TableCell>
                <TableCell>
                  <span className="text-sm line-clamp-1 text-muted-foreground" title={request.description}>
                    {request.description || '-'}
                  </span>
                </TableCell>
                <TableCell><RepairStatusBadge status={request.status} /></TableCell>
                <TableCell className="text-sm">
                  {new Date(request.createdAt).toLocaleDateString('th-TH')}
                </TableCell>
                {/* <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8"><MoreHorizontal className="size-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onView?.(request)}><Eye className="mr-2 size-4" /> ดูรายละเอียด</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit?.(request)}><Edit className="mr-2 size-4" /> แก้ไขสถานะ</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Footer Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/20 text-sm">
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">แสดงหน้าละ</span>
            <Select value={pagination.pageSize.toString()} onValueChange={(v) => onPageSizeChange(Number(v))}>
              <SelectTrigger className="h-8 w-[70px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {[10, 20, 50].map(s => <SelectItem key={s} value={s.toString()}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <span className="text-muted-foreground">รายการที่ {startItem}-{endItem} จาก {pagination.total}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="mr-4">หน้า {pagination.page} จาก {totalPages}</span>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onPageChange(1)} disabled={pagination.page === 1}><ChevronsLeft className="size-4" /></Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onPageChange(pagination.page - 1)} disabled={pagination.page === 1}><ChevronLeft className="size-4" /></Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onPageChange(pagination.page + 1)} disabled={pagination.page === totalPages}><ChevronRight className="size-4" /></Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onPageChange(totalPages)} disabled={pagination.page === totalPages}><ChevronsRight className="size-4" /></Button>
          </div>
        </div>
      </div>
    </div>
  );
}