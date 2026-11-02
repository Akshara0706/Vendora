import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'customer' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    const result = await register(form.name, form.email, form.password, form.role, form.phone);
    if (result.success) {
      toast.success('Account created!');
      if (form.role === 'vendor') navigate('/vendor/register');
      else navigate('/');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="card shadow-md">
          <div className="text-center mb-6">
            <span className="text-4xl">🛒</span>
            <h1 className="text-2xl font-bold text-gray-800 mt-2">Create Account</h1>
            <p className="text-gray-500 text-sm mt-1">Join Vendora today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" required className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Min 6 characters" required className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">I want to</label>
              <select name="role" value={form.role} onChange={handleChange} className="input-field">
                <option value="customer">Shop as a Customer</option>
                <option value="vendor">Sell as a Vendor</option>
              </select>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 disabled:opacity-60">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-green-600 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
