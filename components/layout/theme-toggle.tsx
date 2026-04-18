'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <Sun className="size-4 text-muted-foreground" />
        <div className="h-[1.15rem] w-8 rounded-full bg-input" />
        <Moon className="size-4 text-muted-foreground" />
      </div>
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="theme-toggle" className="sr-only">
        สลับโหมดสว่าง/มืด
      </Label>
      <Sun
        className={`size-4 transition-colors ${
          isDark ? 'text-muted-foreground' : 'text-primary'
        }`}
      />
      <Switch
        id="theme-toggle"
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
        aria-label="สลับโหมดสว่าง/มืด"
      />
      <Moon
        className={`size-4 transition-colors ${
          isDark ? 'text-primary' : 'text-muted-foreground'
        }`}
      />
    </div>
  );
}
