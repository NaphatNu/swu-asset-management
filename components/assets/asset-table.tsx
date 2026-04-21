'use client';

import { ArrowUpDown, MoreHorizontal, Eye, Edit, QrCode, Wrench } from 'lucide-react';
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
import { StatusBadge } from './status-badge';
import { categoryLabels } from '@/constants/asset';
import type { Asset } from '@/types/asset';

interface AssetTableProps {
  assets: Asset[];
  onView?: (asset: Asset) => void;
  onEdit?: (asset: Asset) => void;
  onGenerateQR?: (asset: Asset) => void;
  onRepair?: (asset: Asset) => void;
}

export function AssetTable({
  assets,
  onView,
  onEdit,
  onGenerateQR,
  onRepair,
}: AssetTableProps) {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {/* <TableHead className="w-[140px]">
              <Button variant="ghost" size="sm" className="-ml-3 h-8">
                รหัส
                <ArrowUpDown className="ml-2 size-3" />
              </Button>
            </TableHead> */}
            <TableHead>รายการครุภัณฑ์</TableHead>
            <TableHead>หมายเลขครุภัณฑ์ หลัก-ย่อย</TableHead>
            <TableHead>หมายเลขครุภัณฑ์เดิม</TableHead>
            <TableHead>สถานะ</TableHead>
            <TableHead>สถานที่ตั้งครุภัณฑ์เดิม</TableHead>
            <TableHead className="hidden md:table-cell">วันที่ได้มา</TableHead>
            {/* <TableHead className="hidden md:table-cell">ประเภท</TableHead>
            <TableHead className="hidden lg:table-cell">สถานที่</TableHead> */}
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets.map((asset) => (

            <TableRow
              key={asset.id}
              className="cursor-pointer"
              onClick={() => onView?.(asset)}
            >
              {/* รายการครุภัณฑ์ */}
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium truncate max-w-[200px] lg:max-w-[300px]">
                    {asset.name}
                  </span>
                  {/* <span className="text-xs text-muted-foreground md:hidden">
                    {categoryLabels[asset.Category]}
                  </span> */}
                </div>
              </TableCell>

              {/* หมายเลขครุภัณฑ์ */}
              <TableCell className="font-mono text-sm">
                {asset.mainSerialNumber}
              </TableCell>

              {/* หมายเลขครุภัณฑ์เดิม */}
              <TableCell className="font-mono text-sm">
                {asset.serialNumber}
              </TableCell>

              {/* สถานะ */}
              <TableCell>
                <StatusBadge status={asset.status} />
              </TableCell>

              {/* สถานที่ตั้งครุภัณฑ์เดิม */}
              <TableCell className="hidden lg:table-cell">
                <span className="truncate max-w-[150px] block">
                  {asset.location}
                </span>
              </TableCell>

              {/* วันที่ได้มา */}
            <TableCell className="hidden md:table-cell">
                {asset.acquiredDate
                  ? new Date(asset.acquiredDate).toLocaleDateString('th-TH', {
                      day: '2-digit',
                      month: 'short',
                      year: '2-digit',
                    })
                  : '-'}
              </TableCell>

              {/* <TableCell className="hidden md:table-cell">
                {categoryLabels[asset.Category]}
              </TableCell> */}

              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="size-8">
                      <MoreHorizontal className="size-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView?.(asset)}>
                      <Eye className="mr-2 size-4" />
                      ดูรายละเอียด
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit?.(asset)}>
                      <Edit className="mr-2 size-4" />
                      แก้ไข
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onGenerateQR?.(asset)}>
                      <QrCode className="mr-2 size-4" />
                      สร้าง QR Code
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onRepair?.(asset)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Wrench className="mr-2 size-4" />
                      แจ้งซ่อม
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
