import Link from 'next/link';
import Image from 'next/image';
import { Fuel, Settings, ArrowRight, Star } from 'lucide-react';
import { Car } from '@/types';
import { formatPrice } from '@/lib/utils';

interface CarCardProps {
  car: Car;
}

export default function CarCard({ car }: CarCardProps) {
  const imageUrl = car.primaryImageUrl ?? '/images/car-placeholder.jpg';

  return (
    <div className="group bg-white card-hover overflow-hidden border border-gray-100">
      {/* Image */}
      <div className="relative h-56 bg-gray-50 overflow-hidden">
        <Image
          src={imageUrl}
          alt={car.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {car.isFeatured && (
          <div className="absolute top-4 left-4">
            <span className="badge bg-[#c8a96e] text-white flex items-center gap-1">
              <Star size={10} fill="white" /> Featured
            </span>
          </div>
        )}
        <div className="absolute top-4 right-4">
          <span className="badge bg-white/90 text-[#1a1a2e]">{car.category}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-display text-2xl text-[#1a1a2e] mb-2 group-hover:text-[#c8a96e] transition-colors">
          {car.name}
        </h3>
        <p className="font-body text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
          {car.shortDescription}
        </p>

        {/* Specs */}
        <div className="flex items-center gap-4 mb-5">
          <div className="flex items-center gap-1.5 text-xs font-body text-gray-500">
            <Fuel size={13} className="text-[#c8a96e]" />
            {car.fuelType}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-body text-gray-500">
            <Settings size={13} className="text-[#c8a96e]" />
            {car.transmission}
          </div>
          {car.mileage && (
            <div className="text-xs font-body text-gray-500">
              {car.mileage} km/l
            </div>
          )}
        </div>

        {/* Price + CTA */}
        <div className="flex items-end justify-between pt-4 border-t border-gray-100">
          <div>
            <span className="font-body text-xs text-gray-400 tracking-widest uppercase">Starting from</span>
            <div className="font-display text-2xl text-[#1a1a2e]">
              {formatPrice(car.startingPrice)}
            </div>
          </div>
          <Link
            href={`/cars/${car.slug}`}
            className="flex items-center gap-2 text-xs font-body tracking-widest uppercase text-[#c8a96e] hover:gap-4 transition-all"
          >
            Explore <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
