import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../api/client';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, isVendor } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', password: '' });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { name: form.name, phone: form.phone };
      if (form.password) payload.password = form.password;
      await api.put('/auth/profile', payload);
      toast.success('Profile updated');
      setForm((f) => ({ ...f, password: '' }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      <div className="card mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-2xl font-bold text-green-700">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-lg">{user?.name}</p>
            <p className="text-gray-500 text-sm">{user?.email}</p>
            <span className="badge bg-green-100 text-green-700 capitalize">{user?.role}</span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="input-field" placeholder="+91 98765 43210" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password (leave blank to keep current)</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="input-field" placeholder="••••••••" minLength={6} />
          </div>
          <button type="submit" disabled={saving} className="btn-primary px-8 disabled:opacity-60">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      <div className="card space-y-3">
        <h2 className="font-semibold">Quick Links</h2>
        <Link to="/orders" className="flex items-center justify-between py-2 border-b text-sm text-gray-600 hover:text-green-600">
          <span>📦 My Orders</span><span>→</span>
        </Link>
        {isVendor ? (
          <Link to="/vendor/dashboard" className="flex items-center justify-between py-2 text-sm text-gray-600 hover:text-green-600">
            <span>🏪 Vendor Dashboard</span><span>→</span>
          </Link>
        ) : (
          <Link to="/vendor/register" className="flex items-center justify-between py-2 text-sm text-gray-600 hover:text-green-600">
            <span>🏪 Become a Vendor</span><span>→</span>
          </Link>
        )}
      </div>
    </div>
  );
}
