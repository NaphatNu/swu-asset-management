'use client';

import { Bell, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

export function Header() {
  const { toggleSidebar, isMobile } = useSidebar();
  const { data: session } = useSession();
  const user = session?.user;
  const initials = (user?.name ?? user?.email ?? '?').slice(0, 1).toUpperCase();

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:h-16 md:px-6">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden size-10 relative z-[100]"
        onClick={toggleSidebar}
      >
        <Menu className="size-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>

      {/* Desktop sidebar toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="hidden md:flex"
        onClick={toggleSidebar}
      >
        <Menu className="size-5" />
        <span className="sr-only">Toggle sidebar</span>
      </Button>

      <div className="flex-1" />

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="size-5" />
              <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                3
              </span>
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-2">
              <h4 className="text-sm font-semibold">การแจ้งเตือน</h4>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
              <p className="text-sm font-medium">แจ้งซ่อมใหม่</p>
              <p className="text-xs text-muted-foreground">
                มีการแจ้งซ่อมเครื่องปรับอากาศห้อง 401
              </p>
              <p className="text-xs text-muted-foreground">5 นาทีที่แล้ว</p>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
              <p className="text-sm font-medium">ครุภัณฑ์ใหม่</p>
              <p className="text-xs text-muted-foreground">
                เพิ่มครุภัณฑ์ใหม่ 3 รายการ
              </p>
              <p className="text-xs text-muted-foreground">1 ชั่วโมงที่แล้ว</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme toggle - hidden on mobile, shown in sidebar */}
        <div className="hidden md:block">
          <ThemeToggle />
        </div>

        {/* User avatar - hidden on mobile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="hidden items-center gap-2 px-2 md:flex"
            >
              <Avatar className="size-8 border-2 border-primary/20">
                <AvatarImage
                  src={user?.image ?? undefined}
                  alt={user?.name ?? user?.email ?? 'User'}
                />
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="p-2">
              <p className="text-sm font-medium">{user?.name ?? 'Signed in'}</p>
              {user?.email && (
                <p className="text-xs text-muted-foreground">{user.email}</p>
              )}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">โปรไฟล์</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">ตั้งค่า</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => signOut({ callbackUrl: '/login' })}
            >
              ออกจากระบบ
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
