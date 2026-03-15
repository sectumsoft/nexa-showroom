'use client';
import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Loader2, CheckCircle2 } from 'lucide-react';
import { carsApi } from '@/lib/api';
import { Car } from '@/types';
import { formatPrice } from '@/lib/utils';
import ImageUploader from '@/components/admin/ImageUploader';

const empty = {
  name: '', shortDescription: '', description: '', category: 'SUV',
  startingPrice: 0, engine: '', fuelType: 'Petrol', transmission: 'Manual',
  mileage: undefined as number | undefined, safetyRating: '', seating: 5 as number | undefined,
  isFeatured: false,
};

export default function AdminCarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editCar, setEditCar] = useState<Car | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState(empty);

  const fetchCars = async () => {
    const res = await carsApi.list({ pageSize: 100 });
    setCars(res.data?.cars ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchCars(); }, []);

  const openCreate = () => { setForm(empty); setEditCar(null); setShowForm(true); };
  const openEdit = (car: Car) => {
    setForm({
      name: car.name, shortDescription: car.shortDescription, description: car.description,
      category: car.category, startingPrice: car.startingPrice, engine: car.engine,
      fuelType: car.fuelType, transmission: car.transmission, mileage: car.mileage,
      safetyRating: car.safetyRating, seating: car.seating, isFeatured: car.isFeatured,
    });
    setEditCar(car);
    setShowForm(true);
  };
const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, startingPrice: Number(form.startingPrice) };
    let carId: number | null = null;
    if (editCar) {
      const res = await carsApi.update(editCar.id, payload as Partial<Car>);
      if (res.success && res.data) {
        carId = res.data.id;
        setCars((p) => p.map((c) => c.id === editCar.id ? res.data! : c));
      }
    } else {
      const res = await carsApi.create(payload as Partial<Car>);
      if (res.success && res.data) {
        carId = res.data.id;
        setCars((p) => [res.data!, ...p]);
      }
    }
    if (carId && uploadedImageUrl) {
      await carsApi.uploadImage(carId, {
        base64Image: '',
        fileName: 'car-image.jpg',
        imageUrl: uploadedImageUrl,
        isPrimary: true,
        altText: form.name,
      });
    }
    setSaving(false); setSaved(true);
    setTimeout(() => { setSaved(false); setShowForm(false); setUploadedImageUrl(null); }, 1200);
  };
  const handleDelete = async (id: number) => {
    if (!confirm('Delete this car? This cannot be undone.')) return;
    await carsApi.delete(id);
    setCars((p) => p.filter((c) => c.id !== id));
  };

  const upd = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((p) => ({ ...p, [k]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }));

  return (
    <div className="p-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="font-display text-4xl text-[#1a1a2e] mb-1">Cars</h1>
          <p className="font-body text-sm text-gray-500">{cars.length} models in the system</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 py-2 px-5 text-xs">
          <Plus size={14} /> Add Car
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100">
        {loading ? (
          <div className="p-16 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-[#c8a96e] border-t-transparent rounded-full mx-auto" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Name', 'Category', 'Fuel', 'Transmission', 'Starting Price', 'Featured', ''].map((h) => (
                    <th key={h} className="px-6 py-4 text-left font-body text-xs tracking-widest uppercase text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cars.map((car) => (
                  <tr key={car.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-display text-base">{car.name}</div>
                      <div className="font-body text-xs text-gray-400 truncate max-w-[200px]">{car.shortDescription}</div>
                    </td>
                    <td className="px-6 py-4 font-body text-sm text-gray-600">{car.category}</td>
                    <td className="px-6 py-4 font-body text-sm text-gray-600">{car.fuelType}</td>
                    <td className="px-6 py-4 font-body text-sm text-gray-600">{car.transmission}</td>
                    <td className="px-6 py-4 font-display text-lg text-[#c8a96e]">{formatPrice(car.startingPrice)}</td>
                    <td className="px-6 py-4">
                      <span className={`badge ${car.isFeatured ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                        {car.isFeatured ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button onClick={() => openEdit(car)} className="text-gray-400 hover:text-[#1a1a2e] transition-colors">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => handleDelete(car.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {cars.length === 0 && (
              <div className="py-16 text-center font-body text-gray-400">No cars added yet</div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="bg-[#1a1a2e] px-8 py-5 flex items-center justify-between">
              <h2 className="font-display text-xl text-white">{editCar ? 'Edit Car' : 'Add New Car'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2">
                  <label className="font-body text-xs tracking-widest uppercase text-gray-400 block mb-2">Car Name *</label>
                  <input required className="input-field" value={form.name} onChange={upd('name')} />
                </div>
                <div>
                  <label className="font-body text-xs tracking-widest uppercase text-gray-400 block mb-2">Category *</label>
                  <select className="input-field" value={form.category} onChange={upd('category')}>
                    {['SUV', 'Sedan', 'Hatchback', 'Crossover', 'MPV'].map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-body text-xs tracking-widest uppercase text-gray-400 block mb-2">Starting Price (₹) *</label>
                  <input required type="number" className="input-field" value={form.startingPrice || ''} onChange={upd('startingPrice')} />
                </div>
                <div>
                  <label className="font-body text-xs tracking-widest uppercase text-gray-400 block mb-2">Fuel Type *</label>
                  <select className="input-field" value={form.fuelType} onChange={upd('fuelType')}>
                    {['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'].map((f) => <option key={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-body text-xs tracking-widest uppercase text-gray-400 block mb-2">Transmission *</label>
                  <select className="input-field" value={form.transmission} onChange={upd('transmission')}>
                    {['Manual', 'Automatic', 'AMT'].map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-body text-xs tracking-widest uppercase text-gray-400 block mb-2">Engine</label>
                  <input className="input-field" placeholder="e.g. 1.5L BSVI" value={form.engine} onChange={upd('engine')} />
                </div>
                <div>
                  <label className="font-body text-xs tracking-widest uppercase text-gray-400 block mb-2">Mileage (km/l)</label>
                  <input type="number" className="input-field" value={form.mileage || ''} onChange={upd('mileage')} />
                </div>
                <div>
                  <label className="font-body text-xs tracking-widest uppercase text-gray-400 block mb-2">Seating Capacity</label>
                  <input type="number" className="input-field" value={form.seating || ''} onChange={upd('seating')} />
                </div>
                <div>
                  <label className="font-body text-xs tracking-widest uppercase text-gray-400 block mb-2">Safety Rating</label>
                  <input className="input-field" placeholder="e.g. 5 Star GNCAP" value={form.safetyRating} onChange={upd('safetyRating')} />
                </div>
                <div className="col-span-2">
                  <label className="font-body text-xs tracking-widest uppercase text-gray-400 block mb-2">Short Description *</label>
                  <input required className="input-field" value={form.shortDescription} onChange={upd('shortDescription')} />
                </div>
                <div className="col-span-2">
                  <label className="font-body text-xs tracking-widest uppercase text-gray-400 block mb-2">Full Description</label>
                  <textarea rows={4} className="input-field resize-none" value={form.description} onChange={upd('description')} />
                </div>

                <div className="col-span-2">
                  <ImageUploader
                    carId={editCar?.id ?? 0}
                    onUploaded={(url) => setUploadedImageUrl(url)}
                  />
                </div>

                <div className="col-span-2 flex items-center gap-3">
                  <input type="checkbox" id="featured" className="accent-[#c8a96e] w-4 h-4"
                    checked={form.isFeatured}
                    onChange={(e) => setForm((p) => ({ ...p, isFeatured: e.target.checked }))}
                  />
                  <label htmlFor="featured" className="font-body text-sm text-gray-600 cursor-pointer">Mark as Featured Car</label>
                </div>
              </div>
              <button type="submit" disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
                {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <CheckCircle2 size={16} /> : null}
                {saved ? 'Saved!' : editCar ? 'Update Car' : 'Create Car'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
