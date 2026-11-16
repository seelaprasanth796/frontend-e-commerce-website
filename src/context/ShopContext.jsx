import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getFromStorage, saveToStorage, removeFromStorage, generateOrderId } from '../utils/storage';
import { useAuth } from './AuthContext';

const ShopContext = createContext(null);

export function ShopProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [coupon, setCoupon] = useState(null);
  const [toasts, setToasts] = useState([]);

  const notify = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load & merge guest cart/wishlist into user account on login
  useEffect(() => {
    if (user) {
      const userCart = getFromStorage(`shop_cart_${user.email}`, []);
      const guestCart = getFromStorage('shop_cart_guest', []);
      let mergedCart = [...userCart];
      if (guestCart.length > 0) {
        guestCart.forEach((gItem) => {
          const key = `${gItem.id}-${gItem.color || ''}-${gItem.storage || ''}-${gItem.size || ''}`;
          const idx = mergedCart.findIndex(
            (c) => `${c.id}-${c.color || ''}-${c.storage || ''}-${c.size || ''}` === key
          );
          if (idx >= 0) mergedCart[idx].quantity += gItem.quantity;
          else mergedCart.push(gItem);
        });
        saveToStorage(`shop_cart_${user.email}`, mergedCart);
        removeFromStorage('shop_cart_guest');
      }
      setCart(mergedCart);

      const userWish = getFromStorage(`shop_wishlist_${user.email}`, []);
      const guestWish = getFromStorage('shop_wishlist_guest', []);
      const mergedWish = [...new Set([...userWish, ...guestWish])];
      if (guestWish.length > 0) {
        saveToStorage(`shop_wishlist_${user.email}`, mergedWish);
        removeFromStorage('shop_wishlist_guest');
      }
      setWishlist(mergedWish);

      setOrders(getFromStorage(`shop_orders_${user.email}`, []));
    } else {
      setCart(getFromStorage('shop_cart_guest', []));
      setWishlist(getFromStorage('shop_wishlist_guest', []));
      setOrders([]);
    }
    setCoupon(getFromStorage('shop_coupon', null));
  }, [user]);

  const persistCart = useCallback(
    (next) => {
      setCart(next);
      saveToStorage(user ? `shop_cart_${user.email}` : 'shop_cart_guest', next);
    },
    [user]
  );

  const persistWishlist = useCallback(
    (next) => {
      setWishlist(next);
      saveToStorage(user ? `shop_wishlist_${user.email}` : 'shop_wishlist_guest', next);
    },
    [user]
  );

  const persistOrders = useCallback(
    (next) => {
      setOrders(next);
      if (user) saveToStorage(`shop_orders_${user.email}`, next);
    },
    [user]
  );

  const addToCart = (product, options = {}) => {
    if (!user) {
      notify('Please sign in or create an account before adding items to your cart.', 'info');
      return { success: false, requiresLogin: true };
    }

    const item = {
      id: product.id,
      title: product.title,
      brand: product.brand,
      price: options.price || product.price,
      originalPrice: options.originalPrice || product.originalPrice,
      image: options.image || product.image,
      quantity: options.quantity || 1,
      color: options.color || product.colors?.[0] || null,
      storage: options.storage || product.storageOptions?.[0]?.name || null,
      size: options.size || product.sizes?.[0] || null,
    };
    const key = `${item.id}-${item.color || ''}-${item.storage || ''}-${item.size || ''}`;
    const existing = cart.findIndex(
      (c) => `${c.id}-${c.color || ''}-${c.storage || ''}-${c.size || ''}` === key
    );
    let next;
    if (existing >= 0) {
      next = [...cart];
      next[existing] = { ...next[existing], quantity: next[existing].quantity + item.quantity };
    } else {
      next = [...cart, item];
    }
    persistCart(next);
    notify(`Added "${product.title.slice(0, 28)}..." to cart!`);
    return { success: true };
  };

  const updateCartQty = (index, delta) => {
    const next = [...cart];
    next[index] = { ...next[index], quantity: Math.max(1, Math.min(10, next[index].quantity + delta)) };
    persistCart(next);
  };

  const removeFromCart = (index) => {
    persistCart(cart.filter((_, i) => i !== index));
    notify('Item removed from cart', 'info');
  };

  const clearCart = () => persistCart([]);

  const toggleWishlist = (productId) => {
    let next;
    const exists = wishlist.includes(productId);
    if (exists) {
      next = wishlist.filter((id) => id !== productId);
      notify('Removed from Wishlist', 'info');
    } else {
      next = [...wishlist, productId];
      notify('Saved to Wishlist ❤️');
    }
    persistWishlist(next);
    return { success: true, added: !exists };
  };

  const applyCoupon = (code) => {
    const upper = (code || '').toUpperCase().trim();
    const coupons = {
      SHOP10: { type: 'percent', value: 10, label: '10% off' },
      SAVE200: { type: 'flat', value: 200, min: 2000, label: '₹200 off' },
      FREESHIP: { type: 'shipping', value: 0, label: 'Free delivery' },
    };
    const c = coupons[upper];
    if (!c) {
      notify('Invalid coupon code', 'danger');
      return { success: false, message: 'Invalid coupon code' };
    }
    const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    if (c.min && subtotal < c.min) {
      const msg = `Minimum order ₹${c.min} required for ${upper}`;
      notify(msg, 'warning');
      return { success: false, message: msg };
    }
    const nextCoupon = { code: upper, ...c };
    setCoupon(nextCoupon);
    saveToStorage('shop_coupon', nextCoupon);
    notify(`Coupon ${upper} applied: ${c.label}!`);
    return { success: true, message: `Coupon applied: ${c.label}` };
  };

  const removeCoupon = () => {
    setCoupon(null);
    saveToStorage('shop_coupon', null);
    notify('Coupon removed', 'info');
  };

  const getCartTotals = () => {
    const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const mrpTotal = cart.reduce((s, i) => s + (i.originalPrice || i.price) * i.quantity, 0);
    const productSavings = Math.max(0, mrpTotal - subtotal);
    let discount = 0;
    let shipping = subtotal === 0 || subtotal >= 999 ? 0 : 49;
    if (coupon) {
      if (coupon.type === 'percent') discount = Math.round(subtotal * (coupon.value / 100));
      if (coupon.type === 'flat') discount = coupon.value;
      if (coupon.type === 'shipping') shipping = 0;
    }
    const grandTotal = Math.max(0, subtotal - discount + shipping);
    const totalSavings = productSavings + discount + (subtotal > 0 && subtotal < 999 && shipping === 0 ? 49 : 0);
    return { subtotal, mrpTotal, productSavings, discount, shipping, grandTotal, totalSavings };
  };

  const placeOrder = (address, paymentMethod, paymentMeta = {}) => {
    if (!user || cart.length === 0) return { success: false };
    const totals = getCartTotals();
    const estDate = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString();
    const order = {
      id: generateOrderId(),
      date: new Date().toISOString(),
      estimatedDelivery: estDate,
      items: [...cart],
      address,
      paymentMethod,
      paymentMeta,
      paymentStatus: paymentMethod === 'COD' ? 'Pay on Delivery' : 'Paid',
      deliveryStatus: 'Processing',
      totals,
      coupon: coupon?.code || null,
    };
    const next = [order, ...orders];
    persistOrders(next);
    clearCart();
    setCoupon(null);
    saveToStorage('shop_coupon', null);
    saveToStorage('shop_last_order', order);
    notify('Order placed successfully! 🎉');
    return { success: true, order };
  };

  const cancelOrder = (orderId) => {
    const next = orders.map((o) =>
      o.id === orderId && o.deliveryStatus === 'Processing'
        ? { ...o, deliveryStatus: 'Cancelled' }
        : o
    );
    persistOrders(next);
    notify(`Order #${orderId} cancelled`, 'info');
  };

  return (
    <ShopContext.Provider
      value={{
        cart,
        wishlist,
        orders,
        coupon,
        toasts,
        notify,
        dismissToast,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        toggleWishlist,
        applyCoupon,
        removeCoupon,
        getCartTotals,
        placeOrder,
        cancelOrder,
        cartCount: cart.reduce((s, i) => s + i.quantity, 0),
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('useShop must be used within ShopProvider');
  return ctx;
}
