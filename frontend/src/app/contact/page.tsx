'use client';
import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import { enquiriesApi } from '@/lib/api';

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customerName: '', customerEmail: '', customerPhone: '',
    subject: '', message: '',
  });

  const update = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await enquiriesApi.submit(form);
    if (res.success) setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-[#f8f7f4]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="section-subtitle">We&apos;re Here to Help</p>
          <h1 className="section-title">Contact Us</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Info Cards */}
          <div className="space-y-6">
            {[
              { icon: <Phone size={20} />, title: 'Call Us', lines: ['+91 98765 43210', '+91 80123 45678'], sub: 'Mon–Sat, 9AM–7PM' },
              { icon: <Mail size={20} />, title: 'Email', lines: ['hello@nexacars.in', 'support@nexacars.in'], sub: 'We reply within 24 hours' },
              { icon: <MapPin size={20} />, title: 'Visit Us', lines: ['123 Premium Auto Park', 'MG Road, Bangalore – 560001'], sub: '' },
              { icon: <Clock size={20} />, title: 'Showroom Hours', lines: ['Mon–Sat: 9:00 AM – 7:00 PM', 'Sunday: 10:00 AM – 5:00 PM'], sub: '' },
            ].map((card) => (
              <div key={card.title} className="bg-white p-6 border border-gray-100 flex gap-4">
                <div className="w-10 h-10 bg-[#f8f7f4] flex items-center justify-center flex-shrink-0 text-[#c8a96e]">
                  {card.icon}
                </div>
                <div>
                  <h4 className="font-display text-lg mb-2">{card.title}</h4>
                  {card.lines.map((line) => (
                    <p key={line} className="font-body text-sm text-gray-600">{line}</p>
                  ))}
                  {card.sub && <p className="font-body text-xs text-gray-400 mt-1">{card.sub}</p>}
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-white p-10 border border-gray-100">
            {!sent ? (
              <>
                <h2 className="font-display text-3xl mb-8">Send an Enquiry</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="font-body text-xs tracking-widest uppercase text-gray-500 block mb-2">Name *</label>
                      <input required className="input-field" placeholder="Your name" value={form.customerName} onChange={update('customerName')} />
                    </div>
                    <div>
                      <label className="font-body text-xs tracking-widest uppercase text-gray-500 block mb-2">Phone *</label>
                      <input required type="tel" className="input-field" placeholder="+91 XXXXX XXXXX" value={form.customerPhone} onChange={update('customerPhone')} />
                    </div>
                  </div>
                  <div>
                    <label className="font-body text-xs tracking-widest uppercase text-gray-500 block mb-2">Email *</label>
                    <input required type="email" className="input-field" placeholder="your@email.com" value={form.customerEmail} onChange={update('customerEmail')} />
                  </div>
                  <div>
                    <label className="font-body text-xs tracking-widest uppercase text-gray-500 block mb-2">Subject *</label>
                    <input required className="input-field" placeholder="How can we help?" value={form.subject} onChange={update('subject')} />
                  </div>
                  <div>
                    <label className="font-body text-xs tracking-widest uppercase text-gray-500 block mb-2">Message *</label>
                    <textarea required rows={5} className="input-field resize-none" placeholder="Tell us more..." value={form.message} onChange={update('message')} />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
                    {loading && <Loader2 size={16} className="animate-spin" />}
                    Send Enquiry
                  </button>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <CheckCircle2 size={56} className="text-green-500 mb-6" />
                <h3 className="font-display text-3xl mb-3">Message Received!</h3>
                <p className="font-body text-gray-500 max-w-sm">
                  Thank you for reaching out. Our team will get back to you within 24 hours.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
