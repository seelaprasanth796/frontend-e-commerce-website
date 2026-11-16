import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { formatCurrency } from '../utils/storage';

export default function Cart() {
  const { isLoggedIn } = useAuth();
  const { cart, updateCartQty, removeFromCart, clearCart, applyCoupon, removeCoupon, coupon, getCartTotals } = useShop();
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const totals = getCartTotals();

  const handleCheckout = () => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: '/checkout' } });
    } else {
      navigate('/checkout');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="bg-white p-5 rounded-4 shadow-sm mx-auto" style={{ maxWidth: 460 }}>
          <i className="bi bi-cart-x text-muted" style={{ fontSize: 64 }}></i>
          <h4 className="mt-3 fw-bold">Your cart is empty!</h4>
          <p className="text-muted small">Add items to it now and unlock exclusive offers.</p>
          <Link to="/products" className="btn btn-accent px-4 mt-2">Shop Now</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0">My Cart ({cart.reduce((s, i) => s + i.quantity, 0)} items)</h4>
        <button className="btn btn-outline-danger btn-sm" onClick={clearCart}>
          <i className="bi bi-trash me-1"></i>Clear Cart
        </button>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          {cart.map((item, idx) => (
            <div className="card mb-3 border-0 shadow-sm" key={idx}>
              <div className="card-body">
                <div className="row align-items-center g-3">
                  <div className="col-auto">
                    <Link to={`/product/${item.id}`}>
                      <img src={item.image} alt={item.title} className="cart-item-img border" />
                    </Link>
                  </div>
                  <div className="col">
                    <Link to={`/product/${item.id}`} className="text-decoration-none text-dark">
                      <h6 className="fw-bold mb-1">{item.title}</h6>
                    </Link>
                    <p className="text-muted small mb-2">
                      {[
                        item.color && `Color: ${item.color}`,
                        item.storage && `Storage: ${item.storage}`,
                        item.size && `Size: ${item.size}`,
                      ]
                        .filter(Boolean)
                        .join(' | ') || item.brand}
                    </p>
                    <div className="d-flex align-items-baseline gap-2">
                      <span className="fw-bold fs-6 text-dark">{formatCurrency(item.price)}</span>
                      {item.originalPrice > item.price && (
                        <span className="text-muted text-decoration-line-through small">
                          {formatCurrency(item.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="col-auto d-flex flex-column align-items-end gap-2">
                    <div className="input-group input-group-sm" style={{ width: 105 }}>
                      <button className="btn btn-outline-secondary" onClick={() => updateCartQty(idx, -1)}>-</button>
                      <input className="form-control text-center fw-bold" value={item.quantity} readOnly />
                      <button className="btn btn-outline-secondary" onClick={() => updateCartQty(idx, 1)}>+</button>
                    </div>
                    <div className="fw-bold text-primary">{formatCurrency(item.price * item.quantity)}</div>
                    <button className="btn btn-link btn-sm text-danger p-0 text-decoration-none" onClick={() => removeFromCart(idx)}>
                      <i className="bi bi-trash me-1"></i>Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm sticky-top" style={{ top: 110 }}>
            <div className="card-body p-4">
              <h6 className="text-muted text-uppercase fw-bold small mb-3">Price Details</h6>
              <div className="d-flex justify-content-between mb-2">
                <span>Price ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span>{formatCurrency(totals.mrpTotal)}</span>
              </div>
              {totals.productSavings > 0 && (
                <div className="d-flex justify-content-between mb-2 text-success">
                  <span>Product Discount</span>
                  <span>-{formatCurrency(totals.productSavings)}</span>
                </div>
              )}
              {totals.discount > 0 && (
                <div className="d-flex justify-content-between mb-2 text-success">
                  <span>Coupon ({coupon?.code})</span>
                  <span>-{formatCurrency(totals.discount)}</span>
                </div>
              )}
              <div className="d-flex justify-content-between mb-2">
                <span>Delivery Charges</span>
                <span className={totals.shipping === 0 ? 'text-success fw-semibold' : ''}>
                  {totals.shipping === 0 ? 'FREE' : formatCurrency(totals.shipping)}
                </span>
              </div>

              <hr />
              <div className="d-flex justify-content-between fw-bold fs-5 mb-2">
                <span>Total Amount</span>
                <span>{formatCurrency(totals.grandTotal)}</span>
              </div>

              {totals.totalSavings > 0 && (
                <p className="text-success small fw-semibold mb-3">
                  You will save {formatCurrency(totals.totalSavings)} on this order!
                </p>
              )}

              {/* Coupon Box */}
              <div className="input-group input-group-sm mb-2">
                <input
                  className="form-control"
                  placeholder="Enter coupon code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                <button className="btn btn-outline-primary fw-semibold" onClick={() => applyCoupon(code)}>
                  Apply
                </button>
              </div>

              <div className="d-flex gap-1 flex-wrap mb-3">
                {['SHOP10', 'SAVE200', 'FREESHIP'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setCode(c);
                      applyCoupon(c);
                    }}
                    className="badge bg-light text-primary border border-primary-subtle"
                    style={{ cursor: 'pointer' }}
                  >
                    {c}
                  </button>
                ))}
              </div>

              {coupon && (
                <div className="alert alert-success py-1 px-2 small d-flex justify-content-between align-items-center mb-3">
                  <span><strong>{coupon.code}</strong> ({coupon.label})</span>
                  <button className="btn-close btn-close-sm" onClick={removeCoupon}></button>
                </div>
              )}

              <button onClick={handleCheckout} className="btn btn-accent w-100 btn-lg fw-bold">
                {isLoggedIn ? 'PLACE ORDER' : 'LOGIN TO CHECKOUT'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
