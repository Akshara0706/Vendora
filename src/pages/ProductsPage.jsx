import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/client';
import ProductCard from '../components/ProductCard';
import { LoadingSpinner } from '../components/UI';
import { FiSearch, FiFilter } from 'react-icons/fi';

const CATEGORIES = ['Groceries', 'Stationery', 'Hardware', 'Electrical', 'Office Products'];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const page = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 12 });
    if (search) params.set('search', search);
    if (category) params.set('category', category);

    api.get(`/products?${params}`)
      .then(({ data }) => { setProducts(data.products); setTotal(data.total); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, category, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    const val = e.target.q.value.trim();
    setSearchParams(val ? { search: val } : {});
  };

  const handleCategory = (cat) => {
    setSearchParams(cat ? { category: cat } : {});
  };

  const pages = Math.ceil(total / 12);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Products</h1>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            name="q"
            defaultValue={search}
            placeholder="Search products..."
            className="input-field pl-10"
          />
        </div>
        <button type="submit" className="btn-primary px-6">Search</button>
      </form>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => handleCategory('')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${!category ? 'bg-green-600 text-white border-green-600' : 'border-gray-300 text-gray-600 hover:border-green-500'}`}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => handleCategory(c)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${category === c ? 'bg-green-600 text-white border-green-600' : 'border-gray-300 text-gray-600 hover:border-green-500'}`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Results */}
      {loading ? (
        <LoadingSpinner />
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-3">🔍</p>
          <p className="text-lg">No products found</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{total} product{total !== 1 ? 's' : ''} found</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setSearchParams({ ...(search && { search }), ...(category && { category }), page: p })}
                  className={`w-9 h-9 rounded-lg text-sm font-medium border ${p === page ? 'bg-green-600 text-white border-green-600' : 'border-gray-300 text-gray-600 hover:border-green-500'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
