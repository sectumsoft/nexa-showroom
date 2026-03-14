'use client';
import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Loader2 } from 'lucide-react';
import { offersApi } from '@/lib/api';
import { Offer } from '@/types';
import { formatDate, formatPrice } from '@/lib/utils';

const emptyForm = {
  title: '', description: '', offerType: 'Discount',
  discountAmount: '' as string | number,
  validFrom: '', validUntil: '', isActive: true, carId: undefined as number | undefined,
};

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editOffer, setEditOffer] = useState<Offer | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    offersApi.all().then((res) => { setOffers(res.data ?? []); setLoading(false); });
  }, []);

  const openCreate = () => { setForm(emptyForm); setEditOffer(null); setShowForm(true); };
  const openEdit = (o: Offer) => {
    setForm({
      title: o.title, description: o.description, offerType: o.offerType,
      discountAmount: o.discountAmount ?? '',
      validFrom: o.validFrom.split('T')[0], validUntil: o.validUntil.split('T')[0],
      isActive: o.isActive, carId: o.carId,
    });
    setEditOffer(o); setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      discountAmount: form.discountAmount ? Number(form.discountAmount) : undefined,
    };
    if (editOffer) {
      const res = await offersApi.update(editOffer.id, payload as Partial<Offer>);
      if (res.success && res.data) setOffers((p) => p.map((o) => o.id === editOffer.id ? res.data! : o));
    } else {
      const res = await offersApi.create(payload as Partial<Offer>);
      if (res.success && res.data) setOffers((p) => [res.data!, ...p]);
    }
    setSaving(false); setShowForm(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this offer?')) return;
    await offersApi.delete(id);
    setOffers((p) => p.filter((o) => o.id !== id));
  };

  const upd = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((p) => ({ ...p, [k]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }));

  return (
    <div className="p-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="font-display text-4xl text-[#1a1a2e] mb-1">Offers</h1>
          <p className="font-body text-sm text-gray-500">{offers.length} offers configured</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 py-2 px-5 text-xs">
          <Plus size={14} /> Add Offer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-100 p-6 animate-pulse">
              <div className="h-4 bg-gray-100 rounded mb-4 w-1/2" />
              <div className="h-6 bg-gray-200 rounded mb-2" />
              <div className="h-4 bg-gray-100 rounded" />
            </div>
          ))
        ) : offers.map((offer) => (
          <div key={offer.id} className={`bg-white border p-6 relative ${offer.isActive ? 'border-gray-100' : 'border-gray-100 opacity-60'}`}>
            <div className="flex items-start justify-between mb-4">
              <span className={`badge ${offer.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                {offer.isActive ? 'Active' : 'Inactive'}
              </span>
              <div className="flex gap-2">
                <button onClick={() => openEdit(offer)} className="text-gray-400 hover:text-[#1a1a2e]"><Pencil size={14} /></button>
                <button onClick={() => handleDelete(offer.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
              </div>
            </div>
            <span className="badge bg-[#c8a96e]/10 text-[#c8a96e] mb-2 block w-fit">{offer.offerType}</span>
            <h3 className="font-display text-xl mb-2">{offer.title}</h3>
            <p className="font-body text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">{offer.description}</p>
            {offer.discountAmount && (
              <div className="font-display text-2xl text-[#c8a96e] mb-3">Save {formatPrice(offer.discountAmount)}</div>
            )}
            <div className="font-body text-xs text-gray-400 border-t border-gray-50 pt-3 mt-auto">
              {formatDate(offer.validFrom)} – {formatDate(offer.validUntil)}
            </div>
          </div>
        ))}
        {!loading && offers.length === 0 && (
          <div className="col-span-3 py-20 text-center bg-white border border-gray-100">
            <p className="font-body text-gray-400">No offers yet. Create one to get started.</p>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="bg-[#1a1a2e] px-8 py-5 flex items-center justify-between">
              <h2 className="font-display text-xl text-white">{editOffer ? 'Edit Offer' : 'New Offer'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-4">
              <div>
                <label className="font-body text-xs tracking-widest uppercase text-gray-400 block mb-2">Title *</label>
                <input required className="input-field" value={form.title} onChange={upd('title')} />
              </div>
              <div>
                <label className="font-body text-xs tracking-widest uppercase text-gray-400 block mb-2">Description *</label>
                <textarea required rows={3} className="input-field resize-none" value={form.description} onChange={upd('description')} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-xs tracking-widest uppercase text-gray-400 block mb-2">Offer Type *</label>
                  <select className="input-field" value={form.offerType} onChange={upd('offerType')}>
                    {['Discount', 'Finance', 'Exchange', 'Cashback', 'Gift'].map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-body text-xs tracking-widest uppercase text-gray-400 block mb-2">Discount Amount (₹)</label>
                  <input type="number" className="input-field" value={form.discountAmount} onChange={upd('discountAmount')} />
                </div>
                <div>
                  <label className="font-body text-xs tracking-widest uppercase text-gray-400 block mb-2">Valid From *</label>
                  <input required type="date" className="input-field" value={form.validFrom} onChange={upd('validFrom')} />
                </div>
                <div>
                  <label className="font-body text-xs tracking-widest uppercase text-gray-400 block mb-2">Valid Until *</label>
                  <input required type="date" className="input-field" value={form.validUntil} onChange={upd('validUntil')} />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="isActive" className="accent-[#c8a96e] w-4 h-4"
                  checked={form.isActive}
                  onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
                />
                <label htmlFor="isActive" className="font-body text-sm text-gray-600 cursor-pointer">Active (visible on website)</label>
              </div>
              <button type="submit" disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
                {saving && <Loader2 size={16} className="animate-spin" />}
                {editOffer ? 'Update Offer' : 'Create Offer'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
