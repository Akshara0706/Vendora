import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client';
import { imgUrl } from '../api/imgUrl';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/UI';
import { FiStar, FiShoppingCart, FiMinus, FiPlus, FiMapPin, FiTruck } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(({ data }) => setProduct(data))
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < qty; i++) {
      const result = addToCart(product, product.vendor);
      if (result?.conflict) return toast.error(result.message);
    }
    toast.success(`${product.name} added to cart`);
  };

  const handleReview = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/products/${id}/reviews`, review);
      toast.success('Review submitted!');
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!product) return <div className="text-center py-20 text-gray-400">Product not found</div>;

  const finalPrice = product.price - (product.price * (product.discount || 0)) / 100;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* Images */}
        <div>
          <div className="bg-gray-100 rounded-xl overflow-hidden aspect-square mb-3">
            {product.images?.[activeImg] ? (
              <img src={imgUrl(product.images[activeImg])} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl text-gray-300">📦</div>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${i === activeImg ? 'border-green-500' : 'border-gray-200'}`}>
                  <img src={imgUrl(img)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-sm text-green-600 font-medium mb-1">{product.vendor?.shopName}</p>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>

          <div className="flex items-center gap-2 mb-3">
            <div className="flex">
              {[1,2,3,4,5].map(s => (
                <FiStar key={s} size={16} className={s <= Math.round(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
              ))}
            </div>
            <span className="text-sm text-gray-500">{product.rating?.toFixed(1)} ({product.totalReviews} reviews)</span>
          </div>

          <div className="mb-4">
            <span className="text-3xl font-bold text-gray-900">₹{finalPrice.toFixed(2)}</span>
            {product.discount > 0 && (
              <>
                <span className="text-gray-400 line-through ml-2 text-lg">₹{product.price}</span>
                <span className="badge bg-red-100 text-red-600 ml-2">{product.discount}% off</span>
              </>
            )}
            <span className="text-sm text-gray-400 ml-2">/ {product.unit}</span>
          </div>

          <p className="text-gray-600 mb-4">{product.description}</p>

          <p className="text-sm mb-4">
            <span className={product.stock > 0 ? 'text-green-600 font-medium' : 'text-red-500 font-medium'}>
              {product.stock > 0 ? `✓ In Stock (${product.stock} left)` : '✕ Out of Stock'}
            </span>
          </p>

          {product.stock > 0 && (
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2 hover:bg-gray-50"><FiMinus size={16} /></button>
                <span className="px-4 text-sm font-medium">{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="p-2 hover:bg-gray-50"><FiPlus size={16} /></button>
              </div>
              <button onClick={handleAddToCart} className="btn-primary flex items-center gap-2 px-6 py-2.5">
                <FiShoppingCart size={18} /> Add to Cart
              </button>
            </div>
          )}

          {product.vendor && (
            <div className="border rounded-xl p-4 bg-gray-50 space-y-2">
              <h3 className="font-semibold text-gray-800">{product.vendor.shopName}</h3>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <FiMapPin size={14} /> {product.vendor.address?.city}, {product.vendor.address?.state}
              </p>
              {product.vendor.deliveryOptions?.delivery && (
                <p className="text-sm text-green-600 flex items-center gap-1"><FiTruck size={14} /> Delivery available</p>
              )}
              {product.vendor.deliveryOptions?.pickup && (
                <p className="text-sm text-blue-600">🏪 Pickup available</p>
              )}
              <Link to={`/vendors/${product.vendor._id}`} className="text-sm text-green-600 hover:underline">View store →</Link>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="border-t pt-8">
        <h2 className="text-xl font-bold mb-6">Reviews ({product.totalReviews})</h2>

        {user && (
          <form onSubmit={handleReview} className="card mb-6 max-w-lg">
            <h3 className="font-semibold mb-3">Write a Review</h3>
            <div className="flex gap-1 mb-3">
              {[1,2,3,4,5].map(s => (
                <button type="button" key={s} onClick={() => setReview({ ...review, rating: s })}>
                  <FiStar size={24} className={s <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                </button>
              ))}
            </div>
            <textarea
              value={review.comment}
              onChange={(e) => setReview({ ...review, comment: e.target.value })}
              placeholder="Share your experience..."
              rows={3}
              className="input-field mb-3"
            />
            <button type="submit" className="btn-primary px-6">Submit Review</button>
          </form>
        )}

        {product.reviews?.length === 0 ? (
          <p className="text-gray-400">No reviews yet.</p>
        ) : (
          <div className="space-y-4 max-w-2xl">
            {product.reviews.map((r, i) => (
              <div key={i} className="card">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{r.name}</span>
                  <div className="flex">
                    {[1,2,3,4,5].map(s => (
                      <FiStar key={s} size={12} className={s <= r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{r.comment}</p>
                <p className="text-xs text-gray-400 mt-1">{new Date(r.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
