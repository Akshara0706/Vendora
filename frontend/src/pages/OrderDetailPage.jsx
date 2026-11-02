import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { LoadingSpinner, OrderStatusBadge } from '../components/UI';
import { FiMapPin, FiPhone, FiPackage } from 'react-icons/fi';
import toast from 'react-hot-toast';

const STATUS_STEPS = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered'];

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(({ data }) => setOrder(data))
      .catch(() => toast.error('Order not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await api.put(`/orders/${id}/cancel`);
      toast.success('Order cancelled');
      const { data } = await api.get(`/orders/${id}`);
      setOrder(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot cancel order');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!order) return <div className="text-center py-20 text-gray-400">Order not found</div>;

  const stepIndex = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button onClick={() => navigate('/orders')} className="text-sm text-gray-500 hover:text-green-600 mb-4 flex items-center gap-1">
        ← Back to orders
      </button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">Order #{order.orderNumber}</h1>
          <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString('en-IN')}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Progress tracker */}
      {order.status !== 'cancelled' && (
        <div className="card mb-6">
          <h2 className="font-semibold mb-4">Order Tracking</h2>
          <div className="flex items-center justify-between">
            {STATUS_STEPS.slice(0, order.fulfillmentType === 'pickup' ? 5 : 6).map((step, i) => {
              const labels = { pending: 'Placed', confirmed: 'Confirmed', preparing: 'Preparing', ready: 'Ready', out_for_delivery: 'On the way', delivered: 'Delivered' };
              const active = i <= stepIndex;
              return (
                <div key={step} className="flex flex-col items-center flex-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${active ? 'bg-green-600 border-green-600 text-white' : 'border-gray-300 text-gray-400'}`}>
                    {i < stepIndex ? '✓' : i + 1}
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div className={`hidden sm:block absolute`} />
                  )}
                  <p className={`text-xs mt-1 text-center ${active ? 'text-green-600 font-medium' : 'text-gray-400'}`}>{labels[step]}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Items */}
      <div className="card mb-4">
        <h2 className="font-semibold mb-3">Items</h2>
        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                {item.image ? (
                  <img src={`http://localhost:5000${item.image}`} alt="" className="w-full h-full object-cover" />
                ) : (
                  <FiPackage size={18} className="text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-gray-500">₹{item.price} × {item.quantity} {item.unit}</p>
              </div>
              <p className="font-semibold text-sm">₹{(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>

        <div className="border-t mt-4 pt-4 space-y-1 text-sm">
          <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{order.totalAmount.toFixed(2)}</span></div>
          {order.deliveryCharge > 0 && (
            <div className="flex justify-between text-gray-600"><span>Delivery</span><span>₹{order.deliveryCharge.toFixed(2)}</span></div>
          )}
          <div className="flex justify-between font-bold text-base pt-1 border-t"><span>Total</span><span>₹{order.grandTotal.toFixed(2)}</span></div>
        </div>
      </div>

      {/* Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="card">
          <h3 className="font-semibold mb-2 text-sm">Vendor</h3>
          <p className="text-sm font-medium">{order.vendor?.shopName}</p>
          {order.vendor?.address && (
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
              <FiMapPin size={12} /> {order.vendor.address.city}
            </p>
          )}
          {order.vendor?.phone && (
            <p className="text-xs text-gray-500 flex items-center gap-1"><FiPhone size={12} /> {order.vendor.phone}</p>
          )}
        </div>

        <div className="card">
          <h3 className="font-semibold mb-2 text-sm">
            {order.fulfillmentType === 'delivery' ? 'Delivery Address' : 'Pickup Info'}
          </h3>
          {order.fulfillmentType === 'delivery' && order.deliveryAddress ? (
            <div className="text-sm text-gray-600">
              <p>{order.deliveryAddress.street}</p>
              <p>{order.deliveryAddress.city}, {order.deliveryAddress.state}</p>
              <p>{order.deliveryAddress.pincode}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-600">Collect from store</p>
          )}
          <p className="text-xs text-gray-400 mt-2">Payment: {order.paymentMethod?.toUpperCase()}</p>
        </div>
      </div>

      {/* Cancel button */}
      {['pending', 'confirmed'].includes(order.status) && (
        <button onClick={handleCancel} className="btn-danger w-full py-2.5">Cancel Order</button>
      )}
    </div>
  );
}
