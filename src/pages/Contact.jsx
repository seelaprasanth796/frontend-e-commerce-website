import { useState } from 'react';
import { useShop } from '../context/ShopContext';

export default function Contact() {
  const { notify } = useShop();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    notify('Message sent! We will get back to you soon.');
    setForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="container py-5">
      <div className="row g-4">
        <div className="col-lg-5">
          <h2 className="fw-bold mb-3">Contact Support</h2>
          <p className="text-muted mb-4">
            Have a question about an order, product, or delivery? Reach out and our team will respond within 24 hours.
          </p>
          <ul className="list-unstyled">
            <li className="mb-3 d-flex align-items-start gap-3">
              <i className="bi bi-geo-alt-fill text-accent fs-5"></i>
              <div>
                <strong>Registered Office</strong>
                <div className="small text-muted">Outer Ring Road, Bengaluru, Karnataka 560103</div>
              </div>
            </li>
            <li className="mb-3 d-flex align-items-start gap-3">
              <i className="bi bi-envelope-fill text-accent fs-5"></i>
              <div>
                <strong>Email</strong>
                <div className="small text-muted">support@shopsphere.com</div>
              </div>
            </li>
            <li className="mb-3 d-flex align-items-start gap-3">
              <i className="bi bi-telephone-fill text-accent fs-5"></i>
              <div>
                <strong>Phone</strong>
                <div className="small text-muted">+91 98765 43210 (24/7)</div>
              </div>
            </li>
          </ul>
        </div>

        <div className="col-lg-7">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">Send a Message</h5>
              {sent && (
                <div className="alert alert-success py-2 small">Message sent successfully!</div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Your Name</label>
                    <input
                      className="form-control"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-semibold">Subject</label>
                    <input
                      className="form-control"
                      required
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-semibold">Message</label>
                    <textarea
                      className="form-control"
                      rows={4}
                      required
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                    ></textarea>
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-accent fw-semibold px-4">
                      Send Message
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
