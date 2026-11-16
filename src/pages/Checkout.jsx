import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { formatCurrency } from '../utils/storage';

export default function Checkout() {
  const { user, isLoggedIn, updateProfile } = useAuth();
  const { cart, getCartTotals, placeOrder } = useShop();
  const navigate = useNavigate();

  const [payment, setPayment] = useState('UPI');
  const [upiId, setUpiId] = useState('');
  const [cardData, setCardData] = useState({ number: '', expiry: '', cvv: '' });
  const [form, setForm] = useState({
    fullName: '',
    mobile: '',
    house: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    if (cart.length === 0) {
      navigate('/cart');
      return;
    }
    if (user) {
      setForm((f) => ({
        ...f,
        fullName: user.name || '',
        mobile: user.phone || '',
        ...(user.address || {}),
      }));
    }
  }, [isLoggedIn, cart.length, user, navigate]);

  const totals = getCartTotals();

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!/^[6-9]\d{9}$/.test(form.mobile)) e.mobile = 'Valid 10-digit mobile required';
    if (!form.house.trim()) e.house = 'House / Building is required';
    if (!form.street.trim()) e.street = 'Street / Area is required';
    if (!form.city.trim()) e.city = 'City is required';
    if (!form.state.trim()) e.state = 'State is required';
    if (!/^\d{6}$/.test(form.postalCode)) e.postalCode = '6-digit PIN required';

    if (payment === 'UPI' && !/^[\w.-]+@[\w.-]+$/.test(upiId)) {
      e.upiId = 'Enter valid UPI ID (e.g. name@okicici)';
    }
    if (payment === 'Card') {
      if (!/^\d{16}$/.test(cardData.number.replace(/\s/g, ''))) e.cardNumber = 'Enter 16-digit card number';
      if (!/^\d{2}\/\d{2}$/.test(cardData.expiry)) e.cardExpiry = 'MM/YY';
      if (!/^\d{3}$/.test(cardData.cvv)) e.cardCvv = '3-digit CVV';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const address = { ...form };
    updateProfile({ address });

    const paymentMeta =
      payment === 'UPI'
        ? { upiId }
        : payment === 'Card'
        ? { last4: cardData.number.replace(/\s/g, '').slice(-4) }
        : {};

    const res = placeOrder(address, payment, paymentMeta);
    if (res.success) navigate('/order-success');
  };

  if (!isLoggedIn || cart.length === 0) return null;

  return (
    <div className="container py-4">
      <h4 className="fw-bold mb-4">Secure Checkout</h4>
      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          <div className="col-lg-7">
            {/* Step 1: Delivery Address */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-navy text-white fw-bold py-2">
                1. DELIVERY ADDRESS
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Full Name</label>
                    <input className={`form-control ${errors.fullName ? 'is-invalid' : ''}`} value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
                    {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Mobile Number</label>
                    <input className={`form-control ${errors.mobile ? 'is-invalid' : ''}`} value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
                    {errors.mobile && <div className="invalid-feedback">{errors.mobile}</div>}
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-semibold">House / Flat / Building</label>
                    <input className={`form-control ${errors.house ? 'is-invalid' : ''}`} value={form.house} onChange={(e) => setForm({ ...form, house: e.target.value })} />
                    {errors.house && <div className="invalid-feedback">{errors.house}</div>}
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-semibold">Street / Area / Locality</label>
                    <input className={`form-control ${errors.street ? 'is-invalid' : ''}`} value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} />
                    {errors.street && <div className="invalid-feedback">{errors.street}</div>}
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold">City</label>
                    <input className={`form-control ${errors.city ? 'is-invalid' : ''}`} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                    {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold">State</label>
                    <input className={`form-control ${errors.state ? 'is-invalid' : ''}`} value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
                    {errors.state && <div className="invalid-feedback">{errors.state}</div>}
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold">PIN Code</label>
                    <input className={`form-control ${errors.postalCode ? 'is-invalid' : ''}`} maxLength={6} value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} />
                    {errors.postalCode && <div className="invalid-feedback">{errors.postalCode}</div>}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Payment Options */}
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-navy text-white fw-bold py-2">
                2. PAYMENT OPTIONS
              </div>
              <div className="card-body d-flex flex-column gap-3">
                {/* UPI */}
                <label className={`payment-option ${payment === 'UPI' ? 'active' : ''}`}>
                  <input type="radio" name="pay" checked={payment === 'UPI'} onChange={() => setPayment('UPI')} />
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>UPI (Google Pay, PhonePe, Paytm)</strong>
                      <div className="small text-muted">Instant payment via UPI ID</div>
                    </div>
                    <i className="bi bi-qr-code-scan fs-4 text-primary"></i>
                  </div>
                  {payment === 'UPI' && (
                    <div className="mt-3">
                      <input
                        className={`form-control form-control-sm ${errors.upiId ? 'is-invalid' : ''}`}
                        placeholder="Enter UPI ID (e.g. demo@upi)"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                      />
                      {errors.upiId && <div className="invalid-feedback">{errors.upiId}</div>}
                    </div>
                  )}
                </label>

                {/* Card */}
                <label className={`payment-option ${payment === 'Card' ? 'active' : ''}`}>
                  <input type="radio" name="pay" checked={payment === 'Card'} onChange={() => setPayment('Card')} />
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>Credit / Debit / ATM Card</strong>
                      <div className="small text-muted">Visa, Mastercard, RuPay</div>
                    </div>
                    <i className="bi bi-credit-card-2-front fs-4 text-primary"></i>
                  </div>
                  {payment === 'Card' && (
                    <div className="row g-2 mt-2">
                      <div className="col-12">
                        <input
                          className={`form-control form-control-sm ${errors.cardNumber ? 'is-invalid' : ''}`}
                          placeholder="Card Number (16 digits)"
                          maxLength={16}
                          value={cardData.number}
                          onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                        />
                        {errors.cardNumber && <div className="invalid-feedback">{errors.cardNumber}</div>}
                      </div>
                      <div className="col-6">
                        <input
                          className={`form-control form-control-sm ${errors.cardExpiry ? 'is-invalid' : ''}`}
                          placeholder="MM/YY"
                          maxLength={5}
                          value={cardData.expiry}
                          onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                        />
                        {errors.cardExpiry && <div className="invalid-feedback">{errors.cardExpiry}</div>}
                      </div>
                      <div className="col-6">
                        <input
                          type="password"
                          className={`form-control form-control-sm ${errors.cardCvv ? 'is-invalid' : ''}`}
                          placeholder="CVV"
                          maxLength={3}
                          value={cardData.cvv}
                          onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                        />
                        {errors.cardCvv && <div className="invalid-feedback">{errors.cardCvv}</div>}
                      </div>
                    </div>
                  )}
                </label>

                {/* COD */}
                <label className={`payment-option ${payment === 'COD' ? 'active' : ''}`}>
                  <input type="radio" name="pay" checked={payment === 'COD'} onChange={() => setPayment('COD')} />
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>Cash on Delivery (COD)</strong>
                      <div className="small text-muted">Pay cash or UPI at your doorstep</div>
                    </div>
                    <i className="bi bi-cash-coin fs-4 text-success"></i>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Summary */}
          <div className="col-lg-5">
            <div className="card border-0 shadow-sm sticky-top" style={{ top: 110 }}>
              <div className="card-body p-4">
                <h6 className="text-muted text-uppercase fw-bold small mb-3">Order Summary</h6>
                <div className="d-flex flex-column gap-2 mb-3" style={{ maxHeight: 240, overflowY: 'auto' }}>
                  {cart.map((item, i) => (
                    <div className="d-flex gap-2 align-items-center small border-bottom pb-2" key={i}>
                      <img src={item.image} alt="" width="44" height="44" className="rounded object-fit-cover" />
                      <div className="flex-grow-1 text-truncate">
                        <div className="fw-semibold text-truncate">{item.title}</div>
                        <div className="text-muted">Qty: {item.quantity}</div>
                      </div>
                      <div className="fw-bold">{formatCurrency(item.price * item.quantity)}</div>
                    </div>
                  ))}
                </div>

                <div className="d-flex justify-content-between mb-1 small"><span>Subtotal</span><span>{formatCurrency(totals.subtotal)}</span></div>
                {totals.discount > 0 && (
                  <div className="d-flex justify-content-between mb-1 small text-success"><span>Coupon Discount</span><span>-{formatCurrency(totals.discount)}</span></div>
                )}
                <div className="d-flex justify-content-between mb-2 small">
                  <span>Delivery</span>
                  <span className="text-success">{totals.shipping === 0 ? 'FREE' : formatCurrency(totals.shipping)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold fs-5 mb-3">
                  <span>Payable Total</span>
                  <span className="text-primary">{formatCurrency(totals.grandTotal)}</span>
                </div>

                <button type="submit" className="btn btn-accent w-100 btn-lg fw-bold">
                  CONFIRM & PLACE ORDER
                </button>
                <Link to="/cart" className="btn btn-link w-100 btn-sm text-decoration-none mt-1">
                  ← Back to Cart
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
