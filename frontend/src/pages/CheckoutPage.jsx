import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import toast from 'react-hot-toast';
import { FiTruck, FiHome } from 'react-icons/fi';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [vendor, setVendor] = useState(null);
  const [fulfillmentType, setFulfillmentType] = useState('pickup');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [address, setAddress] = useState({ street: '', city: '', state: '', pincode: '' });
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!cart.vendorId) return;
    api.get(`/vendors/${cart.vendorId}`)
      .then(({ data }) => {
        setVendor(data);
        if (!data.deliveryOptions?.pickup && data.deliveryOptions?.delivery) {
          setFulfillmentType('delivery');
        }
      })
      .catch(() => {});
  }, [cart.vendorId]);

  if (cart.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">🛒</p>
        <p className="text-gray-500 mb-4">Your cart is empty</p>
        <Link to="/products" className="btn-primary px-8">Browse Products</Link>
      </div>
    );
  }

  const deliveryCharge = fulfillmentType === 'delivery' ? (vendor?.deliveryOptions?.deliveryCharge || 0) : 0;
  const grandTotal = cartTotal + deliveryCharge;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (fulfillmentType === 'delivery' && (!address.street || !address.city || !address.pincode)) {
      return toast.error('Please fill in your delivery address');
    }

    setSubmitting(true);
    try {
      const items = cart.items.map((i) => ({ productId: i._id, quantity: i.quantity }));
      const { data } = await api.post('/orders', {
        vendorId: cart.vendorId,
        items,
        fulfillmentType,
        deliveryAddress: fulfillmentType === 'delivery' ? address : null,
        paymentMethod,
        customerNote: note,
      });
      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/orders/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left */}
          <div className="lg:col-span-2 space-y-6">
            {/* Fulfillment type */}
            <div className="card">
              <h2 className="font-semibold mb-4">Fulfillment Method</h2>
              <div className="grid grid-cols-2 gap-3">
                {vendor?.deliveryOptions?.pickup && (
                  <button type="button" onClick={() => setFulfillmentType('pickup')}
                    className={`border-2 rounded-xl p-4 text-left transition-colors ${fulfillmentType === 'pickup' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <FiHome size={20} className="text-green-600 mb-2" />
                    <p className="font-medium text-sm">Store Pickup</p>
                    <p className="text-xs text-gray-500 mt-1">{vendor.address?.city}</p>
                  </button>
                )}
                {vendor?.deliveryOptions?.delivery && (
                  <button type="button" onClick={() => setFulfillmentType('delivery')}
                    className={`border-2 rounded-xl p-4 text-left transition-colors ${fulfillmentType === 'delivery' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <FiTruck size={20} className="text-green-600 mb-2" />
                    <p className="font-medium text-sm">Home Delivery</p>
                    <p className="text-xs text-gray-500 mt-1">+₹{vendor.deliveryOptions.deliveryCharge}</p>
                  </button>
                )}
              </div>
            </div>

            {/* Delivery address */}
            {fulfillmentType === 'delivery' && (
              <div className="card">
                <h2 className="font-semibold mb-4">Delivery Address</h2>
                <div className="space-y-3">
                  <input type="text" placeholder="Street / Flat No." value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    className="input-field" required />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="City" value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="input-field" required />
                    <input type="text" placeholder="State" value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="input-field" />
                  </div>
                  <input type="text" placeholder="Pincode" value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                    className="input-field" required />
                </div>
              </div>
            )}

            {/* Payment */}
            <div className="card">
              <h2 className="font-semibold mb-4">Payment Method</h2>
              <div className="space-y-2">
                {[
                  { value: 'cod', label: '💵 Cash on Delivery / Pickup' },
                  { value: 'online', label: '💳 Online Payment (UPI / Card)' },
                ].map((p) => (
                  <label key={p.value} className={`flex items-center gap-3 border-2 rounded-xl p-3 cursor-pointer transition-colors ${paymentMethod === p.value ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                    <input type="radio" name="payment" value={p.value} checked={paymentMethod === p.value}
                      onChange={() => setPaymentMethod(p.value)} className="text-green-600" />
                    <span className="text-sm font-medium">{p.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Note */}
            <div className="card">
              <h2 className="font-semibold mb-3">Order Note (optional)</h2>
              <textarea value={note} onChange={(e) => setNote(e.target.value)}
                placeholder="Any special instructions for your order..."
                rows={2} className="input-field" />
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="card sticky top-20">
              <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm mb-4">
                {cart.items.map((item) => (
                  <div key={item._id} className="flex justify-between text-gray-600">
                    <span className="truncate max-w-[140px]">{item.name} × {item.quantity}</span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 flex justify-between text-gray-600">
                  <span>Subtotal</span><span>₹{cartTotal.toFixed(2)}</span>
                </div>
                {deliveryCharge > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery</span><span>₹{deliveryCharge.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between font-bold text-base">
                  <span>Total</span><span>₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>
              <button type="submit" disabled={submitting}
                className="btn-primary w-full py-3 disabled:opacity-60">
                {submitting ? 'Placing Order...' : `Place Order ₹${grandTotal.toFixed(2)}`}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
