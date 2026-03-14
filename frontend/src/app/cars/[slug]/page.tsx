'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Fuel, Settings, Users, Shield, Zap, CheckCircle2, ArrowRight, ChevronLeft } from 'lucide-react';
import { carsApi } from '@/lib/api';
import { Car, CarVariant } from '@/types';
import { formatPrice } from '@/lib/utils';
import BookingModal from '@/components/booking/BookingModal';
import TestDriveModal from '@/components/booking/TestDriveModal';

export default function CarDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<CarVariant | null>(null);
  const [selectedColor, setSelectedColor] = useState(0);
  const [showBooking, setShowBooking] = useState(false);
  const [showTestDrive, setShowTestDrive] = useState(false);

  useEffect(() => {
    carsApi.bySlug(slug).then((res) => {
      if (res.success && res.data) {
        setCar(res.data);
        if (res.data.variants.length > 0) setSelectedVariant(res.data.variants[0]);
      }
      setLoading(false);
    });
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen pt-28 flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-[#c8a96e] border-t-transparent rounded-full" />
    </div>
  );

  if (!car) return (
    <div className="min-h-screen pt-28 flex items-center justify-center">
      <div className="text-center">
        <h2 className="font-display text-3xl mb-4">Car Not Found</h2>
        <Link href="/cars" className="btn-primary">Back to Cars</Link>
      </div>
    </div>
  );

  const displayImages = car.images.length > 0
    ? car.images
    : [{ id: 0, imageUrl: '/images/car-placeholder.jpg', altText: car.name, isPrimary: true, sortOrder: 0 }];

  return (
    <div className="min-h-screen bg-white pt-24">
      {/* Breadcrumb */}
      <div className="bg-[#f8f7f4] py-4">
        <div className="max-w-7xl mx-auto px-6">
          <Link href="/cars" className="flex items-center gap-2 text-sm font-body text-gray-500 hover:text-[#c8a96e] transition-colors">
            <ChevronLeft size={16} /> Back to Cars
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: Image Gallery */}
          <div>
            <div className="relative h-80 md:h-[450px] bg-[#f8f7f4] overflow-hidden mb-4">
              <Image
                src={displayImages[activeImage]?.imageUrl ?? '/images/car-placeholder.jpg'}
                alt={car.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {displayImages.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(i)}
                  className={`relative flex-shrink-0 w-20 h-16 overflow-hidden border-2 transition-all ${
                    activeImage === i ? 'border-[#c8a96e]' : 'border-transparent'
                  }`}
                >
                  <Image
                    src={img.imageUrl}
                    alt={img.altText}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Details */}
          <div>
            <div className="mb-2">
              <span className="badge bg-[#f8f7f4] text-gray-500">{car.category}</span>
            </div>
            <h1 className="font-display text-5xl text-[#1a1a2e] mb-3">{car.name}</h1>
            <p className="font-body text-gray-500 leading-relaxed mb-6">{car.shortDescription}</p>

            {/* Price */}
            <div className="flex items-center gap-3 mb-8">
              <span className="font-body text-xs text-gray-400 tracking-widest uppercase">Starting at</span>
              <span className="font-display text-4xl text-[#c8a96e]">
                {formatPrice(selectedVariant?.price ?? car.startingPrice)}
              </span>
            </div>

            {/* Key Specs */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { icon: <Fuel size={16} />, label: 'Fuel', value: car.fuelType },
                { icon: <Settings size={16} />, label: 'Transmission', value: car.transmission },
                { icon: <Zap size={16} />, label: 'Engine', value: car.engine },
                { icon: <Users size={16} />, label: 'Seating', value: car.seating ? `${car.seating} Seater` : 'N/A' },
                { icon: <Shield size={16} />, label: 'Safety', value: car.safetyRating || 'N/A' },
                { icon: <Fuel size={16} />, label: 'Mileage', value: car.mileage ? `${car.mileage} km/l` : 'N/A' },
              ].map((spec) => (
                <div key={spec.label} className="flex items-center gap-3 bg-[#f8f7f4] p-3">
                  <span className="text-[#c8a96e]">{spec.icon}</span>
                  <div>
                    <div className="font-body text-xs text-gray-400">{spec.label}</div>
                    <div className="font-body text-sm font-medium">{spec.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Colors */}
            {car.colors.length > 0 && (
              <div className="mb-8">
                <h4 className="font-body text-xs tracking-[0.15em] uppercase text-gray-500 mb-3">
                  Color: <span className="text-[#1a1a2e] font-medium">{car.colors[selectedColor]?.name}</span>
                </h4>
                <div className="flex gap-3">
                  {car.colors.map((color, i) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(i)}
                      title={color.name}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor === i ? 'border-[#c8a96e] scale-110' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color.hexCode }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => setShowBooking(true)} className="btn-primary flex-1 text-center">
                Reserve Now
              </button>
              <button onClick={() => setShowTestDrive(true)} className="btn-outline flex-1 text-center">
                Book Test Drive
              </button>
            </div>
          </div>
        </div>

        {/* Variants Table */}
        {car.variants.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display text-3xl mb-8">Available Variants</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#1a1a2e] text-white">
                    <th className="font-body text-xs tracking-widest uppercase text-left px-6 py-4">Variant</th>
                    <th className="font-body text-xs tracking-widest uppercase text-left px-6 py-4">Fuel</th>
                    <th className="font-body text-xs tracking-widest uppercase text-left px-6 py-4">Transmission</th>
                    <th className="font-body text-xs tracking-widest uppercase text-left px-6 py-4">Mileage</th>
                    <th className="font-body text-xs tracking-widest uppercase text-right px-6 py-4">Price</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {car.variants.map((variant, i) => (
                    <tr
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`border-b border-gray-100 cursor-pointer transition-colors ${
                        selectedVariant?.id === variant.id ? 'bg-[#f8f7f4]' : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="px-6 py-4 font-display text-lg">{variant.name}</td>
                      <td className="px-6 py-4 font-body text-sm text-gray-600">{variant.fuelType}</td>
                      <td className="px-6 py-4 font-body text-sm text-gray-600">{variant.transmission}</td>
                      <td className="px-6 py-4 font-body text-sm text-gray-600">{variant.mileage ? `${variant.mileage} km/l` : '—'}</td>
                      <td className="px-6 py-4 text-right font-display text-xl text-[#c8a96e]">{formatPrice(variant.price)}</td>
                      <td className="px-6 py-4">
                        {selectedVariant?.id === variant.id && (
                          <CheckCircle2 size={18} className="text-[#c8a96e]" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Full Description */}
        <section className="mt-20 max-w-3xl">
          <h2 className="font-display text-3xl mb-6">About the {car.name}</h2>
          <p className="font-body text-gray-600 leading-relaxed">{car.description}</p>
        </section>
      </div>

      {/* Modals */}
      {showBooking && (
        <BookingModal
          car={car}
          selectedVariant={selectedVariant}
          onClose={() => setShowBooking(false)}
        />
      )}
      {showTestDrive && (
        <TestDriveModal
          car={car}
          onClose={() => setShowTestDrive(false)}
        />
      )}
    </div>
  );
}