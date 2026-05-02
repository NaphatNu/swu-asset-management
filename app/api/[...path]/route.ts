import { NextRequest, NextResponse } from 'next/server';

// 1. กำหนด Base URL ของ Backend C# (ดึงจาก env เพื่อความปลอดภัย)
const BACKEND_URL = process.env.API_BASE_URL;

/**
 * ฟังก์ชันกลางสำหรับจัดการ Request ทั้งหมด (GET, POST, PUT, DELETE)
 */
async function handleProxy(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    // 2. ดึงค่า path จาก URL (เช่น ['users', 'profile'])
    const resolvedParams = await params;
    const subPath = resolvedParams.path.join('/');
    
    // 3. จัดการ Query Parameters (ถ้ามี) เช่น ?id=1&name=test
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const targetUrl = `${BACKEND_URL}/${subPath}${queryString ? `?${queryString}` : ''}`;

    // 4. อ่าน Body จาก Request (เฉพาะ Method ที่ไม่ใช่ GET/HEAD)
    let body: any = null;
    if (!['GET', 'HEAD'].includes(request.method)) {
      body = await request.text();
    }

    // 5. ส่งต่อ Request ไปยัง Backend C# ด้วย fetch
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
        // ส่งต่อ Authorization Header ถ้าฝั่ง Client ส่งมา
        'Authorization': request.headers.get('authorization') || '',
      },
      body: body,
    });

    // 6. รับข้อมูลจาก C# และส่งกลับไปให้ Client (Axios)
    const data = await response.json();
    
    return NextResponse.json(data, { 
      status: response.status 
    });

  } catch (error: any) {
    console.error('Proxy Error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
}

// 7. Export ฟังก์ชันตาม HTTP Method ที่ต้องการรองรับ
export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const DELETE = handleProxy;