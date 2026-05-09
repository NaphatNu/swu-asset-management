// app/providers.tsx
'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import { useEffect, type ReactNode } from 'react';
import { apiClient } from '@/lib/api/client';

// Component นี้จะทำหน้าที่ Sync ข้อมูลกับ Backend
function AuthSync() {
  const { data: session , status} = useSession();

useEffect(() => {
  const syncUser = async () => {
    // 1. เช็คสถานะการ Login
    if (status === 'authenticated' && session?.oid) {
      
      // 2. เช็ค Flag ใน sessionStorage (ค่านี้จะหายไปก็ต่อเมื่อปิดแท็บ/ปิดเบราว์เซอร์)
      const isSyncedInThisSession = sessionStorage.getItem(`synced_${session.oid}`);

      if (!isSyncedInThisSession) {
        try {
          await apiClient.post('/user/sync-user', {
            azureId: session.oid,
            name: session.user?.name,
            email: session.user?.email,
          });

          // 3. บันทึกไว้ว่าใน Session นี้ (การเปิดแท็บนี้) ได้ Sync ไปแล้ว
          sessionStorage.setItem(`synced_${session.oid}`, 'true');
          console.log('[Auth] User synced for this session');
        } catch (error) {
          console.error("[Auth] Backend Sync Failed", error);
        }
      } else {
        // กรณีเคย Sync ไปแล้วในแท็บนี้ จะไม่ยิง API ซ้ำ
        console.log('[Auth] Skip sync: Already synced in this session');
      }
    }
  };

  syncUser();
}, [session, status]);

  return null; // ไม่ต้อง render อะไรออกหน้าจอ
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthSync /> 
      {children}
    </SessionProvider>
  );
}