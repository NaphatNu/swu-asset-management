'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Search,
  Plus,
  List,
  QrCode,
  Wrench,
  User,
  HelpCircle,
  Settings,
  LogOut,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { signOut, useSession } from 'next-auth/react';

const mainNavItems = [
  {
    title: 'แดชบอร์ด',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'ค้นหาครุภัณฑ์',
    href: '/search',
    icon: Search,
  },
  {
    title: 'เพิ่มครุภัณฑ์',
    href: '/assets/new',
    icon: Plus,
  },
  {
    title: 'รายการครุภัณฑ์',
    href: '/assets',
    icon: List,
  },
];

const toolsNavItems = [
  {
    title: 'สร้าง QR Code',
    href: '/qr-generator',
    icon: QrCode,
  },
  {
    title: 'แจ้งซ่อม',
    href: '/repair',
    icon: Wrench,
  },
];

const settingsNavItems = [
  {
    title: 'โปรไฟล์',
    href: '/profile',
    icon: User,
  },
  {
    title: 'ช่วยเหลือ',
    href: '/help',
    icon: HelpCircle,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const user = session?.user;
  const initials = (user?.name ?? user?.email ?? '?').slice(0, 1).toUpperCase();

  return (
    <Sidebar variant="inset" className="border-r-0">
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
            <LayoutDashboard className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-semibold tracking-tight">
              Asset Manager
            </span>
            <span className="text-xs text-muted-foreground">
              ระบบจัดการครุภัณฑ์
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent className="scrollbar-thin">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground">
            เมนูหลัก
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      pathname === item.href ||
                      (item.href !== '/' && pathname.startsWith(item.href))
                    }
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground">
            เครื่องมือ
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {toolsNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground">
            การตั้งค่า
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="p-2">
        <div className="flex items-center justify-between px-2 py-1">
          <ThemeToggle />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-sidebar-accent">
              <Avatar className="size-9 border-2 border-primary/20">
                <AvatarImage
                  src={user?.image ?? undefined}
                  alt={user?.name ?? user?.email ?? 'User'}
                />
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                {status === 'loading' ? (
                  <>
                    <p className="truncate text-sm font-medium text-muted-foreground">
                      Loading…
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      &nbsp;
                    </p>
                  </>
                ) : (
                  <>
                    <p className="truncate text-sm font-medium">
                      {user?.name ?? 'Signed in'}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user?.email ?? ''}
                    </p>
                  </>
                )}
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center gap-2">
                <User className="size-4" />
                โปรไฟล์
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center gap-2">
                <Settings className="size-4" />
                ตั้งค่า
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => signOut({ callbackUrl: '/login' })}
            >
              <LogOut className="size-4 mr-2" />
              ออกจากระบบ
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
