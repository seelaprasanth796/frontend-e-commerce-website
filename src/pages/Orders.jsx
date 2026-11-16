import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { formatCurrency } from '../utils/storage';

export default function Orders() {
  const { isLoggedIn } = useAuth();
  const { orders, cancelOrder } = useShop();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) navigate('/login', { state: { from: '/orders' } });
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) return null;

  if (orders.length === 0) {
    return (
      <div className="container py-5 text-center">
        <i className="bi bi-bag-x fs-1 text-muted"></i>
        <h4 className="mt-3 fw-bold">No orders yet</h4>
        <p className="text-muted small">Looks like you haven&apos;t placed an order yet.</p>
        <Link to="/products" className="btn btn-accent mt-2">Start Shopping</Link>
      </div>
    );
  }

  const statusClass = {
    Processing: 'bg-warning text-dark',
    Shipped: 'bg-info text-dark',
    Delivered: 'bg-success',
    Cancelled: 'bg-danger',
  };

  return (
    <div className="container py-4">
      <h4 className="fw-bold mb-4">My Orders ({orders.length})</h4>
      {orders.map((order) => (
        <div className="card order-card shadow-sm mb-3" key={order.id}>
          <div className="card-body">
            <div className="d-flex justify-content-between flex-wrap gap-2 mb-3 pb-2 border-bottom">
              <div>
                <h6 className="fw-bold mb-1">Order #{order.id}</h6>
                <p className="text-muted small mb-0">
                  Placed on {new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  {order.estimatedDelivery && order.deliveryStatus !== 'Cancelled' && (
                    <> · Est. Delivery: <strong>{new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</strong></>
                  )}
                </p>
              </div>
              <div className="text-end d-flex align-items-start gap-2">
                <span className={`badge ${statusClass[order.deliveryStatus] || 'bg-secondary'}`}>
                  {order.deliveryStatus}
                </span>
                <span className={`badge ${order.paymentStatus === 'Paid' ? 'bg-success' : 'bg-secondary'}`}>
                  {order.paymentStatus}
                </span>
              </div>
            </div>

            <div className="d-flex flex-column gap-2 mb-3">
              {order.items.map((item, i) => (
                <div className="d-flex align-items-center gap-3" key={i}>
                  <img src={item.image} alt="" width="56" height="56" className="rounded object-fit-cover border" />
                  <div className="flex-grow-1">
                    <Link to={`/product/${item.id}`} className="text-decoration-none text-dark fw-semibold small">
                      {item.title}
                    </Link>
                    <div className="text-muted" style={{ fontSize: '0.78rem' }}>
                      Qty: {item.quantity} · {formatCurrency(item.price)}
                    </div>
                  </div>
                  <div className="fw-bold small">{formatCurrency(item.price * item.quantity)}</div>
                </div>
              ))}
            </div>

            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 pt-2 border-top">
              <div>
                <span className="text-muted small">Total Paid: </span>
                <strong className="text-primary">{formatCurrency(order.totals.grandTotal)}</strong>
                <span className="text-muted small ms-2">| {order.paymentMethod}</span>
              </div>

              <div className="d-flex align-items-center gap-3">
                <span className="small text-muted">
                  <i className="bi bi-geo-alt me-1"></i>
                  {order.address.city}, {order.address.state} – {order.address.postalCode}
                </span>
                {order.deliveryStatus === 'Processing' && (
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => {
                      if (window.confirm(`Cancel order #${order.id}?`)) cancelOrder(order.id);
                    }}
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
