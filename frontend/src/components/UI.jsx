export function LoadingSpinner({ size = 'md' }) {
  const sizes = { sm: 'h-5 w-5', md: 'h-10 w-10', lg: 'h-16 w-16' };
  return (
    <div className="flex justify-center items-center py-10">
      <div className={`${sizes[size]} animate-spin rounded-full border-4 border-green-200 border-t-green-600`}></div>
    </div>
  );
}

const statusConfig = {
  pending:          { color: 'bg-yellow-100 text-yellow-700', label: 'Pending' },
  confirmed:        { color: 'bg-blue-100 text-blue-700',   label: 'Confirmed' },
  preparing:        { color: 'bg-purple-100 text-purple-700', label: 'Preparing' },
  ready:            { color: 'bg-indigo-100 text-indigo-700', label: 'Ready' },
  out_for_delivery: { color: 'bg-orange-100 text-orange-700', label: 'Out for Delivery' },
  delivered:        { color: 'bg-green-100 text-green-700', label: 'Delivered' },
  cancelled:        { color: 'bg-red-100 text-red-700', label: 'Cancelled' },
};

export function OrderStatusBadge({ status }) {
  const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-600', label: status };
  return <span className={`badge ${config.color}`}>{config.label}</span>;
}
