import { offersApi } from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/utils';
import { Tag, Clock } from 'lucide-react';

export const revalidate = 60;

export default async function OffersPage() {
  const res = await offersApi.active();
  const offers = res.data ?? [];

  return (
    <div className="min-h-screen pt-28 pb-20 bg-[#f8f7f4]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="section-subtitle">Save More, Drive More</p>
          <h1 className="section-title">Current Offers</h1>
          <p className="font-body text-gray-500 mt-4 max-w-xl mx-auto">
            Take advantage of our exclusive seasonal deals, finance offers, and exchange bonuses.
            Limited time only — don&apos;t miss out.
          </p>
        </div>

        {offers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white border border-gray-100 card-hover overflow-hidden group"
              >
                {/* Top bar */}
                <div className="bg-[#1a1a2e] px-6 py-3 flex items-center justify-between">
                  <span className="badge bg-[#c8a96e]/20 text-[#c8a96e] flex items-center gap-1">
                    <Tag size={10} /> {offer.offerType}
                  </span>
                  {offer.carName && (
                    <span className="font-body text-xs text-gray-400">{offer.carName}</span>
                  )}
                </div>

                {/* Body */}
                <div className="p-8">
                  <h3 className="font-display text-2xl text-[#1a1a2e] mb-3 group-hover:text-[#c8a96e] transition-colors">
                    {offer.title}
                  </h3>
                  <p className="font-body text-sm text-gray-500 leading-relaxed mb-6">
                    {offer.description}
                  </p>
                  {offer.discountAmount && (
                    <div className="font-display text-4xl text-[#c8a96e] mb-6">
                      Save {formatPrice(offer.discountAmount)}
                    </div>
                  )}

                  {/* Validity */}
                  <div className="flex items-center gap-2 text-xs font-body text-gray-400 border-t border-gray-100 pt-4">
                    <Clock size={12} />
                    Valid till {formatDate(offer.validUntil)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white border border-gray-100">
            <Tag size={48} className="text-gray-200 mx-auto mb-4" />
            <h3 className="font-display text-2xl text-gray-400 mb-2">No Active Offers</h3>
            <p className="font-body text-gray-400">Check back soon for exciting deals.</p>
          </div>
        )}
      </div>
    </div>
  );
}
