import { NextRequest, NextResponse } from 'next/server';
import {
  getMockAssetByAssetId,
  updateMockAssetByAssetId,
} from '@/lib/api/mock-store';
import { assetFormSchema } from '@/lib/validations';
import type { Asset } from '@/types/asset';

type RouteContext = { params: Promise<{ assetId: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  const { assetId: raw } = await context.params;
  const assetId = decodeURIComponent(raw);
  const asset = getMockAssetByAssetId(assetId);
  if (!asset) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(asset);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { assetId: raw } = await context.params;
  const routeAssetId = decodeURIComponent(raw);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = assetFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  if (parsed.data.assetId !== routeAssetId) {
    return NextResponse.json(
      { error: 'รหัสครุภัณฑ์ไม่ตรงกับ URL' },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const patch: Pick<
    Asset,
    | 'name'
    | 'category'
    | 'location'
    | 'status'
    | 'description'
    | 'purchaseDate'
    | 'purchasePrice'
    | 'warrantyExpiry'
  > = {
    name: data.name,
    category: data.category,
    location: data.location,
    status: data.status,
    description: data.description?.trim() ? data.description : undefined,
    purchaseDate: data.purchaseDate?.trim() ? data.purchaseDate : undefined,
    purchasePrice:
      typeof data.purchasePrice === 'number' ? data.purchasePrice : undefined,
    warrantyExpiry: data.warrantyExpiry?.trim()
      ? data.warrantyExpiry
      : undefined,
  };

  const updated = updateMockAssetByAssetId(routeAssetId, patch);
  if (!updated) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(updated);
}
