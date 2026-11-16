import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';

export default function Profile() {
  const { user, isLoggedIn, updateProfile, deleteAccount, logout } = useAuth();
  const { notify } = useShop();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    fullName: '',
    mobile: '',
    house: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: '/profile' } });
      return;
    }
    if (user) {
      setForm({
        name: user.name || '',
        phone: user.phone || '',
        fullName: user.address?.fullName || user.name || '',
        mobile: user.address?.mobile || user.phone || '',
        house: user.address?.house || '',
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        postalCode: user.address?.postalCode || '',
        country: user.address?.country || 'India',
      });
    }
  }, [isLoggedIn, user, navigate]);

  if (!isLoggedIn) return null;

  const handleSave = (e) => {
    e.preventDefault();
    const address = {
      fullName: form.fullName,
      mobile: form.mobile,
      house: form.house,
      street: form.street,
      city: form.city,
      state: form.state,
      postalCode: form.postalCode,
      country: form.country,
    };
    updateProfile({ name: form.name, phone: form.phone, address });
    setSaved(true);
    notify('Profile updated successfully!');
    setTimeout(() => setSaved(false), 2500);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      deleteAccount();
      notify('Account deleted', 'info');
      navigate('/');
    }
  };

  return (
    <div className="container py-4">
      <h4 className="fw-bold mb-4">My Profile</h4>
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <form onSubmit={handleSave}>
                <h6 className="fw-bold text-muted text-uppercase small mb-3">Personal Info</h6>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Full Name</label>
                    <input
                      className="form-control"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Phone</label>
                    <input
                      className="form-control"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-semibold">Email</label>
                    <input className="form-control" value={user?.email || ''} disabled />
                  </div>
                </div>

                <h6 className="fw-bold text-muted text-uppercase small mb-3">Default Delivery Address</h6>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Full Name</label>
                    <input
                      className="form-control"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Mobile</label>
                    <input
                      className="form-control"
                      value={form.mobile}
                      onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-semibold">House / Flat</label>
                    <input
                      className="form-control"
                      value={form.house}
                      onChange={(e) => setForm({ ...form, house: e.target.value })}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-semibold">Street / Area</label>
                    <input
                      className="form-control"
                      value={form.street}
                      onChange={(e) => setForm({ ...form, street: e.target.value })}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold">City</label>
                    <input
                      className="form-control"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold">State</label>
                    <input
                      className="form-control"
                      value={form.state}
                      onChange={(e) => setForm({ ...form, state: e.target.value })}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold">PIN Code</label>
                    <input
                      className="form-control"
                      maxLength={6}
                      value={form.postalCode}
                      onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                    />
                  </div>
                </div>

                <div className="d-flex gap-2 mt-4">
                  <button type="submit" className="btn btn-accent fw-semibold">
                    {saved ? 'Saved!' : 'Save Changes'}
                  </button>
                  <Link to="/orders" className="btn btn-outline-primary">
                    View Orders
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3">Account Actions</h6>
              <button
                className="btn btn-outline-secondary w-100 mb-2"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
              >
                <i className="bi bi-box-arrow-right me-2"></i>Logout
              </button>
              <button className="btn btn-outline-danger w-100" onClick={handleDelete}>
                <i className="bi bi-trash me-2"></i>Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
