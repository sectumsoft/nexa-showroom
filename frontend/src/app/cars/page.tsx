'use client';
import { useState, useEffect, useCallback } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { carsApi } from '@/lib/api';
import { Car, CarFilter } from '@/types';
import CarCard from '@/components/cars/CarCard';
import { formatPrice } from '@/lib/utils';

const FUEL_TYPES = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'];
const TRANSMISSIONS = ['Manual', 'Automatic', 'AMT'];
const CATEGORIES = ['SUV', 'Sedan', 'Hatchback', 'Crossover', 'MPV'];

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filter, setFilter] = useState<CarFilter>({ page: 1, pageSize: 12 });

  const fetchCars = useCallback(async () => {
    setLoading(true);
    const res = await carsApi.list(filter);
    if (res.success && res.data) {
      setCars(res.data.cars);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    }
    setLoading(false);
  }, [filter]);

  useEffect(() => { fetchCars(); }, [fetchCars]);

  const updateFilter = (key: keyof CarFilter, value: string | number | undefined) => {
    setFilter((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => setFilter({ page: 1, pageSize: 12 });

  const hasActiveFilters = filter.fuelType || filter.transmission || filter.category ||
    filter.minPrice || filter.maxPrice;

  return (
    <div className="min-h-screen bg-[#f8f7f4] pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-10">
          <p className="section-subtitle">Our Collection</p>
          <div className="flex items-end justify-between">
            <h1 className="section-title">All Cars</h1>
            <div className="flex items-center gap-4">
              {hasActiveFilters && (
                <button onClick={clearFilters} className="flex items-center gap-2 text-xs font-body text-red-500 hover:text-red-700">
                  <X size={14} /> Clear Filters
                </button>
              )}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 btn-outline py-2 px-4 text-xs"
              >
                <SlidersHorizontal size={14} />
                Filters {hasActiveFilters && <span className="w-2 h-2 bg-[#c8a96e] rounded-full"></span>}
              </button>
            </div>
          </div>
          <p className="font-body text-sm text-gray-500 mt-2">{total} cars available</p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className={`w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white p-6 border border-gray-100 sticky top-28">
              <h3 className="font-display text-lg mb-6">Filter By</h3>

              {/* Fuel Type */}
              <div className="mb-6">
                <h4 className="font-body text-xs tracking-[0.15em] uppercase text-gray-500 mb-3">Fuel Type</h4>
                <div className="space-y-2">
                  {FUEL_TYPES.map((fuel) => (
                    <label key={fuel} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="fuelType"
                        checked={filter.fuelType === fuel}
                        onChange={() => updateFilter('fuelType', filter.fuelType === fuel ? undefined : fuel)}
                        className="accent-[#c8a96e]"
                      />
                      <span className="font-body text-sm text-gray-600 group-hover:text-[#1a1a2e]">{fuel}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Transmission */}
              <div className="mb-6">
                <h4 className="font-body text-xs tracking-[0.15em] uppercase text-gray-500 mb-3">Transmission</h4>
                <div className="space-y-2">
                  {TRANSMISSIONS.map((t) => (
                    <label key={t} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="transmission"
                        checked={filter.transmission === t}
                        onChange={() => updateFilter('transmission', filter.transmission === t ? undefined : t)}
                        className="accent-[#c8a96e]"
                      />
                      <span className="font-body text-sm text-gray-600 group-hover:text-[#1a1a2e]">{t}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div className="mb-6">
                <h4 className="font-body text-xs tracking-[0.15em] uppercase text-gray-500 mb-3">Category</h4>
                <div className="space-y-2">
                  {CATEGORIES.map((cat) => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        checked={filter.category === cat}
                        onChange={() => updateFilter('category', filter.category === cat ? undefined : cat)}
                        className="accent-[#c8a96e]"
                      />
                      <span className="font-body text-sm text-gray-600 group-hover:text-[#1a1a2e]">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="font-body text-xs tracking-[0.15em] uppercase text-gray-500 mb-3">Budget</h4>
                <div className="space-y-2">
                  {[
                    { label: 'Under ₹10L', min: undefined, max: 1000000 },
                    { label: '₹10L – ₹20L', min: 1000000, max: 2000000 },
                    { label: '₹20L – ₹30L', min: 2000000, max: 3000000 },
                    { label: 'Above ₹30L', min: 3000000, max: undefined },
                  ].map((range) => (
                    <label key={range.label} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="budget"
                        checked={filter.minPrice === range.min && filter.maxPrice === range.max}
                        onChange={() => {
                          setFilter((prev) => ({
                            ...prev,
                            minPrice: range.min,
                            maxPrice: range.max,
                            page: 1,
                          }));
                        }}
                        className="accent-[#c8a96e]"
                      />
                      <span className="font-body text-sm text-gray-600 group-hover:text-[#1a1a2e]">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Car Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white animate-pulse">
                    <div className="h-52 bg-gray-200" />
                    <div className="p-6 space-y-3">
                      <div className="h-6 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-100 rounded" />
                      <div className="h-4 bg-gray-100 rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : cars.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {cars.map((car) => (
                    <CarCard key={car.id} car={car} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-12">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setFilter((prev) => ({ ...prev, page: p }))}
                        className={`w-10 h-10 text-sm font-body border transition-colors ${
                          filter.page === p
                            ? 'bg-[#1a1a2e] text-white border-[#1a1a2e]'
                            : 'border-gray-200 text-gray-600 hover:border-[#c8a96e]'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 bg-white border border-gray-100">
                <div className="font-display text-4xl text-gray-200 mb-4">No Cars Found</div>
                <p className="font-body text-gray-400 mb-6">Try adjusting your filters</p>
                <button onClick={clearFilters} className="btn-outline">
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
