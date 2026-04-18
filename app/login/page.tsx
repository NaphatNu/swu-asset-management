import { Suspense } from 'react';
import LoginClient from './login-client';

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-0px)] flex items-center justify-center p-6">
          <div className="text-sm text-muted-foreground">Loading…</div>
        </div>
      }
    >
      <LoginClient />
    </Suspense>
  );
}

