'use client';

import {
    MoreHorizontal, Eye, Edit, QrCode, Wrench,
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
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ActionBadge, ConditionBadge, StatusBadge } from '../badge/status-badge';
import type { Asset, AssetLog } from '@/types/asset';
import { TableLoadingSkeleton } from '../shared/table-loading-skeleton';

interface AssetLogTableProps {
    assetsLogs: AssetLog[];
    pagination: {
        page: number;
        pageSize: number;
        total: number;
    };
    isLoading?: boolean;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
    onView?: (asset: AssetLog) => void;
    onEdit?: (asset: AssetLog) => void;
    onGenerateQR?: (asset: AssetLog) => void;
    onRepair?: (asset: AssetLog) => void;
}

export function AssetLogTable({
    assetsLogs,
    pagination,
    isLoading,
    onPageChange,
    onPageSizeChange,
    onView,
    onEdit,
    onGenerateQR,
    onRepair,
}: AssetLogTableProps) {
    const totalPages = Math.ceil(pagination.total / pagination.pageSize);

    // คำนวณช่วงของรายการที่แสดง เช่น 1-20
    const startItem = (pagination.page - 1) * pagination.pageSize + 1;
    const endItem = Math.min(pagination.page * pagination.pageSize, pagination.total);

    if (isLoading) {
        return <TableLoadingSkeleton columns={11} rows={6} />;
    }

    return (
        <div className="rounded-lg border bg-card overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead>รายการครุภัณฑ์</TableHead>
                        <TableHead className="hidden md:table-cell">หมายเลขเดิม</TableHead>
                        <TableHead>การดำเนินการ</TableHead>
                        <TableHead className="max-w-[300px]">รายละเอียด</TableHead>
                        <TableHead className="hidden md:table-cell">ผู้ทำรายการ</TableHead>
                        <TableHead className="hidden md:table-cell">วันที่ทำรายการ</TableHead>
                        <TableHead className="w-[70px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {assetsLogs.length > 0 ? (
                        assetsLogs.map((log) => (
                            <TableRow
                                key={log.id}
                                className="cursor-pointer"
                                onClick={() => onView?.(log)}
                            >
                                <TableCell className="font-medium">{log.assetName}</TableCell>
                                <TableCell className="hidden md:table-cell font-mono text-xs">{log.serialNumber}</TableCell>
                                <TableCell className="font-medium"><ActionBadge action={log.action} /></TableCell>
                                <TableCell className="font-medium max-w-[300px] truncate">{log.note}</TableCell>
                                <TableCell className="font-medium">{log.createdByName}</TableCell>
                                <TableCell className="hidden md:table-cell text-sm">
                                    {log.createdAt ? new Date(log.createdAt).toLocaleDateString('th-TH') : '-'}
                                </TableCell>
                                <TableCell onClick={(e) => e.stopPropagation()}>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="size-8">
                                                <MoreHorizontal className="size-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => onView?.(log)}><Eye className="mr-2 size-4" /> ดูรายละเอียด</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => onGenerateQR?.(log)}><QrCode className="mr-2 size-4" /> สร้าง QR Code</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => onRepair?.(log)} className="text-destructive focus:text-destructive">
                                                <Wrench className="mr-2 size-4" /> แจ้งซ่อม
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">ไม่พบข้อมูล</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Pagination Footer */}
            <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/20">
                {/* Left Side: Items per page & Stats */}
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

                {/* Right Side: Navigation Buttons */}
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