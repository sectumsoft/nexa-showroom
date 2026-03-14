'use client';
import { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, CalendarDays } from 'lucide-react';
import { carsApi, testDriveApi } from '@/lib/api';
import { Car } from '@/types';

const TIME_SLOTS = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

export default function TestDrivePage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    carId: '', customerName: '', customerEmail: '',
    customerPhone: '', preferredDate: '', preferredTime: '', message: '',
  });

  useEffect(() => {
    carsApi.list({ pageSize: 50 }).then((res) => setCars(res.data?.cars ?? []));
  }, []);

  const upd = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await testDriveApi.book({ ...form, carId: Number(form.carId) });
    if (res.success) setDone(true);
    setLoading(false);
  };

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split('T')[0];

  return (
    <div className="min-h-screen pt-28 pb-20 bg-[#f8f7f4]">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left — Info */}
          <div className="lg:pt-8">
            <p className="section-subtitle">Free & No Obligation</p>
            <h1 className="section-title mb-6">Book a Test Drive</h1>
            <p className="font-body text-gray-500 leading-relaxed mb-10">
              Experience the thrill of driving a Nexa car. Our specialists will guide you through
              every feature and answer all your questions — at your convenience.
            </p>
            <div className="space-y-6">
              {[
                { step: '01', title: 'Choose Your Car', desc: 'Select the model you want to experience.' },
                { step: '02', title: 'Pick a Slot', desc: 'Choose a date and time that works for you.' },
                { step: '03', title: 'We Confirm', desc: 'Our team confirms within 2 hours.' },
                { step: '04', title: 'Drive It', desc: 'Arrive at the showroom and enjoy the ride.' },
              ].map((item) => (
                <div key={item.step} className="flex gap-5">
                  <div className="font-display text-2xl text-[#c8a96e] w-8 flex-shrink-0">{item.step}</div>
                  <div>
                    <div className="font-display text-lg">{item.title}</div>
                    <div className="font-body text-sm text-gray-500">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Form */}
          <div className="bg-white p-8 border border-gray-100">
            {!done ? (
              <>
                <div className="flex items-center gap-3 mb-8">
                  <CalendarDays size={22} className="text-[#c8a96e]" />
                  <h2 className="font-display text-2xl">Schedule Your Drive</h2>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="font-body text-xs tracking-widest uppercase text-gray-400 block mb-2">Select Car *</label>
                    <select required className="input-field" value={form.carId} onChange={upd('carId')}>
                      <option value="">— Choose a model —</option>
                      {cars.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="font-body text-xs tracking-widest uppercase text-gray-400 block mb-2">Full Name *</label>
                    <input required className="input-field" placeholder="Your full name" value={form.customerName} onChange={upd('customerName')} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-body text-xs tracking-widest uppercase text-gray-400 block mb-2">Email *</label>
                      <input required type="email" className="input-field" placeholder="you@email.com" value={form.customerEmail} onChange={upd('customerEmail')} />
                    </div>
                    <div>
                      <label className="font-body text-xs tracking-widest uppercase text-gray-400 block mb-2">Phone *</label>
                      <input required type="tel" className="input-field" placeholder="+91 XXXXX" value={form.customerPhone} onChange={upd('customerPhone')} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-body text-xs tracking-widest uppercase text-gray-400 block mb-2">Preferred Date *</label>
                      <input required type="date" min={minDateStr} className="input-field" value={form.preferredDate} onChange={upd('preferredDate')} />
                    </div>
                    <div>
                      <label className="font-body text-xs tracking-widest uppercase text-gray-400 block mb-2">Time Slot *</label>
                      <select required className="input-field" value={form.preferredTime} onChange={upd('preferredTime')}>
                        <option value="">Select time</option>
                        {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="font-body text-xs tracking-widest uppercase text-gray-400 block mb-2">Message (Optional)</label>
                    <textarea rows={3} className="input-field resize-none" placeholder="Any preferences or questions?" value={form.message} onChange={upd('message')} />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
                    {loading && <Loader2 size={16} className="animate-spin" />}
                    Book Test Drive
                  </button>
                </form>
              </>
            ) : (
              <div className="py-12 text-center">
                <CheckCircle2 size={56} className="text-green-500 mx-auto mb-6" />
                <h3 className="font-display text-3xl mb-3">You&apos;re Booked!</h3>
                <p className="font-body text-gray-500 leading-relaxed">
                  We&apos;ve received your test drive request. Our team will confirm your slot
                  within 2 hours via phone and email.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
