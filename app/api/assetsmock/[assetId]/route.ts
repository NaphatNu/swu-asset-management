import { NextRequest, NextResponse } from 'next/server';
import { assetFormSchema } from '@/lib/validations';
import type { Asset } from '@/types/asset';
import { getMockAssetBySerialNumber, updateMockAssetBySerialNumber } from '@/lib/api/mock-store';

type RouteContext = { params: Promise<{ assetId: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  const { assetId: raw } = await context.params;
  const assetId = decodeURIComponent(raw);
  const asset = getMockAssetBySerialNumber(assetId);
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

  if (parsed.data.serialNumber !== routeAssetId) {
    return NextResponse.json(
      { error: 'รหัสครุภัณฑ์ไม่ตรงกับ URL' },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const patch: Pick<
    Asset,
    | 'mainSerialNumber'
    | 'serialNumber'
    | 'name'
    | 'status'
    | 'owner'
    | 'location'
    | 'acquiredDate'
  > = {
    mainSerialNumber: data.mainSerialNumber,
    serialNumber: data.serialNumber,
    name: data.name,
    status: data.status,
    owner: data.owner ?? '',
    location: data.location,
    acquiredDate: data.acquiredDate ?? '',
    // description: data.description?.trim() ? data.description : undefined,
    // purchaseDate: data.purchaseDate?.trim() ? data.purchaseDate : undefined,
    // purchasePrice:
    //   typeof data.purchasePrice === 'number' ? data.purchasePrice : undefined,
    // warrantyExpiry: data.warrantyExpiry?.trim()
    //   ? data.warrantyExpiry
    //   : undefined,
  };

  const updated = updateMockAssetBySerialNumber(routeAssetId, patch);
  if (!updated) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(updated);
}
