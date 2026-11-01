import { Link } from 'react-router-dom';
import { FiStar, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (product.stock < 1) return toast.error('Out of stock');
    const result = addToCart(product, product.vendor);
    if (result?.conflict) {
      toast.error(result.message);
    } else {
      toast.success(`${product.name} added to cart`);
    }
  };

  const discount = product.discount || 0;
  const finalPrice = product.price - (product.price * discount) / 100;

  return (
    <Link to={`/products/${product._id}`} className="card hover:shadow-md transition-shadow duration-200 flex flex-col group">
      <div className="relative overflow-hidden rounded-lg mb-3 bg-gray-100 aspect-square">
        {product.images?.[0] ? (
          <img
            src={product.images[0].startsWith('http') ? product.images[0] : `http://localhost:5000${product.images[0]}`}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">📦</div>
        )}
        {discount > 0 && (
          <span className="absolute top-2 left-2 badge bg-red-500 text-white">{discount}% OFF</span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="flex-1">
        <p className="text-xs text-green-600 font-medium mb-1">{product.vendor?.shopName}</p>
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1">{product.name}</h3>
        <div className="flex items-center gap-1 mb-2">
          <FiStar className="text-yellow-400 fill-yellow-400" size={12} />
          <span className="text-xs text-gray-500">{product.rating?.toFixed(1) || '0.0'} ({product.totalReviews})</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
        <div>
          <span className="text-base font-bold text-gray-900">₹{finalPrice.toFixed(2)}</span>
          {discount > 0 && (
            <span className="text-xs text-gray-400 line-through ml-1">₹{product.price}</span>
          )}
          <span className="text-xs text-gray-400 ml-1">/ {product.unit}</span>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <FiShoppingCart size={16} />
        </button>
      </div>
    </Link>
  );
}
