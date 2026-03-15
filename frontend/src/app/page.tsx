import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Shield, Award, Headphones, Zap } from 'lucide-react';
import { carsApi, offersApi } from '@/lib/api';
import CarCard from '@/components/cars/CarCard';
import { formatPrice } from '@/lib/utils';

export const revalidate = 60;

export default async function HomePage() {
  const [featuredRes, offersRes] = await Promise.all([
    carsApi.featured(),
    offersApi.active(),
  ]);

  const featuredCars = featuredRes.data ?? [];
  const offers = offersRes.data?.slice(0, 3) ?? [];

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative h-screen min-h-[700px] flex items-center overflow-hidden">
        {/* Background Video */}
<div className="absolute inset-0 bg-[#1a1a2e] overflow-hidden">
  <video
    autoPlay
    muted
    loop
    playsInline
    className="absolute inset-0 w-full h-full object-cover opacity-40"
    src="https://res.cloudinary.com/dzmidur6k/video/upload/v1773567676/3999415-hd_1920_1080_24fps_qr7ago.mp4"
  />
  <div className="hero-overlay absolute inset-0" />
</div>

        {/* Decorative lines */}
        <div className="absolute right-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-[#c8a96e]/30 to-transparent" />
        <div className="absolute right-24 top-0 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24">
          <div className="max-w-2xl">
            <p className="section-subtitle fade-up">Premium Nexa Experience</p>
            <h1 className="font-display text-6xl md:text-8xl text-white font-light leading-none mb-6 fade-up fade-up-delay-1">
              Drive the
              <span className="block gold-shimmer">Extraordinary</span>
            </h1>
            <p className="font-body text-gray-300 text-lg leading-relaxed mb-10 max-w-lg fade-up fade-up-delay-2">
              Discover Nexa&apos;s curated collection of premium automobiles.
              From bold crossovers to refined sedans — find your perfect drive.
            </p>
            <div className="flex flex-wrap gap-4 fade-up fade-up-delay-3">
              <Link href="/cars" className="btn-gold">
                Explore Cars
              </Link>
              <Link href="/test-drive" className="btn-outline border-white text-white hover:bg-white hover:text-[#1a1a2e]">
                Book Test Drive
              </Link>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-black/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '15+', label: 'Car Models' },
              { value: '10K+', label: 'Happy Customers' },
              { value: '5★', label: 'Service Rating' },
              { value: '24/7', label: 'Customer Support' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-2xl text-[#c8a96e]">{stat.value}</div>
                <div className="font-body text-xs text-gray-400 tracking-widest uppercase mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Cars ─────────────────────────────────── */}
      <section className="py-24 bg-[#f8f7f4]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
            <div>
              <p className="section-subtitle">Handpicked for you</p>
              <h2 className="section-title">Featured Models</h2>
            </div>
            <Link href="/cars" className="flex items-center gap-2 text-sm font-body tracking-widest uppercase text-[#c8a96e] hover:gap-4 transition-all mt-4 md:mt-0">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {featuredCars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400 font-body">
              No featured cars at the moment. Check back soon.
            </div>
          )}
        </div>
      </section>

      {/* ── Why Nexa ──────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="section-subtitle">Why Choose Us</p>
            <h2 className="section-title">The Nexa Difference</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Award size={28} />,
                title: 'Premium Selection',
                desc: 'Curated range of world-class automobiles designed for the discerning driver.',
              },
              {
                icon: <Shield size={28} />,
                title: 'Trusted Quality',
                desc: 'Every vehicle meets the highest standards of safety, performance, and refinement.',
              },
              {
                icon: <Headphones size={28} />,
                title: 'Concierge Service',
                desc: 'Dedicated relationship managers to guide you through your entire journey.',
              },
              {
                icon: <Zap size={28} />,
                title: 'Easy Booking',
                desc: 'Reserve your dream car online with a simple booking amount — hassle-free.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group p-8 border border-gray-100 hover:border-[#c8a96e] transition-all duration-300 hover:shadow-lg"
              >
                <div className="w-12 h-12 bg-[#f8f7f4] flex items-center justify-center mb-6 text-[#c8a96e] group-hover:bg-[#1a1a2e] group-hover:text-white transition-all duration-300">
                  {item.icon}
                </div>
                <h3 className="font-display text-xl mb-3">{item.title}</h3>
                <p className="font-body text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Offers ────────────────────────────────────────── */}
      {offers.length > 0 && (
        <section className="py-24 bg-[#1a1a2e]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
              <div>
                <p className="section-subtitle text-[#c8a96e]">Limited Time</p>
                <h2 className="section-title text-white">Exclusive Offers</h2>
              </div>
              <Link href="/offers" className="flex items-center gap-2 text-sm font-body tracking-widest uppercase text-[#c8a96e] hover:gap-4 transition-all mt-4 md:mt-0">
                View All <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {offers.map((offer) => (
                <div key={offer.id} className="border border-white/10 p-8 hover:border-[#c8a96e] transition-all">
                  <span className="badge bg-[#c8a96e]/20 text-[#c8a96e] mb-4 block w-fit">
                    {offer.offerType}
                  </span>
                  <h3 className="font-display text-2xl text-white mb-3">{offer.title}</h3>
                  <p className="font-body text-sm text-gray-400 leading-relaxed mb-4">{offer.description}</p>
                  {offer.discountAmount && (
                    <div className="font-display text-3xl text-[#c8a96e]">
                      Save {formatPrice(offer.discountAmount)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="section-subtitle">Ready to Drive?</p>
          <h2 className="section-title mb-6">Experience it First-hand</h2>
          <p className="font-body text-gray-500 mb-10 leading-relaxed">
            Schedule a personalized test drive at your convenience. Our specialists
            will ensure you find exactly the right car for your lifestyle.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/test-drive" className="btn-primary">
              Book Test Drive
            </Link>
            <Link href="/contact" className="btn-outline">
              Talk to an Expert
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
