'use client';
import { useEffect, useState } from 'react';
import { Mail, MailOpen, Phone } from 'lucide-react';
import { enquiriesApi } from '@/lib/api';
import { Enquiry } from '@/types';
import { formatDate } from '@/lib/utils';

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Enquiry | null>(null);

  useEffect(() => {
    enquiriesApi.all().then((res) => {
      setEnquiries(res.data ?? []);
      setLoading(false);
    });
  }, []);

  const markRead = async (id: number) => {
    await enquiriesApi.markRead(id);
    setEnquiries((prev) => prev.map((e) => e.id === id ? { ...e, isRead: true } : e));
  };

  const open = (e: Enquiry) => {
    setSelected(e);
    if (!e.isRead) markRead(e.id);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl text-[#1a1a2e] mb-1">Enquiries</h1>
        <p className="font-body text-sm text-gray-500">
          {enquiries.filter((e) => !e.isRead).length} unread of {enquiries.length} total
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="bg-white border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin w-6 h-6 border-2 border-[#c8a96e] border-t-transparent rounded-full mx-auto" />
            </div>
          ) : enquiries.length === 0 ? (
            <div className="p-12 text-center font-body text-gray-400">No enquiries yet</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {enquiries.map((e) => (
                <button
                  key={e.id}
                  onClick={() => open(e)}
                  className={`w-full text-left px-5 py-4 hover:bg-gray-50 transition-colors ${
                    selected?.id === e.id ? 'bg-[#f8f7f4]' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      e.isRead ? 'bg-gray-100 text-gray-400' : 'bg-[#c8a96e]/20 text-[#c8a96e]'
                    }`}>
                      {e.isRead ? <MailOpen size={14} /> : <Mail size={14} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-body text-sm truncate ${e.isRead ? 'text-gray-600' : 'font-semibold text-gray-900'}`}>
                        {e.customerName}
                      </div>
                      <div className="font-body text-xs text-gray-400 truncate">{e.subject}</div>
                      <div className="font-body text-xs text-gray-300 mt-1">{formatDate(e.createdAt)}</div>
                    </div>
                    {!e.isRead && <div className="w-2 h-2 bg-[#c8a96e] rounded-full mt-2 flex-shrink-0" />}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detail */}
        <div className="lg:col-span-2 bg-white border border-gray-100">
          {selected ? (
            <div className="p-8">
              <div className="flex items-start justify-between mb-6 pb-6 border-b border-gray-100">
                <div>
                  <h2 className="font-display text-2xl mb-1">{selected.subject}</h2>
                  <div className="flex items-center gap-4 text-sm font-body text-gray-400">
                    <span>{formatDate(selected.createdAt)}</span>
                    {selected.carName && (
                      <span className="badge bg-[#f8f7f4] text-gray-600">{selected.carName}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Sender info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[
                  { label: 'Name', value: selected.customerName },
                  { label: 'Email', value: selected.customerEmail },
                  { label: 'Phone', value: selected.customerPhone },
                ].map((item) => (
                  <div key={item.label} className="bg-[#f8f7f4] p-4">
                    <div className="font-body text-xs tracking-widest uppercase text-gray-400 mb-1">{item.label}</div>
                    <div className="font-body text-sm font-medium">{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Message */}
              <div>
                <h3 className="font-body text-xs tracking-widest uppercase text-gray-400 mb-3">Message</h3>
                <p className="font-body text-gray-700 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>

              {/* Quick actions */}
              <div className="flex gap-4 mt-8 pt-6 border-t border-gray-100">
                <a
                  href={`mailto:${selected.customerEmail}?subject=Re: ${selected.subject}`}
                  className="btn-primary text-xs py-2"
                >
                  Reply via Email
                </a>
                <a
                  href={`tel:${selected.customerPhone}`}
                  className="btn-outline text-xs py-2 flex items-center gap-2"
                >
                  <Phone size={13} /> Call Customer
                </a>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full py-24 text-center">
              <div>
                <Mail size={40} className="text-gray-200 mx-auto mb-4" />
                <p className="font-body text-gray-400">Select an enquiry to read it</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
