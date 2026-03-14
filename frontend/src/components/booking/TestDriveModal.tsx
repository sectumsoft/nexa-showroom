'use client';
import { useState } from 'react';
import { X, CheckCircle2, Loader2 } from 'lucide-react';
import { Car } from '@/types';
import { testDriveApi } from '@/lib/api';

interface Props {
  car: Car;
  onClose: () => void;
}

const TIME_SLOTS = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

export default function TestDriveModal({ car, onClose }: Props) {
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    preferredDate: '',
    preferredTime: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await testDriveApi.book({ carId: car.id, ...form });
    if (res.success) setDone(true);
    setLoading(false);
  };

  const update = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [k]: e.target.value }));

  // Minimum date: tomorrow
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="bg-[#1a1a2e] px-8 py-6 flex items-start justify-between">
          <div>
            <h2 className="font-display text-2xl text-white">Book Test Drive</h2>
            <p className="font-body text-xs text-gray-400 mt-1">{car.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {!done ? (
          <form onSubmit={handleSubmit} className="p-8 space-y-4">
            <div>
              <label className="font-body text-xs tracking-widest uppercase text-gray-500 block mb-2">Full Name *</label>
              <input required className="input-field" placeholder="Your full name" value={form.customerName} onChange={update('customerName')} />
            </div>
            <div>
              <label className="font-body text-xs tracking-widest uppercase text-gray-500 block mb-2">Email *</label>
              <input required type="email" className="input-field" placeholder="your@email.com" value={form.customerEmail} onChange={update('customerEmail')} />
            </div>
            <div>
              <label className="font-body text-xs tracking-widest uppercase text-gray-500 block mb-2">Phone *</label>
              <input required type="tel" className="input-field" placeholder="+91 XXXXX XXXXX" value={form.customerPhone} onChange={update('customerPhone')} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-body text-xs tracking-widest uppercase text-gray-500 block mb-2">Preferred Date *</label>
                <input required type="date" min={minDateStr} className="input-field" value={form.preferredDate} onChange={update('preferredDate')} />
              </div>
              <div>
                <label className="font-body text-xs tracking-widest uppercase text-gray-500 block mb-2">Time Slot *</label>
                <select required className="input-field" value={form.preferredTime} onChange={update('preferredTime')}>
                  <option value="">Select time</option>
                  {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="font-body text-xs tracking-widest uppercase text-gray-500 block mb-2">Message (Optional)</label>
              <textarea className="input-field min-h-20 resize-none" placeholder="Any specific requirements?" value={form.message} onChange={update('message')} />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading && <Loader2 size={16} className="animate-spin" />}
              Schedule Test Drive
            </button>
          </form>
        ) : (
          <div className="p-8 text-center">
            <CheckCircle2 size={56} className="text-green-500 mx-auto mb-6" />
            <h3 className="font-display text-3xl mb-3">Booked!</h3>
            <p className="font-body text-gray-500 mb-8">
              Your test drive for the <strong>{car.name}</strong> has been scheduled.
              We&apos;ll confirm your slot via email and phone within 24 hours.
            </p>
            <button onClick={onClose} className="btn-primary w-full">Close</button>
          </div>
        )}
      </div>
    </div>
  );
}
