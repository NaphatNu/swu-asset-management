'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Search,
  Plus,
  List,
  Wrench,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  {
    title: 'หน้าหลัก',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'ค้นหา',
    href: '/search',
    icon: Search,
  },
  {
    title: 'เพิ่ม',
    href: '/assets/new',
    icon: Plus,
  },
  {
    title: 'รายการ',
    href: '/assets',
    icon: List,
  },
  {
    title: 'แจ้งซ่อม',
    href: '/repair',
    icon: Wrench,
  },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden">
      <div className="flex h-16 items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 text-muted-foreground transition-colors min-w-[60px]',
                'active:scale-95 touch-manipulation',
                isActive && 'text-primary'
              )}
            >
              <div
                className={cn(
                  'flex size-10 items-center justify-center rounded-xl transition-all',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground'
                )}
              >
                <item.icon className="size-5" />
              </div>
              <span
                className={cn(
                  'text-[10px] font-medium',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {item.title}
              </span>
            </Link>
          );
        })}
      </div>
      {/* Safe area for iOS */}
      <div className="h-safe-area-inset-bottom bg-background" />
    </nav>
  );
}
