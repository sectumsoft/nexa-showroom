'use client';
import { useEffect, useState } from 'react';
import { Car, CalendarCheck, MessageSquare, TrendingUp, Clock } from 'lucide-react';
import { carsApi, bookingsApi, testDriveApi, enquiriesApi } from '@/lib/api';
import { Booking, Enquiry, TestDriveBooking } from '@/types';
import { formatPrice, formatDate, getStatusColor } from '@/lib/utils';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ cars: 0, bookings: 0, testDrives: 0, enquiries: 0 });
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [recentEnquiries, setRecentEnquiries] = useState<Enquiry[]>([]);
  const [recentTestDrives, setRecentTestDrives] = useState<TestDriveBooking[]>([]);

  useEffect(() => {
    Promise.all([
      carsApi.list({ pageSize: 1 }),
      bookingsApi.all(),
      testDriveApi.all(),
      enquiriesApi.all(),
    ]).then(([carsRes, bookRes, tdRes, enqRes]) => {
      const bookings = bookRes.data ?? [];
      const testDrives = tdRes.data ?? [];
      const enquiries = enqRes.data ?? [];
      setStats({
        cars: carsRes.data?.total ?? 0,
        bookings: bookings.length,
        testDrives: testDrives.length,
        enquiries: enquiries.filter((e) => !e.isRead).length,
      });
      setRecentBookings(bookings.slice(0, 5));
      setRecentTestDrives(testDrives.slice(0, 5));
      setRecentEnquiries(enquiries.slice(0, 5));
    });
  }, []);

  const statCards = [
    { label: 'Total Cars', value: stats.cars, icon: <Car size={22} />, color: 'bg-blue-50 text-blue-600' },
    { label: 'Reservations', value: stats.bookings, icon: <TrendingUp size={22} />, color: 'bg-green-50 text-green-600' },
    { label: 'Test Drives', value: stats.testDrives, icon: <CalendarCheck size={22} />, color: 'bg-purple-50 text-purple-600' },
    { label: 'Unread Enquiries', value: stats.enquiries, icon: <MessageSquare size={22} />, color: 'bg-amber-50 text-amber-600' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl text-[#1a1a2e] mb-1">Dashboard</h1>
        <p className="font-body text-sm text-gray-500">Welcome back. Here&apos;s what&apos;s happening.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white border border-gray-100 p-6">
            <div className={`w-11 h-11 ${card.color} flex items-center justify-center mb-4`}>
              {card.icon}
            </div>
            <div className="font-display text-3xl text-[#1a1a2e]">{card.value}</div>
            <div className="font-body text-sm text-gray-500 mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings */}
        <div className="bg-white border border-gray-100 p-6">
          <h2 className="font-display text-xl mb-6">Recent Reservations</h2>
          {recentBookings.length > 0 ? (
            <div className="space-y-4">
              {recentBookings.map((b) => (
                <div key={b.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <div>
                    <div className="font-body text-sm font-medium">{b.customerName}</div>
                    <div className="font-body text-xs text-gray-400">{b.carName} · {b.bookingNumber}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-sm text-[#c8a96e]">{formatPrice(b.bookingAmount)}</div>
                    <span className={`badge text-xs mt-1 ${getStatusColor(b.bookingStatus)}`}>
                      {b.bookingStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="font-body text-sm text-gray-400 py-8 text-center">No reservations yet</p>
          )}
        </div>

        {/* Recent Test Drives */}
        <div className="bg-white border border-gray-100 p-6">
          <h2 className="font-display text-xl mb-6">Recent Test Drives</h2>
          {recentTestDrives.length > 0 ? (
            <div className="space-y-4">
              {recentTestDrives.map((t) => (
                <div key={t.id} className="py-3 border-b border-gray-50 last:border-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-body text-sm font-medium">{t.customerName}</div>
                      <div className="font-body text-xs text-gray-400">{t.carName}</div>
                      <div className="font-body text-xs text-gray-400 mt-1">
                        {formatDate(t.preferredDate)} · {t.preferredTime}
                      </div>
                    </div>
                    <span className={`badge text-xs ${getStatusColor(t.status)}`}>
                      {t.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="font-body text-sm text-gray-400 py-8 text-center">No test drives yet</p>
          )}
        </div>

        {/* Recent Enquiries */}
        <div className="bg-white border border-gray-100 p-6">
          <h2 className="font-display text-xl mb-6">Recent Enquiries</h2>
          {recentEnquiries.length > 0 ? (
            <div className="space-y-4">
              {recentEnquiries.map((e) => (
                <div key={e.id} className={`py-3 border-b border-gray-50 last:border-0 ${!e.isRead ? 'opacity-100' : 'opacity-60'}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-body text-sm font-medium">{e.customerName}</span>
                        {!e.isRead && <span className="w-2 h-2 bg-[#c8a96e] rounded-full" />}
                      </div>
                      <div className="font-body text-xs text-gray-400">{e.subject}</div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-body text-gray-400">
                      <Clock size={11} />
                      {formatDate(e.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="font-body text-sm text-gray-400 py-8 text-center">No enquiries yet</p>
          )}
        </div>
      </div>
    </div>
  );
}