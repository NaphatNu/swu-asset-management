'use client';

import { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/';
  const { status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') router.replace(callbackUrl);
  }, [status, router, callbackUrl]);

  return (
    <div className="min-h-[calc(100vh-0px)] flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Sign in with your Microsoft account to continue.
          </p>
          <Button
            className="w-full"
            onClick={() => signIn('azure-ad', { callbackUrl })}
            disabled={status === 'loading'}
          >
            Login with Microsoft
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

