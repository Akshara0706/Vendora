import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { LoadingSpinner, OrderStatusBadge } from '../components/UI';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my')
      .then(({ data }) => setOrders(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-3">📦</p>
          <p className="text-lg mb-4">No orders yet</p>
          <Link to="/products" className="btn-primary px-8">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order._id} to={`/orders/${order._id}`}
              className="card hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <p className="font-semibold text-gray-900">#{order.orderNumber}</p>
                  <OrderStatusBadge status={order.status} />
                </div>
                <p className="text-sm text-gray-500">{order.vendor?.shopName}</p>
                <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                <p className="text-xs text-gray-500 mt-1">{order.items.length} item{order.items.length > 1 ? 's' : ''} · {order.fulfillmentType}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">₹{order.grandTotal.toFixed(2)}</p>
                <p className="text-xs text-green-600 hover:underline">View details →</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
