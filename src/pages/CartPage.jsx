import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const navigate = useNavigate();

  if (cart.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-6xl mb-4">🛒</p>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
        <p className="text-gray-400 mb-6">Discover products from local vendors near you</p>
        <Link to="/products" className="btn-primary px-8 py-3">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">
              Items from <span className="font-medium text-green-600">{cart.vendorName}</span>
            </p>
            <button onClick={clearCart} className="text-sm text-red-500 hover:underline flex items-center gap-1">
              <FiTrash2 size={14} /> Clear cart
            </button>
          </div>

          {cart.items.map((item) => (
            <div key={item._id} className="card flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                {item.images?.[0] ? (
                  <img src={`http://localhost:5000${item.images[0]}`} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-800 text-sm truncate">{item.name}</h3>
                <p className="text-green-600 font-semibold text-sm">₹{item.price} / {item.unit}</p>
              </div>

              <div className="flex items-center border border-gray-200 rounded-lg">
                <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="p-1.5 hover:bg-gray-50">
                  <FiMinus size={14} />
                </button>
                <span className="px-3 text-sm font-medium">{item.quantity}</span>
                <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="p-1.5 hover:bg-gray-50">
                  <FiPlus size={14} />
                </button>
              </div>

              <div className="text-right flex-shrink-0">
                <p className="font-semibold text-sm">₹{(item.price * item.quantity).toFixed(2)}</p>
                <button onClick={() => removeFromCart(item._id)} className="text-red-400 hover:text-red-600 mt-1">
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-20">
            <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm mb-4">
              {cart.items.map((item) => (
                <div key={item._id} className="flex justify-between text-gray-600">
                  <span className="truncate max-w-[150px]">{item.name} × {item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between font-bold text-base">
                <span>Subtotal</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2"
            >
              <FiShoppingBag size={18} /> Proceed to Checkout
            </button>
            <Link to="/products" className="block text-center text-sm text-green-600 hover:underline mt-3">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
