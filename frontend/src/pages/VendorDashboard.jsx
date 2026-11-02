import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { LoadingSpinner, OrderStatusBadge } from '../components/UI';
import { FiPackage, FiShoppingBag, FiPlusCircle, FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

const TABS = ['overview', 'products', 'orders'];

export default function VendorDashboard() {
  const [tab, setTab] = useState('overview');
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [categories, setCategories] = useState([]);
  const [orderFilter, setOrderFilter] = useState('');

  const [productForm, setProductForm] = useState({
    name: '', description: '', price: '', mrp: '', discount: 0,
    stock: '', unit: 'piece', category: '', sku: '', isFeatured: false,
  });

  useEffect(() => {
    Promise.all([
      api.get('/vendors/me'),
      api.get('/products/mine'),
      api.get('/orders/vendor'),
      api.get('/categories'),
    ])
      .then(([v, p, o, c]) => {
        setVendor(v.data);
        setProducts(p.data);
        setOrders(o.data);
        setCategories(c.data);
        if (c.data.length > 0) setProductForm((f) => ({ ...f, category: c.data[0]._id }));
      })
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  const refreshOrders = () => {
    const params = orderFilter ? `?status=${orderFilter}` : '';
    api.get(`/orders/vendor${params}`).then(({ data }) => setOrders(data));
  };

  useEffect(() => { if (vendor) refreshOrders(); }, [orderFilter]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/products', productForm);
      setProducts((p) => [data, ...p]);
      setShowAddProduct(false);
      setProductForm({ name: '', description: '', price: '', mrp: '', discount: 0, stock: '', unit: 'piece', category: categories[0]?._id || '', sku: '', isFeatured: false });
      toast.success('Product added');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts((p) => p.filter((x) => x._id !== id));
      toast.success('Product deleted');
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  const handleToggleProduct = async (product) => {
    try {
      const { data } = await api.put(`/products/${product._id}`, { isActive: !product.isActive });
      setProducts((p) => p.map((x) => x._id === data._id ? data : x));
    } catch (err) {
      toast.error('Failed to update product');
    }
  };

  const handleOrderStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      refreshOrders();
      toast.success('Order status updated');
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!vendor) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">🏪</p>
        <h2 className="text-xl font-bold mb-2">No vendor profile found</h2>
        <p className="text-gray-500 mb-6">Set up your store to start selling</p>
        <Link to="/vendor/register" className="btn-primary px-8">Register Your Store</Link>
      </div>
    );
  }

  const pending = orders.filter((o) => o.status === 'pending').length;
  const totalRevenue = orders.filter((o) => o.status === 'delivered').reduce((s, o) => s + o.grandTotal, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{vendor.shopName}</h1>
          <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
            {vendor.isApproved
              ? <span className="badge bg-green-100 text-green-700">✓ Approved</span>
              : <span className="badge bg-yellow-100 text-yellow-700">⏳ Pending approval</span>}
            <span className="text-gray-400">{vendor.category}</span>
          </p>
        </div>
        <button onClick={() => setShowAddProduct(true)} className="btn-primary flex items-center gap-2">
          <FiPlusCircle size={16} /> Add Product
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 gap-1">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${tab === t ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total Products', value: products.length, icon: '📦', color: 'bg-blue-50 text-blue-700' },
            { label: 'Pending Orders', value: pending, icon: '🔔', color: 'bg-yellow-50 text-yellow-700' },
            { label: 'Revenue (delivered)', value: `₹${totalRevenue.toFixed(0)}`, icon: '💰', color: 'bg-green-50 text-green-700' },
          ].map((stat) => (
            <div key={stat.label} className={`card flex items-center gap-4 ${stat.color}`}>
              <span className="text-3xl">{stat.icon}</span>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm opacity-80">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Products */}
      {tab === 'products' && (
        <div>
          {products.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-4xl mb-2">📦</p>
              <p>No products yet. Add your first product!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-500">
                    <th className="py-2 pr-4">Product</th>
                    <th className="py-2 pr-4">Price</th>
                    <th className="py-2 pr-4">Stock</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-lg flex-shrink-0">
                            {p.images?.[0] ? <img src={`http://localhost:5000${p.images[0]}`} alt="" className="w-full h-full object-cover rounded" /> : '📦'}
                          </div>
                          <span className="font-medium truncate max-w-[150px]">{p.name}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4">₹{p.price}</td>
                      <td className="py-3 pr-4">
                        <span className={p.stock === 0 ? 'text-red-500' : p.stock < 5 ? 'text-yellow-500' : 'text-green-600'}>{p.stock}</span>
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`badge ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {p.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleToggleProduct(p)} className="text-gray-400 hover:text-green-600">
                            {p.isActive ? <FiToggleRight size={18} /> : <FiToggleLeft size={18} />}
                          </button>
                          <button onClick={() => handleDeleteProduct(p._id)} className="text-gray-400 hover:text-red-500">
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Orders */}
      {tab === 'orders' && (
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            {['', 'pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'].map((s) => (
              <button key={s} onClick={() => setOrderFilter(s)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${orderFilter === s ? 'bg-green-600 text-white border-green-600' : 'border-gray-300 text-gray-500 hover:border-green-500'}`}>
                {s || 'All'}
              </button>
            ))}
          </div>
          <div className="space-y-3">
            {orders.length === 0 ? (
              <div className="text-center py-10 text-gray-400">No orders found</div>
            ) : orders.map((order) => (
              <div key={order._id} className="card">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-semibold">#{order.orderNumber}</p>
                    <p className="text-sm text-gray-500">{order.customer?.name} · {order.customer?.phone}</p>
                    <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleString('en-IN')}</p>
                    <p className="text-sm mt-1 font-medium">₹{order.grandTotal.toFixed(2)} · {order.fulfillmentType} · {order.paymentMethod?.toUpperCase()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <OrderStatusBadge status={order.status} />
                    {!['delivered', 'cancelled'].includes(order.status) && (
                      <select
                        value={order.status}
                        onChange={(e) => handleOrderStatus(order._id, e.target.value)}
                        className="text-xs border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-green-500"
                      >
                        {['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'].map((s) => (
                          <option key={s} value={s}>{s.replace('_', ' ')}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {order.items.map((item, i) => (
                    <span key={i} className="text-xs bg-gray-100 rounded px-2 py-0.5">{item.name} × {item.quantity}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-lg font-bold mb-4">Add New Product</h2>
            <form onSubmit={handleAddProduct} className="space-y-3">
              <input type="text" placeholder="Product name *" required value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} className="input-field" />
              <textarea placeholder="Description" rows={2} value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} className="input-field" />
              <div className="grid grid-cols-2 gap-3">
                <input type="number" placeholder="Price (₹) *" required min="0" value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} className="input-field" />
                <input type="number" placeholder="MRP (₹)" min="0" value={productForm.mrp}
                  onChange={(e) => setProductForm({ ...productForm, mrp: e.target.value })} className="input-field" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input type="number" placeholder="Stock *" required min="0" value={productForm.stock}
                  onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} className="input-field" />
                <input type="number" placeholder="Discount %" min="0" max="100" value={productForm.discount}
                  onChange={(e) => setProductForm({ ...productForm, discount: Number(e.target.value) })} className="input-field" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <select value={productForm.unit}
                  onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })} className="input-field">
                  {['piece', 'kg', 'gram', 'litre', 'ml', 'dozen', 'pack', 'box'].map((u) => <option key={u}>{u}</option>)}
                </select>
                <select value={productForm.category}
                  onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} className="input-field">
                  {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <input type="text" placeholder="SKU (optional)" value={productForm.sku}
                onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })} className="input-field" />
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1">Add Product</button>
                <button type="button" onClick={() => setShowAddProduct(false)} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
