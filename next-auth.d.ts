import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    } & DefaultSession['user'];
    oid?: string;
    accessToken?: string;
    error?: string; // เพิ่มฟิลด์ error สำหรับแจ้งปัญหา Refresh Token
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    oid?: string;
    picture?: string;
    accessToken?: string;
    error?: string; // เพิ่มฟิลด์ error สำหรับแจ้งปัญหา Refresh Token
  }
}

