'use client';
import { useEffect, useState } from 'react';
import { testDriveApi } from '@/lib/api';
import { TestDriveBooking } from '@/types';
import { formatDate, getStatusColor } from '@/lib/utils';

const STATUSES = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

export default function AdminTestDrivesPage() {
  const [bookings, setBookings] = useState<TestDriveBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    testDriveApi.all().then((res) => {
      setBookings(res.data ?? []);
      setLoading(false);
    });
  }, []);

  const updateStatus = async (id: number, status: string) => {
    const res = await testDriveApi.updateStatus(id, status);
    if (res.success && res.data) {
      setBookings((prev) => prev.map((b) => b.id === id ? res.data! : b));
    }
  };

  const filtered = filter ? bookings.filter((b) => b.status === filter) : bookings;

  return (
    <div className="p-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="font-display text-4xl text-[#1a1a2e] mb-1">Test Drives</h1>
          <p className="font-body text-sm text-gray-500">{bookings.length} total bookings</p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="input-field w-auto py-2 text-sm"
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="bg-white border border-gray-100">
        {loading ? (
          <div className="p-16 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-[#c8a96e] border-t-transparent rounded-full mx-auto" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Customer', 'Car', 'Date & Time', 'Phone', 'Message', 'Status', 'Action'].map((h) => (
                    <th key={h} className="px-6 py-4 text-left font-body text-xs tracking-widest uppercase text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-body text-sm font-medium">{b.customerName}</div>
                      <div className="font-body text-xs text-gray-400">{b.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4 font-body text-sm">{b.carName}</td>
                    <td className="px-6 py-4">
                      <div className="font-body text-sm">{formatDate(b.preferredDate)}</div>
                      <div className="font-body text-xs text-gray-400">{b.preferredTime}</div>
                    </td>
                    <td className="px-6 py-4 font-body text-sm text-gray-600">{b.customerPhone}</td>
                    <td className="px-6 py-4 font-body text-sm text-gray-500 max-w-[200px] truncate">
                      {b.message || '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge ${getStatusColor(b.status)}`}>{b.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={b.status}
                        onChange={(e) => updateStatus(b.id, e.target.value)}
                        className="text-xs font-body border border-gray-200 px-2 py-1 focus:outline-none focus:border-[#c8a96e]"
                      >
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-16 text-center font-body text-gray-400">No test drive bookings found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}