'use client';

import { Inbox } from 'lucide-react';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

interface TableEmptyStateProps {
  title?: string;
  description?: string;
  colSpan?: number;
  asTableRow?: boolean;
}

export function TableEmptyState({
  title = 'ไม่พบข้อมูล',
  description = 'ลองปรับเงื่อนไขการค้นหาหรือเพิ่มรายการใหม่',
  colSpan = 8,
  asTableRow = true,
}: TableEmptyStateProps) {
  const content = (
    <Empty className="border-0 py-8">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Inbox />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );

  if (asTableRow) {
    return (
      <tr>
        <td colSpan={colSpan} className="p-0">
          {content}
        </td>
      </tr>
    );
  }

  return <div className="rounded-lg border bg-card">{content}</div>;
}
