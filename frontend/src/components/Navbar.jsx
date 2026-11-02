import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout, isVendor } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🛒</span>
            <span className="text-xl font-bold text-green-600">Vendora</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/products" className="text-gray-600 hover:text-green-600 text-sm font-medium transition-colors">Products</Link>
            <Link to="/vendors" className="text-gray-600 hover:text-green-600 text-sm font-medium transition-colors">Vendors</Link>
            {isVendor && (
              <Link to="/vendor/dashboard" className="text-gray-600 hover:text-green-600 text-sm font-medium transition-colors">Dashboard</Link>
            )}
          </div>

          {/* Right section */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-green-600">
              <FiShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            {user ? (
              <div className="flex items-center gap-2">
                <Link to="/profile" className="flex items-center gap-1 text-sm text-gray-700 hover:text-green-600">
                  <FiUser size={18} />
                  <span>{user.name.split(' ')[0]}</span>
                </Link>
                <button onClick={handleLogout} className="p-2 text-gray-500 hover:text-red-500">
                  <FiLogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="btn-secondary text-sm py-1.5 px-3">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-1.5 px-3">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 text-gray-600" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-3">
          <Link to="/products" className="block text-gray-600 hover:text-green-600 text-sm" onClick={() => setMenuOpen(false)}>Products</Link>
          <Link to="/vendors" className="block text-gray-600 hover:text-green-600 text-sm" onClick={() => setMenuOpen(false)}>Vendors</Link>
          <Link to="/cart" className="block text-gray-600 hover:text-green-600 text-sm" onClick={() => setMenuOpen(false)}>Cart {cartCount > 0 && `(${cartCount})`}</Link>
          {user ? (
            <>
              {isVendor && <Link to="/vendor/dashboard" className="block text-gray-600 hover:text-green-600 text-sm" onClick={() => setMenuOpen(false)}>Dashboard</Link>}
              <Link to="/profile" className="block text-gray-600 hover:text-green-600 text-sm" onClick={() => setMenuOpen(false)}>Profile</Link>
              <Link to="/orders" className="block text-gray-600 hover:text-green-600 text-sm" onClick={() => setMenuOpen(false)}>My Orders</Link>
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="text-red-500 text-sm">Logout</button>
            </>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="btn-secondary text-sm py-1.5 px-3" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="btn-primary text-sm py-1.5 px-3" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
