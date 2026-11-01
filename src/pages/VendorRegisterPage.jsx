import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import toast from 'react-hot-toast';

const CATEGORIES = ['Groceries', 'Stationery', 'Hardware', 'Electrical', 'Office Products', 'Other'];

export default function VendorRegisterPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    shopName: '', shopDescription: '', category: 'Groceries',
    address: { street: '', city: '', state: '', pincode: '' },
    phone: '', email: '',
    deliveryOptions: { pickup: true, delivery: false, deliveryCharge: 0, deliveryRadius: 5, minOrderAmount: 0 },
  });

  const set = (field, value) => setForm((p) => ({ ...p, [field]: value }));
  const setAddr = (field, value) => setForm((p) => ({ ...p, address: { ...p.address, [field]: value } }));
  const setDel = (field, value) => setForm((p) => ({ ...p, deliveryOptions: { ...p.deliveryOptions, [field]: value } }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/vendors/register', form);
      toast.success('Vendor profile submitted! Awaiting admin approval.');
      navigate('/vendor/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register vendor');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Register Your Store</h1>
      <p className="text-gray-500 text-sm mb-6">Fill in your shop details. Your profile will be reviewed and approved shortly.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <div className="card space-y-4">
          <h2 className="font-semibold">Basic Information</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name *</label>
            <input type="text" value={form.shopName} onChange={(e) => set('shopName', e.target.value)} required className="input-field" placeholder="My Local Store" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.shopDescription} onChange={(e) => set('shopDescription', e.target.value)} rows={3} className="input-field" placeholder="Tell customers about your store..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select value={form.category} onChange={(e) => set('category', e.target.value)} className="input-field">
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} className="input-field" placeholder="+91 98765 43210" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} className="input-field" placeholder="shop@email.com" />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="card space-y-4">
          <h2 className="font-semibold">Shop Address</h2>
          <input type="text" value={form.address.street} onChange={(e) => setAddr('street', e.target.value)} required className="input-field" placeholder="Street / Area *" />
          <div className="grid grid-cols-2 gap-3">
            <input type="text" value={form.address.city} onChange={(e) => setAddr('city', e.target.value)} required className="input-field" placeholder="City *" />
            <input type="text" value={form.address.state} onChange={(e) => setAddr('state', e.target.value)} required className="input-field" placeholder="State *" />
          </div>
          <input type="text" value={form.address.pincode} onChange={(e) => setAddr('pincode', e.target.value)} required className="input-field" placeholder="Pincode *" />
        </div>

        {/* Delivery */}
        <div className="card space-y-4">
          <h2 className="font-semibold">Fulfillment Options</h2>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.deliveryOptions.pickup} onChange={(e) => setDel('pickup', e.target.checked)} className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">Store Pickup</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.deliveryOptions.delivery} onChange={(e) => setDel('delivery', e.target.checked)} className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">Home Delivery</span>
            </label>
          </div>
          {form.deliveryOptions.delivery && (
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Delivery Charge (₹)</label>
                <input type="number" min="0" value={form.deliveryOptions.deliveryCharge} onChange={(e) => setDel('deliveryCharge', Number(e.target.value))} className="input-field" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Radius (km)</label>
                <input type="number" min="1" value={form.deliveryOptions.deliveryRadius} onChange={(e) => setDel('deliveryRadius', Number(e.target.value))} className="input-field" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Min Order (₹)</label>
                <input type="number" min="0" value={form.deliveryOptions.minOrderAmount} onChange={(e) => setDel('minOrderAmount', Number(e.target.value))} className="input-field" />
              </div>
            </div>
          )}
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full py-3 text-base disabled:opacity-60">
          {submitting ? 'Submitting...' : 'Submit for Approval'}
        </button>
      </form>
    </div>
  );
}
