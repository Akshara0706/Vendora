import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { LoadingSpinner } from '../components/UI';
import { FiSearch, FiMapPin, FiStar } from 'react-icons/fi';

export default function VendorsPage() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const CATEGORIES = ['Groceries', 'Stationery', 'Hardware', 'Electrical', 'Office Products'];

  const fetchVendors = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    api.get(`/vendors?${params}`)
      .then(({ data }) => setVendors(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchVendors(); }, [category]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchVendors();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Local Vendors</h1>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search vendors..."
            className="input-field pl-10"
          />
        </div>
        <button type="submit" className="btn-primary px-6">Search</button>
      </form>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setCategory('')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${!category ? 'bg-green-600 text-white border-green-600' : 'border-gray-300 text-gray-600 hover:border-green-500'}`}
        >All</button>
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setCategory(c)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${category === c ? 'bg-green-600 text-white border-green-600' : 'border-gray-300 text-gray-600 hover:border-green-500'}`}>
            {c}
          </button>
        ))}
      </div>

      {loading ? <LoadingSpinner /> : vendors.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-3">🏪</p>
          <p className="text-lg">No vendors found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {vendors.map((v) => (
            <Link key={v._id} to={`/vendors/${v._id}`} className="card hover:shadow-md transition-shadow group">
              <div className="h-32 bg-gradient-to-br from-green-100 to-green-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                {v.banner ? (
                  <img src={`http://localhost:5000${v.banner}`} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                ) : (
                  <span className="text-5xl">🏪</span>
                )}
              </div>
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {v.logo ? (
                    <img src={`http://localhost:5000${v.logo}`} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl">🛒</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{v.shopName}</h3>
                  <p className="text-xs text-green-600 font-medium">{v.category}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <FiMapPin size={11} /> {v.address?.city}, {v.address?.state}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <FiStar size={12} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-gray-500">{v.rating?.toFixed(1) || '0.0'} ({v.totalReviews})</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                {v.deliveryOptions?.pickup && <span className="badge bg-blue-50 text-blue-600">🏪 Pickup</span>}
                {v.deliveryOptions?.delivery && <span className="badge bg-green-50 text-green-600">🚚 Delivery</span>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
