import { NextRequest, NextResponse } from 'next/server';
import { listMockAssets } from '@/lib/api/mock-store';
// เพิ่มการนำเข้า LocationOption (หรือชื่อ Type ที่คุณใช้สำหรับ location)
import type { AssetCategory, AssetStatus, LocationOption } from '@/types/asset';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') ?? undefined;
  const category = searchParams.get('category') as AssetCategory | undefined;
  const status = searchParams.get('status') as AssetStatus | undefined;
  const location = searchParams.get('location') as LocationOption | undefined;

  const assets = listMockAssets({
    ...(search ? { search } : {}),
    ...(category ? { category } : {}),
    ...(status ? { status } : {}),
    // แก้ไข syntax ตรงนี้ให้ระบุ key: value
    ...(location ? { location } : {}), 
  });

  return NextResponse.json(assets);
}