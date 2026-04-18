import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar, MobileNav, Header } from '@/components/layout';


export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-4 pb-24 md:p-6 md:pb-6">
          {children}
        </main>
      </SidebarInset>
      <MobileNav />
    </SidebarProvider>
  );
}
