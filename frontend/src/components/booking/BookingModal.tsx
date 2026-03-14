'use client';
import { useState } from 'react';
import { X, CheckCircle2, Loader2 } from 'lucide-react';
import { Car, CarVariant } from '@/types';
import { bookingsApi } from '@/lib/api';
import { formatPrice } from '@/lib/utils';

interface Props {
  car: Car;
  selectedVariant: CarVariant | null;
  onClose: () => void;
}

export default function BookingModal({ car, selectedVariant, onClose }: Props) {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [bookingNumber, setBookingNumber] = useState('');
  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    colorPreference: '',
  });

  const BOOKING_AMOUNT = 11000; // ₹11,000 token amount

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await bookingsApi.create({
      carId: car.id,
      carVariantId: selectedVariant?.id,
      ...form,
      bookingAmount: BOOKING_AMOUNT,
    });
    if (res.success && res.data) {
      setBookingNumber(res.data.bookingNumber);
      setStep('success');
    }
    setLoading(false);
  };

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-[#1a1a2e] px-8 py-6 flex items-start justify-between">
          <div>
            <h2 className="font-display text-2xl text-white">Reserve Your Car</h2>
            <p className="font-body text-xs text-gray-400 mt-1">{car.name}{selectedVariant ? ` · ${selectedVariant.name}` : ''}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {step === 'form' ? (
          <form onSubmit={handleSubmit} className="p-8 space-y-4">
            {/* Booking summary */}
            <div className="bg-[#f8f7f4] p-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-body text-sm text-gray-500">Booking Amount</span>
                <span className="font-display text-2xl text-[#c8a96e]">{formatPrice(BOOKING_AMOUNT)}</span>
              </div>
              <p className="font-body text-xs text-gray-400 mt-2">
                Refundable token amount. Full payment on delivery.
              </p>
            </div>

            <div>
              <label className="font-body text-xs tracking-widest uppercase text-gray-500 block mb-2">Full Name *</label>
              <input
                required
                className="input-field"
                placeholder="Your full name"
                value={form.customerName}
                onChange={update('customerName')}
              />
            </div>
            <div>
              <label className="font-body text-xs tracking-widest uppercase text-gray-500 block mb-2">Email *</label>
              <input
                required
                type="email"
                className="input-field"
                placeholder="your@email.com"
                value={form.customerEmail}
                onChange={update('customerEmail')}
              />
            </div>
            <div>
              <label className="font-body text-xs tracking-widest uppercase text-gray-500 block mb-2">Phone *</label>
              <input
                required
                type="tel"
                className="input-field"
                placeholder="+91 XXXXX XXXXX"
                value={form.customerPhone}
                onChange={update('customerPhone')}
              />
            </div>
            <div>
              <label className="font-body text-xs tracking-widest uppercase text-gray-500 block mb-2">Color Preference</label>
              <input
                className="input-field"
                placeholder="Preferred color (optional)"
                value={form.colorPreference}
                onChange={update('colorPreference')}
              />
            </div>
            <div>
              <label className="font-body text-xs tracking-widest uppercase text-gray-500 block mb-2">Address</label>
              <textarea
                className="input-field min-h-20 resize-none"
                placeholder="Your address (optional)"
                value={form.customerAddress}
                onChange={update('customerAddress')}
              />
            </div>

            {/* Payment placeholder */}
            <div className="border border-dashed border-gray-200 p-4 mt-2">
              <p className="font-body text-xs text-gray-400 text-center">
                💳 Payment gateway integration point<br />
                <span className="text-gray-300">(Razorpay / PayU integration goes here)</span>
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              Confirm Booking · {formatPrice(BOOKING_AMOUNT)}
            </button>
          </form>
        ) : (
          <div className="p-8 text-center">
            <CheckCircle2 size={56} className="text-green-500 mx-auto mb-6" />
            <h3 className="font-display text-3xl mb-3">Booking Confirmed!</h3>
            <p className="font-body text-gray-500 mb-4">
              Your booking number is:
            </p>
            <div className="font-display text-2xl text-[#c8a96e] bg-[#f8f7f4] py-4 px-6 mb-6">
              {bookingNumber}
            </div>
            <p className="font-body text-sm text-gray-400 mb-8">
              Our team will contact you shortly to confirm your reservation.
              Please save your booking number for future reference.
            </p>
            <button onClick={onClose} className="btn-primary w-full">
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
