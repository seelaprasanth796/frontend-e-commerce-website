import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { getFromStorage } from '../utils/storage';

export default function Login() {
  const [email, setEmail] = useState(getFromStorage('shop_remember_email') || '');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(!!getFromStorage('shop_remember_email'));
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { notify } = useShop();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';
  const requiresCartLogin = location.state?.reason === 'cart';

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const res = login(email, password, remember);
    if (res.success) {
      notify(res.message);
      navigate(from, { replace: true });
    } else {
      setError(res.message);
    }
  };

  const quickDemoLogin = () => {
    const res = login('demo@shopsphere.com', 'Demo@123', true);
    if (res.success) {
      notify('Signed in as Demo User!');
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="text-center mb-1">Welcome Back</h2>
        <p className="text-center text-muted small mb-4">Login to manage orders, wishlist & fast checkout</p>

        {requiresCartLogin && (
          <div className="alert alert-info py-2 small" role="status">
            Please sign in or create an account before adding items to your cart. You’ll return to the product after login.
          </div>
        )}

        {error && <div className="alert alert-danger py-2 small">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Email Address</label>
            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Password</label>
            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="form-check mb-3">
            <input className="form-check-input" type="checkbox" id="remember" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            <label className="form-check-label small" htmlFor="remember">Remember me</label>
          </div>
          <button type="submit" className="btn btn-accent w-100 fw-semibold py-2">Login</button>
        </form>

        <div className="demo-credentials mt-3 text-center">
          <div className="fw-semibold mb-1">Instant Demo Access</div>
          <div className="text-muted small mb-2">
            <code>demo@shopsphere.com</code> / <code>Demo@123</code>
          </div>
          <button type="button" onClick={quickDemoLogin} className="btn btn-sm btn-outline-primary fw-semibold w-100">
            <i className="bi bi-lightning-fill me-1"></i>1-Click Demo Login
          </button>
        </div>

        <p className="text-center small mt-3 mb-0">
          New to ShopSphere? <Link to="/signup" className="fw-semibold">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
