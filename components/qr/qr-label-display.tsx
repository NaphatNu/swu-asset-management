'use client';

import { cn } from '@/lib/utils';

export interface QrLabelData {
  fiscalYear?: string;
  mainSequenceNo?: string;
  itemSequenceName?: string;
  itemSequenceNo?: number | string;
  fullAssetCode: string;
}

interface QrLabelDisplayProps {
  data: QrLabelData;
  className?: string;
  printMode?: boolean;
}

export function formatQrLabelLine(data: QrLabelData): string {
  const year = data.fiscalYear ?? '-';
  const mainSeq = data.mainSequenceNo ?? '-';
  const name = data.itemSequenceName ?? '-';
  const itemSeq = data.itemSequenceNo ?? '-';
  return `ปี ${year} (${mainSeq}) ${name} (${itemSeq})`;
}

export function QrLabelDisplay({ data, className, printMode }: QrLabelDisplayProps) {
  const Wrapper = 'div' as const;

  return (
    <Wrapper
      className={cn(
        'w-full max-w-full text-center space-y-1 px-2',
        printMode && 'print:text-black print:break-inside-avoid',
        className
      )}
    >
      <p
        className={cn(
          'font-medium leading-snug break-words',
          printMode ? 'text-xs' : 'text-sm'
        )}
      >
        {formatQrLabelLine(data)}
      </p>
      <p
        className={cn(
          'font-mono break-all leading-tight text-muted-foreground',
          printMode ? 'text-[10px] text-black' : 'text-xs'
        )}
      >
        {data.fullAssetCode}
      </p>
    </Wrapper>
  );
}
