import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client';
import ProductCard from '../components/ProductCard';
import { LoadingSpinner } from '../components/UI';
import { FiMapPin, FiPhone, FiMail, FiStar, FiTruck } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function VendorDetailPage() {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get(`/vendors/${id}`),
      api.get(`/products?vendor=${id}&limit=20`),
    ])
      .then(([vRes, pRes]) => {
        setVendor(vRes.data);
        setProducts(pRes.data.products || []);
      })
      .catch(() => toast.error('Failed to load vendor'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!vendor) return <div className="text-center py-20 text-gray-400">Vendor not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Banner */}
      <div className="h-48 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl mb-6 overflow-hidden relative">
        {vendor.banner && (
          <img src={`http://localhost:5000${vendor.banner}`} alt="" className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-black/30 flex items-end p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-2xl border-2 border-white overflow-hidden">
              {vendor.logo ? <img src={`http://localhost:5000${vendor.logo}`} alt="" className="w-full h-full object-cover" /> : '🛒'}
            </div>
            <div className="text-white">
              <h1 className="text-2xl font-bold">{vendor.shopName}</h1>
              <p className="text-green-200 text-sm">{vendor.category}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="card">
            <h3 className="font-semibold mb-3">Store Info</h3>
            <div className="space-y-2 text-sm text-gray-600">
              {vendor.shopDescription && <p>{vendor.shopDescription}</p>}
              <p className="flex items-center gap-2"><FiMapPin size={14} /> {vendor.address?.street}, {vendor.address?.city}</p>
              {vendor.phone && <p className="flex items-center gap-2"><FiPhone size={14} /> {vendor.phone}</p>}
              {vendor.email && <p className="flex items-center gap-2"><FiMail size={14} /> {vendor.email}</p>}
              <div className="flex items-center gap-1 pt-1">
                <FiStar size={14} className="text-yellow-400 fill-yellow-400" />
                <span>{vendor.rating?.toFixed(1)} ({vendor.totalReviews} reviews)</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold mb-3">Fulfillment</h3>
            <div className="space-y-2 text-sm">
              {vendor.deliveryOptions?.pickup && (
                <p className="flex items-center gap-2 text-blue-600">🏪 Pickup available</p>
              )}
              {vendor.deliveryOptions?.delivery && (
                <>
                  <p className="flex items-center gap-2 text-green-600"><FiTruck size={14} /> Delivery available</p>
                  <p className="text-gray-500">Charge: ₹{vendor.deliveryOptions.deliveryCharge}</p>
                  <p className="text-gray-500">Radius: {vendor.deliveryOptions.deliveryRadius} km</p>
                  {vendor.deliveryOptions.minOrderAmount > 0 && (
                    <p className="text-gray-500">Min order: ₹{vendor.deliveryOptions.minOrderAmount}</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="lg:col-span-3">
          <h2 className="text-xl font-bold mb-4">Products ({products.length})</h2>
          {products.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-4xl mb-2">📦</p>
              <p>No products listed yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {products.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
