import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-auto pt-5 pb-4" style={{ background: '#172337', color: '#cbd5e1' }}>
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="badge bg-accent p-2 rounded-2">
                <i className="bi bi-bag-heart-fill fs-5"></i>
              </span>
              <h5 className="text-white fw-bold mb-0">ShopSphere</h5>
            </div>
            <p className="small text-secondary mb-3">
              India&apos;s smart shopping destination. Discover top electronics, fashion, home appliances & more with fast delivery and secure checkout.
            </p>
            <div className="d-flex gap-2 flex-wrap">
              <span className="badge bg-dark border border-secondary px-2 py-1">VISA</span>
              <span className="badge bg-dark border border-secondary px-2 py-1">Mastercard</span>
              <span className="badge bg-dark border border-secondary px-2 py-1">UPI</span>
              <span className="badge bg-dark border border-secondary px-2 py-1">COD</span>
            </div>
          </div>

          <div className="col-6 col-lg-2 col-md-3">
            <h6 className="text-white text-uppercase small fw-bold mb-3">Shop</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2">
              <li><Link to="/products" className="text-decoration-none text-secondary hover-white">All Products</Link></li>
              <li><Link to="/products?category=Mobiles" className="text-decoration-none text-secondary hover-white">Mobiles</Link></li>
              <li><Link to="/products?category=Laptops" className="text-decoration-none text-secondary hover-white">Laptops</Link></li>
              <li><Link to="/products?category=Headphones" className="text-decoration-none text-secondary hover-white">Headphones</Link></li>
              <li><Link to="/products?category=Shoes" className="text-decoration-none text-secondary hover-white">Footwear</Link></li>
            </ul>
          </div>

          <div className="col-6 col-lg-2 col-md-3">
            <h6 className="text-white text-uppercase small fw-bold mb-3">Account</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2">
              <li><Link to="/profile" className="text-decoration-none text-secondary hover-white">My Profile</Link></li>
              <li><Link to="/orders" className="text-decoration-none text-secondary hover-white">Track Orders</Link></li>
              <li><Link to="/wishlist" className="text-decoration-none text-secondary hover-white">Wishlist</Link></li>
              <li><Link to="/cart" className="text-decoration-none text-secondary hover-white">Shopping Cart</Link></li>
            </ul>
          </div>

          <div className="col-lg-4 col-md-6">
            <h6 className="text-white text-uppercase small fw-bold mb-3">Registered Office & Support</h6>
            <ul className="list-unstyled small text-secondary d-flex flex-column gap-2">
              <li><i className="bi bi-geo-alt me-2 text-accent"></i>Outer Ring Road, Bengaluru, Karnataka 560103</li>
              <li><i className="bi bi-envelope me-2 text-accent"></i>support@shopsphere.com</li>
              <li><i className="bi bi-telephone me-2 text-accent"></i>+91 98765 43210 (24/7 Support)</li>
              <li className="mt-1">
                <Link to="/contact" className="btn btn-sm btn-outline-light">
                  <i className="bi bi-chat-dots me-1"></i>Contact Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-secondary my-4" />
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 small text-secondary">
          <span>© {new Date().getFullYear()} ShopSphere E-Commerce. Built with React, Vite & Bootstrap 5.</span>
          <span>Deployed via GitHub + Vercel</span>
        </div>
      </div>
    </footer>
  );
}
