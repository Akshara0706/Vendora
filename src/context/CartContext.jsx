import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : { vendorId: null, vendorName: '', items: [] };
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, vendor) => {
    // Cart can only hold items from one vendor at a time
    if (cart.vendorId && cart.vendorId !== vendor._id) {
      return {
        conflict: true,
        message: `Your cart has items from "${cart.vendorName}". Clear cart to add from a new vendor.`,
      };
    }

    setCart((prev) => {
      const existing = prev.items.find((i) => i._id === product._id);
      if (existing) {
        return {
          ...prev,
          items: prev.items.map((i) =>
            i._id === product._id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return {
        vendorId: vendor._id,
        vendorName: vendor.shopName,
        items: [...prev.items, { ...product, quantity: 1 }],
      };
    });
    return { conflict: false };
  };

  const removeFromCart = (productId) => {
    setCart((prev) => {
      const items = prev.items.filter((i) => i._id !== productId);
      return items.length === 0
        ? { vendorId: null, vendorName: '', items: [] }
        : { ...prev, items };
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return removeFromCart(productId);
    setCart((prev) => ({
      ...prev,
      items: prev.items.map((i) => (i._id === productId ? { ...i, quantity } : i)),
    }));
  };

  const clearCart = () => setCart({ vendorId: null, vendorName: '', items: [] });

  const cartTotal = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const cartCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
