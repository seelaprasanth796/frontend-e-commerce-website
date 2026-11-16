import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getFromStorage, formatCurrency } from '../utils/storage';
import { useAuth } from '../context/AuthContext';

export default function OrderSuccess() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    const last = getFromStorage('shop_last_order');
    if (!last) {
      navigate('/orders');
      return;
    }
    setOrder(last);
  }, [isLoggedIn, navigate]);

  if (!order) return null;

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <div
          className="d-inline-flex align-items-center justify-content-center rounded-circle bg-success text-white mb-3"
          style={{ width: 80, height: 80 }}
        >
          <i className="bi bi-check-lg fs-1"></i>
        </div>
        <h2 className="fw-bold text-success">Order Placed Successfully!</h2>
        <p className="text-muted">Thank you for shopping with ShopSphere.</p>
      </div>

      <div className="card border-0 shadow-sm mx-auto" style={{ maxWidth: 560 }}>
        <div className="card-body p-4">
          <div className="d-flex justify-content-between mb-3">
            <div>
              <div className="text-muted small">Order ID</div>
              <strong>#{order.id}</strong>
            </div>
            <div className="text-end">
              <div className="text-muted small">Total Paid</div>
              <strong className="text-primary fs-5">{formatCurrency(order.totals.grandTotal)}</strong>
            </div>
          </div>

          <div className="bg-light rounded-3 p-3 mb-3">
            <div className="small text-muted mb-1">Estimated Delivery</div>
            <strong>
              {new Date(order.estimatedDelivery).toLocaleDateString('en-IN', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </strong>
          </div>

          <div className="mb-3">
            <div className="small text-muted mb-1">Shipping to</div>
            <div className="small">
              {order.address.fullName}<br />
              {order.address.house}, {order.address.street}<br />
              {order.address.city}, {order.address.state} – {order.address.postalCode}
            </div>
          </div>

          <div className="d-flex gap-2">
            <Link to="/orders" className="btn btn-accent flex-grow-1 fw-semibold">
              Track Order
            </Link>
            <Link to="/products" className="btn btn-outline-primary flex-grow-1">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
