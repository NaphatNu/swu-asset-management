import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// 1. เปลี่ยนชื่อ function จาก proxy เป็น middleware (สำคัญมาก!)
export async function middleware(req: NextRequest) {
  const { pathname, search, origin } = req.nextUrl;

  // 2. เช็ค Public Paths ให้เด็ดขาดด้วย .startsWith
  // และเช็คว่าถ้าอยู่ที่หน้า /login อยู่แล้ว "ห้าม" รีไดเรกต์ซ้ำ
  const isPublicPath = 
    pathname.startsWith('/login') || 
    pathname.startsWith('/api/auth') || 
    pathname.startsWith('/_next') || 
    pathname.startsWith('/favicon.ico');

  if (isPublicPath) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // 3. ตรวจสอบเงื่อนไข Token: ไม่มี Token หรือ Refresh มี Error
  if (!token || token.error === "RefreshAccessTokenError") {
    // ถ้าไม่มี Token และไม่ใช่หน้า Public ให้ไปหน้า Login
    const callbackUrl = `${pathname}${search}`;
    const loginUrl = new URL('/login', origin);
    loginUrl.searchParams.set('callbackUrl', callbackUrl);
    
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// 4. ปรับ Matcher ให้ครอบคลุมแต่ยกเว้นไฟล์ที่จำเป็น
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};