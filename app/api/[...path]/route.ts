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
    if (!BACKEND_URL) {
      throw new Error('API_BASE_URL is not defined in environment variables');
    }


    // 2. ดึงค่า path จาก URL (เช่น ['users', 'profile'])
    const resolvedParams = await params;
    const subPath = resolvedParams.path.join('/');

    // 3. จัดการ Query Parameters (ถ้ามี) เช่น ?id=1&name=test
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const targetUrl = `${BACKEND_URL}/${subPath}${queryString ? `?${queryString}` : ''}`;

    // 4. Clone Headers ทั้งหมดจาก Client ส่งต่อไปหา C#
    const requestHeaders = new Headers(request.headers);
    requestHeaders.delete('host');

    // 5. อ่าน Body จาก Request (เฉพาะ Method ที่ไม่ใช่ GET/HEAD)
    let body: any = null;
    if (!['GET', 'HEAD'].includes(request.method)) {
      body = await request.arrayBuffer();
    }

    // 6. ส่งต่อ Request ไปยัง Backend C# ด้วย fetch
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: requestHeaders,
      body: body,
      cache: 'no-store'
    });

    // 7. จัดการ Headers ขา กลับจาก C# ส่งคืนให้หน้าบ้าน
    const responseHeaders = new Headers(response.headers);
    // ป้องกันปัญหา Encoding เพี้ยน
    responseHeaders.set('Cache-Control', 'no-store, max-age=0, must-revalidate');

    // 8. ตรวจสอบ Content-Type ขากลับเพื่อส่งข้อมูลคืนสไตล์ที่ถูกต้อง (JSON, ไฟล์ หรือ Text)
    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const jsonResponse = await response.json();
      return NextResponse.json(jsonResponse, { status: response.status, headers: responseHeaders });
    } else {
      // หาก C# ส่งกลับมาเป็นไฟล์ดาวน์โหลด เช่น Excel, PDF หรือรูปภาพ
      const blobResponse = await response.blob();
      return new NextResponse(blobResponse, { status: response.status, headers: responseHeaders });
    }

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