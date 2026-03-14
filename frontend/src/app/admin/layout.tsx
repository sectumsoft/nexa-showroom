'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Car, CalendarCheck, MessageSquare, Tag, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '@/store/auth';

const navItems = [
  { href: '/admin/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { href: '/admin/cars', icon: <Car size={18} />, label: 'Cars' },
  { href: '/admin/bookings', icon: <CalendarCheck size={18} />, label: 'Bookings' },
  { href: '/admin/enquiries', icon: <MessageSquare size={18} />, label: 'Enquiries' },
  { href: '/admin/offers', icon: <Tag size={18} />, label: 'Offers' },
  { href: '/admin/test-drives', icon: <CalendarCheck size={18} />, label: 'Test Drives' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [user, isLoading, pathname, router]);

  if (pathname === '/admin/login') return <>{children}</>;
  if (isLoading || !user) return (
    <div className="min-h-screen bg-[#f8f7f4] flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-[#c8a96e] border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#f8f7f4]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1a1a2e] flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#c8a96e] flex items-center justify-center">
              <span className="font-display text-white font-bold text-sm">N</span>
            </div>
            <div>
              <div className="font-display text-white text-lg">Nexa Admin</div>
              <div className="font-body text-xs text-gray-500 leading-none">Management Portal</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-body transition-all ${
                  active
                    ? 'bg-[#c8a96e] text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.icon}
                {item.label}
                {active && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-white/10">
          <div className="px-4 py-3 mb-2">
            <div className="font-body text-sm text-white">{user.name}</div>
            <div className="font-body text-xs text-gray-500">{user.role}</div>
          </div>
          <button
            onClick={() => { logout(); router.replace('/admin/login'); }}
            className="flex items-center gap-3 px-4 py-3 w-full text-sm font-body text-gray-400 hover:text-red-400 transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
