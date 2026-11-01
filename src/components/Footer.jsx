import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white text-lg font-bold mb-2">🛒 Vendora</h3>
          <p className="text-sm text-gray-400">Your local marketplace for Groceries, Stationery, Hardware, Electrical & Office Supplies.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/products" className="hover:text-green-400 transition-colors">Browse Products</Link></li>
            <li><Link to="/vendors" className="hover:text-green-400 transition-colors">Find Vendors</Link></li>
            <li><Link to="/vendor/register" className="hover:text-green-400 transition-colors">Become a Vendor</Link></li>
            <li><Link to="/cart" className="hover:text-green-400 transition-colors">My Cart</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Categories</h4>
          <ul className="space-y-2 text-sm">
            {['Groceries', 'Stationery', 'Hardware', 'Electrical', 'Office Products'].map((c) => (
              <li key={c}>
                <Link to={`/products?category=${c}`} className="hover:text-green-400 transition-colors">{c}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 text-center py-4 text-xs text-gray-500">
        © {new Date().getFullYear()} Vendora. All rights reserved.
      </div>
    </footer>
  );
}
