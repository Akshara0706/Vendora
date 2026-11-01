import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/client';
import ProductCard from '../components/ProductCard';
import { LoadingSpinner } from '../components/UI';

const CATEGORIES = [
  { name: 'Groceries', icon: '🛒', color: 'bg-green-50 text-green-700 border-green-200' },
  { name: 'Stationery', icon: '✏️', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { name: 'Hardware', icon: '🔧', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  { name: 'Electrical', icon: '⚡', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  { name: 'Office Products', icon: '🖨️', color: 'bg-purple-50 text-purple-700 border-purple-200' },
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products?limit=8')
      .then(({ data }) => setFeatured(data.products || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Shop Local, Live Better</h1>
          <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
            Discover groceries, stationery, hardware, electrical supplies and office products from trusted local vendors near you.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/products" className="bg-white text-green-700 font-semibold px-8 py-3 rounded-lg hover:bg-green-50 transition-colors">
              Browse Products
            </Link>
            <Link to="/vendors" className="border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/10 transition-colors">
              Find Vendors
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?search=${encodeURIComponent(cat.name)}`}
              className={`border rounded-xl p-4 text-center hover:shadow-md transition-shadow cursor-pointer ${cat.color}`}
            >
              <div className="text-3xl mb-2">{cat.icon}</div>
              <span className="text-sm font-semibold">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Featured Products</h2>
          <Link to="/products" className="text-green-600 hover:underline text-sm font-medium">View all →</Link>
        </div>
        {loading ? (
          <LoadingSpinner />
        ) : featured.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-3">📦</p>
            <p>No products available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </section>

      {/* Vendor CTA */}
      <section className="bg-green-50 border-t border-green-100 py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Are you a local retailer?</h2>
          <p className="text-gray-500 mb-6">Join Vendora to showcase your products online, manage inventory, and receive orders from local customers.</p>
          <Link to="/vendor/register" className="btn-primary px-8 py-3 text-base">Start Selling Today</Link>
        </div>
      </section>
    </div>
  );
}
