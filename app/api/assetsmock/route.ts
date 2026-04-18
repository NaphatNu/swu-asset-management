import { NextRequest, NextResponse } from 'next/server';
import { listMockAssets } from '@/lib/api/mock-store';
import type { AssetCategory, AssetStatus } from '@/types/asset';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') ?? undefined;
  const category = searchParams.get('category') as AssetCategory | undefined;
  const status = searchParams.get('status') as AssetStatus | undefined;
  const location = searchParams.get('location') ?? undefined;

  const assets = listMockAssets({
    ...(search ? { search } : {}),
    ...(category ? { category } : {}),
    ...(status ? { status } : {}),
    ...(location ? { location } : {}),
  });

  return NextResponse.json(assets);
}
