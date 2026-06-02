'use client';

import { cn } from '@/lib/utils';

export interface QrLabelData {
  fiscalYear?: string;
  mainSequenceNo?: string;
  itemSequenceName?: string;
  itemSequenceNo?: number | string;
  budgetType?: number | string;
  fullAssetCode: string;
}

interface QrLabelDisplayProps {
  data: QrLabelData;
  className?: string;
}

export function formatQrLabelLine(data: QrLabelData): string {
  const year = data.fiscalYear ?? '-';
  const mainSeq = data.mainSequenceNo ?? '-';
  const name = data.itemSequenceName ?? '-';
  const itemSeq = data.itemSequenceNo ?? '-';
  const budgetType = data.budgetType ?? '-';
  return `ปี ${year} (${budgetType}) (${mainSeq}) ${name} (${itemSeq})`;
}

export function QrLabelDisplay({ data, className }: QrLabelDisplayProps) {
  const Wrapper = 'div' as const;

  return (
    <Wrapper
      className={cn(
        // ใช้ flex เพื่อคุมระยะห่างให้แม่นยำ
        'w-full max-w-full text-center flex flex-col items-center print:text-black print:break-inside-avoid',
        className
      )}
    >
      {/* บรรทัดที่ 1: ขนาด 24px สีดำ */}
      <p className="font-sans text-[22px] leading-[22px] text-black break-words w-full">
        {formatQrLabelLine(data)}
      </p>
      
      {/* บรรทัดที่ 2: ขนาด 24px สีดำ ห่างจากด้านบน 8px */}
      <p className="font-mono text-[22px] leading-[22px] text-black break-all mt-[8px] w-full">
        {data.fullAssetCode}
      </p>
    </Wrapper>
  );
}